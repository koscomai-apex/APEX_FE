import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MessageBubble from "../components/MessageBubble";
import { BottomSheet } from "../components/BottomSheet";
import styles from "./ChatPage.module.css";
import { fetchStockSummary } from "../api/apiStockSummary";
import back from "../assets/back.png";

const ChatPage = ({ company = "SK하이닉스" }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  // 메세지 추가
  const sendMessageToAPI = async (userText, mode) => {
    // 사용자 메시지 먼저 추가
    const userMessage = { id: Date.now(), sender: "user", text: userText };
    setMessages((prev) => [...prev, userMessage]);

    // 로딩 메시지
    const loadingMessage = {
      id: Date.now() + 1,
      sender: "bot",
      text: "분석 중입니다...",
    };
    setMessages((prev) => [...prev, loadingMessage]);

    try {
      // mode는 feedback / simulation / undefined
      const data = await fetchStockSummary({
        company,
        input: userText,
        sessionId: "user-123",
        mode,
      });

      const botAnswer = data.result?.answer || "답변이 없습니다.";
      const botMessage = { id: Date.now() + 2, sender: "bot", text: botAnswer };

      // 기존 로딩 메시지 제거 후 실제 답변 추가
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== loadingMessage.id),
        botMessage,
      ]);
    } catch (err) {
      const errorMessage = {
        id: Date.now() + 3,
        sender: "bot",
        text: "API 호출에 실패했습니다.",
      };
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== loadingMessage.id),
        errorMessage,
      ]);
    }
  };

  // 사용자 입력 전송
  const handleSend = () => {
    if (input.trim() === "") return;
    sendMessageToAPI(input); // 일반 질문이면 mode 생략
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
              sendMessageToAPI("투자 피드백 상세", "feedback");
              setIsDrawerOpen(false);
            }}
          >
            투자 피드백 상세
          </p>
          <p
            onClick={() => {
              sendMessageToAPI("투자 시뮬레이션 하기", "simulation");
              setIsDrawerOpen(false);
            }}
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
            if (e.key === "Enter") handleSend();
          }}
        />
        <button className={styles.upArrow} onClick={handleSend}>
          ↑
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
