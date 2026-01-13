const express = require("express");
const client = require("prom-client");

const app = express();
const PORT = process.env.PORT || 3000;
const VERSION = process.env.APP_VERSION || "v2-canary";

/* Prometheus Metrics */
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request latency",
  labelNames: ["method", "route", "status"],
  buckets: [0.1, 0.3, 0.5, 1, 1.5, 2, 5]
});

/* Routes */
app.get("/products", (req, res) => {
  const end = httpRequestDuration.startTimer();
  const delay = Math.random() * 300; // simulate latency

  setTimeout(() => {
    res.status(200).json({
      service: "product-service",
      version: VERSION,
      products: ["Laptop", "Phone", "Tablet"]
    });
    end({ method: "GET", route: "/products", status: 200 });
  }, delay);
});

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.listen(PORT, () => {
  console.log(`Product Service running on port ${PORT}, version: ${VERSION}`);
});

