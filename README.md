# scrapUndo ♻️

> AI-Powered Doorstep Scrap Collection Platform in Kerala

**scrapUndo** allows households and businesses in Kerala to photograph their scrap (old TVs, newspapers, metals, electronics, plastics), get instant AI price estimates, locate certified scrap collection shops nearest to their real GPS location, and book a doorstep collection slot with cash handover on collection.

---

## 🌟 Key Features

- **AI Scrap Recognition**: Upload any scrap photo (e.g. TV, newspaper bundles, copper wire) to get instant market value estimates.
- **Real GPS Location & Proximity Sorting**: Detects device coordinates, reverse-geocodes to your Kerala street address, calculates Haversine distance, and automatically sorts scrap shops nearest to your doorstep first.
- **Kerala Coverage**: Kochi (Ernakulam), Palakkad, Malappuram, and Thrissur.
- **Doorstep Booking & OTP Verification**: 4-digit secure confirmation OTP generated upon booking to give to the collector after weighing and cash payout.
- **Bidirectional Scroll Reveal Animations**: Clean, modern animations that glide into view smoothly whether you scroll down or scroll up.
- **Mobile-Optimized**: Native bottom navigation bar and direct smartphone camera snap integration.

---

## 🏗️ Architecture

```
scrapconnect/
├── frontend/         Next.js 14 (App Router + TypeScript + Tailwind CSS)
├── backend/          NestJS 12 (TypeScript + Prisma ORM + PostgreSQL)
└── docker-compose.yml
```

---

## 🚀 Quick Start

### 1. Run Development Server
```bash
# From the root directory:
npm run dev
```

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001/api/v1](http://localhost:3001/api/v1)

---

## 📄 License
MIT
