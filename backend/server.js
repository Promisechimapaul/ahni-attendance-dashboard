const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const SCHEDULED_START = "09:00";

app.post('/api/clock-in', (req, res) => {
  const { staffId } = req.body;
  if (!staffId) return res.status(400).json({ error: 'Staff ID required' });

  const now = new Date();
  const date = now.toISOString().split('T')[0];
  const time = now.toTimeString().substring(0, 5);

  const [sh, sm] = SCHEDULED_START.split(':').map(Number);
  const [ah, am] = time.split(':').map(Number);
  const lateMinutes = Math.max(0, (ah * 60 + am) - (sh * 60 + sm));
  const status = lateMinutes > 0 ? 'Late' : 'On Time';

  db.get(`SELECT * FROM attendance WHERE staff_id = ? AND date = ?`, [staffId, date], (err, row) => {
    if (row) return res.status(400).json({ error: 'Already clocked in today' });

    db.run(
      `INSERT INTO attendance (staff_id, date, clock_in, late_minutes, status) VALUES (?, ?, ?, ?, ?)`,
      [staffId, date, time, lateMinutes, status],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, record: { id: this.lastID, staffId, date, time, status, lateMinutes } });
      }
    );
  });
});

app.get('/api/attendance/:staffId', (req, res) => {
  db.all(`SELECT * FROM attendance WHERE staff_id = ? ORDER BY date DESC LIMIT 30`, [req.params.staffId], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/facilities', (req, res) => {
  db.all(`SELECT * FROM facilities ORDER BY name`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/cadres', (req, res) => {
  db.all(`SELECT * FROM cadres ORDER BY code`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/facility/punctuality', (req, res) => {
  const query = `
    SELECT f.name as facility_name,
           COUNT(*) as total,
           SUM(CASE WHEN a.status = 'On Time' THEN 1 ELSE 0 END) as on_time,
           ROUND((SUM(CASE WHEN a.status = 'On Time' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)), 1) as rate
    FROM attendance a
    JOIN staff s ON a.staff_id = s.id
    JOIN facilities f ON s.facility_id = f.id
    GROUP BY f.id
    ORDER BY rate DESC
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/cadre/punctuality', (req, res) => {
  const query = `
    SELECT c.code, c.name,
           COUNT(*) as total,
           SUM(CASE WHEN a.status = 'On Time' THEN 1 ELSE 0 END) as on_time,
           ROUND((SUM(CASE WHEN a.status = 'On Time' THEN 1 ELSE 0 END) * 100.0 / COUNT(*)), 1) as rate
    FROM attendance a
    JOIN staff s ON a.staff_id = s.id
    JOIN cadres c ON s.cadre_id = c.id
    GROUP BY c.id
    ORDER BY rate DESC
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/manager/attendance', (req, res) => {
  const query = `
    SELECT a.*, s.name as staff_name, f.name as facility, c.code as cadre
    FROM attendance a
    JOIN staff s ON a.staff_id = s.id
    JOIN facilities f ON s.facility_id = f.id
    JOIN cadres c ON s.cadre_id = c.id
    ORDER BY a.date DESC, a.clock_in DESC
    LIMIT 100
  `;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`✅ AHNi Attendance Backend running on http://localhost:${PORT}`);
});
