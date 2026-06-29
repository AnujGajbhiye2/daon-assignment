import { useEffect, useRef, useState } from "react";
import type { AppState } from "../types";
import { startCamera, captureSnapshot, getCameraErrorMessage } from "../utils";
import { SNAPSHOT_SECONDS } from "../utils/constants";

/**
 * Owns the full camera lifecycle: requesting access, previewing the stream,
 * running the countdown, taking the snapshot, and cleaning up on unmount.
 */
export function useCamera() {
  const [state, setState] = useState<AppState>({ status: "idle" });
  const [countdown, setCountdown] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Attach the stream once the <video> element is mounted (after the
  // "streaming" render), otherwise videoRef is still null when start() runs.
  useEffect(() => {
    if (state.status === "streaming" && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [state.status]);

  // Capture when the countdown reaches 0. The status guard makes this
  // idempotent, so a StrictMode double-invoke can't snapshot twice.
  useEffect(() => {
    if (
      countdown === 0 &&
      state.status === "streaming" &&
      videoRef.current &&
      streamRef.current
    ) {
      const imageSrc = captureSnapshot(videoRef.current, streamRef.current);
      if (imageSrc) setState({ status: "captured", imageSrc });
    }
  }, [countdown, state.status]);

  // Cancel a pending countdown and release the camera if we unmount early.
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const startCountdown = () => {
    setCountdown(SNAPSHOT_SECONDS);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const start = async () => {
    try {
      const stream = await startCamera();
      streamRef.current = stream;
      setState({ status: "streaming" });
      startCountdown();
    } catch (err) {
      setState({ status: "error", message: getCameraErrorMessage(err) });
    }
  };

  return { state, countdown, videoRef, start };
}
