// src/pages/FlowViewer.jsx
import { useState, useMemo } from "react";
import { useFlowRunner } from "../core/state/useFlowRunner";
import { useFlowContext } from "../contexts/FlowContext";
import { flowsRegistry } from "../data/flows.registry";

import { PaymentStatus } from "../components/PaymentStatus";
import { TraceViewer } from "../components/TraceViewer";
import { Controls } from "../components/Controls";
import TimelineItem from "../components/TimelineItem";


export default function FlowViewer() {
  const { activeFlow } = useFlowContext();
  const [flowKey, setFlowKey] = useState("jwt");

  const flow = useMemo(() => {
    return activeFlow?.length ? activeFlow : flowsRegistry[flowKey];
  }, [activeFlow, flowKey]);

  const {
    history,
    stepIndex,
    currentState,
    next,
    prev,
    goTo,
  } = useFlowRunner(flow);
  return (
    <div className="grid grid-cols-3 gap-4 p-6 bg-zinc-950 text-white min-h-screen">

      {/* LEFT */}
      <div className="col-span-1 border-r border-white/10 pr-4">
        <h2 className="text-xl font-bold mb-4">Steps</h2>

        <div className="flex gap-2 flex-wrap mb-4">
          {Object.keys(flowsRegistry).map((key) => (
            <button
              key={key}
              onClick={() => setFlowKey(key)}
              className="px-3 py-1 border rounded text-xs"
            >
              {key}
            </button>
          ))}
        </div>

        {history.map((h, i) => (
          <TimelineItem
            key={h.stepId || i}
            h={h}
            i={i}
            stepIndex={stepIndex}
            goTo={goTo}
          />
        ))}
      </div>

      {/* RIGHT */}
      <div className="col-span-2">
        <pre className="text-xs bg-black p-4 rounded">
          {JSON.stringify(currentState, null, 2)}
        </pre>
        
        {(flowKey === "payment"||"architecture") && <PaymentStatus paymentStatus={currentState?.payment?.status} />}

        {flowKey === "architecture"  && <TraceViewer trace={currentState?.trace || []} />}

        <Controls
          history={history}
          stepIndex={stepIndex}
          next={next}
          prev={prev}
          goTo={goTo}
        />
      </div>
    </div>
  );
}