# Ingham County Housing Equity - Web App

Interactive map-based ML platform for housing equity analysis.

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
```bash
cp .env.local.example .env.local
# Edit .env.local with your API keys:
# - OPENAI_API_KEY (get from https://platform.openai.com/api-keys)
# - NEXT_PUBLIC_MAPBOX_TOKEN (get from https://account.mapbox.com/access-tokens/)
```

3. **Run development server:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Features

- **Interactive Map**: Mapbox GL visualization with 238 block groups
- **3 ML Predictions**: Equity Score, Gentrification Risk, Foreclosure Risk
- **AI Assistant**: Natural language queries and what-if simulations
- **Automatic Highlighting**: AI responses highlight areas on map

## Project Structure

```
webapp/
├── app/
│   ├── api/chat/route.ts    # AI Assistant API endpoint
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Main page
│   └── globals.css           # Global styles
├── components/
│   ├── BlockGroupMap.tsx     # Mapbox map component
│   ├── BlockGroupPanel.tsx   # Detail panel
│   └── AIAssistant.tsx       # Chat interface
├── lib/
│   ├── types.ts              # TypeScript types
│   └── data-loader.ts        # Data utilities
└── public/data/
    ├── bg_predictions.json   # ML predictions (78 KB)
    └── ingham_block_groups.geojson  # Geographic boundaries (535 KB)
```

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
vercel env add OPENAI_API_KEY
vercel env add NEXT_PUBLIC_MAPBOX_TOKEN

# Deploy to production
vercel --prod
```

## Tech Stack

- **Framework**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Mapbox GL JS
- **AI**: Vercel AI SDK + OpenAI GPT-4o-mini
- **Deployment**: Vercel

## Cost

- **Vercel**: $0/mo (Hobby tier)
- **Mapbox**: $0/mo (50k loads free)
- **OpenAI**: ~$10/mo (moderate usage)

**Total: ~$11/month**
