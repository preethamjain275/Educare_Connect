import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageSquare, FiX, FiSend, FiMinimize2, FiCpu, FiUser } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

type Message = {
    id: string;
    sender: "user" | "ai";
    text: string;
    timestamp: Date;
};

interface EducareAIProps {
    context?: string;
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    hideFloatingButton?: boolean;
}

const EducareAI = ({ context = "general", isOpen: externalIsOpen, onOpenChange, hideFloatingButton = false }: EducareAIProps) => {
    const [internalIsOpen, setInternalIsOpen] = useState(false);

    const isControlled = externalIsOpen !== undefined;
    const isOpen = isControlled ? externalIsOpen : internalIsOpen;

    const toggleOpen = () => {
        if (isControlled) {
            onOpenChange?.(!isOpen);
        } else {
            setInternalIsOpen(!internalIsOpen);
        }
    };
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            sender: "ai",
            text: context === 'doctor'
                ? "Hello, Doctor. I am your AI Medical Assistant. I can help with general medical queries, symptoms, and student health records."
                : "Hello! I am Educare AI 🤖. How can I assist you today?",
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userText = inputValue;
        setInputValue("");

        const userMsg: Message = {
            id: Date.now().toString(),
            sender: "user",
            text: userText,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMsg]);
        setIsLoading(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

            const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({
                    messages: messages.concat(userMsg).map(m => ({
                        role: m.sender === 'user' ? 'user' : 'assistant',
                        content: m.text
                    })),
                    context: context
                })
            });

            if (!response.ok) throw new Error("Failed to fetch response");
            if (!response.body) throw new Error("No response body");

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            const aiMsgId = (Date.now() + 1).toString();
            // Add placeholder AI message
            setMessages((prev) => [...prev, {
                id: aiMsgId,
                sender: "ai",
                text: "",
                timestamp: new Date()
            }]);

            let accumulatedText = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value);
                const lines = chunk.split("\n");

                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        const dataStr = line.slice(6);
                        if (dataStr === "[DONE]") continue;

                        try {
                            const data = JSON.parse(dataStr);
                            if (data.choices?.[0]?.delta?.content) {
                                accumulatedText += data.choices[0].delta.content;

                                setMessages(prev => prev.map(m =>
                                    m.id === aiMsgId ? { ...m, text: accumulatedText } : m
                                ));
                            }
                        } catch (e) {
                            console.error("Error parsing SSE chunk", e);
                        }
                    }
                }
            }

        } catch (error) {
            console.error("AI Chat Error:", error);
            setMessages((prev) => [...prev, {
                id: Date.now().toString(),
                sender: "ai",
                text: "Sorry, I encountered an error. Please try again.",
                timestamp: new Date()
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {!isOpen && !hideFloatingButton && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        whileHover={{ scale: 1.1 }}
                        onClick={toggleOpen}
                        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-50 text-white ${context === 'doctor' ? 'bg-gradient-to-br from-rose-500 to-pink-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                            }`}
                    >
                        {context === 'doctor' ? <FiMessageSquare className="w-7 h-7" /> : <FiCpu className="w-7 h-7" />}
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-6 right-6 w-[350px] md:w-[400px] h-[500px] bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className={`p-4 border-b border-border flex items-center justify-between ${context === 'doctor' ? 'bg-gradient-to-r from-rose-500/10 to-pink-600/10' : 'bg-gradient-to-r from-indigo-500/10 to-purple-600/10'
                            }`}>
                            <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${context === 'doctor' ? 'bg-gradient-to-br from-rose-500 to-pink-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                                    }`}>
                                    {context === 'doctor' ? <FiMessageSquare className="w-5 h-5 text-white" /> : <FiCpu className="w-5 h-5 text-white" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-sm">{context === 'doctor' ? 'Medical Assistant' : 'Educare AI'}</h3>
                                    <p className="text-xs text-green-500 flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        Online
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleOpen}>
                                    <FiMinimize2 className="w-4 h-4 text-muted-foreground" />
                                </Button>
                            </div>
                        </div>

                        {/* Chat Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                                >
                                    {msg.sender === 'ai' && (
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 mt-1 shrink-0 ${context === 'doctor' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'
                                            }`}>
                                            {context === 'doctor' ? <FiMessageSquare className="w-3 h-3" /> : <FiCpu className="w-3 h-3" />}
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.sender === "user"
                                            ? (context === 'doctor' ? "bg-rose-600 text-white rounded-tr-none" : "bg-indigo-600 text-white rounded-tr-none")
                                            : "bg-muted text-foreground rounded-tl-none"
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-muted px-4 py-2 rounded-full text-xs text-muted-foreground animate-pulse">
                                        AI is thinking...
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-3 border-t border-border bg-muted/50">
                            <div className="flex gap-2">
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={context === 'doctor' ? "Ask about symptoms, medicines..." : "Ask something..."}
                                    className="bg-background border-border"
                                    disabled={isLoading}
                                />
                                <Button type="submit" size="icon" disabled={isLoading} className={`text-white ${context === 'doctor' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'
                                    }`}>
                                    <FiSend className="w-4 h-4" />
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default EducareAI;
