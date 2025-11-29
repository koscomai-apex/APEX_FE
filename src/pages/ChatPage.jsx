import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MessageBubble from "../components/MessageBubble";
import { BottomSheet } from "../components/BottomSheet";
import styles from "./ChatPage.module.css";
import back from "../assets/back.png";
import { fetchChat } from "../api/apiChat";
import { fetchChatFeedback } from "../api/apiChatFeedback";
import { fetchChatSimulation } from "../api/apiChatSimulation";

const ChatPage = ({ company = "SK하이닉스" }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null); // 스크롤을 위한 Ref 추가

  // 컴포넌트 마운트 및 메시지 업데이트 시 스크롤 최하단으로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleBack = () => {
    navigate(-1);
  };

  const sendMessageToAPI = async (userText, mode = "chat") => {
    if (isLoading) return;

    const userMessage = { id: Date.now(), sender: "user", text: userText };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const loadingMessageId = Date.now() + 1;
    const loadingMessage = {
      id: loadingMessageId,
      sender: "bot",
      text: "분석 중입니다...",
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      let data;
      switch (mode) {
        case "feedback":
          data = await fetchChatFeedback({ company, input: userText });
          break;
        case "simulation":
          data = await fetchChatSimulation({ company, input: userText });
          break;
        case "chat":
        default:
          data = await fetchChat({ company, input: userText });
          break;
      }
      const response = Array.isArray(data) ? data[0] : data;

      const botAnswer =
        response?.result?.answer || `[${mode}] 요청에 대한 답변이 없습니다.`;

      const botMessage = {
        id: Date.now() + 2,
        sender: "bot",
        text: botAnswer,
      };

      setMessages((prev) => [
        ...prev.filter((m) => m.id !== loadingMessageId),
        botMessage,
      ]);
    } catch (err) {
      console.error(`[${mode}] API 호출 오류:`, err);
      const errorMessage = {
        id: Date.now() + 3,
        sender: "bot",
        text: `[${mode}] API 호출에 실패했습니다. 서버 오류를 확인해주세요.`,
      };
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== loadingMessageId),
        errorMessage,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => {
    if (input.trim() === "") return;
    sendMessageToAPI(input.trim(), "chat");
    setInput("");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          <img src={back} alt="뒤로가기" className={styles.backIcon} />
        </button>
      </header>

      <div className={styles.chatArea}>
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            sender={msg.sender}
            title={msg.title}
            text={msg.text}
            recommendation={msg.recommendation}
          />
        ))}
        <div ref={messagesEndRef} />
        <div style={{ height: "150px" }} />
      </div>

      <div className={styles.investmentScreenArea}>
        <BottomSheet
          isOpen={isDrawerOpen}
          setOpen={setIsDrawerOpen}
          initPosition="85%"
          openPosition="75%"
        >
          <p
            onClick={() => {
              // mode: "feedback" 으로 설정
              sendMessageToAPI("투자 피드백 받기", "feedback");
              setIsDrawerOpen(false);
            }}
            className={styles.bottomSheetItem}
          >
            투자 피드백 상세
          </p>
          <p
            onClick={() => {
              // mode: "simulation" 으로 설정
              sendMessageToAPI("투자 시뮬레이션 하기", "simulation");
              setIsDrawerOpen(false);
            }}
            className={styles.bottomSheetItem}
          >
            투자 시뮬레이션 하기
          </p>
        </BottomSheet>
      </div>

      <div className={styles.inputContainer}>
        <input
          className={styles.inputText}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isLoading) handleSend();
          }}
          disabled={isLoading}
          placeholder={
            isLoading
              ? "답변을 기다리는 중입니다..."
              : "여기에 메시지를 입력하세요..."
          }
        />
        <button
          className={styles.upArrow}
          onClick={handleSend}
          disabled={isLoading}
        >
          ↑
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
