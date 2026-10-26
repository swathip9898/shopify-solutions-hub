# 🛍️ Shopify Solutions Hub

> **Centralized Custom Solutions Knowledge Base for Shopify Teams**  
> Easily log, discover, and reuse custom features across 60–70+ client Shopify stores. Powered by **Next.js 14**, **Tailwind CSS**, and backed by **Google Sheets** for zero-cost, zero-maintenance database hosting.

---

## 🌟 Highlights

- **Tailored for Shopify Stores & Brands**: Categorized by *Theme / Liquid*, *Checkout UI Extensions*, *Shopify Functions*, *Custom Apps (Remix/Node)*, *Flow & Webhooks*, *Metafields*, and *Integrations*.
- **Google Sheets as Free Database**: Uses Google Sheets API v4 with Service Account authentication. No paid third-party wrappers, 100% free forever.
- **Graceful Fallback / Demo Mode**: Out-of-the-box realistic seed data for brands (Dawn, Prestige, Hydrogen) and custom solutions so the app works immediately even before connecting Google Sheets.
- **Brand Directory**: Manage all 60–70 brands, their theme, lead developer, and see how many custom solutions exist per store.
- **Developer Submission Form**: Clean modal with syntax-styled code snippet inputs, GitHub PR links, and Loom video docs.
- **100% Free Hosting on Vercel**: Ready for one-click deployment with support for free custom domain linking (e.g., `solutions.yourbrand.com`).

---

## 🚀 Quick Start (Local Development)

```bash
# 1. Open the project in terminal
cd ~/Desktop/shopify-solutions-hub

# 2. Install dependencies (if needed)
npm install

# 3. Start the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app runs in **Demo Mode** with pre-populated realistic Shopify store data.

---

## 📊 Connecting Google Sheets (100% Free)

Follow these 4 simple steps to connect your private Google Sheet:

### Step 1: Create a Google Spreadsheet
1. Open [sheets.new](https://sheets.new) and create a new Google Sheet.
2. Name it something like: `Shopify Custom Solutions`.
3. *(Optional)* You do not need to create columns or tabs manually — when the app connects, it **automatically initializes** the `Brands` and `Solutions` tabs and column headers for you.
4. Copy the **Spreadsheet ID** from the browser URL:
   ```
   https://docs.google.com/spreadsheets/d/[YOUR_SPREADSHEET_ID]/edit
   ```

### Step 2: Create a Free Google Cloud Service Account
1. Go to the [Google Cloud Console](https://console.cloud.google.com/) (100% free, no billing required for Sheets API).
2. Create a new project (e.g., `Shopify Solutions Hub`).
3. In the search bar, search for **Google Sheets API** and click **Enable**.
4. Go to **IAM & Admin > Service Accounts** > Click **Create Service Account**:
   - Service account name: `shopify-solutions-bot`
   - Click **Create and Continue**, then click **Done**.
5. Click on the created service account > Go to the **Keys** tab > Click **Add Key > Create new key > JSON**.
6. A JSON key file will download to your computer.

### Step 3: Share the Google Sheet with the Service Account
1. Open the downloaded JSON file and copy the `client_email` value (e.g., `shopify-solutions-bot@your-project.iam.gserviceaccount.com`).
2. Go back to your Google Sheet > Click the green **Share** button.
3. Paste the service account email and give it **Editor** permissions.

### Step 4: Configure Environment Variables
Create a `.env.local` file in the project root:

```bash
GOOGLE_SHEET_ID=your_spreadsheet_id_from_step_1
GOOGLE_SERVICE_ACCOUNT_EMAIL=shopify-solutions-bot@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwgg...\n-----END PRIVATE KEY-----\n"
```

---

## 🌐 Free Hosting Guide (Vercel)

You can host this application completely free on **Vercel** with automatic HTTPS and free custom domain support:

### Option A: Deploy via GitHub (Recommended)
1. Initialize git and push this repo to your GitHub:
   ```bash
   cd ~/Desktop/shopify-solutions-hub
   git init
   git add .
   git commit -m "feat: initial shopify solutions hub"
   git remote add origin https://github.com/your-organization/shopify-solutions-hub.git
   git push -u origin main
   ```
2. Go to [Vercel](https://vercel.com/) and click **Add New > Project**.
3. Import your GitHub repository.
4. Under **Environment Variables**, add the 3 variables:
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
   - `GOOGLE_PRIVATE_KEY`
5. Click **Deploy**. Your app will be live in ~60 seconds with a free `.vercel.app` URL!

---

## 🔗 How to Connect Your Custom Domain (Free)

Once deployed on Vercel:
1. Open your project in the [Vercel Dashboard](https://vercel.com/).
2. Navigate to **Settings > Domains**.
3. Enter your custom subdomain (e.g., `solutions.yourbrand.com`).
4. Add the `CNAME` record provided by Vercel in your DNS provider.
5. Vercel will automatically provision a **free SSL certificate** within 1–5 minutes!
