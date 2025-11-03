# AHNi Attendance Dashboard

Staff punctuality tracking system for AHNi's 26 facilities and 10 cadres.

## ✅ Features
- Clock-in/out with automatic lateness detection
- Dashboard: Punctuality by **facility** and **cadre**
- Manager view: All staff across all sites
- Built with React + Node.js + SQLite

## 🏥 Facilities (26)
Boshong Health Clinic, Guyuk General Hospital, Toungo Cottage Hospital, Major Aminu Urban Health Centre, Peace Hospital Jimeta, St. Francis Hospital, Yola Specialist Hospital, Wauro-Jabbe Health Centre, Garkida General Hospital, Mubi General Hospital, Song Cottage Hospital, G.D.Chanrai Memorial Hospital, Yola Federal Medical Centre, Cottage Hospital Gulak, Fufore Cottage Hospital, Ganye General Hospital, Borrong General Hospital, Adamawa Hospital Yola, Jada Township Clinic, Hong Cottage Hospital, Maiha Cottage Hospital, Mayo Belwa Cottage Hospital, Mayo-Belwa Township Clinic, Girei B Clinic, Michika General Hospital, Numan General Hospital

## 👥 Cadres (10)
| Code | Role |
|------|------|
| SEO | Site Enhancement Officer |
| DA | Data Assistant |
| PCM | Professional Case Manager |
| LCM | Lay Case Manager |
| LSS | Laboratory Support Staff |
| LQO | Laboratory Quality Optimiser |
| MM | Mentor Mother |
| DEC | Data Entry Clerk |
| PCT | Professional Counselor Tester |
| LCT | Lay Counselor Tester |

## ▶️ Local Setup
```bash
# 1. Clone repo
git clone https://github.com/YOUR-USERNAME/ahni-attendance-dashboard.git
cd ahni-attendance-dashboard

# 2. Start backend
cd backend
npm install
npm run dev

# 3. Start frontend
cd ../frontend
npx create-react-app .  # if needed
npm install chart.js react-chartjs-2
npm start
