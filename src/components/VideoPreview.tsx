import type { RefObject } from "react";
import type { AppState } from "../types";

type VideoPreviewProps = {
  state: AppState;
  countdown: number | null;
  videoRef: RefObject<HTMLVideoElement | null>;
};

export function VideoPreview({ state, countdown, videoRef }: VideoPreviewProps) {
  return (
    <section className="section">
      {state.status === "streaming" && (
        <div className="video-wrapper">
          <video ref={videoRef} autoPlay playsInline className="media" />
          {countdown !== null && (
            <div className="overlay">
              {countdown > 1 ? countdown : "📸 Smile!"}
            </div>
          )}
        </div>
      )}
      {state.status === "error" && (
        <p className="error">
          {state.message.startsWith("Camera access blocked")
            ? "Camera access was blocked."
            : state.message}
        </p>
      )}
    </section>
  );
}
