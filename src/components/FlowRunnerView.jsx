// src/components/FlowRunnerView.jsx
import React from "react";
import { useFlowRunner } from "../core/state/useFlowRunner";
import FlowGraph from "./FlowGraph";
import { Controls } from "./Controls";
import { TraceViewer } from "./TraceViewer";
import StateViewer from "./StateViewer";
import GlobalTelemetry from "./GlobalTelemetry";

export default function FlowRunnerView({ graphData }) {
  const { history, stepIndex, next, prev, goTo, loading } = useFlowRunner(graphData);
  const progress = history.length > 0 ? ((stepIndex + 1) / history.length) * 100 : 0;
  if (loading) {
    return (
      <div className="h-[60vh] flex items-center justify-center font-mono text-blue-500">
        EXECUTING_FLOW_ENGINE...
      </div>
    );
  }

  return (
    <> 
      <GlobalTelemetry progress={progress} />
      <div className="max-w-[1400px] mx-auto space-y-6 pb-40">
        <Controls history={history} stepIndex={stepIndex} next={next} prev={prev} goTo={goTo} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <FlowGraph flow={graphData} history={history} stepIndex={stepIndex}/>
          </div>

          <div className="space-y-6">
            <TraceViewer history={history} goTo={goTo} stepIndex={stepIndex} />
            <StateViewer history={history} stepIndex={stepIndex} />
          </div>
        </div>
      </div>
    </>
    
  );
}