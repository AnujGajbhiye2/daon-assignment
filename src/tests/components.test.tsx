import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Instructions } from '../components/Instructions'
import { VideoPreview } from '../components/VideoPreview'
import { CapturedImage } from '../components/CapturedImage'
import { CameraBlockedTooltip } from '../components/CameraBlockedTooltip'
import type { RefObject } from 'react'

describe('Instructions', () => {
  it('renders title and description', () => {
    render(<Instructions onStart={() => {}} disabled={false} label="Start" />)
    expect(screen.getByRole('heading', { name: /video capture/i })).toBeInTheDocument()
    expect(screen.getByText(/click the button/i)).toBeInTheDocument()
  })

  it('shows label on button', () => {
    render(<Instructions onStart={() => {}} disabled={false} label="Retry" />)
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
  })

  it('disables button when disabled=true', () => {
    render(<Instructions onStart={() => {}} disabled={true} label="Start" />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('calls onStart when clicked', async () => {
    const user = userEvent.setup()
    let called = false
    render(<Instructions onStart={() => { called = true }} disabled={false} label="Start" />)
    await user.click(screen.getByRole('button'))
    expect(called).toBe(true)
  })
})

describe('VideoPreview', () => {
  const nullRef = { current: null } as RefObject<HTMLVideoElement | null>

  it('renders nothing when idle', () => {
    const { container } = render(
      <VideoPreview state={{ status: 'idle' }} countdown={null} videoRef={nullRef} />
    )
    expect(container.querySelector('video')).toBeNull()
    expect(container.querySelector('.error')).toBeNull()
  })

  it('renders video element when streaming', () => {
    const { container } = render(
      <VideoPreview state={{ status: 'streaming' }} countdown={3} videoRef={nullRef} />
    )
    expect(container.querySelector('video')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('shows smile message when countdown is 1', () => {
    render(
      <VideoPreview state={{ status: 'streaming' }} countdown={1} videoRef={nullRef} />
    )
    expect(screen.getByText(/smile/i)).toBeInTheDocument()
  })

  it('renders error message on error state', () => {
    render(
      <VideoPreview
        state={{ status: 'error', message: 'No camera found.' }}
        countdown={null}
        videoRef={nullRef}
      />
    )
    expect(screen.getByText('No camera found.')).toBeInTheDocument()
  })

  it('shows generic blocked text when message starts with "Camera access blocked"', () => {
    render(
      <VideoPreview
        state={{ status: 'error', message: 'Camera access blocked. Allow it from...' }}
        countdown={null}
        videoRef={nullRef}
      />
    )
    expect(screen.getByText('Camera access was blocked.')).toBeInTheDocument()
  })
})

describe('CapturedImage', () => {
  it('renders nothing when not captured', () => {
    const { container } = render(<CapturedImage state={{ status: 'idle' }} />)
    expect(container.querySelector('img')).toBeNull()
  })

  it('renders snapshot image when captured', () => {
    render(<CapturedImage state={{ status: 'captured', imageSrc: 'data:image/png;base64,abc' }} />)
    const img = screen.getByRole('img', { name: /captured snapshot/i })
    expect(img).toHaveAttribute('src', 'data:image/png;base64,abc')
  })
})

describe('CameraBlockedTooltip', () => {
  it('renders nothing when not visible', () => {
    const { container } = render(<CameraBlockedTooltip visible={false} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders tooltip when visible', () => {
    render(<CameraBlockedTooltip visible={true} />)
    expect(screen.getByText(/allow camera access/i)).toBeInTheDocument()
  })
})
