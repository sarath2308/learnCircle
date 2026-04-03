import client from "prom-client";

const register = new client.Registry();

// collect default metrics (CPU, memory, etc.)
client.collectDefaultMetrics({ register });

export default register;
