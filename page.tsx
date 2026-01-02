"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport, type UIMessage } from "ai"
import { Send, Sparkles, BookOpen, Brain, Target, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const quickPrompts = [
  { icon: BookOpen, text: "Explain Pythagoras theorem", as: "পাইথাগোৰাছ উপপাদ্য" },
  { icon: Brain, text: "Photosynthesis short notes", as: "সালোকসংশ্লেষণ" },
  { icon: Target, text: "Exam tips for Mathematics", as: "গণিত পৰীক্ষাৰ টিপচ" },
  { icon: Lightbulb, text: "Important English grammar", as: "ইংৰাজী ব্যাকৰণ" },
]

const subjects = ["Mathematics", "Science", "English", "Social Science", "Assamese"]

export default function Home() {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, sendMessage, status } = useChat<UIMessage>({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || status !== "ready") return
    sendMessage({ text: input })
    setInput("")
  }

  const handleQuickPrompt = (prompt: string) => {
    if (status !== "ready") return
    sendMessage({ text: prompt })
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-accent/20 to-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary">
              <Sparkles className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-balance bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ANISHA – Class 10 Exam AI
              </h1>
              <p className="text-sm text-muted-foreground">
                Assamese + English | Ask questions. Get fast answers. Learn smarter.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="container mx-auto px-4 py-6 max-w-4xl">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 mb-6">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-center mb-3 text-balance">নমস্কাৰ! Hello!</h2>
                <p className="text-muted-foreground text-center mb-8 text-balance max-w-md">
                  I'm ANISHA, your Class 10 study companion. Ask me anything about your subjects!
                </p>

                {/* Subjects Pills */}
                <div className="flex flex-wrap gap-2 justify-center mb-8">
                  {subjects.map((subject) => (
                    <div
                      key={subject}
                      className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium"
                    >
                      {subject}
                    </div>
                  ))}
                </div>

                {/* Quick Prompts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
                  {quickPrompts.map((prompt, index) => (
                    <Card
                      key={index}
                      className="p-4 cursor-pointer hover:bg-accent/50 transition-colors group"
                      onClick={() => handleQuickPrompt(prompt.text)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <prompt.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm mb-1">{prompt.text}</p>
                          <p className="text-xs text-muted-foreground">{prompt.as}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn("flex animate-slide-in", message.role === "user" ? "justify-end" : "justify-start")}
                  >
                    {message.role === "assistant" && (
                      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary mr-2 mt-1 flex-shrink-0">
                        <Sparkles className="w-4 h-4 text-primary-foreground" />
                      </div>
                    )}
                    <div
                      className={cn(
                        "rounded-2xl px-4 py-3 max-w-[80%] shadow-sm",
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border",
                      )}
                    >
                      {message.parts.map((part, index) => {
                        if (part.type === "text") {
                          return (
                            <div key={index} className="text-sm leading-relaxed whitespace-pre-wrap">
                              {part.text}
                            </div>
                          )
                        }
                        return null
                      })}
                    </div>
                  </div>
                ))}
                {status === "streaming" && (
                  <div className="flex justify-start animate-slide-in">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary mr-2 mt-1">
                      <Sparkles className="w-4 h-4 text-primary-foreground animate-pulse-slow" />
                    </div>
                    <div className="rounded-2xl px-4 py-3 bg-card border border-border">
                      <div className="flex gap-1">
                        <div
                          className="w-2 h-2 rounded-full bg-primary animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        />
                        <div
                          className="w-2 h-2 rounded-full bg-primary animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        />
                        <div
                          className="w-2 h-2 rounded-full bg-primary animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Input Area */}
      <footer className="border-t border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask your question... প্ৰশ্ন সোধক..."
              disabled={status !== "ready"}
              className="flex-1 px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            />
            <Button
              type="submit"
              disabled={!input.trim() || status !== "ready"}
              className="rounded-xl px-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-opacity"
              size="lg"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-xs text-center text-muted-foreground mt-3">
            ANISHA – Built to help Class 10 students succeed.
          </p>
        </div>
      </footer>
    </div>
  )
}
