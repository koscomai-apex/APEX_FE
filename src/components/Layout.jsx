import React from "react";
import nav from "../assets/navbar.png";
import foot from "../assets/footer.png";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
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
      <img src={nav} alt="Navbar" style={{ width: "100%" }} />

      <main style={{ flex: 1, overflowY: "auto" }}>
        <Outlet />
      </main>

      <img src={foot} alt="Footer" style={{ width: "100%" }} />
    </div>
  );
};

export default Layout;
