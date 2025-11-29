import React, { useEffect, useState } from "react";
import StockItem from "../components/StockItem";
import RecentStockItem from "../components/RecentStockItem";
import styles from "./HomePage.module.css";
import { useNavigate } from "react-router-dom";
import samsungLogo from "../assets/logos/samsung.png";
import kakaoLogo from "../assets/logos/kakao.png";
import hyundaiLogo from "../assets/logos/hyundai.png";
import naverLogo from "../assets/logos/naver.png";
import skhynixLogo from "../assets/logos/skhynix.jpeg";
import { fetchPortfolio } from "../api/apiStockPortfolio";

const HomePage = () => {
  const navigate = useNavigate();

  const initialMyStocks = [
    {
      id: "samsung",
      logo: samsungLogo,
      name: "삼성전자",
      ticker: "005930",
      quantity: 5,
    },
    {
      id: "hyundai",
      logo: hyundaiLogo,
      name: "현대차",
      ticker: "035720",
      quantity: 3,
    },
    {
      id: "kakao",
      logo: kakaoLogo,
      name: "카카오",
      ticker: "035720",
      quantity: 3,
    },
    {
      id: "skhynix",
      logo: skhynixLogo,
      name: "SK하이닉스",
      ticker: "000660",
      quantity: 1,
    },
  ];

  const recentStocks = [
    { id: "naver", logo: naverLogo, name: "네이버", price: 233500 },
    { id: "kakao", logo: kakaoLogo, name: "카카오", price: 56300 },
    { id: "hyundai", logo: hyundaiLogo, name: "현대차", price: 218000 },
    {
      id: "skhynix",
      logo: skhynixLogo,
      name: "SK하이닉스",
      price: 145000,
    },
  ];

  const [myStocks, setMyStocks] = useState(initialMyStocks);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPortfolio = async () => {
      try {
        const holdings = initialMyStocks.map((s) => ({
          ticker: s.ticker,
          name: s.name,
          quantity: s.quantity,
        }));

        const result = await fetchPortfolio(holdings);

        const updated = initialMyStocks.map((stock) => {
          const apiData = result.holdings.find(
            (h) => h.ticker === stock.ticker
          );

          return {
            ...stock,
            price: apiData?.totalValue || 0,
            pricePerShare: apiData?.price || null,
          };
        });

        setMyStocks(updated);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadPortfolio();
  }, []);

  const handleStockClick = (id) => {
    navigate(`/invest/${id}`);
  };

  const totalPrice = myStocks.reduce((sum, s) => sum + (s.price || 0), 0);

  if (loading) {
    return <div className={styles.loading}>데이터 불러오는 중...</div>;
  }

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <h2 className={styles.title}>내 종목</h2>
        <p className={styles.totalPrice}>{totalPrice.toLocaleString()}원</p>

        <div className={styles.stockList}>
          {myStocks.map((stock) => (
            <StockItem
              key={stock.name}
              logo={stock.logo}
              name={stock.name}
              qunatity={stock.quantity}
              price={stock.price}
              onClick={() => handleStockClick(stock.id)}
            />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.title}>최근 본 종목</h2>
        <div className={styles.stockList}>
          {recentStocks.map((stock) => (
            <RecentStockItem key={stock.name} {...stock} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
