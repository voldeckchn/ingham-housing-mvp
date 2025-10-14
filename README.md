# Ingham County Housing Equity Model - MVP

Web-based ML-powered housing equity analysis tool for Ingham County, Michigan.

## 🎯 Features

- **3 ML Predictions**: Equity Score, Gentrification Risk, Foreclosure Risk
- **Census Block Group Analysis**: ~150-200 neighborhoods
- **AI Assistant**: Natural language interface for data exploration
- **Interactive Map**: Mapbox visualization with AI-driven highlighting
- **What-If Simulations**: Model policy interventions

## 🏗️ Architecture

**Data Pipeline (Python)**
```
01_fetch_block_groups.py  → Census boundaries
02_fetch_census.py         → ACS demographic data
03_fetch_assessor.py       → Property assessments (synthetic for MVP)
04_generate_synthetic_mls.py → Market data (synthetic for MVP)
05_engineer_features.py    → Feature engineering
06_train_model.py          → Random Forest models
07_generate_predictions.py → Generate JSON predictions
```

**Frontend (Next.js 14 + TypeScript)**
- BlockGroupMap component (Mapbox GL JS)
- AI Assistant (Vercel AI SDK + GPT-4o-mini)
- Real-time map highlighting based on AI queries

## 🚀 Quick Start

### 1. Run Data Pipeline

```bash
# Install Python dependencies
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run full pipeline (takes ~5-10 minutes)
bash run_pipeline.sh
```

This generates:
- `data/block_groups/ingham_block_groups.geojson` (~500KB)
- `data/block_groups/bg_predictions.json` (~50KB)
- `models/equity_model.pkl` (~5MB)
- `models/foreclosure_model.pkl` (~5MB)

### 2. Set Up Frontend

```bash
# Initialize Next.js app
npx create-next-app@latest webapp --typescript --tailwind --app --no-src-dir
cd webapp

# Install dependencies
npm install ai @ai-sdk/openai zod mapbox-gl recharts

# Copy data to public folder
mkdir -p public/data
cp ../data/block_groups/bg_predictions.json public/data/
cp ../data/block_groups/ingham_block_groups.geojson public/data/

# Set environment variables
echo "OPENAI_API_KEY=your_key_here" > .env.local
echo "NEXT_PUBLIC_MAPBOX_TOKEN=your_token_here" >> .env.local
```

### 3. Build Components

Follow the implementation plan in `../system-dynamics-docs/MVP_BUILD_PLAN.md`

Key components:
- `app/api/chat/route.ts` - AI assistant endpoint
- `components/BlockGroupMap.tsx` - Map visualization
- `components/BlockGroupPanel.tsx` - Detail panel
- `components/AIAssistant.tsx` - Chat interface

### 4. Deploy

```bash
# Deploy to Vercel
npm run build
vercel --prod
```

## 📊 Data Sources

**MVP (Synthetic Data)**
- Census ACS 5-year (2022) - Real
- Census TIGER/Line boundaries - Real
- MLS sales data - **Synthetic**
- Assessor data - **Synthetic**

**Production**
- Partner with Greater Lansing Association of Realtors for real MLS
- FOIA request to Ingham County for assessor parcels
- Integrate Land Bank foreclosure data
- Add HMIS data for homelessness risk

## 🤖 AI Assistant Capabilities

**Data Queries:**
- "Which 5 areas have worst foreclosure risk?"
- "Show me high gentrification risk areas"
- "What's the equity score for block group 260650001001?"

**Comparisons:**
- "Compare downtown Lansing with East Lansing"
- "How does area X compare to area Y?"

**Simulations:**
- "What if median income increased 15% in area X?"
- "Simulate a 10% price drop in downtown"

**Map Integration:**
- AI responses automatically highlight areas on map
- Clickable links to zoom to specific block groups
- Visual indicators for high-risk areas

## 📈 ML Models

**Random Forest Regressors:**
- 100 trees, max depth 10
- 12 input features (demographics, prices, stability)
- Trained on ~150-200 block groups
- Expected R² ~0.6-0.8 with synthetic data

**Input Features:**
- `median_income`, `pct_owner_occupied`, `pct_cost_burdened`
- `median_sale_price`, `price_yoy_change`, `days_on_market`
- `affordability_ratio`, `market_liquidity`, etc.

**Targets:**
- Equity Score (0-100): Composite of affordability, stability, opportunity
- Foreclosure Risk (0-100): Cost burden, price volatility, income risk
- Gentrification Risk (0-100): Rule-based (price momentum + demographics)

## 💰 Costs

**Development:** ~63 hours (~2 weeks full-time)

**Operating:**
- Vercel: $0/mo (hobby tier)
- Mapbox: $0/mo (50k loads free)
- OpenAI API: ~$10/mo (moderate usage)
- **Total: ~$11/month**

## 🔧 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Maps**: Mapbox GL JS
- **AI**: Vercel AI SDK + GPT-4o-mini
- **ML**: scikit-learn (Python)
- **Deployment**: Vercel
- **Data**: GeoJSON + JSON (no database for MVP)

## 📝 License

MIT License - See LICENSE file

## 🤝 Contributing

This is an MVP. For production deployment:
1. Replace synthetic data with real MLS partnership
2. Add PostgreSQL for historical data
3. Implement user authentication
4. Add community validation workflows
5. Integrate with HTF grant allocation system

## 📚 Documentation

See `../system-dynamics-docs/MVP_BUILD_PLAN.md` for complete implementation guide.

---

Built with ❤️ for Ingham County housing equity
