const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const FormData = require('form-data');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/tiktok', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).json({ error: 'URL manquante' });

  try {
    const form = new FormData();
    form.append('url', videoUrl);
    form.append('format', '');

    const response = await fetch('https://ttdownloader.com/req/', {
      method: 'POST',
      body: form,
      headers: {
        'origin': 'https://ttdownloader.com/',
        'referer': 'https://ttdownloader.com/',
      }
    });

    const text = await response.text();
    const noWatermark = text.match(/<a href="(.*?)"[^>]*>Without Watermark<\/a>/);
    
    if (noWatermark && noWatermark[1]) {
      res.json({ download: noWatermark[1] });
    } else {
      res.status(404).json({ error: 'Impossible de récupérer la vidéo.' });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne du serveur proxy.' });
  }
});

app.listen(port, () => {
  console.log(`✅ Serveur TikTok Proxy (TTDownloader) en ligne sur le port ${port}`);
});
