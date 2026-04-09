//src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import GlobalTelemetry from "./components/GlobalTelemetry";

const Home = lazy(() => import("./pages/Home"));
const FlowViewer = lazy(() => import("./pages/FlowViewer"));

export default function App() {
  return (
    <BrowserRouter>
     <GlobalTelemetry />
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/flow/:projectId" element={<FlowViewer/>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}