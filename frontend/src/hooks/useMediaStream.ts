import { useState, useEffect, useRef, useCallback } from 'react'

export interface UseMediaStreamReturn {
  stream: MediaStream | null
  videoRef: React.RefObject<HTMLVideoElement | null>
  hasPermission: boolean | null
  error: string | null
  isVideoEnabled: boolean
  isAudioEnabled: boolean
  startStream: () => Promise<void>
  stopStream: () => void
  toggleVideo: () => void
  toggleAudio: () => void
}

export function useMediaStream(autoStart = false): UseMediaStreamReturn {
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop())
      setStream(null)
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
  }, [stream])

  const startStream = useCallback(async () => {
    setError(null)
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera and microphone access is not supported by your browser.')
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: true,
      })

      setStream(mediaStream)
      setHasPermission(true)
      setIsVideoEnabled(true)
      setIsAudioEnabled(true)

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err: any) {
      setHasPermission(false)
      const msg =
        err.name === 'NotAllowedError'
          ? 'Camera or microphone access denied. Please grant permission in your browser.'
          : err.name === 'NotFoundError'
          ? 'No camera or microphone device found.'
          : err.message || 'Failed to access camera and microphone.'
      setError(msg)
    }
  }, [])

  const toggleVideo = useCallback(() => {
    if (stream) {
      const videoTracks = stream.getVideoTracks()
      if (videoTracks.length > 0) {
        const nextState = !isVideoEnabled
        videoTracks.forEach((t) => (t.enabled = nextState))
        setIsVideoEnabled(nextState)
      }
    }
  }, [stream, isVideoEnabled])

  const toggleAudio = useCallback(() => {
    if (stream) {
      const audioTracks = stream.getAudioTracks()
      if (audioTracks.length > 0) {
        const nextState = !isAudioEnabled
        audioTracks.forEach((t) => (t.enabled = nextState))
        setIsAudioEnabled(nextState)
      }
    }
  }, [stream, isAudioEnabled])

  // Attach stream to video element whenever stream changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream
    }
  }, [stream])

  useEffect(() => {
    if (autoStart) {
      startStream()
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [autoStart])

  return {
    stream,
    videoRef,
    hasPermission,
    error,
    isVideoEnabled,
    isAudioEnabled,
    startStream,
    stopStream,
    toggleVideo,
    toggleAudio,
  }
}
