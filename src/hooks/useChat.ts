'use client'

import { useState, useCallback, useEffect } from 'react'
import { ChatMessage, ChatSession } from '@/data/types'

// Storage keys
const STORAGE_KEYS = {
  CHAT_SESSION: 'electricity_tutor_chat_session',
  CHAT_MESSAGES: 'electricity_tutor_chat_messages'
}

// Storage utilities
const storage = {
  save: (key: string, data: any) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(data))
      }
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  },
  load: (key: string) => {
    try {
      if (typeof window !== 'undefined') {
        const item = localStorage.getItem(key)
        return item ? JSON.parse(item) : null
      }
    } catch (error) {
      console.warn('Failed to load from localStorage:', error)
    }
    return null
  },
  remove: (key: string) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(key)
      }
    } catch (error) {
      console.warn('Failed to remove from localStorage:', error)
    }
  }
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)
  const [isRestored, setIsRestored] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // Load stored data on mount
  useEffect(() => {
    const storedMessages = storage.load(STORAGE_KEYS.CHAT_MESSAGES)
    const storedSession = storage.load(STORAGE_KEYS.CHAT_SESSION)
    
    // console.log('Loading stored data:', { storedMessages, storedSession })
    
    let hasRestoredData = false
    
    if (storedMessages && Array.isArray(storedMessages) && storedMessages.length > 0) {
      // Convert timestamp strings back to Date objects
      const restoredMessages = storedMessages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
      // console.log('Restored messages:', restoredMessages)
      setMessages(restoredMessages)
      hasRestoredData = true
    }
    
    if (storedSession) {
      // Convert dates back from storage
      const restoredSession = {
        ...storedSession,
        startTime: new Date(storedSession.startTime),
        lastActivity: new Date(storedSession.lastActivity)
      }
      // console.log('Restored session:', restoredSession)
      setCurrentSession(restoredSession)
      hasRestoredData = true
    }
    
    setIsRestored(true)
    setIsInitialized(hasRestoredData)
  }, [])

  // Save messages to storage whenever they change
  useEffect(() => {
    if (isRestored && messages.length > 0) {
      // console.log('Saving messages to storage:', messages)
      storage.save(STORAGE_KEYS.CHAT_MESSAGES, messages)
    }
  }, [messages, isRestored])

  // Save session to storage whenever it changes
  useEffect(() => {
    if (isRestored && currentSession) {
      // console.log('Saving session to storage:', currentSession)
      storage.save(STORAGE_KEYS.CHAT_SESSION, currentSession)
    }
  }, [currentSession, isRestored])

  const initializeSession = useCallback(() => {
    // Only create new session if none exists and no stored data
    if (!isInitialized && !currentSession && messages.length === 0) {
      const session: ChatSession = {
        id: Date.now().toString(),
        messages: [],
        startTime: new Date(),
        lastActivity: new Date()
      }
      setCurrentSession(session)
      
      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: 'welcome',
        role: 'assistant',
        content: `Hello! I'm your expert electricity tutor and educational assistant. I specialize in helping students understand fundamental electrical principles through clear explanations, analogies, and interactive guidance.

My teaching approach focuses on:
- Starting with simple concepts before building complexity
- Using analogies (like water flow) to explain abstract electrical concepts
- Encouraging active learning and questions
- Emphasizing safety first
- Providing practical, real-world applications

I can help you with:
- Atomic structure and electrical fundamentals
- Voltage, current, and resistance relationships
- Ohm's Law and circuit analysis
- Series and parallel circuits
- Electrical components (resistors, capacitors, inductors)
- AC vs DC concepts
- Electrical safety practices
- Measurement techniques and instruments

How can I assist your learning today? Feel free to ask about any electrical concept, request explanations, or discuss the content you're currently studying. I'm here to help you develop a deep, intuitive understanding!`,
        timestamp: new Date()
      }
      
      setMessages([welcomeMessage])
      setIsInitialized(true)
      return session
    }
    
    return currentSession
  }, [currentSession, messages.length, isInitialized])

  const sendMessage = useCallback(async (content: string, context?: string) => {
    if (!content.trim()) return

    setIsLoading(true)
    setError(null)

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
      context
    }

    setMessages(prev => [...prev, userMessage])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: content,
          context,
          messages: messages.slice(-10) // Send last 10 messages for context
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()

      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.message,
        timestamp: new Date(),
        context: data.context
      }

      setMessages(prev => [...prev, assistantMessage])

      // Update session
      if (currentSession) {
        setCurrentSession(prev => prev ? {
          ...prev,
          lastActivity: new Date(),
          messages: [...prev.messages, userMessage, assistantMessage]
        } : null)
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try asking your question again.',
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [messages, currentSession])

  const clearChat = useCallback(() => {
    setMessages([])
    setCurrentSession(null)
    setError(null)
    setIsInitialized(false)
    // Clear localStorage
    storage.remove(STORAGE_KEYS.CHAT_MESSAGES)
    storage.remove(STORAGE_KEYS.CHAT_SESSION)
  }, [])

  const setContext = useCallback((sectionId: string, sectionTitle: string) => {
    setCurrentSession(prev => prev ? {
      ...prev,
      currentSection: sectionId,
      lastActivity: new Date()
    } : null)
  }, [])

  return {
    messages,
    isLoading,
    error,
    currentSession,
    sendMessage,
    clearChat,
    setContext,
    initializeSession
  }
}
