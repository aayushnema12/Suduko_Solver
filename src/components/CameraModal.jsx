import React, { useRef, useEffect, useState } from 'react';
import { extractGridCells, recognizeBoard } from '../utils/imageProcessor';

const CameraModal = ({ onSuccess, onError, onClose }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let stream = null;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        onError('Unable to access the camera. Please check permissions.');
        onClose();
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [onError, onClose]);

  const handleCapture = async () => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsProcessing(true);
    setProgress(0);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      // Small delay to allow UI to update to processing state
      await new Promise(r => setTimeout(r, 100));

      const cellCanvases = await extractGridCells(canvas);
      if (!cellCanvases || cellCanvases.length !== 81) {
        throw new Error('Grid extraction failed');
      }

      const board = await recognizeBoard(cellCanvases, (p) => setProgress(p));
      
      // Basic validation: check if at least some numbers were found
      let numCount = 0;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (board[r][c] !== 0) numCount++;
        }
      }

      if (numCount < 10) {
        onError('Please click the picture properly. Unable to detect the numbers.');
      } else {
        onSuccess(board);
      }
    } catch (err) {
      console.error(err);
      onError('Please click the picture properly here. Unable to detect the grid.');
    } finally {
      setIsProcessing(false);
      onClose(); // Close modal after capture attempt
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden w-full max-w-lg shadow-2xl relative flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-800">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Scan Sudoku Puzzle</h3>
          <button 
            onClick={onClose}
            disabled={isProcessing}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Video Area */}
        <div className="relative bg-black w-full aspect-[3/4] sm:aspect-square overflow-hidden flex items-center justify-center">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className="w-full h-full object-cover"
          />
          
          {/* Overlay Guide */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Darken edges */}
            <div className="absolute inset-0 border-[40px] sm:border-[60px] border-black/40"></div>
            {/* Clear center square with border */}
            <div className="absolute inset-[40px] sm:inset-[60px] border-2 border-green-500/80 shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500 -ml-1 -mt-1"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500 -mr-1 -mt-1"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500 -ml-1 -mb-1"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500 -mr-1 -mb-1"></div>
              
              {!isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center opacity-70">
                  <p className="text-white text-sm font-medium bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-md">
                    Align grid within frame
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Processing Overlay */}
          {isProcessing && (
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
              <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <h4 className="text-lg font-semibold text-white mb-2">Analyzing Grid...</h4>
              <div className="w-full max-w-xs bg-slate-800 rounded-full h-2.5 mb-2 overflow-hidden">
                <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out" style={{ width: `${progress}%` }}></div>
              </div>
              <p className="text-sm text-slate-300">{progress}% complete</p>
            </div>
          )}
        </div>

        {/* Hidden Canvas for capture */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Footer / Controls */}
        <div className="p-6 bg-white dark:bg-slate-900 flex justify-center">
          <button
            onClick={handleCapture}
            disabled={isProcessing}
            className="w-16 h-16 rounded-full bg-blue-500 border-4 border-blue-100 dark:border-blue-900/50 flex items-center justify-center hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 shadow-lg shadow-blue-500/30"
          >
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraModal;
