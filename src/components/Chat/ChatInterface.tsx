import { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { Card, Text, Title } from "@tremor/react";
import { Send, Bot, User } from "lucide-react";
import toast from "react-hot-toast";
import { Database } from "../../lib/database.types";

type Tables = Database["public"]["Tables"];
type ChatLog = Tables["chat_logs"]["Row"];
type ChatLogInsert = Tables["chat_logs"]["Insert"];

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChatHistory();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('chat_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const chatLogs = data as ChatLog[];
      setMessages(
        chatLogs.map((msg) => ({
          role: msg.role,
          content: msg.content,
          timestamp: new Date(msg.created_at).toLocaleTimeString(),
        }))
      );
    } catch (error) {
      console.error("Error loading chat history:", error);
      toast.error("Failed to load chat history");
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Send message to Gemini AI through Supabase Edge Function
      const { data, error } = await supabase.functions.invoke(
        "chat-assistant",
        {
          body: JSON.stringify({ message: input }),
        }
      );

      if (error) throw error;

      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: data.response,
        timestamp: new Date().toLocaleTimeString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Save both messages to chat_logs
      await supabase.from('chat_logs').insert([
        {
          user_id: user.id,
          role: 'user' as const,
          content: input,
        },
        {
          user_id: user.id,
          role: 'assistant' as const,
          content: data.response,
        },
      ] satisfies ChatLogInsert[]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="h-[600px] flex flex-col">
        <Title>SEO Assistant</Title>
        <Text>Ask me anything about SEO and content optimization</Text>

        <div className="flex-1 overflow-y-auto mt-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`flex items-start space-x-2 max-w-[80%] ${
                  msg.role === "user"
                    ? "flex-row-reverse space-x-reverse bg-indigo-100"
                    : "bg-gray-100"
                } rounded-lg p-3`}
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white">
                  {msg.role === "user" ? (
                    <User className="w-5 h-5 text-indigo-600" />
                  ) : (
                    <Bot className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div>
                  <Text>{msg.content}</Text>
                  <Text className="text-xs text-gray-500 mt-1">
                    {msg.timestamp}
                  </Text>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="mt-4">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="Ask a question about SEO..."
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? "Thinking..." : <Send className="w-5 h-5" />}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
