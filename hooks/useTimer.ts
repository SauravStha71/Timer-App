import { useState, useEffect, useRef } from 'react';

interface UseTimerReturn {
  time: number;
  isRunning: boolean;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

export const useTimer = (): UseTimerReturn => {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const accumulatedTimeRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning) {
      // Always start from the current accumulated time (0 after reset)
      startTimeRef.current = performance.now();
      
      const updateTimer = () => {
        if (startTimeRef.current !== null && isRunning) {
          const elapsed = performance.now() - startTimeRef.current;
          const currentTime = accumulatedTimeRef.current + elapsed;
          setTime(currentTime);
          animationFrameRef.current = requestAnimationFrame(updateTimer);
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(updateTimer);
    } else {
      // When stopping, save the accumulated time
      if (startTimeRef.current !== null) {
        const elapsed = performance.now() - startTimeRef.current;
        accumulatedTimeRef.current += elapsed;
        startTimeRef.current = null;
      }
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning]);

  const start = () => {
    setIsRunning(true);
  };

  const stop = () => {
    setIsRunning(false);
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  const reset = () => {
    setIsRunning(false);
    setTime(0);
    accumulatedTimeRef.current = 0;
    startTimeRef.current = null;
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  return { time, isRunning, start, stop, reset };
};

