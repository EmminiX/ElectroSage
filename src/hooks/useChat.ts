'use client'

import { useState, useCallback } from 'react'
import { ChatMessage, ChatSession } from '@/data/types'

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null)

  const initializeSession = useCallback(() => {
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
      content: `Hello! I'm your electricity tutor. I'm here to help you understand basic electrical concepts, answer questions, and guide you through the learning material. 

How can I help you today? You can ask me about:
- Atomic structure and electrical fundamentals
- Voltage, current, and resistance
- Circuit analysis
- Safety practices
- Any specific concepts you're studying

Feel free to ask questions about the content you're reading or request explanations of concepts!`,
      timestamp: new Date()
    }
    
    setMessages([welcomeMessage])
    return session
  }, [])

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
  }, [])

  const setContext = useCallback((sectionId: string, sectionTitle: string) => {
    if (currentSession) {
      setCurrentSession(prev => prev ? {
        ...prev,
        currentSection: sectionId,
        lastActivity: new Date()
      } : null)
    }
  }, [currentSession])

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
