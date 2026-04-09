// src/components/FlowRunnerView.jsx
import React from "react";
import { useFlowRunner } from "../core/state/useFlowRunner";
import FlowGraph from "./FlowGraph";
import { Controls } from "./Controls";
import { TraceViewer } from "./TraceViewer";
import StateViewer from "./StateViewer";
import { PaymentStatus } from "./PaymentStatus";
export default function FlowRunnerView({ graphData }) {
  const { history, stepIndex, next, prev, goTo } = useFlowRunner(graphData);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-40">
      <Controls history={history} stepIndex={stepIndex} next={next} prev={prev} goTo={goTo} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <FlowGraph flow={graphData} activeNode={history[stepIndex]?.stepId} />
        </div>

        <div className="space-y-6">
          {/* PASS THE FULL HISTORY HERE */}
          <TraceViewer 
            history={history} 
            goTo={goTo} 
            stepIndex={stepIndex} 
          />
          <StateViewer history={history} stepIndex={stepIndex} />
        </div>
      </div>
    </div>
  );
}