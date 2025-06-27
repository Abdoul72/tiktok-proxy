const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/tiktok', async (req, res) => {
  const videoUrl = req.query.url;
  if (!videoUrl) return res.status(400).json({ error: 'URL manquante' });

  try {
    const response = await fetch(`https://godownloader.com/api/tiktok-no-watermark-free?url=${encodeURIComponent(videoUrl)}&key=godownloader.com`);
    const data = await response.json();

    if (data && data.download) {
      res.json({ download: data.download });
    } else {
      res.status(404).json({ error: 'Impossible de récupérer la vidéo' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur interne serveur' });
  }
});

app.listen(port, () => {
  console.log(`✅ TikTok Proxy (GoDownloader) lancé sur le port ${port}`);
});
