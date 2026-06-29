type CameraBlockedTooltipProps = {
  visible: boolean;
};

export function CameraBlockedTooltip({ visible }: CameraBlockedTooltipProps) {
  if (!visible) return null;

  return (
    <div className="camera-tooltip">
      <div className="camera-tooltip-arrow" />
      <p>Allow camera access from the icon in your address bar</p>
    </div>
  );
}
