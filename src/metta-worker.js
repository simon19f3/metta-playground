import init, {run_metta} from "../pkg/metta_playground.js";

let initPromise = null;

async function ensureInit() {
  if (!initPromise) {
    initPromise = init();
  }
  await initPromise;
}

self.addEventListener("message", async (event) => {
  const message = event.data;
  if (!message || !message.type) return;

  try {
    if (message.type === "init") {
      await ensureInit();
      self.postMessage({type: "ready"});
      return;
    }

    if (message.type === "run") {
      await ensureInit();
      const output = run_metta(message.code);
      self.postMessage({type: "result", output, requestId: message.requestId});
    }
  } catch (err) {
    self.postMessage({
      type: "error",
      error: err instanceof Error ? err.message : String(err),
      requestId: message.requestId
    });
  }
});
