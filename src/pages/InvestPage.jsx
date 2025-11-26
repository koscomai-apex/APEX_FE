import React, { useState, useEffect } from "react";
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
import { fetchStockSummary } from "../api/apiStockSummary";
import styles from "./InvestPage.module.css";
import chatbot from "../assets/chatbot.png";
import back from "../assets/back.png";

const InvestPage = () => {
  const { stockId } = useParams();
  const [activeTab, setActiveTab] = useState("price");
  const [stockData, setStockData] = useState(null);
  const [sentimentData, setSentimentData] = useState(null);

  const stockNames = {
    samsung: "삼성전자",
    naver: "네이버",
    kakao: "카카오",
    hyundai: "현대차",
    skhynix: "sk하이닉스",
  };

  // ⭐ 기본 데이터
  const defaultStockData = {
    currentPrice: 70000,
    name: "SK하이닉스",
    priceData: [
      { time: "09:00", price: 68000 },
      { time: "10:00", price: 90000 },
      { time: "11:00", price: 30000 },
      { time: "12:00", price: 40000 },
      { time: "13:00", price: 70000 },
      { time: "14:00", price: 20000 },
      { time: "15:00", price: 11000 },
    ],
  };

  const defaultSentimentData = {
    compound: 0,
    ratios: { pos: 0.3, neu: 0.4, neg: 0.3 },
    reasons: ["데이터 부족으로 임시 값 표시"],
    generated_at: new Date().toISOString(),
  };

  useEffect(() => {
    const companyName = stockNames[stockId] || "SK하이닉스";

    fetchStockSummary({
      company: companyName,
      days: 7,
      sessionId: "user-123",
    })
      .then((data) => {
        console.log("Stock Summary:", data.output);
        setStockData(data.output);
      })
      .catch((err) => console.error(err));

    fetchStockSummary({
      company: companyName,
      mode: "sentiment",
      days: 7,
      sessionId: "user-123",
    })
      .then((data) => {
        console.log("Sentiment API Result:", data);
        setSentimentData(data);
      })
      .catch((err) => console.error(err));
  }, [stockId]);

  const currentStock = stockData?.output?.stockInfo || defaultStockData;

  const displaySentimentData = sentimentData || defaultSentimentData;

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

  const isDetailDataReady =
    stockId === "samsung" ||
    stockId === "naver" ||
    stockId === "kakao" ||
    stockId === "skhynix";

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
          <img src={back} alt="뒤로가기" className={styles.backIcon} />
        </button>
      </header>
      <h1 className={styles.stockName}>{stockNames[stockId]}</h1>
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
              {sentimentData ? (
                <>
                  <p className={styles.sentimentScore}>
                    {sentimentData.compound}
                  </p>
                  <p className={styles.sentimentDate}>
                    {" "}
                    {new Date(sentimentData.generated_at).toLocaleDateString()}
                  </p>
                  <div className={styles.sentimentDetails}>
                    <div className={styles.sentimentItem}>
                      <span className={styles.sentimentLabel}>긍정</span>
                      <span className={styles.sentimentValue}>
                        {Math.round(sentimentData.ratios.pos * 100)}%
                      </span>
                    </div>
                    <div className={styles.sentimentItem}>
                      <span className={styles.sentimentLabel}>중립</span>
                      <span className={styles.sentimentValue}>
                        {Math.round(sentimentData.ratios.neu * 100)}%
                      </span>
                    </div>
                    <div className={styles.sentimentItem}>
                      <span className={styles.sentimentLabel}>부정</span>
                      <span className={styles.sentimentValue}>
                        {Math.round(sentimentData.ratios.neg * 100)}%
                      </span>
                    </div>
                  </div>
                  <p className={styles.sentimentComment}>
                    {sentimentData.reasons.join(", ")}
                  </p>
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
          <span>&gt;</span> {stockData?.output?.summary?.market_summary?.[0]}
        </div>

        <div className={styles.summaryItem}>
          <span>&gt;</span> {stockData?.output?.summary?.market_summary?.[1]}
        </div>

        <div className={styles.summaryItem}>
          <span>&gt;</span> {stockData?.output?.summary?.market_summary?.[2]}
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
