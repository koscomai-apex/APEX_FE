import React from "react";
import styles from "./MessageBubble.module.css";

/**
 * 메시지 말풍선 컴포넌트
 * @param {object} props - 컴포넌트 속성
 * @param {'user'|'bot'} props.sender - 메시지 발신자 ('user' 또는 'bot')
 * @param {string} props.text - 메시지 내용 (일반 텍스트)
 * @param {string} props.recommendation - 봇 추천 메시지 ("매수", "중립" 등)
 */
const MessageBubble = ({ sender, text, recommendation }) => {
  const isUser = sender === "user";

  // contentClass와 bubbleClass는 styles가 로드되면 사용 가능합니다.
  // 현재 오류 수정 후에는 정상적으로 작동할 것입니다.
  // const contentClass = isUser ? styles.userContent : styles.botContent; // 현재 사용되지 않음
  const bubbleClass = isUser ? styles.userBubble : styles.botBubble;

  return (
    <div
      className={`${styles.messageRow} ${
        isUser ? styles.userRow : styles.botRow
      }`}
    >
      <div className={`${styles.messageBubble} ${bubbleClass}`}>
        {recommendation && (
          <div className={styles.recommendationTag}>
            "{recommendation}" 추천 "중" 수준입니다!
          </div>
        )}
        <div className={styles.messageContent}>
          {/* 텍스트 내용을 줄바꿈 처리하여 렌더링 */}
          {text.split("\n").map((line, index) => (
            <p key={index} className={styles.textLine}>
              {line}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
