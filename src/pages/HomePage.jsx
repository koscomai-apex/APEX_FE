import React from "react";
import StockItem from "../components/StockItem";
import styles from "./HomePage.module.css";
import { useNavigate } from "react-router-dom";
import samsungLogo from "../assets/logos/samsung.png";
import kakaoLogo from "../assets/logos/kakao.png";
import hyundaiLogo from "../assets/logos/hyundai.png";
import naverLogo from "../assets/logos/naver.png";
import skhynixLogo from "../assets/logos/skhynix.jpeg";

const HomePage = () => {
  const myStocks = [
    {
      id: "samsung",
      logo: samsungLogo,
      name: "삼성전자",
      amount: "5주",
      price: 420180,
    },
    {
      id: "naver",
      logo: naverLogo,
      name: "네이버",
      amount: "2주",
      price: 250500,
    },
    {
      id: "kakao",
      logo: kakaoLogo,
      name: "카카오",
      amount: "3주",
      price: 180320,
    },

    {
      id: "skhynix",
      logo: skhynixLogo,
      name: "SK하이닉스",
      amount: "1주",
      price: 145000,
    },
  ];

  const recentStocks = [
    {
      id: "naver",
      logo: naverLogo,
      name: "네이버",
      price: 233500,
    },
    {
      id: "kakao",
      logo: kakaoLogo,
      name: "카카오",
      price: 56300,
    },
    {
      id: "samsung",
      logo: samsungLogo,
      name: "삼성전자",
      price: 70600,
    },
    {
      id: "hyundai",
      logo: hyundaiLogo,
      name: "현대차",
      price: 218000,
    },
    {
      id: "skhynix",
      logo: skhynixLogo,
      name: "SK하이닉스",
      amount: "1주",
      price: 145000,
    },
  ];

  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  const handleStockClick = (id) => {
    navigate(`/invest/${id}`);
  };

  const totalPrice = myStocks.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className={styles.container}>
      <section className={styles.section}>
        <h2 className={styles.title}>내 종목</h2>
        <p className={styles.totalPrice}>{totalPrice.toLocaleString()}원</p>

        <div className={styles.stockList}>
          {myStocks.map((stock) => (
            <StockItem
              key={stock.name}
              {...stock}
              onClick={() => handleStockClick(stock.id)}
            />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.title}>최근 본 종목</h2>
        <div className={styles.stockList}>
          {recentStocks.map((stock) => (
            <StockItem key={stock.name} {...stock} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
