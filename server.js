// server.js 최소 보강본
const express = require("express");
const fetch = require("node-fetch");
const crypto = require("crypto");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS(개발)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

// JSON 파서(데이터랩 POST용)
app.use(express.json());

// JSON 보장
async function passJSON(res, r) {
  const text = await r.text();
  try {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.json(JSON.parse(text));
  } catch {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(r.status || 500).json({ error: true, status: r.status || 500, body: text.slice(0, 200) });
  }
}

// 네이버 검색광고 키워드 도구
app.get("/api/keywordstool", async (req, res) => {
  try {
    const hint = req.query.hint || "";
    const path = "/keywordstool";
    const ts = Date.now().toString();
    const method = "GET";
    const sig = crypto.createHmac("sha256", process.env.NAVER_AD_SECRET).update(`${ts}.${method}.${path}`).digest("base64");
    const url = `https://api.naver.com${path}?hintKeywords=${encodeURIComponent(hint)}&showDetail=1`;
    const r = await fetch(url, {
      headers: {
        "X-Timestamp": ts,
        "X-API-KEY": process.env.NAVER_AD_ACCESS,
        "X-CUSTOMER": process.env.NAVER_AD_CUSTOMER,
        "X-Signature": sig
      }
    });
    await passJSON(res, r);
  } catch (e) { res.status(500).json({ error: true, message: e.message }); }
});

// 네이버 오픈API: 블로그 검색
app.get("/api/open/blog", async (req, res) => {
  try {
    const q = req.query.query || "";
    const display = Math.min(parseInt(req.query.display || "10", 10), 20);
    const start = Math.min(parseInt(req.query.start || "1", 10), 1000);
    const url = `https://openapi.naver.com/v1/search/blog.json?query=${encodeURIComponent(q)}&display=${display}&start=${start}&sort=sim`;
    const r = await fetch(url, {
      headers: {
        "X-Naver-Client-Id": process.env.NAVER_OPEN_CLIENT_ID,
        "X-Naver-Client-Secret": process.env.NAVER_OPEN_CLIENT_SECRET
      }
    });
    await passJSON(res, r);
  } catch (e) { res.status(500).json({ error: true, message: e.message }); }
});

// 네이버 오픈API: 데이터랩 트렌드
app.post("/api/open/datalab", async (req, res) => {
  try {
    const r = await fetch("https://openapi.naver.com/v1/datalab/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Naver-Client-Id": process.env.NAVER_OPEN_CLIENT_ID,
        "X-Naver-Client-Secret": process.env.NAVER_OPEN_CLIENT_SECRET
      },
      body: JSON.stringify(req.body || {})
    });
    await passJSON(res, r);
  } catch (e) { res.status(500).json({ error: true, message: e.message }); }
});

// 404 안내(디버깅)
app.all("*", (req, res) => res.status(404).json({ error: true, msg: `No route: ${req.method} ${req.path}` }));

app.listen(PORT, () => console.log(`Proxy running http://localhost:${PORT}`));
