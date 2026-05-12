// src/core/engine/executeFlow.js

export async function executeFlow(graphData, options = {}) {
  if (!graphData?.nodes) return [];

  const history = [];
  const stateMap = new Map();
  const joinTracker = new Map();

  const startTime = Date.now();

  // options
  const deterministic = options.deterministicParallel ?? false;
  const MAX_DEPTH = options.maxDepth ?? 1000;
  const MAX_VISITS_PER_NODE = options.maxVisits ?? 50;

  const visitCount = new Map();

  // Track all async tasks (prevents fire-and-forget issues)
  const activeTasks = new Set();

  function trackTask(promise) {
    activeTasks.add(promise);

    promise.finally(() => {
      activeTasks.delete(promise);
    });

    return promise;
  }

  async function executeNode(
    nodeId,
    incomingState = { status: "initialized" },
    depth = 0
  ) {
    if (!nodeId) return;

    // =====================================================
    // DEPTH GUARD
    // =====================================================
    if (depth > MAX_DEPTH) {
      throw new Error(
        `Max execution depth exceeded at node ${nodeId}`
      );
    }

    // =====================================================
    // VISIT GUARD (cycle protection runtime)
    // =====================================================
    const count = (visitCount.get(nodeId) || 0) + 1;

    visitCount.set(nodeId, count);

    if (count > MAX_VISITS_PER_NODE) {
      throw new Error(
        `Node ${nodeId} exceeded max visits`
      );
    }

    const node = graphData.nodes[nodeId];

    if (!node) return;

    const nodeStartTime = performance.now();

    let nextState;

    // =====================================================
    // NODE EXECUTION
    // =====================================================
    try {
      if (node.meta?.delay) {
        await new Promise((r) =>
          setTimeout(r, node.meta.delay)
        );
      }

      const runFn = node.run || (async (s) => s);

      nextState = await runFn(
        structuredClone(incomingState)
      );
    } catch (err) {
      nextState = {
        ...incomingState,
        error: err.message,
        failed: true,
      };
    }

    const nodeEndTime = performance.now();

    // =====================================================
    // SAVE STATE
    // =====================================================
    stateMap.set(
      node.id,
      structuredClone(nextState)
    );

    // =====================================================
    // EXECUTION HISTORY
    // =====================================================
    history.push({
      stepId: node.id,
      event: node.title,
      state: structuredClone(nextState),

      finishedAt: Date.now() - startTime,

      meta: {
        service:
          node.meta?.service || "system",

        duration:
          (nodeEndTime - nodeStartTime).toFixed(2) +
          "ms",

        type: node.type || "task",
      },
    });

    // =====================================================
    // DETERMINE NEXT NODES
    // =====================================================
    let nextNodes = [];

    // -----------------------------------------------------
    // PARALLEL NODE
    // -----------------------------------------------------
    if (node.type === "parallel") {
      nextNodes = node.next || [];
    }

    // -----------------------------------------------------
    // BINARY DECISION NODE
    // -----------------------------------------------------
    else if (node.type === "decision") {

      // explicit decision support
      if (
        typeof nextState.decision === "string"
      ) {
        const routed =
          node.next?.[nextState.decision];

        if (routed) {
          nextNodes = [routed];
        }
      }

      // legacy compatibility
      else {
        nextNodes = [
          nextState.failed
            ? node.next.fail
            : node.next.success,
        ];
      }
    }

    // -----------------------------------------------------
    // MULTI-ROUTE ROUTER NODE
    // -----------------------------------------------------
    else if (node.type === "router") {
      /**
       * Expected:
       *
       * nextState.route = "rag"
       *
       * node.next = {
       *   rag: "...",
       *   agent: "...",
       *   direct: "..."
       * }
       */

      const routeKey = nextState.route;

      const routedNode =
        node.next?.[routeKey];

      if (routedNode) {
        nextNodes = [routedNode];
      }
    }

    // -----------------------------------------------------
    // NORMAL SEQUENTIAL NODE
    // -----------------------------------------------------
    else if (typeof node.next === "string") {
      nextNodes = [node.next];
    }

    const tasks = [];

    // =====================================================
    // EXECUTE NEXT NODES
    // =====================================================
    for (const nextId of nextNodes) {
      const nextNode =
        graphData.nodes[nextId];

      if (!nextNode) continue;

      // ===================================================
      // JOIN NODE
      // ===================================================
      if (nextNode.type === "join") {
        const tracker =
          joinTracker.get(nextId) || {
            arrived: [],
            states: [],
          };

        if (
          !tracker.arrived.includes(node.id)
        ) {
          tracker.arrived.push(node.id);

          tracker.states.push(nextState);
        }

        joinTracker.set(nextId, tracker);

        // wait for all dependencies
        if (
          nextNode.waitFor.every((id) =>
            tracker.arrived.includes(id)
          )
        ) {
          const merged =
            tracker.states.reduce(
              (acc, curr) => ({
                ...acc,
                ...curr,
              }),
              {}
            );

          const task = executeNode(
            nextId,
            merged,
            depth + 1
          );

          if (deterministic) {
            tasks.push(task);
          } else {
            trackTask(task);
          }
        }
      }

      // ===================================================
      // NORMAL / PARALLEL EXECUTION
      // ===================================================
      else {
        if (node.type === "parallel") {
          const task = executeNode(
            nextId,
            nextState,
            depth + 1
          );

          if (deterministic) {
            tasks.push(task);
          } else {
            trackTask(task);
          }
        } else {
          await executeNode(
            nextId,
            nextState,
            depth + 1
          );
        }
      }
    }

    // =====================================================
    // DETERMINISTIC PARALLEL EXECUTION
    // =====================================================
    if (
      deterministic &&
      tasks.length > 0
    ) {
      await Promise.all(tasks);
    }
  }

  // =======================================================
  // START EXECUTION
  // =======================================================
  await executeNode(graphData.startNode);

  // =======================================================
  // WAIT FOR BACKGROUND TASKS
  // =======================================================
  if (activeTasks.size > 0) {
    await Promise.allSettled([
      ...activeTasks,
    ]);
  }

  return history;
}