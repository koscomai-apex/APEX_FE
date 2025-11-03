import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import styles from "./InvestPage.module.css";
import chatbot from "../assets/chatbot.png";

const InvestPage = () => {
  const { stockId } = useParams();
  const [activeTab, setActiveTab] = useState("price");

  // 임시 데이터
  const stockInfo = {
    samsung: {
      name: "삼성전자",
      currentPrice: 138762,
      priceData: [
        { time: "09:00", price: 142000 },
        { time: "10:00", price: 141000 },
        { time: "11:00", price: 139000 },
        { time: "12:00", price: 138000 },
        { time: "13:00", price: 138762 },
      ],
      sentiment: {
        score: "상",
        date: "2025.10.01 기준",
        positive: "62%",
        neutral: "20%",
        negative: "18%",
        comment:
          "공급망 언급량이 62%로 급증하였습니다. 높은 감정 과열 수치를 띄므로 이성적인 판단이 중요합니다.",
        sources: ["CAFE:20250720-775", "HSS:20250720-112"],
      },
    },
    naver: {
      name: "네이버",
      currentPrice: 210000,
      priceData: [
        { time: "09:00", price: 208000 },
        { time: "10:00", price: 210500 },
        { time: "11:00", price: 209500 },
        { time: "12:00", price: 211000 },
        { time: "13:00", price: 210000 },
      ],
      sentiment: {
        score: "중",
        date: "2025.10.01 기준",
        positive: "45%",
        neutral: "40%",
        negative: "15%",
        comment:
          "신규 AI 서비스 출시 기대감으로 긍정적 언급이 소폭 증가했습니다. 투자 전 추가적인 자료 검토가 필요합니다.",
        sources: ["NEWS:20250930-001"],
      },
    },
    // 오류 방지용 최소 데이터
    kakao: { name: "카카오", currentPrice: 0, priceData: [], sentiment: {} },
    hyundai: { name: "현대차", currentPrice: 0, priceData: [], sentiment: {} },
  }[stockId];

  const currentStock = stockInfo;

  if (!currentStock || !currentStock.name) {
    return (
      <div className={styles.noDataMessage} style={{ backgroundColor: "#fff" }}>
        데이터를 불러오는 중이거나, 유효하지 않은 종목입니다.
      </div>
    );
  }

  const averagePrice =
    currentStock.priceData.length > 0
      ? currentStock.priceData.reduce((sum, item) => sum + item.price, 0) /
        currentStock.priceData.length
      : 0;

  const isChartReady =
    currentStock.priceData && currentStock.priceData.length > 0;

  const isDetailDataReady = stockId === "samsung" || stockId === "naver";

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  const handleChatClick = () => {
    navigate(`/chat`);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backButton} onClick={handleBack}>
          &lt;
        </button>
      </header>
      <h1 className={styles.stockName}>{currentStock.name}</h1>
      <div className={styles.priceDisplay}>
        <p className={styles.currentPrice}>
          {currentStock.currentPrice.toLocaleString()}원
        </p>

        <div className={styles.tabButtons}>
          <button
            className={`${styles.tabButton} ${
              activeTab === "price" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("price")}
          >
            주가
          </button>
          <button
            className={`${styles.tabButton} ${
              activeTab === "sentiment" ? styles.active : styles.inactive
            }`}
            onClick={() => setActiveTab("sentiment")}
          >
            감정
          </button>
        </div>
      </div>

      {isDetailDataReady ? (
        <>
          {activeTab === "price" ? (
            <section className={styles.graphSection}>
              <div className={styles.graphPlaceholder}>
                {isChartReady ? (
                  <div className={styles.chartContainer}>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart
                        data={currentStock.priceData} // 🟢 오류 수정: priceData 배열을 전달
                        margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                      >
                        <XAxis dataKey="time" hide />
                        <YAxis hide />
                        <Tooltip
                          formatter={(value) => `${value.toLocaleString()}원`}
                          labelFormatter={(label) => `${label} 시`}
                        />
                        {/* 🟢 기준선 (ReferenceLine) 추가 */}
                        {averagePrice > 0 && (
                          <ReferenceLine
                            y={averagePrice}
                            stroke="#cccccc"
                            strokeDasharray="3 3"
                          />
                        )}
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke="#2563eb"
                          strokeWidth={2}
                          dot={false}
                          activeDot={{
                            r: 6,
                            fill: "#2563eb",
                            stroke: "#fff",
                            strokeWidth: 2,
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div
                    className={styles.noDataMessage}
                    style={{ height: "200px" }}
                  >
                    주가 데이터를 준비 중입니다.
                  </div>
                )}
              </div>
              <div className={styles.timeframeButtons}>
                <button
                  className={`${styles.timeframeButton} ${styles.active}`}
                >
                  1일
                </button>
                <button className={styles.timeframeButton}>1주</button>
                <button className={styles.timeframeButton}>1달</button>
                <button className={styles.timeframeButton}>1년</button>
                <button className={styles.timeframeButton}>5년</button>
                <button className={styles.timeframeButton}>전체</button>
              </div>
            </section>
          ) : (
            <section className={styles.sentimentSection}>
              <h2 className={styles.sentimentTitle}>감정 과열도</h2>
              {currentStock.sentiment &&
              Object.keys(currentStock.sentiment).length > 0 ? (
                <>
                  <p className={styles.sentimentScore}>
                    {currentStock.sentiment.score}
                  </p>
                  <p className={styles.sentimentDate}>
                    {currentStock.sentiment.date}
                  </p>
                  <div className={styles.sentimentDetails}>
                    <div className={styles.sentimentItem}>
                      <span className={styles.sentimentLabel}>긍정</span>
                      <span className={styles.sentimentValue}>
                        {currentStock.sentiment.positive}
                      </span>
                    </div>
                    <div className={styles.sentimentItem}>
                      <span className={styles.sentimentLabel}>중립</span>
                      <span className={styles.sentimentValue}>
                        {currentStock.sentiment.neutral}
                      </span>
                    </div>
                    <div className={styles.sentimentItem}>
                      <span className={styles.sentimentLabel}>부정</span>
                      <span className={styles.sentimentValue}>
                        {currentStock.sentiment.negative}
                      </span>
                    </div>
                  </div>
                  <p className={styles.sentimentComment}>
                    {currentStock.sentiment.comment}
                  </p>
                  <div className={styles.sentimentSources}>
                    {currentStock.sentiment.sources &&
                      currentStock.sentiment.sources.map((src, index) => (
                        <p key={index} className={styles.sourceItem}>
                          출처: {src}
                        </p>
                      ))}
                  </div>
                </>
              ) : (
                <div className={styles.noDataMessage}>
                  감정 분석 데이터는 준비 중입니다.
                </div>
              )}
            </section>
          )}
        </>
      ) : (
        // 데이터 준비 중 메시지 (카카오, 현대차 등)
        <div className={styles.noDataMessage} style={{ marginBottom: "30px" }}>
          <p>
            {currentStock.name} 종목의 상세 분석 데이터는 현재 준비 중입니다.
          </p>
        </div>
      )}

      <section className={styles.summarySection}>
        <h2 className={styles.summaryTitle}>주식 시장 요약</h2>
        <div className={styles.summaryItem}>
          기관 순매수 유입
          <span>&gt;</span>
        </div>
        <div className={styles.summaryItem}>
          분기 실적이 컨센서스 대비 5% 상회
          <span>&gt;</span>
        </div>
        <div className={styles.summaryItem}>
          글로벌 경기 불확실성으로 큰 폭의 변동 우려
          <span>&gt;</span>
        </div>
      </section>

      <footer className={styles.footerButtons}>
        <button className={styles.robotButton}>
          <img
            src={chatbot}
            alt="로봇 버튼"
            className={styles.robotIcon}
            onClick={() => handleChatClick()}
          />
        </button>
        <button className={styles.sellButton}>판매하기</button>
        <button className={styles.buyButton}>구매하기</button>
      </footer>
    </div>
  );
};

export default InvestPage;
