import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Send, Bot, Paperclip, Mic, Image, Square } from "lucide-react";
import {jwtDecode} from "jwt-decode"; // Import jwt-decode

const API_KEY = "AIzaSyAuoc6omPHCESF6nREp7L2sHnT1MK5s30k"; // Replace with your actual API key

const Chatbot = () => {
  // Define Message type
  type Message = {
    id: string;
    text: string;
    sender: string;
    time: Date;
    image?: string | null;
    audio?: string | null;
  };

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [studentId, setStudentId] = useState<string | null>(null); // State for studentId

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const generateUniqueId = () => {
    return Date.now().toString() + "-" + Math.random().toString(36).substr(2, 9);
  };

  // Setup audio recording functionality
  useEffect(() => {
    const setupAudioRecording = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        
        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };
        
        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setAudioBlob(audioBlob);
          setAudioUrl(audioUrl);
          audioChunksRef.current = [];
        };
        
        mediaRecorderRef.current = mediaRecorder;
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    };
    
    setupAudioRecording();
    
    // Clean up function
    return () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // Retrieve and decode token to set studentId
  useEffect(() => {
    const token = localStorage.getItem("token"); // Adjust key if different
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setStudentId(decoded.id); // Extract 'id' from payload
        console.log("Student ID set to:", decoded.id);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.error("No token found in local storage");
    }
  }, []);

  // Fetch chat history when studentId is available
  useEffect(() => {
    if (studentId) {
      const fetchChatHistory = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/chat/${studentId}`);
          // Log the response for debugging
          console.log("API Response:", response.data);

          if (Array.isArray(response.data)) {
            const fetchedMessages = response.data.map((msg: any) => ({
              id: msg._id.toString(),
              text: msg.text,
              sender: msg.sender,
              time: new Date(msg.time),
              image: msg.image || null,
              audio: msg.audio || null,
            }));
            if (fetchedMessages.length === 0) {
              const initialMessage = {
                id: "init-msg",
                text: "Hello! I'm your VidyaSetu learning assistant. How can I help you today?",
                sender: "bot",
                time: new Date(),
                image: null,
                audio: null,
              };
              setMessages([initialMessage]);
            } else {
              setMessages(fetchedMessages);
            }
          } else {
            console.error("Expected an array but received:", response.data);
            // Set an initial message if the response is not an array
            const initialMessage = {
              id: "init-msg",
              text: "Hello! I'm your VidyaSetu learning assistant. How can I help you today?",
              sender: "bot",
              time: new Date(),
              image: null,
              audio: null,
            };
            setMessages([initialMessage]);
          }
        } catch (error) {
          console.error("Error fetching chat history:", error);
          // Set an initial message on network or other errors
          const initialMessage = {
            id: "init-msg",
            text: "Hello! I'm your VidyaSetu learning assistant. How can I help you today?",
            sender: "bot",
            time: new Date(),
            image: null,
            audio: null,
          };
          setMessages([initialMessage]);
        }
      };
      fetchChatHistory();
    }
  }, [studentId]);

  // Scroll to bottom on new message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Utility to convert blob to base64
  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Save message to the database
  const saveMessage = async (message: Message, audioBlob: Blob | null) => {
    if (!studentId) {
      console.error("Cannot save message: studentId is not set");
      return;
    }
    try {
      let audioData = null;
      if (audioBlob) {
        audioData = await blobToBase64(audioBlob);
      }
      await axios.post("http://localhost:5000/api/chat", {
        studentId, // Include studentId in payload
        text: message.text,
        sender: message.sender,
        time: message.time.toISOString(),
        image: message.image,
        audio: audioData,
      });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  };

// Function to send message to Gemini API
const fetchGeminiResponse = async (userInput: string, imageData: string | null, audioBlob: Blob | null) => {
  try {
    const requestData: any = {
      contents: [{ parts: [] }]
    };

    // Add text input if available
    if (userInput) {
      requestData.contents[0].parts.push({ text: userInput });
    }

    // Add image input if available
    if (imageData) {
      requestData.contents[0].parts.push({
        inline_data: {
          mime_type: "image/png",  // Adjust based on the actual image type
          data: imageData.split(",")[1],  // Extract base64 data
        },
      });
    }

    // Add audio input if available
    if (audioBlob) {
      // For audio, we need to convert the blob to base64
      const audioBase64 = await blobToBase64(audioBlob);
      const base64Data = audioBase64.split(",")[1];
      
      requestData.contents[0].parts.push({
        inline_data: {
          mime_type: "audio/webm",
          data: base64Data,
        },
      });
    }

    // Send request to Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      requestData
    );

    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process that.";

  } catch (error) {
    console.error("Error fetching response:", error);
    return "Oops! Something went wrong. The API might not support direct audio processing. Please try with text or image input.";
  }
};


  const handleSendMessage = async () => {
    if (inputMessage.trim() === "" && !selectedImage && !audioBlob) return;
    if (!studentId) {
      console.error("Cannot send message: studentId is not set");
      return;
    }
    setIsProcessing(true);

    const userMessage: Message = {
      id: generateUniqueId(),
      text: inputMessage || (selectedImage || audioBlob ? `${selectedImage ? "📷 " : ""}${audioBlob ? "🎤 " : ""}Sent media` : ""),
      sender: "user",
      time: new Date(),
      image: selectedImage || null,
      audio: audioUrl || null,
    };

    setMessages((prev) => [...prev, userMessage]);
    await saveMessage(userMessage, audioBlob); // Save user message

    const thinkingId = generateUniqueId();
    const thinkingMessage = {
      id: thinkingId,
      text: "Thinking...",
      sender: "bot",
      time: new Date(),
    };
    setMessages((prev) => [...prev, thinkingMessage]);

    const botReply = await fetchGeminiResponse(inputMessage, selectedImage, audioBlob);
    setMessages((prev) => prev.filter((msg) => msg.id !== thinkingId));

    const botMessage: Message = {
      id: generateUniqueId(),
      text: botReply,
      sender: "bot",
      time: new Date(),
    };

    setMessages((prev) => [...prev, botMessage]);
    await saveMessage(botMessage, null); // Save bot message

    setInputMessage("");
    setSelectedImage(null);
    setAudioBlob(null);
    setAudioUrl(null);
    setIsProcessing(false);
  };

  const handleFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const startRecording = () => {
    if (mediaRecorderRef.current) {
      audioChunksRef.current = []; // Clear previous chunks
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } else {
      console.error("MediaRecorder not initialized");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)]">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Learning Assistant</h1>

      <div className="flex-1 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col">
        {/* Chat header */}
        <div className="p-4 border-b border-gray-100 bg-primary/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-full">
              <Bot size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="font-medium">VidyaSetu Assistant</h2>
              <p className="text-xs text-gray-600">Online • Ready to help</p>
            </div>
          </div>
        </div>

        {/* Messages container */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user" ? "bg-primary text-white rounded-tr-none" : "bg-gray-100 text-gray-800 rounded-tl-none"
                  }`}
                >
                  {message.image && (
                    <img src={message.image} alt="Uploaded" className="max-w-[200px] rounded-lg shadow-md mb-2" />
                  )}
                  {message.audio && (
                    <audio controls src={message.audio} className="mb-2 max-w-full"></audio>
                  )}
                  <ReactMarkdown>{message.text}</ReactMarkdown>
                  <span className={`text-xs mt-1 block ${message.sender === "user" ? "text-white/70" : "text-gray-500"}`}>
                    {message.time.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <button 
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full" 
              onClick={handleFileSelect}
              disabled={isRecording || isProcessing}
            >
              <Paperclip size={20} />
            </button>
            <button 
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full" 
              onClick={handleFileSelect}
              disabled={isRecording || isProcessing}
            >
              <Image size={20} />
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            <div className="flex-1 relative">
              {selectedImage && (
                <div className="mt-2">
                  <img src={selectedImage} alt="Selected" className="max-w-[200px] rounded-lg shadow-md" />
                </div>
              )}
              {audioUrl && (
                <div className="mt-2">
                  <audio controls src={audioUrl} className="max-w-full"></audio>
                </div>
              )}
              <textarea
                className="w-full p-3 pr-10 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                placeholder="Type your message..."
                rows={1}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isProcessing || isRecording}
              />
              <button 
                className="absolute right-3 bottom-3 text-gray-500 hover:text-gray-700" 
                onClick={handleSendMessage}
                disabled={isProcessing || isRecording || (inputMessage.trim() === "" && !selectedImage && !audioBlob)}
              >
                <Send size={20} />
              </button>
            </div>
            <button 
              className={`p-2 rounded-full ${isRecording ? 'bg-red-100 text-red-500' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isProcessing}
            >
              {isRecording ? <Square size={20} /> : <Mic size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;