import React, { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Bot, User, Loader2 } from "lucide-react";
// import ReactMarkdown from 'react-markdown'; // Uncomment this line in your project

const GeminiChat = () => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleAsk = async () => {
    if (!prompt.trim() && !file) {
      return;
    }

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: prompt.trim(),
      file: file ? file.name : null,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setPrompt("");
    
    const currentFile = file;
    setFile(null);

    try {
      let res, data;

      if (currentFile) {
        const formData = new FormData();
        formData.append("file", currentFile);

        res = await fetch("https://ai-chatbot-lz10.onrender.com/summarize", {
          method: "POST",
          body: formData,
        });

        data = await res.json();
        
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: data.summary || "No summary returned.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, botMessage]);
      } else {
        res = await fetch("https://ai-chatbot-lz10.onrender.com/ask", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: prompt.trim() }),
        });

        data = await res.json();
        
        const botMessage = {
          id: Date.now() + 1,
          type: 'bot',
          content: data.response || "No response returned.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error("Error during fetch:", error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "Something went wrong. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const removeFile = () => {
    setFile(null);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">Gemini Assistant</h1>
            <p className="text-sm text-gray-500">Chat & Document Summarizer</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto space-y-6">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Gemini Assistant</h2>
              <p className="text-gray-600">Ask me anything or upload a document to get started!</p>
            </div>
          )}

          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex max-w-xs lg:max-w-2xl ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 ${message.type === 'user' ? 'ml-3' : 'mr-3'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-blue-500' 
                      : message.isError 
                        ? 'bg-red-500' 
                        : 'bg-gradient-to-r from-purple-500 to-pink-500'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                </div>

                {/* Message Content */}
                <div className={`px-4 py-3 rounded-2xl ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : message.isError
                      ? 'bg-red-50 text-red-800 border border-red-200'
                      : 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                }`}>
                  {message.file && (
                    <div className={`text-xs mb-2 flex items-center space-x-1 ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      <Paperclip className="w-3 h-3" />
                      <span>{message.file}</span>
                    </div>
                  )}
                  
                  {/* Message Content with Markdown Support */}
                  {message.type === 'bot' ? (
                    <div className="prose prose-sm max-w-none">
                      {/* Enhanced markdown parsing for demo - replace with ReactMarkdown in your project */}
                      <div 
                        className="text-sm leading-relaxed space-y-2"
                        dangerouslySetInnerHTML={{
                          __html: message.content
                            // Handle headings
                            .replace(/^### (.*$)/gm, '<h3 class="text-base font-semibold text-gray-900 mt-4 mb-2">$1</h3>')
                            .replace(/^## (.*$)/gm, '<h2 class="text-lg font-semibold text-gray-900 mt-4 mb-2">$1</h2>')
                            .replace(/^# (.*$)/gm, '<h1 class="text-xl font-semibold text-gray-900 mt-4 mb-2">$1</h1>')
                            
                            // Handle numbered lists
                            .replace(/^\d+\.\s+(.*)$/gm, '<li class="ml-4 mb-1">$1</li>')
                            
                            // Handle bullet points
                            .replace(/^\*\s+(.*)$/gm, '<li class="ml-4 mb-1 list-disc">$1</li>')
                            .replace(/^-\s+(.*)$/gm, '<li class="ml-4 mb-1 list-disc">$1</li>')
                            
                            // Handle bold and italic
                            .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
                            .replace(/\*(.*?)\*/g, '<em class="italic">$1</em>')
                            
                            // Handle inline code
                            .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">$1</code>')
                            
                            // Handle code blocks
                            .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 p-3 rounded mt-3 mb-3 text-xs overflow-x-auto font-mono"><code>$1</code></pre>')
                            
                            // Handle line breaks
                            .replace(/\n\n/g, '</p><p class="mt-2">')
                            .replace(/\n/g, '<br>')
                            
                            // Wrap in paragraph if not already wrapped
                            .replace(/^(?!<[h1-6|li|pre|div])(.+)/gm, '<p>$1</p>')
                        }}
                      />
                      {/* In your project, replace the above div with ReactMarkdown: */}
                      {/* 
                      <ReactMarkdown 
                        className="text-sm leading-relaxed"
                        components={{
                          h1: ({children}) => <h1 className="text-xl font-semibold text-gray-900 mt-4 mb-2">{children}</h1>,
                          h2: ({children}) => <h2 className="text-lg font-semibold text-gray-900 mt-4 mb-2">{children}</h2>,
                          h3: ({children}) => <h3 className="text-base font-semibold text-gray-900 mt-4 mb-2">{children}</h3>,
                          p: ({children}) => <p className="mb-2">{children}</p>,
                          strong: ({children}) => <strong className="font-semibold">{children}</strong>,
                          em: ({children}) => <em className="italic">{children}</em>,
                          ul: ({children}) => <ul className="list-disc ml-4 mb-2 space-y-1">{children}</ul>,
                          ol: ({children}) => <ol className="list-decimal ml-4 mb-2 space-y-1">{children}</ol>,
                          li: ({children}) => <li className="mb-1">{children}</li>,
                          code: ({node, inline, className, children, ...props}) => (
                            inline ? 
                            <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono" {...props}>
                              {children}
                            </code> :
                            <pre className="bg-gray-100 p-3 rounded mt-3 mb-3 text-xs overflow-x-auto">
                              <code className="font-mono" {...props}>{children}</code>
                            </pre>
                          )
                        }}
                      >
                        {message.content}
                      </ReactMarkdown> 
                      */}
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.content}</p>
                  )}
                  <div className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    {message.timestamp}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex">
                <div className="mr-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="bg-white text-gray-800 border border-gray-200 shadow-sm px-4 py-3 rounded-2xl">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 animate-spin text-purple-500" />
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          {/* File Upload Preview */}
          {file && (
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Paperclip className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-800 font-medium">{file.name}</span>
                <span className="text-xs text-blue-600">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <button
                onClick={removeFile}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Remove
              </button>
            </div>
          )}

          {/* Input Container */}
          <div className="relative flex items-end space-x-3">
            {/* File Upload Button */}
            <label className="flex-shrink-0 cursor-pointer">
              <input
                type="file"
                accept=".pdf,.txt,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors">
                <Paperclip className="w-5 h-5 text-gray-500" />
              </div>
            </label>

            {/* Text Input */}
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Message Gemini Assistant..."
                className="w-full resize-none rounded-2xl border border-gray-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent max-h-32 min-h-[44px]"
                rows="1"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#CBD5E0 transparent'
                }}
              />
              
              {/* Send Button */}
              <button
                onClick={handleAsk}
                disabled={loading || (!prompt.trim() && !file)}
                className={`absolute right-2 bottom-2 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  (!prompt.trim() && !file) || loading
                    ? 'bg-gray-200 cursor-not-allowed'
                    : 'bg-purple-500 hover:bg-purple-600 shadow-lg hover:shadow-xl'
                }`}
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 text-gray-400 animate-spin" />
                ) : (
                  <Send className={`w-4 h-4 ${
                    (!prompt.trim() && !file) ? 'text-gray-400' : 'text-white'
                  }`} />
                )}
              </button>
            </div>
          </div>

          {/* Footer Text */}
          <p className="text-xs text-gray-500 text-center mt-3">
            Gemini can make mistakes. Please verify important information.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GeminiChat;