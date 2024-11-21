import React, { useState } from 'react';
import axios from 'axios';
import FileUpload from './FileUpload';

function App() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false); // State for loader

  const sendMessage = async (message) => {
    const userMessage = { sender: "user", text: message };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true); // Show loader when waiting for bot response
  
    try {
      const response = await axios.post("http://98.84.191.214:5005/webhooks/rest/webhook", {
        sender: "user",
        message,
      });
  
      // Join multiple bot replies into a single message
      const botText = response.data
        .filter(botReply => botReply.text) // Ensure there's text in the response
        .map(botReply => botReply.text)
        .join('\n'); // Join all replies into a single string
  
      if (botText) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "bot", text: botText },
        ]);
      }
    } catch (error) {
      console.error("Error communicating with Rasa server:", error);
    } finally {
      setIsLoading(false); // Hide loader after bot response
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (userInput.trim() !== "") {
      sendMessage(userInput);
      setUserInput(""); // Clear input field
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto", fontFamily: "Arial, sans-serif", position: "relative" }}>
      <h1>Miheer Chatbot</h1>
      <div style={{ border: "1px solid #ccc", padding: "10px", height: "300px", overflowY: "scroll", marginBottom: "10px", position: "relative" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === "bot" ? "left" : "right", margin: "5px 0" }}>
            <strong>{msg.sender === "bot" ? "Bot" : "You"}:</strong>
            <div
              style={{ whiteSpace: "pre-wrap" }} // This style preserves white space and line breaks
              dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>') }} // Replace new lines with <br/>
            />
          </div>
        ))}
        {isLoading && (
          <div style={{
            position: "absolute", // Positioning the loader in the center of the chat box
            top: "50%", 
            left: "50%", 
            transform: "translate(-50%, -50%)", // Center it properly
            border: "6px solid #f3f3f3", // Light gray
            borderTop: "6px solid #3498db", // Blue
            borderRadius: "50%",
            width: "50px", // Increased size
            height: "50px", // Increased size
            animation: "spin 1.5s linear infinite"
          }}>
            {/* Loader */}
          </div>
        )}
      </div>
      <FileUpload onFileUpload={() => alert('File uploaded successfully!')} />
      <form onSubmit={handleTextSubmit} style={{ display: "flex" }}>
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type a message"
          style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
        />
        <button type="submit" style={{ padding: "10px 20px", marginLeft: "10px", borderRadius: "4px", backgroundColor: "#4CAF50", color: "#fff", border: "none" }}>
          Send
        </button>
      </form>

      {/* Adding keyframes animation for the spinner inline */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default App;
