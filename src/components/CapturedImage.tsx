import type { AppState } from "../types";

type CapturedImageProps = {
  state: AppState;
};

export function CapturedImage({ state }: CapturedImageProps) {
  if (state.status !== "captured") return null;

  return (
    <section className="section">
      <img src={state.imageSrc} alt="Captured snapshot" className="media" />
    </section>
  );
}
