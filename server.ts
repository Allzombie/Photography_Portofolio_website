import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Generous limits for photo uploading
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Ensure persistent data directory exists inside workspace
  const DATA_DIR = path.join(process.cwd(), 'data');
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  const PHOTOS_PATH = path.join(DATA_DIR, 'photos.json');
  const VIDEOS_PATH = path.join(DATA_DIR, 'videos.json');
  const ABOUT_PATH = path.join(DATA_DIR, 'about.json');
  const INQUIRIES_PATH = path.join(DATA_DIR, 'inquiries.json');

  // API Endpoints for photos
  app.get('/api/photos', (req, res) => {
    try {
      if (fs.existsSync(PHOTOS_PATH)) {
        const data = fs.readFileSync(PHOTOS_PATH, 'utf8');
        return res.json(JSON.parse(data));
      }
      return res.json([]);
    } catch (err) {
      console.error('Error reading photos DB:', err);
      return res.status(500).json({ error: 'Database read error' });
    }
  });

  app.post('/api/photos', (req, res) => {
    try {
      const photos = req.body;
      fs.writeFileSync(PHOTOS_PATH, JSON.stringify(photos, null, 2), 'utf8');
      return res.json({ success: true });
    } catch (err) {
      console.error('Error writing photos DB:', err);
      return res.status(500).json({ error: 'Database write error' });
    }
  });

  // API Endpoints for videos
  app.get('/api/videos', (req, res) => {
    try {
      if (fs.existsSync(VIDEOS_PATH)) {
        const data = fs.readFileSync(VIDEOS_PATH, 'utf8');
        return res.json(JSON.parse(data));
      }
      return res.json([]);
    } catch (err) {
      console.error('Error reading videos DB:', err);
      return res.status(500).json({ error: 'Database read error' });
    }
  });

  app.post('/api/videos', (req, res) => {
    try {
      const videos = req.body;
      fs.writeFileSync(VIDEOS_PATH, JSON.stringify(videos, null, 2), 'utf8');
      return res.json({ success: true });
    } catch (err) {
      console.error('Error writing videos DB:', err);
      return res.status(500).json({ error: 'Database write error' });
    }
  });

  // API Endpoints for about details
  app.get('/api/about', (req, res) => {
    try {
      if (fs.existsSync(ABOUT_PATH)) {
        const data = fs.readFileSync(ABOUT_PATH, 'utf8');
        return res.json(JSON.parse(data));
      }
      return res.json({});
    } catch (err) {
      console.error('Error reading about DB:', err);
      return res.status(500).json({ error: 'Database read error' });
    }
  });

  app.post('/api/about', (req, res) => {
    try {
      const about = req.body;
      fs.writeFileSync(ABOUT_PATH, JSON.stringify(about, null, 2), 'utf8');
      return res.json({ success: true });
    } catch (err) {
      console.error('Error writing about DB:', err);
      return res.status(500).json({ error: 'Database write error' });
    }
  });

  // API Endpoints for inquiries/bookings (Option B - Server database storage)
  app.get('/api/inquiries', (req, res) => {
    try {
      if (fs.existsSync(INQUIRIES_PATH)) {
        const data = fs.readFileSync(INQUIRIES_PATH, 'utf8');
        return res.json(JSON.parse(data));
      }
      return res.json([]);
    } catch (err) {
      console.error('Error reading inquiries DB:', err);
      return res.status(500).json({ error: 'Database read error' });
    }
  });

  app.post('/api/inquiries', (req, res) => {
    try {
      const inquiry = req.body;
      let inquiries = [];
      if (fs.existsSync(INQUIRIES_PATH)) {
        inquiries = JSON.parse(fs.readFileSync(INQUIRIES_PATH, 'utf8'));
      }
      const newInquiry = {
        ...inquiry,
        id: `inq-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: inquiry.status || 'unread'
      };
      inquiries.unshift(newInquiry);
      fs.writeFileSync(INQUIRIES_PATH, JSON.stringify(inquiries, null, 2), 'utf8');
      return res.json({ success: true, inquiry: newInquiry });
    } catch (err) {
      console.error('Error writing inquiries DB:', err);
      return res.status(500).json({ error: 'Database write error' });
    }
  });

  app.put('/api/inquiries', (req, res) => {
    try {
      const inquiries = req.body;
      fs.writeFileSync(INQUIRIES_PATH, JSON.stringify(inquiries, null, 2), 'utf8');
      return res.json({ success: true });
    } catch (err) {
      console.error('Error writing inquiries DB:', err);
      return res.status(500).json({ error: 'Database write error' });
    }
  });

  // Integrate Vite dev middleware or serve static dist in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Portfolio server online at port ${PORT}`);
  });
}

startServer();
