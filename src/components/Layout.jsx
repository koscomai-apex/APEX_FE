import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import nav from "../assets/navbar.png";
import homeNav from "../assets/home_navbar.png";
import foot from "../assets/footer.png";

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <>
      <div
        style={{
          width: "360px",
          height: "760px",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          border: "1px solid #ccc",
          overflow: "hidden",
        }}
      >
        <img
          src={isHomePage ? homeNav : nav}
          alt="Navbar"
          style={{ width: "100%" }}
        />

        <main style={{ flex: 1, overflowY: "auto" }}>
          <Outlet />
        </main>

        <img src={foot} alt="Footer" style={{ width: "100%", zIndex: 400 }} />
      </div>
    </>
  );
};

export default Layout;
