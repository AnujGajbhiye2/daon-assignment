import { useCamera } from "./hooks/useCamera";
import { Instructions } from "./components/Instructions";
import { VideoPreview } from "./components/VideoPreview";
import { CapturedImage } from "./components/CapturedImage";
import { CameraBlockedTooltip } from "./components/CameraBlockedTooltip";

const App = () => {
  const { state, countdown, videoRef, start } = useCamera();
  const isBlocked =
    state.status === "error" &&
    state.message.startsWith("Camera access blocked");

  return (
    <div className="app">
      <CameraBlockedTooltip visible={isBlocked} />
      <Instructions
        onStart={start}
        disabled={state.status === "streaming"}
        label={state.status === "error" ? "Retry" : "Start"}
      />
      <VideoPreview state={state} countdown={countdown} videoRef={videoRef} />
      <CapturedImage state={state} />
    </div>
  );
};

export default App;
