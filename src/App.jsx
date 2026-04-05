//src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import FlowViewer from "./pages/FlowViewer";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FlowViewer />} />
      </Routes>
    </BrowserRouter>
  );
}