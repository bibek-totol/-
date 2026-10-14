# Krishi Abohawa (কৃষি আবহাওয়া) – District Agro-Weather Bulletin App

**Krishi Abohawa (কৃষি আবহাওয়া)** is a modern, responsive, Bengali-first agro-meteorological advisory web application built with **Next.js (App Router), TypeScript, and Tailwind CSS**.

It extracts and visualizes official agro-weather bulletins from the **Bangladesh Agro-Meteorological Information System (BAMIS)** under the **Department of Agricultural Extension (DAE)**. Farmers, extension officers, and agricultural researchers can select any of Bangladesh's 64 districts to view real-time 5-day forecasts, past 4-day trends, interactive temperature graphs, detailed meteorological parameters, and crop/livestock management advice.

---

## 🌟 Key Features

1. **Bengali-First Interface**:
   - Styled with Google Fonts **Noto Sans Bengali** for maximum clarity and typographic elegance.
   - All digits, dates, weather metrics, and advisory guidelines are presented in natural Bengali.

2. **Searchable District Selector**:
   - Filter districts by Bengali (`রংপুর`, `বরগুনা`) or English (`Rangpur`, `Barguna`) name.
   - Quick-select pills for major agricultural hubs.
   - Persists selected district in `localStorage` and syncs with shareable URL parameters (e.g. `/?district=27`).

3. **Agro-Weather Bulletin Summary**:
   - District name, official bulletin number (e.g. বুলেটিন নং ৭৬৮), publication date, and validity period.
   - Stale cache indicator badge (`পূর্বের সংরক্ষিত তথ্য`) if BAMIS is temporarily unreachable.

4. **5-Day Weather Forecast Cards**:
   - Weather condition icons (Sunny, Partly Cloudy, Rain, Overcast).
   - High & low temperature badges, rain probability/mm, relative humidity range, and wind speed/direction.

5. **Interactive Temperature Trend Chart**:
   - Built with `recharts`.
   - Smooth area curves illustrating maximum and minimum temperature trends.
   - Interactive toggle between **"আগামী ৫ দিনের পূর্বাভাস"** and **"গত ৪ দিনের তথ্য"**.

6. **Detailed Meteorological Tables**:
   - Horizontally scrollable comparison table optimized for mobile viewports.
   - Covers rainfall (mm), max/min temperatures (°C), humidity (%), wind speed (km/h), direction, and cloud cover (octa).

7. **Crop & Livestock Advisory Accordions**:
   - Dynamic categories (e.g., ধান আমন, সবজি, উদ্যান ফসল, গবাদি পশু, হাঁসমুরগী, মৎস্য, আলু).
   - First category opened by default with accordion toggles and "সব খুলুন / সব বন্ধ করুন" controls.
   - Automatic extraction of crop growth stages (e.g. `পর্যায়: দানা জমাট বাঁধা`).
   - Original, safe, unmodified Bengali advisory text preserving critical chemical dosages and agronomic practices.

8. **Reliability, Caching & Offline Fallback**:
   - Server-side fetching with 10-second timeout, realistic User-Agent, and 2 retries.
   - 3-hour cache revalidation (`s-maxage=10800`).
   - In-memory backup cache with `stale: true` fallback if BAMIS portal suffers downtime.

9. **Accessibility & Dark Mode**:
   - Full dark mode support with instant theme toggle and system preference detection.
   - Print & "Save as PDF" button (`window.print()`) with print-optimized stylesheets.

---

## 📊 Live BAMIS District Verification Report

The live BAMIS portal (`https://www.bamis.gov.bd`) was scanned to verify the 64 districts of Bangladesh and resolve uncertainties from initial handwritten notes:

