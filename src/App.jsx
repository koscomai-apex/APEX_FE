import styles from "./App.module.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import InvestPage from "./pages/InvestPage";
import ChatPage from "./pages/ChatPage";
import Layout from "./components/Layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="invest/:stockId" element={<InvestPage />} />
        <Route path="chat" element={<ChatPage />} />
      </Route>
    </Routes>
  );
}

export default App;
