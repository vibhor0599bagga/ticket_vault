"use client"

import { useState, useEffect, useRef } from "react"
import { MessageCircle, X, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function Chatbot() {
    const [isMounted, setIsMounted] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState([])
    const [inputValue, setInputValue] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [sessionId, setSessionId] = useState("")
    const messagesEndRef = useRef(null)

    // Handle mounting to avoid hydration mismatch
    useEffect(() => {
        setIsMounted(true)
    }, [])

    // Generate or retrieve session ID
    useEffect(() => {
        let storedSessionId = localStorage.getItem("chatbot_session_id")
        if (!storedSessionId) {
            storedSessionId = Math.random().toString(36).substring(2, 15)
            localStorage.setItem("chatbot_session_id", storedSessionId)
        }
        setSessionId(storedSessionId)

        // Add welcome message
        setMessages([
            {
                type: "bot",
                content: "Hi! I'm your TicketVault assistant. Ask me anything about events, tickets, or how to use our platform!",
                timestamp: new Date().toISOString()
            }
        ])
    }, [])

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return

        const userMessage = {
            type: "user",
            content: inputValue,
            timestamp: new Date().toISOString()
        }

        setMessages(prev => [...prev, userMessage])
        const currentQuery = inputValue
        setInputValue("")
        setIsLoading(true)

        try {
            // Call your own API route instead of directly calling external API
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    query: currentQuery,
                    session_id: sessionId
                })
            })

            const data = await response.json()

            console.log("API Response:", data) // Debug log

            // Check if response has the answer field
            if (!response.ok) {
                throw new Error(`Server error: ${response.status} - ${data.error || 'Unknown error'}`)
            }

            if (!data.answer) {
                throw new Error("No answer received from server")
            }

            const botMessage = {
                type: "bot",
                content: data.answer,
                timestamp: new Date().toISOString(),
                metadata: {
                    sessionId: data.session_id,
                    isEventRelated: data.is_event_related,
                    processingTime: data.processing_time
                }
            }

            setMessages(prev => [...prev, botMessage])
        } catch (error) {
            console.error("Chatbot error:", error)
            const errorMessage = {
                type: "bot",
                content: `⚠️ Error: ${error.message}. Please try again later.`,
                timestamp: new Date().toISOString()
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    // Don't render until mounted to avoid hydration mismatch
    if (!isMounted) {
        return null
    }

    return (
        <>
            {/* Floating Chat Button */}
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 z-50 transition-all duration-300 hover:scale-110 animate-in fade-in slide-in-from-bottom-4"
                    size="icon"
                >
                    <MessageCircle className="h-6 w-6" />
                </Button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl z-50 flex flex-col overflow-hidden p-0 animate-in slide-in-from-bottom-8 fade-in duration-300">
                    <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Avatar className="h-8 w-8 bg-white">
                                    <AvatarFallback className="bg-white text-purple-600">
                                        TV
                                    </AvatarFallback>
                                </Avatar>
                                <CardTitle className="text-lg">TicketVault Assistant</CardTitle>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsOpen(false)}
                                className="text-white hover:bg-white/20"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-lg px-4 py-2 ${message.type === "user"
                                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                                        : "bg-slate-100 text-slate-900"
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                    <p className={`text-xs mt-1 ${message.type === "user" ? "text-white/70" : "text-slate-500"
                                        }`}>
                                        {new Date(message.timestamp).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-slate-100 rounded-lg px-4 py-2">
                                    <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </CardContent>

                    <div className="p-4 border-t">
                        <div className="flex space-x-2">
                            <Input
                                placeholder="Ask me anything..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isLoading}
                                className="flex-1"
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={isLoading || !inputValue.trim()}
                                size="icon"
                                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </Card>
            )}
        </>
    )
}
