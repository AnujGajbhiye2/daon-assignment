export async function startCamera(): Promise<MediaStream> {
  return navigator.mediaDevices.getUserMedia({ video: true })
}

export function getCameraErrorMessage(err: unknown): string {
  if (err instanceof DOMException) {
    switch (err.name) {
      case "NotAllowedError":
        return "Camera access blocked. Allow it from the camera icon in your browser's address bar, then retry.";
      case "NotFoundError":
        return "No camera found. Connect a camera and retry.";
      case "NotReadableError":
        return "Camera is already in use by another application.";
    }
  }
  if (err instanceof Error) return err.message;
  return "Camera access denied.";
}

export function captureSnapshot(
  videoEl: HTMLVideoElement,
  stream: MediaStream
): string | null {
  const canvas = document.createElement("canvas")
  canvas.width = videoEl.videoWidth
  canvas.height = videoEl.videoHeight

  const ctx = canvas.getContext("2d")
  if (!ctx) return null

  ctx.drawImage(videoEl, 0, 0)
  stream.getTracks().forEach((t) => t.stop())

  return canvas.toDataURL("image/png")
}
