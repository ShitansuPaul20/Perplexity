import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useChat } from '../hooks/useChat'
import { createNewChat, addNewMessage, setCurrentChatId } from '../chat.slice'
import { Send, Mic, Plus, User, Bot } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

const ChatArea = () => {
    const { handleSendMessage } = useChat()
    const dispatch = useDispatch()

    const { chats, currentChatId, isloading } = useSelector(state => state.chat)
    const { user } = useSelector(state => state.auth)

    const [input, setInput] = useState('')
    const messagesEndRef = useRef(null)
    const textareaRef = useRef(null)

    const currentMessages = currentChatId && chats[currentChatId]
        ? chats[currentChatId].messages
        : []

    const currentChatTitle = currentChatId && chats[currentChatId]
        ? chats[currentChatId].title
        : 'New Chat'

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [currentMessages.length, isloading])

    useEffect(() => {
        const ta = textareaRef.current
        if (ta) {
            ta.style.height = 'auto'
            ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'
        }
    }, [input])

    const handleSubmit = async () => {
        if (!input.trim() || isloading) return
        const message = input.trim()
        setInput('')

        if (!currentChatId) {
            const tempId = 'temp_' + Date.now()
            dispatch(createNewChat({ chatId: tempId, title: 'New Chat' }))
            dispatch(setCurrentChatId(tempId))
            dispatch(addNewMessage({ chatId: tempId, content: message, role: 'user' }))
            try {
                await handleSendMessage(message, null, tempId)
            } catch {
                // error state mein already set hai
            }
        } else {
            dispatch(addNewMessage({ chatId: currentChatId, content: message, role: 'user' }))
            try {
                await handleSendMessage(message, currentChatId)
            } catch {
                // error state mein already set hai
            }
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    return (
        <div className="flex-1 flex flex-col h-full min-w-0 bg-[#141414]">

            {/* Top Bar */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8">
                <span className="text-white/50 text-sm truncate">{currentChatTitle}</span>
                <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-white/70 text-xs font-medium shrink-0">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5 custom-scrollbar">

                {!currentChatId && currentMessages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="mb-3 w-12 h-12 rounded-2xl bg-white/8 flex items-center justify-center">
                            <Bot size={22} className="text-white/50" />
                        </div>
                        <p className="text-white/40 text-sm">Hi {user?.name || 'there'},</p>
                        <h2 className="text-white/80 text-xl font-medium mt-1">Where should we start?</h2>
                    </div>
                )}

                {currentMessages.map((msg, index) => (
                    <MessageBubble key={index} message={msg} />
                ))}

                {isloading && (
                    <div className="flex items-start gap-3">
                        <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                            <Bot size={14} className="text-white/50" />
                        </div>
                        <div className="bg-white/7 rounded-2xl rounded-tl-sm px-4 py-3">
                            <div className="flex gap-1 items-center h-4">
                                <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 pb-5 pt-3">
                <div className="bg-[#1c1c1c] border border-white/12 rounded-2xl px-4 py-3
                                focus-within:border-white/25 transition-colors duration-200">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask Lumina..."
                        rows={1}
                        disabled={isloading}
                        className="w-full bg-transparent text-white/85 text-sm placeholder-white/25
                                   resize-none outline-none leading-relaxed custom-scrollbar
                                   disabled:opacity-50"
                        style={{ maxHeight: '160px' }}
                    />
                    <div className="flex items-center justify-between mt-2">
                        <button className="text-white/30 hover:text-white/60 transition-colors">
                            <Plus size={18} />
                        </button>
                        <div className="flex items-center gap-2">
                            <button className="text-white/30 hover:text-white/60 transition-colors">
                                <Mic size={18} />
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!input.trim() || isloading}
                                className={`
                                    w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200
                                    ${input.trim() && !isloading
                                        ? 'bg-white text-black hover:bg-white/90'
                                        : 'bg-white/10 text-white/25 cursor-not-allowed'
                                    }
                                `}
                            >
                                <Send size={13} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const MessageBubble = ({ message }) => {
    const isUser = message.role === 'user'

    return (
        <div className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0
                            ${isUser ? 'bg-white/20' : 'bg-white/10'}`}>
                {isUser
                    ? <User size={13} className="text-white/70" />
                    : <Bot size={13} className="text-white/50" />
                }
            </div>

            <div className={`
                max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
                ${isUser
                    ? 'bg-white/15 text-white/90 rounded-tr-sm'
                    : 'bg-white/7 text-white/75 rounded-tl-sm'
                }
            `}>
                {isUser ? (
                    // User message - plain text
                    message.content
                ) : (
                    // AI message - markdown render karo
                    <ReactMarkdown
                        components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            strong: ({ children }) => <strong className="text-white/95 font-semibold">{children}</strong>,
                            em: ({ children }) => <em className="text-white/80 italic">{children}</em>,
                            h1: ({ children }) => <h1 className="text-white/90 text-base font-semibold mt-3 mb-1">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-white/90 text-sm font-semibold mt-3 mb-1">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-white/90 text-sm font-medium mt-2 mb-1">{children}</h3>,
                            ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-2">{children}</ol>,
                            li: ({ children }) => <li className="text-white/75">{children}</li>,
                            code: ({ inline, children }) =>
                                inline ? (
                                    <code className="bg-white/10 text-white/90 px-1.5 py-0.5 rounded text-xs font-mono">{children}</code>
                                ) : (
                                    <pre className="bg-black/30 rounded-lg p-3 mt-2 mb-2 overflow-x-auto">
                                        <code className="text-white/85 text-xs font-mono">{children}</code>
                                    </pre>
                                ),
                            blockquote: ({ children }) => (
                                <blockquote className="border-l-2 border-white/20 pl-3 italic text-white/60 my-2">{children}</blockquote>
                            ),
                        }}
                    >
                        {message.content}
                    </ReactMarkdown>
                )}
            </div>
        </div>
    )
}

export default ChatArea