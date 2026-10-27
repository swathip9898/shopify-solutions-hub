# 🛍️ Shopify Custom Solutions Hub

> **Centralized Knowledge Base & Code Registry for Shopify Teams**  
> Easily log, discover, and reuse custom features across 60–70+ brand stores. Powered by **Next.js 14**, **Tailwind CSS**, and backed by **Google Sheets** for zero-cost, zero-maintenance database hosting.

---

## 🌟 Highlights

- **Tailored for Shopify Stores & Brands**: Categorized by *Liquid / Theme*, *Checkout UI Extensions*, *Shopify Functions*, *Custom Apps*, *Metafields*, and *Integrations*.
- **Google Sheets as Free Database**: Direct real-time read and write via Google Apps Script Web App. 100% free forever, no complex IAM keys or paid add-ons.
- **Brand Directory**: Track all 60–70 brands and see how many custom solutions exist per store.
- **Developer Submission Modal**: Clean submission form with syntax-styled code inputs, brand selector, and tags.
- **1-Click Snippet Copying**: Instant clipboard copy with visual feedback for fast developer workflows.
- **100% Free Hosting on Vercel**: Ready for one-click deployment with support for free custom domain linking (e.g., `solutions.yourcompany.com`).

---

## 📖 Complete Documentation

For the full architectural breakdown, data model, Google Apps Script setup, and operational guide, see:
👉 **[DOCUMENTATION.md](./DOCUMENTATION.md)**

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variable
# Copy .env.example or create .env.local:
GOOGLE_SHEET_WEBAPP_URL="https://script.google.com/macros/s/AKfycbxrUd6_SIK4ZvMBCOHHghjLsxyzNoZcHTj-n-MtyD8-a_5c0hNPZb5rz_nLT30hnu74/exec"

# 3. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploy to Vercel (100% Free Hosting)

1. Push your repository to GitHub.
2. Sign in to [Vercel](https://vercel.com) and click **"Add New..."** → **"Project"**.
3. Import **`shopify-solutions-hub`**.
4. In the **Environment Variables** section, add:
   - **Key**: `GOOGLE_SHEET_WEBAPP_URL`
   - **Value**: `https://script.google.com/macros/s/AKfycbxrUd6_SIK4ZvMBCOHHghjLsxyzNoZcHTj-n-MtyD8-a_5c0hNPZb5rz_nLT30hnu74/exec`
5. Click **Deploy**.

---

## 📄 License
Internal team tool. Created for Shopify brands management.
