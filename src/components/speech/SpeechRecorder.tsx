"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Mic, 
  MicOff, 
  Square, 
  Loader2,
  Volume2,
  AlertCircle,
  Settings,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SpeechRecorderProps {
  onTranscriptionComplete: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

export default function SpeechRecorder({ 
  onTranscriptionComplete, 
  disabled = false,
  className = ""
}: SpeechRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioLevel, setAudioLevel] = useState(0);
  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied' | 'prompt'>('unknown');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);

  // Check initial permission status
  useEffect(() => {
    checkPermissionStatus();
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const checkPermissionStatus = async () => {
    if ('permissions' in navigator) {
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        setPermissionStatus(permissionStatus.state as any);
        console.log('🔐 Initial permission status:', permissionStatus.state);
        
        // Listen for permission changes
        permissionStatus.onchange = () => {
          setPermissionStatus(permissionStatus.state as any);
          console.log('🔄 Permission status changed:', permissionStatus.state);
        };
      } catch (error) {
        console.log('⚠️ Could not check permission status:', error);
        setPermissionStatus('unknown');
      }
    }
  };

  // Audio level monitoring
  const monitorAudioLevel = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    
    // Calculate average audio level
    const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
    setAudioLevel(average / 255); // Normalize to 0-1
    
    if (isRecording) {
      animationRef.current = requestAnimationFrame(monitorAudioLevel);
    }
  };

  const startRecording = async () => {
    try {
      setError(null);
      setIsRecording(true);
      setRecordingTime(0);
      audioChunksRef.current = [];

      console.log('🎤 Requesting microphone access...');
      console.log('Browser:', navigator.userAgent);
      console.log('Is HTTPS:', window.location.protocol === 'https:');
      console.log('Is localhost:', window.location.hostname === 'localhost');
      console.log('Current URL:', window.location.href);

      // Check for HTTPS requirement
      const isSecureContext = window.isSecureContext;
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const isHTTPS = window.location.protocol === 'https:';
      
      console.log('Is secure context:', isSecureContext);
      console.log('Is localhost:', isLocalhost);
      
      if (!isSecureContext && !isLocalhost) {
        throw new Error('Microphone access requires HTTPS. Please access this site via HTTPS or use localhost for development.');
      }

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser doesn\'t support microphone access. Please use a modern browser.');
      }

      // First, check current permission status
      if ('permissions' in navigator) {
        try {
          const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          console.log('🔐 Microphone permission status:', permissionStatus.state);
          
          if (permissionStatus.state === 'denied') {
            throw new Error('Microphone access is blocked. Please enable it in your browser settings and refresh the page.');
          }
        } catch (permError) {
          console.log('⚠️ Could not check permission status:', permError);
        }
      }

      // Request microphone access with more specific error handling
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        }
      }).catch((error) => {
        console.error('❌ getUserMedia error:', error);
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        
        // More specific error messages based on error type
        switch (error.name) {
          case 'NotAllowedError':
          case 'PermissionDeniedError':
            throw new Error('Microphone access denied. Please click the microphone icon in your browser\'s address bar and allow access.');
          case 'NotFoundError':
          case 'DevicesNotFoundError':
            throw new Error('No microphone found. Please connect a microphone and try again.');
          case 'NotReadableError':
          case 'TrackStartError':
            throw new Error('Microphone is being used by another application. Please close other apps using the microphone.');
          case 'OverconstrainedError':
          case 'ConstraintNotSatisfiedError':
            throw new Error('Microphone doesn\'t meet the required specifications. Try using a different microphone.');
          case 'NotSupportedError':
            throw new Error('Your browser doesn\'t support microphone access. Please use Chrome, Firefox, Safari, or Edge.');
          case 'AbortError':
            throw new Error('Microphone access was aborted. Please try again.');
          default:
            throw new Error(`Failed to access microphone: ${error.message || 'Unknown error'}`);
        }
      });
      
      streamRef.current = stream;

      // Set up audio analysis for visual feedback
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      // Start monitoring audio level
      monitorAudioLevel();

      // Set up MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { 
          type: 'audio/webm;codecs=opus' 
        });
        
        await processAudio(audioBlob);
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
        streamRef.current = null;
        analyserRef.current = null;
      };

      // Start recording
      mediaRecorder.start(100); // Collect data every 100ms

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

    } catch (error) {
      console.error('❌ Failed to start recording:', error);
      setError('Failed to access microphone. Please check permissions.');
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsProcessing(true);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    try {
      console.log('🎤 Processing audio blob:', {
        size: audioBlob.size,
        type: audioBlob.type
      });

      const formData = new FormData();
      formData.append('audio', audioBlob, 'recording.webm');

      const response = await fetch('/api/speech-to-text', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Transcription failed');
      }

      console.log('✅ Transcription received:', data.transcription);
      
      if (data.transcription && data.transcription.trim()) {
        onTranscriptionComplete(data.transcription.trim());
      } else {
        setError('No speech detected. Please try again.');
      }

    } catch (error) {
      console.error('❌ Audio processing error:', error);
      setError(error instanceof Error ? error.message : 'Processing failed');
    } finally {
      setIsProcessing(false);
      setRecordingTime(0);
      setAudioLevel(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const isSecureContext = typeof window !== 'undefined' ? window.isSecureContext : true;
  const isLocalhost = typeof window !== 'undefined' ? 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') : 
    false;
  const needsHTTPS = !isSecureContext && !isLocalhost;

  return (
    <div className={`relative ${className}`}>
      {/* HTTPS Warning Banner */}
      {needsHTTPS && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 px-3 py-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-lg shadow-lg z-50 max-w-xs">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <div className="text-xs">
              <div className="font-medium">HTTPS Required</div>
              <div>Voice recording needs HTTPS or localhost</div>
            </div>
          </div>
        </div>
      )}

      {/* Recording Banner */}
      <AnimatePresence>
        {isRecording && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 px-4 py-2 bg-red-500 text-white rounded-full shadow-lg z-50"
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              <span className="text-sm font-medium">Recording</span>
              <span className="text-sm">{formatTime(recordingTime)}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 px-3 py-2 bg-red-50 border border-red-200 text-red-700 rounded-lg shadow-lg z-50 max-w-xs"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Button */}
      <button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled || isProcessing}
        className={`
          relative w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95
          ${isRecording 
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg ring-4 ring-red-200' 
            : 'bg-electric-500 hover:bg-electric-600 text-white shadow-md'
          }
          ${disabled || isProcessing ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        title={isRecording ? 'Stop recording' : 'Start voice recording'}
      >
        {isProcessing ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isRecording ? (
          <Square className="w-4 h-4" />
        ) : (
          <Mic className="w-5 h-5" />
        )}

        {/* Audio Level Indicator */}
        {isRecording && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-white/30"
            animate={{
              scale: 1 + (audioLevel * 0.3),
              opacity: 0.7 + (audioLevel * 0.3)
            }}
            transition={{ duration: 0.1 }}
          />
        )}
      </button>

      {/* Processing Indicator */}
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 text-xs text-gray-600 dark:text-gray-400"
        >
          Processing audio...
        </motion.div>
      )}
    </div>
  );
}