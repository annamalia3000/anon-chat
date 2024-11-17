import { Message } from './components/Message/Message'
import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid';
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";
import './App.css'

type MessageInfo = {
  id: number;
  userId: string;
  content: string;
  isOwnMessage: boolean;
};

const App: React.FC = () => {
  const url ='http://localhost:7070/messages';
  const [messages, setMessages] = useState<MessageInfo[]>([]);
  const [message, setMessage] = useState("");
  const [lastId, setLastId] = useState(0);

  const generateUserId = () => {
    let storedId = localStorage.getItem("userId");
    if (!storedId) {
      storedId = uuidv4();
      localStorage.setItem("userId", storedId);
    }
    return storedId;
  };

  const userId = generateUserId();

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${url}?from=${lastId}`);
      if (response.data.length > 0) {
        setMessages((prevMessages) =>  {
          const existingIds = new Set(prevMessages.map((msg) => msg.id));

          const newMessages = response.data.filter(
            (msg: MessageInfo) => !existingIds.has(msg.id)
          );
          return [...prevMessages, ...newMessages];
        });
        setLastId(response.data[response.data.length - 1].id);
      } 
    } catch (error) {
      console.log("Ошибка при загрузке сообщений:", error);
    }
  }

  const addMessage = async () => {
    if (message.trim() !== "") {
      try {
        await axios.post(url, 
          {
          id: 0,
          userId,
          content: message,
        });
        setMessage("");
        await fetchMessages();
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const intervalId = setInterval(fetchMessages, 5 * 1000);
    return () => clearInterval(intervalId);
  }, [lastId]); 

  return (
    <div className='chat-container'>
      <div className='chat'>
      <div className='message-container'>
        {messages.map ((message) => (
          <Message 
          key={message.id} 
          id={message.id} 
          userId={message.userId} 
          content={message.content}
          isOwnMessage={message.userId === userId} />
        ))}
      </div>
      <div className="input-container">
          <textarea
            className="new-message-input"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="submit-button" type="button" onClick={addMessage}>
            <i className="fa fa-location-arrow"></i>
          </button>
        </div>
    </div>
    </div>
  )

}
export default App

