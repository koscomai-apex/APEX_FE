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
import { fetchStockSentiment } from "../api/apiStockSentiment";
import styles from "./InvestPage.module.css";
import chatbot from "../assets/chatbot.png";
import back from "../assets/back.png";

const InvestPage = () => {
  const { stockId } = useParams();
  const navigate = useNavigate();
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

  let initialPrice = 544000;
  if (stockId === "samsung") initialPrice = 103500;
  else if (stockId === "hyundai") initialPrice = 261500;
  else if (stockId === "kakao") initialPrice = 59700;
  else if (stockId === "skhynix") initialPrice = 544000;

  const defaultStockData = {
    currentPrice: initialPrice,
    name: "SK하이닉스",
    priceData: (() => {
      const startTime = 9 * 60;
      const endTime = 15 * 60;
      const data = [];
      let price = initialPrice;
      for (let t = startTime; t <= endTime; t += 5) {
        const hour = Math.floor(t / 60);
        const min = t % 60;
        const timeStr = `${String(hour).padStart(2, "0")}:${String(
          min
        ).padStart(2, "0")}`;

        const change = Math.floor(Math.random() * 10000 - 5000);

        price += change;

        data.push({ time: timeStr, price });
      }
      return data;
    })(),
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}.${mm}.${dd} ${hh}:${min}`;
  };

  const displaySentimentData =
    Array.isArray(sentimentData) && sentimentData.length > 0
      ? sentimentData[0]
      : {
          compound: 0,
          ratios: { pos: 0, neu: 0, neg: 0 },
          reasons: ["데이터 없음"],
          generated_at: new Date().toISOString(),
          level: "상",
        };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const companyName = stockNames[stockId] || "SK하이닉스";
    setIsLoading(true);

    Promise.all([
      fetchStockSummary({
        company: companyName,
      }),
      fetchStockSentiment({
        company: companyName,
      }),
    ])
      .then(([stockResponse, sentimentResponse]) => {
        const rawData = Array.isArray(stockResponse)
          ? stockResponse[0]
          : stockResponse;

        const summaryData = rawData?.output || rawData;

        console.log("Stock Summary Processed:", summaryData);
        setStockData(summaryData);
        setSentimentData(sentimentResponse.output || sentimentResponse);
      })
      .catch((err) => {
        console.error("API Fetch Error:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [stockId]);

  if (isLoading) {
    return (
      <div className={styles.noDataMessage} style={{ backgroundColor: "#fff" }}>
        AI가 분석 중...
      </div>
    );
  }

  const currentStock = stockData?.output?.stockInfo || defaultStockData;
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

  const isDetailDataReady = ["samsung", "naver", "kakao", "skhynix"].includes(
    stockId
  );

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
                        data={currentStock.priceData}
                        margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                      >
                        <XAxis dataKey="time" hide />
                        <YAxis hide />
                        <Tooltip
                          formatter={(value) => `${value.toLocaleString()}원`}
                          labelFormatter={(label) => `${label} 시`}
                        />
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
                    {{
                      긍정: "상",
                      중립: "중",
                      부정: "하",
                    }[displaySentimentData?.level] ?? "중"}
                  </p>

                  <p className={styles.sentimentDate}>
                    {formatDateTime(displaySentimentData.generated_at)}
                  </p>
                  <div className={styles.sentimentDetails}>
                    <div className={styles.sentimentItem}>
                      <span className={styles.sentimentLabel}>긍정</span>
                      <span className={styles.sentimentValue}>
                        {Math.round(
                          (displaySentimentData?.ratios?.pos || 0) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div className={styles.sentimentItem}>
                      <span className={styles.sentimentLabel}>중립</span>
                      <span className={styles.sentimentValue}>
                        {Math.round(
                          (displaySentimentData?.ratios?.neu || 0) * 100
                        )}
                        %
                      </span>
                    </div>
                    <div className={styles.sentimentItem}>
                      <span className={styles.sentimentLabel}>부정</span>
                      <span className={styles.sentimentValue}>
                        {Math.round(
                          (displaySentimentData?.ratios?.neg || 0) * 100
                        )}
                        %
                      </span>
                    </div>
                  </div>
                  <p className={styles.sentimentComment}>
                    {stockData?.summary?.sentiment_based ||
                      "감정 분석 데이터가 없습니다."}
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
        <div className={styles.noDataMessage} style={{ marginBottom: "30px" }}>
          <p>현종목의 상세 분석 데이터는 현재 준비 중입니다.</p>
        </div>
      )}

      <section className={styles.summarySection}>
        <h2 className={styles.summaryTitle}>주식 시장 요약</h2>
        {stockData?.summary?.market_summary?.map((item, idx) => (
          <div key={idx} className={styles.summaryItem}>
            {item}
            <span>&gt;</span>
          </div>
        ))}
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
