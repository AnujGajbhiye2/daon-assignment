# Video Capture

## Demo

Here's a short video demonstrating the app running in the browser and capturing a photo:

[Watch demo](https://www.loom.com/share/84e592c0afcd480ba9a990b5eda8fd01)

---

Single-page app that accesses the user's camera via the WebRTC `getUserMedia` API and automatically takes a snapshot after 5 seconds.

## Features

- Request camera access on **Start**
- Live video preview with a countdown overlay, or a descriptive error message if access is denied
- Tooltip guidance when camera permission is blocked in the browser
- Automatic snapshot 5 seconds after the stream starts
- Captured image stays visible; camera stream stops after capture
- **Retry** button available on error

## Tech stack

- React 19 + TypeScript + Vite
- No backend, no third-party video libraries
- React Compiler enabled via Babel plugin

---

## Running the project

### 1. Install Node.js

This project requires **Node.js 18 or later**.

Check if you have it:

```bash
node -v
```

If not installed, download from [nodejs.org](https://nodejs.org) or use a version manager:

```bash
# Using nvm (recommended)
nvm install 20
nvm use 20

# Using Homebrew (macOS)
brew install node
```

### 2. Clone the repository

```bash
git clone <repo-url>
cd daon-assignment
```

### 3. Install dependencies

```bash
npm install
```

### 4. Start the dev server

```bash
npm run dev
```

Open the URL printed in the terminal (e.g. `http://localhost:5173`).

> **Camera access requires a secure context.**
> `localhost` is treated as secure by browsers, so the dev server works out of the box.
> To test on another device on your network, serve over HTTPS.

### 5. Build for production (optional)

```bash
npm run build    # type-check + bundle to dist/
npm run preview  # serve the dist/ folder locally
```

---

## Project structure

```
daon-assignment/
├── index.html                  # Vite entry point — mounts the React app
├── src/
│   ├── main.tsx                # React root — renders <App /> into the DOM
│   ├── App.tsx                 # Top-level composition: wires the hook to the four sections
│   ├── index.css               # Global styles and responsive layout
│   │
│   ├── components/
│   │   ├── Instructions.tsx        # Always-visible top section: title, description, Start/Retry button
│   │   ├── VideoPreview.tsx        # Live <video> element with countdown overlay, or error message
│   │   ├── CapturedImage.tsx       # Displays the final snapshot; hidden until capture is complete
│   │   └── CameraBlockedTooltip.tsx # Fixed tooltip that guides the user to unblock the camera in the browser
│   │
│   ├── hooks/
│   │   └── useCamera.ts        # All camera logic in one place:
│   │                           #   - requests getUserMedia stream
│   │                           #   - attaches stream to the <video> element
│   │                           #   - runs the 5-second countdown via setInterval
│   │                           #   - captures the snapshot when countdown hits 0
│   │                           #   - stops all tracks and cleans up on unmount
│   │
│   ├── utils/
│   │   ├── index.ts            # Three pure helpers:
│   │   │                       #   startCamera()         — calls getUserMedia
│   │   │                       #   getCameraErrorMessage() — maps DOMException names to readable strings
│   │   │                       #   captureSnapshot()     — draws video frame to canvas, returns data URL
│   │   └── constants.ts        # SNAPSHOT_SECONDS = 5 (single source of truth for the timer)
│   │
│   └── types/
│       └── index.ts            # AppState discriminated union:
│                               #   idle | streaming | error (+ message) | captured (+ imageSrc)
│
├── package.json
├── tsconfig.app.json
├── vite.config.ts
└── eslint.config.js
```

### Data flow

```
user clicks Start
  → useCamera.start()
    → startCamera()         [utils] — getUserMedia → MediaStream
    → setState("streaming") — triggers VideoPreview to render <video>
    → useEffect attaches stream to videoRef.current.srcObject
    → startCountdown()      — setInterval ticks every second
  → countdown reaches 0
    → captureSnapshot()     [utils] — canvas.drawImage → data URL
    → stream tracks stopped
    → setState("captured")  — CapturedImage renders, VideoPreview hides
```

### State machine

| Status | What's visible |
|---|---|
| `idle` | Instructions + Start button |
| `streaming` | Instructions (disabled) + video preview + countdown overlay |
| `error` | Instructions + Retry button + error message + camera tooltip (if blocked) |
| `captured` | Instructions + captured image |
