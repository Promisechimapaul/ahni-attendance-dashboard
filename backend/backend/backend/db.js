const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./ahni_attendance.db');

db.serialize(() => {
  // Cadres
  db.run(`CREATE TABLE IF NOT EXISTS cadres (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL
  )`);

  const cadres = [
    { code: 'SEO', name: 'Site Enhancement Officer' },
    { code: 'DA',  name: 'Data Assistant' },
    { code: 'PCM', name: 'Professional Case Manager' },
    { code: 'LCM', name: 'Lay Case Manager' },
    { code: 'LSS', name: 'Laboratory Support Staff' },
    { code: 'LQO', name: 'Laboratory Quality Optimiser' },
    { code: 'MM',  name: 'Mentor Mother' },
    { code: 'DEC', name: 'Data Entry Clerk' },
    { code: 'PCT', name: 'Professional Counselor Tester' },
    { code: 'LCT', name: 'Lay Counselor Tester' }
  ];

  cadres.forEach(c => {
    db.get(`SELECT * FROM cadres WHERE code = ?`, [c.code], (err, row) => {
      if (!row) {
        db.run(`INSERT INTO cadres (code, name) VALUES (?, ?)`, [c.code, c.name]);
      }
    });
  });

  // Facilities
  db.run(`CREATE TABLE IF NOT EXISTS facilities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  )`);

  const facilities = [
    "Boshong Health Clinic",
    "Guyuk General Hospital",
    "Toungo Cottage Hospital",
    "Major Aminu Urban Health Centre",
    "Peace Hospital Jimeta",
    "St. Francis Hospital",
    "Yola Specialist Hospital",
    "Wauro-Jabbe Health Centre",
    "Garkida General Hospital",
    "Mubi General Hospital",
    "Song Cottage Hospital",
    "G.D.Chanrai Memorial Hospital",
    "Yola Federal Medical Centre",
    "Cottage Hospital Gulak",
    "Fufore Cottage Hospital",
    "Ganye General Hospital",
    "Borrong General Hospital",
    "Adamawa Hospital Yola",
    "Jada Township Clinic",
    "Hong Cottage Hospital",
    "Maiha Cottage Hospital",
    "Mayo Belwa Cottage Hospital",
    "Mayo-Belwa Township Clinic",
    "Girei B Clinic",
    "Michika General Hospital",
    "Numan General Hospital"
  ];

  facilities.forEach(name => {
    db.get(`SELECT * FROM facilities WHERE name = ?`, [name], (err, row) => {
      if (!row) {
        db.run(`INSERT INTO facilities (name) VALUES (?)`, [name]);
      }
    });
  });

  // Staff
  db.run(`CREATE TABLE IF NOT EXISTS staff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    facility_id INTEGER NOT NULL,
    cadre_id INTEGER NOT NULL,
    FOREIGN KEY (facility_id) REFERENCES facilities(id),
    FOREIGN KEY (cadre_id) REFERENCES cadres(id)
  )`);

  // Attendance
  db.run(`CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    staff_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    clock_in TEXT NOT NULL,
    late_minutes INTEGER DEFAULT 0,
    status TEXT NOT NULL,
    FOREIGN KEY (staff_id) REFERENCES staff(id)
  )`);

  // Insert sample staff
  db.all(`SELECT id FROM facilities`, (err, fRows) => {
    db.all(`SELECT id, code FROM cadres`, (err, cRows) => {
      const sampleStaff = fRows.map((f, i) => {
        const cadre = cRows[i % cRows.length];
        return {
          name: `Staff ${i+1}`,
          email: `staff${i+1}@ahni.org`,
          facility_id: f.id,
          cadre_id: cadre.id
        };
      });

      sampleStaff.forEach(s => {
        db.get(`SELECT * FROM staff WHERE email = ?`, [s.email], (err, row) => {
          if (!row) {
            db.run(`INSERT INTO staff (name, email, facility_id, cadre_id) VALUES (?, ?, ?, ?)`,
              [s.name, s.email, s.facility_id, s.cadre_id]);
          }
        });
      });
    });
  });
});

module.exports = db;
