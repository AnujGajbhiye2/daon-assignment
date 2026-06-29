export type AppState =
  | { status: "idle" }
  | { status: "streaming" }
  | { status: "error"; message: string }
  | { status: "captured"; imageSrc: string }
