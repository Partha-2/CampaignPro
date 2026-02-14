# 📊 CampaignPro: Unified Analytics & Investor Insights

A premium **crowdfunding analytics engine** built with **NestJS**, designed to process large-scale campaign data, investor transactions, and generate automated performance reports.

---

## 🌟 Submission Highlights
*   **Unified Dashboard**: A search-first, single-page analytics dashboard with real-time global filtering.
*   **High Test Coverage**: **~72% code coverage** focused on complex business logic and formulas.
*   **Clean Architecture**: Modular structure separating data access, core logic, and reporting.
*   **Automated Seeding**: One-click data generation for 300+ records across all analytics categories.

---

## 🛠 Tech Stack
-   **Backend**: NestJS (Node.js) + TypeScript
-   **Frontend**: Vanilla JavaScript + Glassmorphism CSS (No external frameworks for maximum performance)
-   **Storage**: JSON-based file storage (Domain-Driven Data Access)
-   **Testing**: Jest
-   **UI/UX**: Modern Dark Mode, Responsive Tables, Real-time Search Synchronization.

---

## 🚀 Getting Started

### 1. Prerequisites
-   Node.js (v18+)
-   npm

### 2. Installation
```bash
git clone <your-repo-url>
cd campaign-analytics
npm install
```

### 3. Initialize Data (Seeding)
To generate the three core output files (`campaign-analytics.json`, `investor-insights.json`, `analytics-reports.json`) with 100 records each:
```bash
npm run dev
# Then visit http://localhost:3000/seed-data in your browser
```

### 4. Running the App
```bash
# Development mode
npm run dev

# Production Build
npm run build
npm run start
```
The application will be live at `http://localhost:3000`.

---

## 📂 Project Architecture

The project follows a **Modular Architecture** for scalability and clarity:

*   `/src/campaign-analytics`: Handles Performance Score calculation (Formula 1) and trend analysis.
*   `/src/investor-insights`: Manages Investor Segmentation (Formula 3) and Sector Preferences (Formula 5).
*   `/src/reports`: Orchestrates date-range based data aggregation and summary reporting.
*   `/src/data`: Centralized data access layer with JSON parsing and seeding logic.
*   `/public`: Premium frontend dashboard assets.

---

## 🔍 Search & Filtering (Try these examples!)

The **Unified Search Bar** at the top of the dashboard allows for instantaneous "One ID Search" across all three data categories simultaneously.

| Category | Example Terms |
| :--- | :--- |
| **Specific IDs** | `CAM-1`, `INV-12`, `#5` (Report ID) |
| **Sectors** | `Fin-tech`, `Health-tech`, `Consumer` |
| **Segments** | `Whale`, `Regular`, `Occasional`, `New` |
| **Time Period** | `2026-02-14` (Today), `January`, `2025` |

---

## 🧪 Verification
Run unit tests to verify formula accuracy and code integrity:
```bash
npm test          # Run all tests
npm run test:cov  # Check coverage report
```

---

**Developed for the Backend Developer Assessment.**
**Submission Date**: February 14, 2026
