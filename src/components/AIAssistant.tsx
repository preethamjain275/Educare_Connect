import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMessageSquare, FiX, FiSend, FiMic, FiMicOff, FiVolume2, FiVolumeX } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`;
const TTS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`;
const STT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-stt`;

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm EduCare AI. How can I help you today?" }
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const streamChat = async (userMessage: string) => {
    const userMsg: Message = { role: "user", content: userMessage };
    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    let assistantContent = "";

    try {
      const response = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = "";

      // Add initial assistant message
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (line.startsWith(":") || line.trim() === "") continue;
          if (!line.startsWith("data: ")) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === "[DONE]") break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = { role: "assistant", content: assistantContent };
                return updated;
              });
            }
          } catch {
            textBuffer = line + "\n" + textBuffer;
            break;
          }
        }
      }

      // Speak the response if voice is enabled
      if (voiceEnabled && assistantContent) {
        speakText(assistantContent);
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error("Failed to get AI response");
      setMessages(prev => {
        const updated = [...prev];
        if (updated[updated.length - 1]?.role === "assistant" && updated[updated.length - 1]?.content === "") {
          updated.pop();
        }
        return updated;
      });
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = async (text: string) => {
    try {
      setIsSpeaking(true);
      
      const response = await fetch(TTS_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error("TTS request failed");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
      }
      
      const audio = new Audio(audioUrl);
      currentAudioRef.current = audio;
      
      audio.onended = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };
      
      audio.onerror = () => {
        setIsSpeaking(false);
        URL.revokeObjectURL(audioUrl);
      };

      await audio.play();
    } catch (error) {
      console.error("TTS error:", error);
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    setIsSpeaking(false);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        stream.getTracks().forEach(track => track.stop());
        
        // Convert to base64 and send to STT
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Audio = (reader.result as string).split(",")[1];
          
          try {
            const response = await fetch(STT_URL, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
              },
              body: JSON.stringify({ audio: base64Audio }),
            });

            if (!response.ok) {
              throw new Error("STT request failed");
            }

            const result = await response.json();
            if (result.text) {
              streamChat(result.text);
            }
          } catch (error) {
            console.error("STT error:", error);
            toast.error("Failed to transcribe audio");
          }
        };
        reader.readAsDataURL(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.success("Recording started... Speak now!");
    } catch (error) {
      console.error("Recording error:", error);
      toast.error("Failed to access microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      toast.success("Processing your voice...");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    
    streamChat(inputText.trim());
    setInputText("");
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg flex items-center justify-center ${isOpen ? "hidden" : ""}`}
      >
        <FiMessageSquare className="w-6 h-6" />
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] max-w-[calc(100vw-48px)] max-h-[calc(100vh-100px)] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <FiMessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold">EduCare AI</h3>
                  <p className="text-xs opacity-80">Powered by Google Gemini</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setVoiceEnabled(!voiceEnabled)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  title={voiceEnabled ? "Disable voice" : "Enable voice"}
                >
                  {voiceEnabled ? <FiVolume2 className="w-5 h-5" /> : <FiVolumeX className="w-5 h-5" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                      msg.role === "user"
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-br-md"
                        : "bg-muted text-foreground rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && messages[messages.length - 1]?.content === "" && (
                <div className="flex justify-start">
                  <div className="bg-muted px-4 py-2 rounded-2xl rounded-bl-md">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Speaking Indicator */}
            {isSpeaking && (
              <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/30 flex items-center justify-between">
                <span className="text-xs text-blue-600 dark:text-blue-400">Speaking...</span>
                <button
                  onClick={stopSpeaking}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Stop
                </button>
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-border">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`p-2 rounded-full transition-colors ${
                    isRecording
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                  disabled={isLoading}
                >
                  {isRecording ? <FiMicOff className="w-5 h-5" /> : <FiMic className="w-5 h-5" />}
                </button>
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message..."
                  disabled={isLoading || isRecording}
                  className="flex-1"
                />
                <Button type="submit" size="sm" disabled={isLoading || isRecording || !inputText.trim()}>
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

export default AIAssistant;
