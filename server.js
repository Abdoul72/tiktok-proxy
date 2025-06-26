const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const port = process.env.PORT || 3000; // ✅ BON port dynamique pour Render

app.use(cors());
app.use(express.json());

app.get('/api/tiktok', async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).json({ error: 'URL manquante' });
  }

  try {
    const response = await fetch(`https://api.tiklydown.me/api/download?url=${encodeURIComponent(videoUrl)}`);
    const data = await response.json();

    if (data && data.video && data.video.no_watermark) {
      res.json({ download: data.video.no_watermark });
    } else {
      res.status(404).json({ error: 'Vidéo non trouvée ou format invalide' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur du serveur proxy' });
  }
});

app.listen(port, () => {
  console.log(`✅ Serveur TikTok Proxy lancé sur le port ${port}`);
});
