type InstructionsProps = {
  onStart: () => void;
  disabled: boolean;
  label: string;
};

export function Instructions({ onStart, disabled, label }: InstructionsProps) {
  return (
    <section className="section">
      <h1>Video capture</h1>
      <p>
        Click the button to allow camera access. A photo will be taken
        automatically after a few seconds.
      </p>
      <button className="btn" onClick={onStart} disabled={disabled}>
        {label}
      </button>
    </section>
  );
}
