const express = require('express');
const axios = require('axios');
const app = express();

// Replace with any test M3U8
const ORIGINAL_M3U8 = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';
const BASE_URL = 'https://test-streams.mux.dev/x36xhzz/';

app.get('/live.m3u8', async (req, res) => {
  try {
    const response = await axios.get(ORIGINAL_M3U8);
    const playlist = response.data.replace(/(.*\.ts)/g, '/segments/$1');
    res.set('Content-Type', 'application/vnd.apple.mpegurl');
    res.send(playlist);
  } catch (err) {
    res.status(500).send('# Error fetching M3U8');
  }
});

app.get('/segments/:segment', async (req, res) => {
  try {
    const url = BASE_URL + req.params.segment;
    const segment = await axios({ url, responseType: 'stream' });
    res.set('Content-Type', 'video/MP2T');
    segment.data.pipe(res);
  } catch (err) {
    res.status(500).send('Segment fetch error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server running'));
