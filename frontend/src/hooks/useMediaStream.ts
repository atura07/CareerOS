import { useState, useEffect, useRef, useCallback } from 'react'

export interface UseMediaStreamReturn {
  stream: MediaStream | null
  videoRef: React.RefCallback<HTMLVideoElement | null>
  hasPermission: boolean | null
  error: string | null
  isVideoEnabled: boolean
  isAudioEnabled: boolean
  startStream: () => Promise<MediaStream | null>
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

  const streamRef = useRef<MediaStream | null>(null)
  const videoElementRef = useRef<HTMLVideoElement | null>(null)

  // Synchronize stream to video element safely
  const bindStreamToElement = useCallback((element: HTMLVideoElement | null, mediaStream: MediaStream | null) => {
    if (!element) return

    if (mediaStream) {
      if (element.srcObject !== mediaStream) {
        element.srcObject = mediaStream
      }
      element.muted = true // Prevent local audio feedback loop
      element.playsInline = true
      element.autoplay = true

      const playPromise = element.play()
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          // Autoplay policy or aborted; retry on loadedmetadata
          if (err.name !== 'AbortError') {
            console.warn('[Camera] Autoplay paused, waiting for loadedmetadata:', err.message)
          }
        })
      }

      element.onloadedmetadata = () => {
        element.play().catch((err) => {
          if (err.name !== 'AbortError') {
            console.warn('[Camera] Play on loadedmetadata error:', err.message)
          }
        })
      }
    } else {
      element.srcObject = null
    }
  }, [])

  // Callback ref for <video> element mounting
  const videoRef = useCallback(
    (node: HTMLVideoElement | null) => {
      videoElementRef.current = node
      if (node && streamRef.current) {
        bindStreamToElement(node, streamRef.current)
      }
    },
    [bindStreamToElement]
  )

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop()
        } catch (_) {}
      })
      streamRef.current = null
      setStream(null)
    }
    if (videoElementRef.current) {
      videoElementRef.current.srcObject = null
    }
  }, [])

  const startStream = useCallback(async (): Promise<MediaStream | null> => {
    setError(null)

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const msg = 'Camera and microphone access is not supported by your browser environment.'
      setError(msg)
      setHasPermission(false)
      return null
    }

    // Diagnostic device enumeration
    try {
      if (navigator.mediaDevices.enumerateDevices) {
        const devices = await navigator.mediaDevices.enumerateDevices()
        const videoInputs = devices.filter((d) => d.kind === 'videoinput')
        const audioInputs = devices.filter((d) => d.kind === 'audioinput')
        console.info(`[MediaDevices] Detected ${videoInputs.length} camera(s) and ${audioInputs.length} microphone(s).`)
      }
    } catch (_) {}

    // Multi-tier progressive constraints fallback
    let mediaStream: MediaStream | null = null

    // Strategy 1: Standard high-quality video with facingMode + audio
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 1280, min: 640 },
          height: { ideal: 720, min: 480 },
        },
        audio: true,
      })
    } catch (err1: any) {
      console.warn('[Camera] Strategy 1 failed, attempting Strategy 2 (generic video + audio):', err1.message)

      // Strategy 2: Generic video + audio
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
      } catch (err2: any) {
        console.warn('[Camera] Strategy 2 failed, attempting Strategy 3 (independent tracks):', err2.message)

        // Strategy 3: Acquire video and audio independently to isolate device failures
        try {
          const videoStream = await navigator.mediaDevices.getUserMedia({ video: true })
          let audioStream: MediaStream | null = null
          try {
            audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
          } catch (audioErr) {
            console.warn('[Camera] Audio stream capture warning:', audioErr)
          }

          const combinedTracks = [
            ...videoStream.getVideoTracks(),
            ...(audioStream ? audioStream.getAudioTracks() : []),
          ]
          mediaStream = new MediaStream(combinedTracks)
        } catch (err3: any) {
          console.error('[Camera] All getUserMedia strategies failed:', err3)
          setHasPermission(false)

          let friendlyMsg = 'Failed to access camera and microphone.'
          if (err3.name === 'NotAllowedError' || err3.name === 'PermissionDeniedError') {
            friendlyMsg = 'Camera or microphone access was denied. Please allow permissions in your browser address bar.'
          } else if (err3.name === 'NotFoundError' || err3.name === 'DevicesNotFoundError') {
            friendlyMsg = 'No camera or microphone device found. Please connect a webcam.'
          } else if (err3.name === 'NotReadableError' || err3.name === 'TrackStartError') {
            friendlyMsg = 'Your camera is currently in use by another app (e.g. Windows Camera, Zoom, Teams). Please close other camera apps and retry.'
          } else if (err3.name === 'OverconstrainedError') {
            friendlyMsg = 'Camera does not support requested settings.'
          } else if (err3.message) {
            friendlyMsg = err3.message
          }

          setError(friendlyMsg)
          return null
        }
      }
    }

    if (mediaStream) {
      streamRef.current = mediaStream
      setStream(mediaStream)
      setHasPermission(true)
      setIsVideoEnabled(true)
      setIsAudioEnabled(true)

      if (videoElementRef.current) {
        bindStreamToElement(videoElementRef.current, mediaStream)
      }

      return mediaStream
    }

    return null
  }, [bindStreamToElement])

  const toggleVideo = useCallback(() => {
    const activeStream = streamRef.current
    if (activeStream) {
      const videoTracks = activeStream.getVideoTracks()
      if (videoTracks.length > 0) {
        const nextState = !isVideoEnabled
        videoTracks.forEach((t) => {
          t.enabled = nextState
        })
        setIsVideoEnabled(nextState)
      }
    }
  }, [isVideoEnabled])

  const toggleAudio = useCallback(() => {
    const activeStream = streamRef.current
    if (activeStream) {
      const audioTracks = activeStream.getAudioTracks()
      if (audioTracks.length > 0) {
        const nextState = !isAudioEnabled
        audioTracks.forEach((t) => {
          t.enabled = nextState
        })
        setIsAudioEnabled(nextState)
      }
    }
  }, [isAudioEnabled])

  // If stream changes, update attached video element
  useEffect(() => {
    if (videoElementRef.current && stream) {
      bindStreamToElement(videoElementRef.current, stream)
    }
  }, [stream, bindStreamToElement])

  // Lifecycle cleanup
  useEffect(() => {
    if (autoStart) {
      startStream()
    }
    return () => {
      stopStream()
    }
  }, [autoStart, startStream, stopStream])

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
