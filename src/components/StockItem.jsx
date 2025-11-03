import React from "react";
import styles from "./StockItem.module.css";

const StockItem = ({ logo, name, amount, price, onClick }) => {
  return (
    <div className={styles.container} onClick={onClick}>
      <div className={styles.left}>
        <img src={logo} alt={name} className={styles.logo} />
        <div>
          <div className={styles.name}>{name}</div>
          <div className={styles.amount}>{amount}</div>
        </div>
      </div>
      <div>{price.toLocaleString()}원</div>
    </div>
  );
};

export default StockItem;
