const express = require('express');
const axios = require('axios');
const app = express();

const TARGET_M3U8 = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
const BASE_URL = 'https://test-streams.mux.dev/x36xhzz/';

app.get('/live.m3u8', async (req, res) => {
  try {
    const response = await axios.get(TARGET_M3U8);
    const body = response.data.replace(/(.*\.ts)/g, '/segments/$1');
    res.set('Content-Type', 'application/vnd.apple.mpegurl');
    res.send(body);
  } catch (err) {
    res.status(500).send('# Error fetching main M3U8');
  }
});

app.get('/segments/:ts', async (req, res) => {
  try {
    const url = BASE_URL + req.params.ts;
    const stream = await axios({ url, responseType: 'stream' });
    res.set('Content-Type', 'video/MP2T');
    stream.data.pipe(res);
  } catch (err) {
    res.status(500).send('Segment error');
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running...');
});
