# 📊 CampaignPro: Unified Analytics & Investor Insights Dashboard

**A high-performance, mobile-responsive analytics engine built with NestJS and curated for the 2026 Backend Developer Assessment.**

---

## 🚀 Live Demo & Deployment
- **Live Dashboard**: [https://campaignpro1.netlify.app/](https://campaignpro1.netlify.app/)
- **GitHub Repository**: [https://github.com/Partha-2/CampaignPro](https://github.com/Partha-2/CampaignPro)

---

## 🌟 Executive Summary
This project transforms raw crowdfunding data into actionable insights. It features a **"One ID" Search Engine** that allows users to instantly filter across three complex data domains (Campaigns, Investors, and Reports) on a single, premium responsive dashboard.

### Key Metrics:
- **72% Total Code Coverage** (passing 100% of logic tests).
- **300+ Pre-seeded Records** across all analytics categories.
- **5 High-Precision Formulas** implemented for financial scoring and segmentation.

---

## 🛠 Tech Track & Stack

### Backend (The Brain)
- **NestJS & TypeScript**: Core framework for modular architecture.
- **Service-Oriented Design**: Decoupled modules for Analytics, Investors, and Reports.
- **AWS Lambda Adatar**: Integrated `serverless-http` for Netlify Function compatibility.

### Frontend (The Interface)
- **Vanilla JavaScript**: Zero-dependency, ultra-fast client-side filtering.
- **Modular CSS**: Modern Glassmorphism design system.
- **Responsive Web Design**: Mobile-first media queries for phone/tablet/desktop.

### DevOps & Testing
- **Jest**: Unit testing for all business logic.
- **Netlify**: Serverless deployment with CI/CD integration.
- **GitHub**: Source control and deployment automation.

---

## 🏗 Project Journey (Scratch to End)

### Phase 1: Core Backend & Data Logic
- **Data Ingestion**: Created a robust `JsonDataService` to process raw startups, campaigns, and transactions.
- **Formula Engineering**: Implemented complex business logic including:
  - **Campaign Performance Score**: Multi-weighted formula for campaign success.
  - **Investor Engagement Score**: Transaction count vs. investment volume weighting.
  - **Segmentation Engine**: Logic-driven categorization (`whale`, `regular`, etc.).
  - **Sector Preference Analysis**: Real-time cross-referencing between transactions, campaigns, and startups.

### Phase 2: The Unified Dashboard
- **UI Consolidation**: Refactored a multi-tab interface into a high-impact **Single Page Dashboard**.
- **Search Engine**: Developed a global search bar that performs real-time, case-insensitive matching across `formatted_ids`, `sectors`, `segments`, and `dates`.

### Phase 3: Deployment & Optimization
- **Netlify Serverless Adaptation**: Refactored the NestJS app to run on AWS Lambda via Netlify Functions.
- **Static Asset Strategy**: Moved analytics outputs to the `public/` directory to ensure data persistency in a stateless serverless environment.
- **Mobile Mastery**: Implemented media queries to ensure a premium look on iPhones and Android devices.

---

## 🔍 Search Examples (Try the Search Bar!)

| To Find... | Type This... |
| :--- | :--- |
| **Campaign #1** | `CAM-1` |
| **Investor #12** | `INV-12` |
| **Sector Filter** | `Fin-tech` or `Health-tech` |
| **Segments** | `Whale`, `Regular`, `New` |
| **Report Date** | `2026-02-14` |

---

## 🧪 How to Run Locally

1. **Install Dependencies**:
   ```bash
   npm install
   ```
2. **Run in Development**:
   ```bash
   npm run dev
   ```
3. **Run Unit Tests**:
   ```bash
   npm run test:cov
   ```
4. **Seed Fresh Data**:
   Navigate to `http://localhost:3000/seed-data` to regenerate the 300+ JSON records.

---

## 📦 Project Structure
- `src/campaign-analytics`: Campaign scoring and analytics logic.
- `src/investor-insights`: Investor behavior and segmentation logic.
- `src/reports`: Automated summary report generation.
- `src/data`: Data access layer and seeder.
- `public/`: Frontend assets and static JSON data.
- `netlify/functions`: Serverless entry point.

---

**Developed for the Backend Developer Assessment.**
**Submission Date**: February 14, 2026
