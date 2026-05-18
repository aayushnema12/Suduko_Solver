import Tesseract from 'tesseract.js';

/**
 * Helper to sort points to [top-left, top-right, bottom-right, bottom-left]
 */
function orderPoints(pts) {
  const rect = new Array(4);
  
  // Sum of x+y. Top-left has smallest sum, bottom-right has largest sum.
  const sum = pts.map(p => p.x + p.y);
  rect[0] = pts[sum.indexOf(Math.min(...sum))];
  rect[2] = pts[sum.indexOf(Math.max(...sum))];
  
  // Difference of y-x. Top-right has smallest diff, bottom-left has largest diff.
  const diff = pts.map(p => p.y - p.x);
  rect[1] = pts[diff.indexOf(Math.min(...diff))];
  rect[3] = pts[diff.indexOf(Math.max(...diff))];
  
  return rect;
}

/**
 * Extracts the Sudoku grid from the canvas using OpenCV.
 * Returns an array of 81 HTMLCanvasElements (one for each cell), or null if failed.
 */
export async function extractGridCells(sourceCanvas) {
  if (!window.cv) {
    throw new Error('OpenCV is not loaded yet. Please try again.');
  }

  const cv = window.cv;
  let src = cv.imread(sourceCanvas);
  let gray = new cv.Mat();
  let blurred = new cv.Mat();
  let thresh = new cv.Mat();
  let contours = new cv.MatVector();
  let hierarchy = new cv.Mat();

  try {
    // 1. Preprocessing
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);
    cv.adaptiveThreshold(blurred, thresh, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY_INV, 11, 2);

    // 2. Find contours
    cv.findContours(thresh, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    let maxArea = 0;
    let maxContourIndex = -1;
    let approxCurve = new cv.Mat();

    for (let i = 0; i < contours.size(); i++) {
      let cnt = contours.get(i);
      let area = cv.contourArea(cnt);
      
      // Filter by area
      if (area > 10000) {
        let perimeter = cv.arcLength(cnt, true);
        let approx = new cv.Mat();
        cv.approxPolyDP(cnt, approx, 0.02 * perimeter, true);

        if (approx.rows === 4 && area > maxArea) {
          maxArea = area;
          maxContourIndex = i;
          approx.copyTo(approxCurve);
        }
        approx.delete();
      }
    }

    if (maxContourIndex === -1) {
      throw new Error('Grid not found');
    }

    // 3. Extract points and apply perspective transform
    let points = [];
    for (let i = 0; i < 4; i++) {
      points.push({
        x: approxCurve.data32S[i * 2],
        y: approxCurve.data32S[i * 2 + 1]
      });
    }

    const orderedPts = orderPoints(points);
    
    // Create Mat for source points
    let srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
      orderedPts[0].x, orderedPts[0].y,
      orderedPts[1].x, orderedPts[1].y,
      orderedPts[2].x, orderedPts[2].y,
      orderedPts[3].x, orderedPts[3].y
    ]);

    // Define target size
    const SIDE = 450;
    let dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
      0, 0,
      SIDE - 1, 0,
      SIDE - 1, SIDE - 1,
      0, SIDE - 1
    ]);

    let M = cv.getPerspectiveTransform(srcTri, dstTri);
    let warped = new cv.Mat();
    let warpedSize = new cv.Size(SIDE, SIDE);
    cv.warpPerspective(gray, warped, M, warpedSize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

    // 4. Threshold the warped image to make it binary for better OCR
    cv.adaptiveThreshold(warped, warped, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY_INV, 11, 2);

    // 5. Slice into 81 cells
    const cellCanvasArray = [];
    const cellSize = SIDE / 9;

    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        let rect = new cv.Rect(j * cellSize, i * cellSize, cellSize, cellSize);
        let cellMat = warped.roi(rect);
        
        // Remove borders by taking an inner ROI
        const margin = Math.floor(cellSize * 0.1);
        let innerRect = new cv.Rect(margin, margin, cellSize - 2 * margin, cellSize - 2 * margin);
        let innerCellMat = cellMat.roi(innerRect);

        // Resize a bit larger for Tesseract
        let resized = new cv.Mat();
        cv.resize(innerCellMat, resized, new cv.Size(64, 64), 0, 0, cv.INTER_CUBIC);
        
        // Inverse again (Tesseract prefers black text on white background)
        cv.bitwise_not(resized, resized);

        // Convert back to RGBA for canvas rendering
        let rgbaMat = new cv.Mat();
        cv.cvtColor(resized, rgbaMat, cv.COLOR_GRAY2RGBA);

        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        cv.imshow(canvas, rgbaMat);
        cellCanvasArray.push(canvas);

        cellMat.delete();
        innerCellMat.delete();
        resized.delete();
        rgbaMat.delete();
      }
    }

    // Cleanup
    srcTri.delete(); dstTri.delete(); M.delete(); warped.delete();
    approxCurve.delete();

    return cellCanvasArray;
  } finally {
    // Ensure cleanup even on error
    src.delete(); gray.delete(); blurred.delete(); thresh.delete(); 
    contours.delete(); hierarchy.delete();
  }
}

/**
 * Runs OCR on 81 canvas elements to build a 9x9 Sudoku board.
 */
export async function recognizeBoard(cellCanvases, onProgress) {
  const board = Array(9).fill(null).map(() => Array(9).fill(0));
  
  const worker = await Tesseract.createWorker('eng');
  
  // Configure Tesseract to only look for digits
  await worker.setParameters({
    tessedit_char_whitelist: '123456789',
    tessedit_pageseg_mode: Tesseract.PSM.SINGLE_CHAR,
  });

  let totalProcessed = 0;

  for (let i = 0; i < 81; i++) {
    const r = Math.floor(i / 9);
    const c = i % 9;
    
    // Optional: check if cell is mostly blank before running OCR to save time
    const ctx = cellCanvases[i].getContext('2d');
    const imageData = ctx.getImageData(0, 0, 64, 64);
    const data = imageData.data;
    let darkPixels = 0;
    for (let p = 0; p < data.length; p += 4) {
      if (data[p] < 128) darkPixels++; // Black text on white bg
    }
    
    const fillRatio = darkPixels / (64 * 64);
    
    // If there is very little ink, it's an empty cell
    if (fillRatio > 0.02 && fillRatio < 0.6) {
      const { data: { text, confidence } } = await worker.recognize(cellCanvases[i]);
      const digit = parseInt(text.trim(), 10);
      
      // Only accept if confidence is reasonable
      if (!isNaN(digit) && digit >= 1 && digit <= 9 && confidence > 40) {
        board[r][c] = digit;
      }
    }
    
    totalProcessed++;
    if (onProgress) {
      onProgress(Math.round((totalProcessed / 81) * 100));
    }
  }

  await worker.terminate();
  return board;
}
