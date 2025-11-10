import { useRef, useEffect, useState } from "react";
import styles from "./BottomSheet.module.css";

const bodySize = window.innerHeight;
const userAgent = navigator.userAgent.toLowerCase();
const isMobileBrowser =
  /android|webos|iphone|ipad|ipod|blackberry|windows phone/.test(userAgent);

export const BottomSheet = ({
  isOpen,
  setOpen,
  initPosition = "80%",
  openPosition = "20%",
  children,
}) => {
  const divRef = useRef(null);
  const [dragStartY, setDragStartY] = useState(0);
  const [currentTop, setCurrentTop] = useState(0);

  const getPx = (value) =>
    typeof value === "number"
      ? value
      : (Number(value.replace("%", "")) * bodySize) / 100;

  const openPosPx = getPx(openPosition);
  const initPosPx = getPx(initPosition);

  useEffect(() => {
    if (divRef.current) {
      divRef.current.style.top = isOpen ? `${openPosPx}px` : `${initPosPx}px`;
    }
  }, [isOpen]);

  const handleTouchStart = (e) => {
    setDragStartY(e.touches[0].clientY);
    if (divRef.current)
      setCurrentTop(parseInt(divRef.current.style.top || "0", 10));
  };
  const handleMouseDown = (e) => {
    e.preventDefault();
    setDragStartY(e.clientY);
    if (divRef.current)
      setCurrentTop(parseInt(divRef.current.style.top || "0", 10));
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleTouchMove = (e) => {
    if (!divRef.current) return;
    const diff = e.touches[0].clientY - dragStartY;
    const newTop = Math.min(Math.max(openPosPx, currentTop + diff), bodySize);
    divRef.current.style.top = `${newTop}px`;
  };

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const diff = e.clientY - dragStartY;
    const newTop = Math.min(Math.max(openPosPx, currentTop + diff), bodySize);
    divRef.current.style.top = `${newTop}px`;
  };

  const endDrag = (finalTop) => {
    const midPoint = (openPosPx + initPosPx) / 2;
    if (divRef.current) {
      if (finalTop < midPoint) {
        divRef.current.style.top = `${openPosPx}px`;
        setOpen(true);
      } else {
        divRef.current.style.top = `${initPosPx}px`;
        setOpen(false);
      }
    }
  };

  const handleTouchEnd = () => {
    if (divRef.current) {
      const finalTop = parseInt(divRef.current.style.top, 10);
      endDrag(finalTop);
    }
  };

  const handleMouseUp = () => {
    if (divRef.current) {
      const finalTop = parseInt(divRef.current.style.top, 10);
      endDrag(finalTop);
    }
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <>
      <div ref={divRef} className={styles.bottomSheet}>
        <div
          className={styles.handle}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          <span />
        </div>
        <div className={styles.content}>{children}</div>
      </div>
      <div className={isOpen ? styles.backdrop : ""} />
    </>
  );
};
