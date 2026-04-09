//src/contexts/FlowContext.jsx
import { createContext, useContext, useState, useCallback } from "react";

const FlowContext = createContext();

export function FlowProvider({ children }) {
  const [draftFlow, setDraftFlow] = useState(null);
  const [activeFlow, setActiveFlow] = useState(null);
  const [flowMode, setFlowMode] = useState("view"); 
  const [activeProject, setActiveProject] = useState(null);

  const updateDraft = useCallback((flow) => {
    setDraftFlow(flow);
  }, []);

  const commitFlow = useCallback((flow) => {
    setActiveFlow(flow);
    setDraftFlow(null);
  }, []);

  const resetFlow = useCallback(() => {
    setDraftFlow(null);
    setActiveFlow(null);
    setActiveProject(null);
  }, []);

  return (
    <FlowContext.Provider
      value={{
        draftFlow,
        activeFlow,
        flowMode,
        activeProject,

        setFlowMode,
        setActiveProject,

        setDraftFlow: updateDraft,
        publishFlow: commitFlow,
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