import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getCameraErrorMessage, captureSnapshot } from '../utils'

describe('getCameraErrorMessage', () => {
  it('returns blocked message for NotAllowedError', () => {
    const err = new DOMException('', 'NotAllowedError')
    expect(getCameraErrorMessage(err)).toMatch(/blocked/i)
  })

  it('returns no camera message for NotFoundError', () => {
    const err = new DOMException('', 'NotFoundError')
    expect(getCameraErrorMessage(err)).toMatch(/no camera/i)
  })

  it('returns in-use message for NotReadableError', () => {
    const err = new DOMException('', 'NotReadableError')
    expect(getCameraErrorMessage(err)).toMatch(/already in use/i)
  })

  it('returns error message for generic Error', () => {
    const err = new Error('something went wrong')
    expect(getCameraErrorMessage(err)).toBe('something went wrong')
  })

  it('returns fallback string for unknown error', () => {
    expect(getCameraErrorMessage(null)).toBe('Camera access denied.')
  })
})

describe('captureSnapshot', () => {
  beforeEach(() => {
    const fakeCtx = { drawImage: vi.fn() }
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(fakeCtx as unknown as CanvasRenderingContext2D)
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue('data:image/png;base64,abc')
  })

  it('draws video frame and returns data URL', () => {
    const video = document.createElement('video')
    Object.defineProperty(video, 'videoWidth', { value: 640 })
    Object.defineProperty(video, 'videoHeight', { value: 480 })

    const stopMock = vi.fn()
    const stream = { getTracks: () => [{ stop: stopMock }] } as unknown as MediaStream

    const result = captureSnapshot(video, stream)
    expect(result).toBe('data:image/png;base64,abc')
    expect(stopMock).toHaveBeenCalled()
  })

  it('returns null when canvas context unavailable', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null)

    const video = document.createElement('video')
    const stream = { getTracks: () => [] } as unknown as MediaStream

    expect(captureSnapshot(video, stream)).toBeNull()
  })
})
