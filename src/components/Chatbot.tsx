import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Car,
  Star,
  Shield,
  RefreshCw,
} from "lucide-react";
import { carAgent } from "../lib/carAgent";
import { Car as CarType } from "../lib/supabase";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  recommendedCars?: { id: number; reason: string; carDetails?: Partial<CarType> }[];
  followUpQuestion?: string;
}

const formatPrice = (price: number | null) => {
  if (!price) return "TBA";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I can help you find the perfect car. What's your budget and what kind of car are you looking for? (e.g., 'I want to buy an EV around 10L')",
    },
  ]);

  const resetChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hi! I can help you find the perfect car. What's your budget and what kind of car are you looking for? (e.g., 'I want to buy an EV around 10L')",
      },
    ]);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    // Append user input
    const userMessage: ChatMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    try {
      // Map state into standard format LangGraph expects
      const graphMessagesInput = newMessages.map((m) => ({
        role: m.role,
        content: m.content + (m.followUpQuestion || ""),
      }));

      // Invoke LangGraph Agent
      const finalState = await carAgent.invoke({
        messages: graphMessagesInput,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: finalState.response,
          recommendedCars: finalState.recommendedCarList,
          followUpQuestion: finalState.followUpQuestion,
        },
      ]);
    } catch (error) {
      console.error("Agent error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, my circuits crossed. Let's try that again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Popup window */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-125 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col mb-4 overflow-hidden transition-all">
          {/* Header */}
          <div className="bg-blue-600 p-4 flex justify-between items-center text-white">
            <div className="flex items-center gap-2 font-semibold">
              <Bot className="w-5 h-5" /> CarFinder AI
            </div>
            <button
              onClick={resetChat}
              className="hover:bg-blue-700 p-1 rounded-md transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-700 p-1 rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, idx) => (
              <div key={idx} className="space-y-3">
                {/* Main Response block */}
                <div
                  className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === "user" ? "bg-slate-800 text-white" : "bg-blue-100 text-blue-600"}`}
                  >
                    {msg.role === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={`px-4 py-2 rounded-2xl max-w-[75%] text-sm ${msg.role === "user" ? "bg-slate-800 text-white rounded-tr-sm" : "bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm"}`}
                  >
                    {msg.content}
                  </div>
                </div>

                {/* Render Recommended Car Chips Between Response and Follow-up */}
                {msg.role === "assistant" &&
                  msg.recommendedCars &&
                  msg.recommendedCars.length > 0 && (
                    <div className="pl-10 pr-4 space-y-2.5">
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Suggested Matches:
                      </p>
                      <div className="flex flex-col gap-2">
                        {msg.recommendedCars.map((carItem) => (
                          <div
                            key={carItem.id}
                            className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm hover:border-blue-300 transition-all"
                          >
                            <div className="flex justify-between items-start gap-2 mb-1">
                              <div>
                                <h4 className="text-sm font-bold text-slate-900">
                                  {carItem.carDetails?.make || "Car"}{" "}
                                  {carItem.carDetails?.model || ""}
                                </h4>
                                {carItem.carDetails?.variant && (
                                  <p className="text-xs text-slate-400">
                                    {carItem.carDetails.variant}
                                  </p>
                                )}
                              </div>
                              {carItem.carDetails?.ex_showroom_price && (
                                <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md shrink-0">
                                  {formatPrice(
                                    carItem.carDetails.ex_showroom_price,
                                  )}
                                </span>
                              )}
                            </div>

                            {/* AI Justification text */}
                            <p className="text-xs text-slate-600 italic bg-slate-50 p-2 rounded-lg border-l-2 border-blue-500 mb-2">
                              "{carItem.reason}"
                            </p>

                            {/* Quick Specification Metadata Sub-row */}
                            <div className="flex items-center justify-between text-[10px] text-slate-500 mb-2">
                              <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">
                                {carItem.carDetails?.fuel_type || "Petrol/EV"}
                              </span>
                              <div className="flex gap-2">
                                {carItem.carDetails?.user_rating && (
                                  <span className="flex items-center gap-0.5">
                                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />{" "}
                                    {carItem.carDetails.user_rating}
                                  </span>
                                )}
                                {carItem.carDetails?.safety_rating && (
                                  <span className="flex items-center gap-0.5">
                                    <Shield className="w-3 h-3 text-emerald-500" />{" "}
                                    {carItem.carDetails.safety_rating} ★
                                  </span>
                                )}
                              </div>
                            </div>

                            <Link
                              to={`/car/${carItem.id}`}
                              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1 mt-1 justify-end w-full"
                            >
                              <Car className="w-3 h-3" /> View Details →
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                {/* Follow-up Question Block rendered right beneath the options */}
                {msg.role === "assistant" && msg.followUpQuestion && (
                  <div className="flex gap-2 flex-row pl-10">
                    <div className="px-4 py-2 rounded-2xl max-w-[85%] text-sm bg-blue-50 text-blue-800 rounded-tl-sm font-medium border border-blue-100 shadow-xs">
                      {msg.followUpQuestion}
                    </div>
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2 items-center text-slate-400 text-sm p-2">
                <Bot className="w-4 h-4" /> Thinking...
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-slate-100">
            <div className="relative flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your requirements..."
                className="w-full bg-slate-50 border border-slate-200 rounded-full pl-4 pr-12 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSend}
                disabled={isTyping || !input.trim()}
                className="absolute right-1.5 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 hover:bg-blue-700 transition-all flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
