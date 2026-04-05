//src/contexts/FlowContext.jsx
import { createContext, useContext, useState, useCallback } from "react";

const FlowContext = createContext();

export function FlowProvider({ children }) {
  const [draftFlow, setDraftFlow] = useState([]);
  const [activeFlow, setActiveFlow] = useState([]);

  const updateDraft = useCallback((flow) => {
    setDraftFlow(Array.isArray(flow) ? flow : []);
  }, []);

  const commitFlow = useCallback((flow) => {
    setActiveFlow(Array.isArray(flow) ? flow : []);
  }, []);

  const resetFlow = useCallback(() => {
    setDraftFlow([]);
    setActiveFlow([]);
  }, []);

  return (
    <FlowContext.Provider
      value={{
        draftFlow,
        activeFlow,
        updateDraft,
        commitFlow,
        resetFlow,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
}

export function useFlowContext() {
  return useContext(FlowContext);
}