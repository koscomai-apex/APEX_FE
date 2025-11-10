import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MessageBubble from "../components/MessageBubble";
import { BottomSheet } from "../components/BottomSheet";
import styles from "./ChatPage.module.css";

const ChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "user",
      text: "투자 피드백 받기",
    },
    {
      id: 2,
      sender: "bot",
      title: " '매수' 추천 '중' 수준입니다! ",
      text:
        "외국인 순매수가 최근 3거래일 연속으로 증가하고 있어요.\n" +
        "반도체 업황 회복 기대감이 일부 반영된 상태예요.\n" +
        "주가가 최근 1개월 사이 저점 대비 15% 상승하여 단기 상승세로 진입했어요.",
    },
  ]);

  const [input, setInput] = useState("");

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  // 사용자 메시지 전송 로직 (임시)
  const handleSend = () => {
    if (input.trim() === "") return;

    const newMessage = {
      id: Date.now(),
      sender: "user",
      text: input,
    };

    setMessages([...messages, newMessage]);
    setInput("");

    // 챗봇 응답 임시
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        sender: "bot",
        text: "사용자님의 메시지를 분석 중입니다. 잠시만 기다려 주세요.",
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
    }, 500);
  };

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          &lt;
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
          {/* 버튼으로 바꿔야함 */}
          <p>투자 피드백 상세</p>
          <p>투자 시뮬레이션 하기</p>
        </BottomSheet>
      </div>

      <div className={styles.inputContainer}>
        <input className={styles.inputText} type="text" />
        <button className={styles.upArrow}>↑</button>
      </div>
    </div>
  );
};

export default ChatPage;