| District ID | Expected (Notes) | Live BAMIS Verification | Status |
| :---: | :--- | :--- | :---: |
| **7** | `Chapainawabganj` | `Chapai Nawabganj` (`চাঁপাইনবাবগঞ্জ`) | Verified |
| **11** | *Missing in notes* | Not found on BAMIS (404/Empty) | **Non-existent ID** |
| **17** | *Missing in notes* | Not found on BAMIS (404/Empty) | **Non-existent ID** |
| **25** | `Panchagarh` (`পঞ্চগড়`) | `Panchagarh` (`পঞ্চগড়` with U+09DC) | Verified & Unified |
| **37** | `Dhaka` (Unsure in notes) | `Dhaka` (`ঢাকা`) | **Verified as ID 37** |
| **41** | `Munshiganj` (`মুন্সীগঞ্জ`) | `Munshiganj` (`মুন্সিগঞ্জ` with হ্রস্ব-ইকার) | Verified & Corrected |

- **Total Valid Districts**: **64**
- **District ID Range**: 1 to 66 (IDs 11 and 17 do not exist in the BAMIS system).
- **Live Verification Script**: Run `npm run verify:districts` to run a live scan against all districts.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS v4
- **Parser**: Cheerio
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Testing**: Vitest 5

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v20.x` or later (tested on Node v24)
- npm `v10.x` or later

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd govt-information-based-data

# Install dependencies
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Running Unit Tests

```bash
npm run test
```

Runs Vitest test suites for `normalize.ts` (Bengali digit, date, range, cloud conversion) and `parseBulletin.ts` (using real BAMIS HTML fixtures from districts 27 and 24).

### Running Linting

```bash
npm run lint
```

### Production Build

```bash
npm run build
npm run start
```

### Running District Verification Script

```bash
npm run verify:districts
```

---

## 🌐 API Reference

### 1. Get District Bulletin

- **Endpoint**: `GET /api/bulletin/[districtId]`
- **Examples**:
  - `GET /api/bulletin/27` (Thakurgaon)
  - `GET /api/bulletin/24` (Barguna)
  - `GET /api/bulletin/37` (Dhaka)
- **Response**: `200 OK` (JSON matching `Bulletin` interface)
- **Invalid ID**: `400 Bad Request`

```json
{
  "districtId": 27,
  "districtNameBn": "ঠাকুরগাঁও",
  "bulletinNo": 768,
  "bulletinDate": "2026-10-14",
  "periodFrom": "2026-10-14",
  "periodTo": "2026-10-18",
  "pastWeather": [...],
  "forecast": [...],
  "advice": [...],
  "sourceUrl": "https://www.bamis.gov.bd/bulletin/district/current/27",
  "fetchedAt": "2026-10-14T09:07:44.000Z"
}
```

### 2. Scheduled Cron Pre-Fetch Job

- **Endpoint**: `POST /api/cron/refresh`
- **Headers**:
  - `Authorization: Bearer <CRON_SECRET>`
- **Description**: Iterates through all 64 districts with a 500ms rate-limit and max concurrency of 2 requests, refreshing server caches.

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory:

```env
# Secret token to protect the cron refresh route
CRON_SECRET=your_secure_cron_secret_here
```

---

## ☁️ Deployment (Vercel)

1. Push your repository to GitHub / GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Framework Preset: **Next.js**.
4. Configure Environment Variables:
   - Add `CRON_SECRET`
5. Optional Cron Schedule (`vercel.json`):
   ```json
   {
     "crons": [
       {
         "path": "/api/cron/refresh",
         "schedule": "0 6 * * *"
       }
     ]
   }
   ```
6. Click **Deploy**.

---

## ⚠️ Known Limitations & Design Decisions

1. **Government Portal Availability**:
   - `bamis.gov.bd` does not offer a public REST API. The app scrapes and parses the live server HTML. If BAMIS changes its HTML layout, the parser logs a descriptive error and returns the last known cached copy (`stale: true`).
2. **Missing District IDs**:
   - District IDs 11 and 17 return 404 on the government portal. The app validates against the 64 genuine IDs and returns 400 for 11 and 17.
3. **Pesticide & Advisory Text**:
   - Agricultural advisory text contains critical chemical formulations (e.g. `১ গ্রাম ব্যাভিস্টিন প্রতি লিটার`). In accordance with agricultural safety guidelines, advisory sentences are strictly preserved in their original Bengali text without translation or truncation.
