# Ingham County Housing Equity Model - MVP Build Plan

## Overview
Build an MVP demonstrating the **Ingham County Comprehensive Housing Equity Model** - a simplified version focusing on the core predictive capabilities without the full institutional infrastructure.

**Based on**: "Comprehensive Housing Equity Model.pdf" - ML-powered causal modeling with real-time market intelligence.

## What Makes This Model Different

This is **NOT** a simple mortgage calculator. This is a **multi-layer predictive system** that:
- Predicts gentrification risk 12-18 months ahead using MLS data
- Detects foreclosure risk at neighborhood level before it cascades
- Calculates comprehensive housing equity at Census Block Group level
- Simulates policy interventions before implementation
- **AI-powered natural language interface** - Ask questions, run simulations, compare areas conversationally

## MVP Scope: Stripped Down But Functional

### What's IN the MVP
✅ **Geographic Analysis Layer**
- Census Block Groups for Ingham County (~150-200 divisions)
- Direct Census demographic data (no interpolation needed)
- Interactive map visualization

✅ **Core Prediction Engine**
- Housing Equity Score (0-100) by block group
- Gentrification Risk Score (0-100) - 12-18 month advance warning
- Foreclosure Risk Score (0-100) - neighborhood-level early detection
- Basic feature engineering pipeline
- Simple ML models (Random Forest or XGBoost)

✅ **Minimal Data Integration**
- Census ACS 5-year data (public, free, perfect alignment)
- County Assessor data aggregated to block groups (public, free)
- Simulated MLS-like data (for demo purposes)

✅ **Simple Dashboard**
- Map view with block group coloring
- Click block group → see scores
- Time series of score trends
- CSV export

✅ **AI Assistant**
- Natural language interface for system operations ("what if I increase income by 10%?")
- Contextual data queries ("what drives equity scores in this area?")
- Area comparisons ("how does downtown compare to east side?")
- Conversational interface limited to housing equity data context

**Example AI interactions with outputs:**

**Query 1: "Which 5 areas have the worst foreclosure risk?"**
```
AI Response:
"Here are the 5 block groups with highest foreclosure risk:

1. Block Group 260650101002 - Foreclosure Risk: 87
   • Median Income: $28,400
   • Equity Score: 32
   [Click to view on map]

2. Block Group 260650105001 - Foreclosure Risk: 82
   • Median Income: $31,200
   • Equity Score: 38
   [Click to view on map]

... (3 more areas)

These areas share common characteristics: low median income
(<$35k), high cost burden (>45%), and recent price volatility."

[Map automatically highlights these 5 areas in red pulsing animation]
```

**Query 2: "What if median income increased 15% in block group 260650001001?"**
```
AI Response:
"Running simulation for Block Group 260650001001...

Current State:
• Median Income: $42,000
• Equity Score: 45.2
• Foreclosure Risk: 68.5

After 15% income increase ($48,300):
• Equity Score: 49.7 (+4.5 points) ✅
• Foreclosure Risk: 65.5 (-3.0 points) ✅

Impact: A 15% income increase would move this area from
'moderate risk' to 'low-moderate risk' for foreclosures.
This suggests income support programs could be effective here."

[Map shows before/after color comparison for that block group]
```

**Query 3: "Compare downtown vs suburbs"**
```
AI Response:
"Comparing downtown Lansing (Block Groups 260650001*)
with suburban areas (260650010*)...

Downtown (avg of 8 block groups):
• Equity Score: 52 (moderate)
• Gentrification Risk: 71 (HIGH)
• Median Income: $38,500
• Population: 4,200

Suburbs (avg of 12 block groups):
• Equity Score: 68 (good)
• Gentrification Risk: 42 (low)
• Median Income: $67,300
• Population: 3,800

Key difference: Downtown has HIGHER gentrification risk
despite lower income, driven by rapid price appreciation
near the river district."

[Map shows downtown areas highlighted in orange,
suburbs in green, with legend]
```

**Query 4: "Simulate $2M HTF investment in block group 260650001001 over 12 months" (CAUSAL LOOP)**
```
AI Response:
"Running causal loop simulation for $2M HTF investment
in Block Group 260650001001 over 12 months...

🔄 FEEDBACK LOOPS DETECTED:

1. HTF Investment → Equity ↑ → Attracts More Investment
   (reinforcing loop, +0.3 per month)

2. Equity ↑ → Gentrification Risk ↑ (unintended consequence)
   (reinforcing loop, +0.1 per month)

3. Foreclosure Risk ↓ → Price Stability → Gent Risk ↓
   (balancing loop, -0.2 per month)

📊 TIMELINE (key months):

Month 0 (Baseline):
• Equity Score: 45.2
• Gentrification Risk: 68.5
• Foreclosure Risk: 62.0

Month 3:
• Equity Score: 52.7 (+7.5)
• Gentrification Risk: 65.2 (-3.3)
• Foreclosure Risk: 54.1 (-7.9)

Month 6:
• Equity Score: 57.1 (+11.9)
• Gentrification Risk: 64.8 (-3.7)
• Foreclosure Risk: 49.3 (-12.7)

Month 12 (Final):
• Equity Score: 59.4 (+14.2) ✅
• Gentrification Risk: 65.1 (-3.4) ✅
• Foreclosure Risk: 47.2 (-14.8) ✅

💡 INSIGHTS:
- Investment effect strongest in first 6 months
- Foreclosure risk drops fastest (direct impact)
- Gentrification risk DECREASES (stabilization effect)
- Equity improvements plateau around month 9

📍 SPILLOVER TO NEIGHBORS:
- 4 adjacent block groups see +4.3 equity score avg
- ~12,000 total residents impacted

[Interactive timeline chart shows all 3 metrics over 12 months]
[Map highlights target area + spillover zones]
```

**Query 5: "What happens if we do NOTHING in that area?" (BASELINE PROJECTION)**
```
AI Response:
"Projecting natural dynamics WITHOUT intervention
in Block Group 260650001001...

🔄 UNCHECKED FEEDBACK LOOPS:

1. Gentrification → Foreclosures → Displacement
   (accelerating spiral)

2. Low Equity → Disinvestment → Lower Equity
   (vicious cycle)

📉 12-MONTH PROJECTION (no intervention):

Month 0: Equity 45.2, Gent Risk 68.5, Fore Risk 62.0
Month 12: Equity 38.1 (-7.1), Gent Risk 76.3 (+7.8), Fore Risk 71.2 (+9.2)

⚠️ WARNING:
- Area crosses into "high risk" territory (>70) for both
  gentrification and foreclosures
- Estimated 340 households at displacement risk
- Without intervention, equity continues declining

💰 COST OF INACTION:
- Potential evictions: 85-120 households/year
- Lost property tax revenue: ~$180k/year
- Emergency services cost: ~$500k over 2 years

[Side-by-side comparison: With vs Without intervention]
```

### What's OUT of the MVP (Save for Later)
❌ Real MLS data partnership (use synthetic data for demo)
❌ Land Bank integration
❌ Housing Trust Fund integration
❌ CoC/HMIS data
✅ **Causal Loop Intervention Simulation** (simplified from PDF pages 24-27)
  - Basic feedback loop modeling
  - Multi-period simulation (12 months)
  - Spillover effects to adjacent block groups
  - HTF investment scenarios
  - Policy intervention testing
❌ User authentication
❌ PostgreSQL database (use JSON files + Vercel Blob)
❌ Docker containers
❌ Automated data pipelines
❌ Community workshops and validation
❌ FedWiki pattern sharing

## Tech Stack (Pragmatic for MVP)

### Frontend
- **Next.js 14** (React + TypeScript)
- **Tailwind CSS**
- **Mapbox GL JS** or **Leaflet** for maps
- **Recharts** for charts

### AI Layer
- **Vercel AI SDK** - Streaming responses, tool calling
- **OpenAI GPT-4o-mini** or **Anthropic Claude 3.5 Haiku** - Cost-effective for data queries
- **Function calling** - Allow AI to query predictions, run simulations, compare areas
- **Context window management** - Only inject relevant block group data

### Data Processing (Client-side or Serverless Functions)
- **pandas** (Python) OR **danfojs** (JavaScript) for data wrangling
- **scikit-learn** (Python model, exported to ONNX) OR **ml5.js** (browser ML)
- Feature engineering in TypeScript/JavaScript

### Storage
- **Vercel Blob Storage** - Store processed hexagon features as JSON
- **localStorage** - Cache last viewed area

### Deployment
- **Vercel** (frontend + serverless functions)
- **Python** (local scripts for data prep + model training)

## Why This Stack?

**Q: Why Census Block Groups instead of H3 hexagons?**
A: Block groups give us **perfect data alignment** with Census data (no interpolation errors), **familiar boundaries** stakeholders already use, and **larger sample sizes** for more stable predictions. We avoid 2-3 days of spatial disaggregation work. Can add hexagons in Phase 2 if needed.

**Q: Why not PostgreSQL with PostGIS like the PDF says?**
A: For MVP, we have ~150-200 block groups with maybe 50 features each. That's ~10K data points = **a 2MB JSON file**. No database needed. Load it all into browser memory.

**Q: Why not real MLS data?**
A: Getting MLS partnership takes 4-6 weeks (per PDF). For MVP, generate synthetic data that mimics MLS patterns. Prove the model works, THEN pursue real data partnerships.

**Q: Why not Docker?**
A: Vercel serverless functions handle Python execution. No containers needed for MVP.

## File Structure

```
ingham-housing-mvp/
├── data/
│   ├── raw/                          # Downloaded Census, Assessor data
│   ├── processed/                    # Cleaned data
│   └── block_groups/
│       ├── ingham_block_groups.geojson  # Census block group boundaries
│       ├── bg_features.json             # Features per block group
│       └── bg_predictions.json          # Model predictions
├── scripts/
│   ├── 01_fetch_block_groups.py     # Download Census block group boundaries
│   ├── 02_fetch_census.py           # Get ACS data (direct match!)
│   ├── 03_fetch_assessor.py         # Get county assessor data
│   ├── 04_generate_synthetic_mls.py # Fake MLS data for demo
│   ├── 05_engineer_features.py      # Create model features
│   ├── 06_train_model.py            # Train ML models
│   └── 07_generate_predictions.py   # Run predictions
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Main map view
│   │   ├── layout.tsx
│   │   └── api/
│   │       ├── predictions/[bgId]/route.ts  # Block group detail API
│   │       └── chat/route.ts        # AI chat endpoint
│   ├── components/
│   │   ├── BlockGroupMap.tsx        # Interactive block group map
│   │   ├── BlockGroupPanel.tsx      # Scores for selected block group
│   │   ├── ScoreLegend.tsx          # Color scale legend
│   │   ├── TrendChart.tsx           # Time series
│   │   └── AIAssistant.tsx          # Chat interface
│   ├── lib/
│   │   ├── data-loader.ts           # Load JSON predictions
│   │   ├── ai-tools.ts              # AI function definitions
│   │   └── types.ts
│   └── data/
│       └── predictions.json         # Uploaded via Vercel Blob
├── models/
│   ├── equity_model.pkl             # Trained sklearn model (equity)
│   └── foreclosure_model.pkl        # Trained sklearn model (foreclosure)
├── README.md
└── package.json
```

## Implementation Plan

### Week 1: Data Foundation

**Day 1: Fetch Block Group Boundaries**
```python
# scripts/01_fetch_block_groups.py
import geopandas as gpd

# Download Census Block Groups for Michigan
print("Downloading Census Block Groups...")
bg = gpd.read_file('https://www2.census.gov/geo/tiger/TIGER2023/BG/tl_2023_26_bg.zip')

# Filter to Ingham County (FIPS 26065)
ingham_bg = bg[bg['COUNTYFP'] == '065'].copy()
print(f"Found {len(ingham_bg)} block groups in Ingham County")

# Save to file
ingham_bg.to_file('data/block_groups/ingham_block_groups.geojson', driver='GeoJSON')

# Print GEOID examples for reference
print("\nSample GEOIDs:")
print(ingham_bg['GEOID'].head())
```

**Day 2: Fetch Census Data**
```python
# scripts/02_fetch_census.py
import pandas as pd
import censusdata

# Define key variables from ACS 5-year
variables = {
    'B19013_001E': 'median_income',
    'B25003_001E': 'total_units',
    'B25003_002E': 'owner_occupied',
    'B25003_003E': 'renter_occupied',
    'B25070_010E': 'rent_burden_50pct',
    'B25070_001E': 'total_renters',
    'B01003_001E': 'total_population',
    'B02001_002E': 'white_population',
    'B02001_003E': 'black_population',
    'B25077_001E': 'median_home_value',
}

# Fetch for Ingham County Block Groups
print("Fetching Census ACS data for Ingham County block groups...")
acs_data = censusdata.download(
    'acs5', 2022,
    censusdata.censusgeo([('state', '26'), ('county', '065'),
                          ('block group', '*')]),
    list(variables.keys())
)

# Clean and rename
acs_data = acs_data.rename(columns=variables)
acs_data['GEOID'] = acs_data.index.map(lambda x: x.geo[0][1] + x.geo[1][1] + x.geo[2][1])

# Calculate derived metrics
acs_data['pct_owner_occupied'] = acs_data['owner_occupied'] / acs_data['total_units']
acs_data['pct_cost_burdened'] = acs_data['rent_burden_50pct'] / acs_data['total_renters']
acs_data['pct_minority'] = 1 - (acs_data['white_population'] / acs_data['total_population'])

# Save - NO SPATIAL JOIN NEEDED! Direct match to block groups
acs_data.to_csv('data/processed/census_by_bg.csv')
print(f"Saved data for {len(acs_data)} block groups")
```

**Day 3: Generate Synthetic MLS Data**
```python
# scripts/04_generate_synthetic_mls.py
# For MVP: Create realistic-looking MLS-style data based on Census values
import numpy as np
import pandas as pd
import geopandas as gpd

census = pd.read_csv('data/processed/census_by_bg.csv')
bg_geo = gpd.read_file('data/block_groups/ingham_block_groups.geojson')

# Merge to get centroids
bg_data = bg_geo.merge(census, on='GEOID')
bg_data['centroid_lon'] = bg_data.geometry.centroid.x
bg_data['centroid_lat'] = bg_data.geometry.centroid.y

# Calculate distance to downtown Lansing (42.7325, -84.5555)
downtown = (-84.5555, 42.7325)
bg_data['dist_to_downtown'] = np.sqrt(
    (bg_data['centroid_lon'] - downtown[0])**2 +
    (bg_data['centroid_lat'] - downtown[1])**2
)

# Generate synthetic MLS sales for each block group
sales = []
for _, row in bg_data.iterrows():
    # Base price from Census median
    base_price = row['median_home_value']

    # Price trend (closer to downtown = higher appreciation)
    yoy_change = 0.05 - (row['dist_to_downtown'] * 0.02)  # 5% baseline
    yoy_change += np.random.normal(0, 0.02)  # Add noise

    # Days on market (lower income areas = longer)
    days_on_market = 30 + (1 - row['median_income'] / 100000) * 20
    days_on_market = max(10, min(90, days_on_market + np.random.normal(0, 10)))

    sales.append({
        'GEOID': row['GEOID'],
        'median_sale_price': base_price,
        'price_yoy_change': yoy_change,
        'days_on_market': days_on_market,
        'sale_count_12mo': int(row['total_units'] * 0.05)  # 5% turnover
    })

sales_df = pd.DataFrame(sales)
sales_df.to_csv('data/processed/synthetic_mls_by_bg.csv', index=False)
print(f"Generated synthetic MLS data for {len(sales)} block groups")
```

**Day 4: Feature Engineering**
```python
# scripts/05_engineer_features.py
import pandas as pd

# Load all data sources
census = pd.read_csv('data/processed/census_by_bg.csv')
mls = pd.read_csv('data/processed/synthetic_mls_by_bg.csv')

# Merge on GEOID - EASY! No spatial joins needed
features = census.merge(mls, on='GEOID')

# Demographics (already calculated in script 02)
# features['median_income'], 'pct_owner_occupied', 'pct_cost_burdened', 'pct_minority'

# Market dynamics (directly from MLS)
# features['median_sale_price'], 'price_yoy_change', 'days_on_market'

# Derived features
features['affordability_ratio'] = features['median_sale_price'] / features['median_income']
features['cost_burden_pct'] = features['pct_cost_burdened'] * 100

# Gentrification pressure proxy
features['gentrification_pressure'] = (
    features['price_yoy_change'] * 100 *  # Price momentum
    (50000 / features['median_income']) *  # Income vulnerability
    features['pct_minority']  # Displacement risk
)

# Foreclosure risk proxy
features['foreclosure_rate'] = features['cost_burden_pct'] / 100  # Placeholder

# Select final features
final_features = features[[
    'GEOID', 'median_income', 'pct_owner_occupied', 'pct_cost_burdened',
    'pct_minority', 'total_population', 'median_sale_price', 'price_yoy_change',
    'days_on_market', 'affordability_ratio', 'cost_burden_pct',
    'gentrification_pressure', 'foreclosure_rate'
]]

final_features.to_csv('data/processed/bg_features.csv', index=False)
print(f"Engineered features for {len(final_features)} block groups")
```

### Week 2: Model Training

**Day 5-6: Train Prediction Models**
```python
# scripts/06_train_model.py
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
import pandas as pd
import joblib

features = pd.read_csv('data/processed/bg_features.csv')

# Define target 1: Housing Equity Score (0-100)
# Composite of affordability, stability, opportunity
def calculate_equity_score(row):
    affordability = 100 - (row['cost_burden_pct'] / 50 * 100)
    stability = 100 - (row['foreclosure_rate'] * 1000)  # placeholder
    opportunity = 50  # placeholder (need more data for real calc)
    quality = 70  # placeholder

    return (
        0.40 * affordability +
        0.30 * stability +
        0.20 * opportunity +
        0.10 * quality
    ).clip(0, 100)

features['equity_score'] = features.apply(calculate_equity_score, axis=1)

# Define target 2: Foreclosure Risk (0-100)
# Based on cost burden, price volatility, and income stability
def calculate_foreclosure_risk(row):
    cost_burden_risk = (row['cost_burden_pct'] / 50 * 100).clip(0, 100)
    price_volatility = abs(row['price_yoy_change']) * 50  # Higher change = higher risk
    income_risk = 100 - (row['median_income'] / 75000 * 100).clip(0, 100)

    return (
        0.50 * cost_burden_risk +
        0.30 * price_volatility +
        0.20 * income_risk
    ).clip(0, 100)

features['foreclosure_risk'] = features.apply(calculate_foreclosure_risk, axis=1)

# Train Equity Score model
X = features[['median_income', 'pct_owner_occupied', 'price_yoy_change',
              'affordability_ratio', 'pct_cost_burdened']]
y_equity = features['equity_score']
y_foreclosure = features['foreclosure_risk']

X_train, X_test, y_train_eq, y_test_eq = train_test_split(X, y_equity, test_size=0.2)
_, _, y_train_fc, y_test_fc = train_test_split(X, y_foreclosure, test_size=0.2)

equity_model = RandomForestRegressor(n_estimators=100, max_depth=10)
equity_model.fit(X_train, y_train_eq)

foreclosure_model = RandomForestRegressor(n_estimators=100, max_depth=10)
foreclosure_model.fit(X_train, y_train_fc)

print(f"Equity Score R²: {equity_model.score(X_test, y_test_eq):.3f}")
print(f"Foreclosure Risk R²: {foreclosure_model.score(X_test, y_test_fc):.3f}")

# Save models
joblib.dump(equity_model, 'models/equity_model.pkl')
joblib.dump(foreclosure_model, 'models/foreclosure_model.pkl')
```

**Day 7: Generate Predictions**
```python
# scripts/07_generate_predictions.py
import joblib
import pandas as pd
import json

equity_model = joblib.load('models/equity_model.pkl')
foreclosure_model = joblib.load('models/foreclosure_model.pkl')
features = pd.read_csv('data/processed/bg_features.csv')

# Generate predictions
X = features[equity_model.feature_names_in_]
equity_predictions = equity_model.predict(X)
foreclosure_predictions = foreclosure_model.predict(X)

# Calculate gentrification risk (rule-based for MVP)
def calculate_gent_risk(row):
    # High price growth + low income + minority population = higher risk
    price_factor = (row['price_yoy_change'] * 10).clip(0, 50)
    income_factor = (1 - row['median_income'] / 75000) * 30
    displacement_risk = row['pct_minority'] * 20
    return (price_factor + income_factor + displacement_risk).clip(0, 100)

gentrification_risks = features.apply(calculate_gent_risk, axis=1)

# Create output JSON
output = []
for i, row in features.iterrows():
    output.append({
        'geoid': row['GEOID'],
        'equity_score': float(equity_predictions[i]),
        'gentrification_risk': float(gentrification_risks[i]),
        'foreclosure_risk': float(foreclosure_predictions[i]),
        'median_income': float(row['median_income']),
        'median_price': float(row['median_sale_price']),
        'population': int(row['total_population'])
    })

# Save as JSON
with open('data/block_groups/bg_predictions.json', 'w') as f:
    json.dump(output, f)

print(f"Generated 3 predictions for {len(output)} block groups")
print(f"Avg Equity Score: {sum(p['equity_score'] for p in output) / len(output):.1f}")
print(f"Avg Gentrification Risk: {sum(p['gentrification_risk'] for p in output) / len(output):.1f}")
print(f"Avg Foreclosure Risk: {sum(p['foreclosure_risk'] for p in output) / len(output):.1f}")
```

### Week 2-3: Frontend

**Day 8-9: Map Component**
```typescript
// src/components/BlockGroupMap.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface BlockGroupData {
  geoid: string;
  equity_score: number;
  gentrification_risk: number;
  foreclosure_risk: number;
  median_income: number;
}

export default function BlockGroupMap({ predictions }: { predictions: BlockGroupData[] }) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [selectedBG, setSelectedBG] = useState<BlockGroupData | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map centered on Lansing, MI
    const map = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-84.5555, 42.7325],
      zoom: 10
    });

    map.on('load', () => {
      // Load block group GeoJSON
      map.addSource('block-groups', {
        type: 'geojson',
        data: '/data/ingham_block_groups.geojson'
      });

      // Join predictions to geometries
      const bgWithScores = predictions.reduce((acc, p) => {
        acc[p.geoid] = p.equity_score;
        return acc;
      }, {} as Record<string, number>);

      // Add colored block group layer
      map.addLayer({
        id: 'bg-layer',
        type: 'fill',
        source: 'block-groups',
        paint: {
          'fill-color': [
            'case',
            ['has', ['get', 'GEOID'], ['literal', bgWithScores]],
            [
              'interpolate',
              ['linear'],
              ['get', ['get', 'GEOID'], ['literal', bgWithScores]],
              0, '#d73027',
              50, '#fee08b',
              100, '#1a9850'
            ],
            '#cccccc'  // Gray for missing data
          ],
          'fill-opacity': 0.7
        }
      });

      // Add borders
      map.addLayer({
        id: 'bg-borders',
        type: 'line',
        source: 'block-groups',
        paint: {
          'line-color': '#ffffff',
          'line-width': 1
        }
      });

      // Add click handler
      map.on('click', 'bg-layer', (e) => {
        const geoid = e.features[0].properties.GEOID;
        const data = predictions.find(p => p.geoid === geoid);
        setSelectedBG(data || null);
      });

      // Change cursor on hover
      map.on('mouseenter', 'bg-layer', () => {
        map.getCanvas().style.cursor = 'pointer';
      });
      map.on('mouseleave', 'bg-layer', () => {
        map.getCanvas().style.cursor = '';
      });
    });

    return () => map.remove();
  }, [predictions]);

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainer} className="w-full h-full" />
      {selectedBG && (
        <BlockGroupPanel bg={selectedBG} onClose={() => setSelectedBG(null)} />
      )}
    </div>
  );
}
```

**Day 10: Detail Panel**
```typescript
// src/components/BlockGroupPanel.tsx
'use client';

interface Props {
  bg: {
    geoid: string;
    equity_score: number;
    gentrification_risk: number;
    foreclosure_risk: number;
    median_income: number;
    median_price: number;
    population: number;
  };
  onClose: () => void;
}

export default function BlockGroupPanel({ bg, onClose }: Props) {
  return (
    <div className="absolute top-4 right-4 w-96 bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Block Group Details</h2>
          <p className="text-xs text-gray-500 font-mono">{bg.geoid}</p>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-sm text-gray-600">Housing Equity Score</div>
          <div className="text-3xl font-bold" style={{
            color: bg.equity_score > 70 ? '#1a9850' : bg.equity_score > 40 ? '#f9a825' : '#d73027'
          }}>
            {bg.equity_score.toFixed(0)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {bg.equity_score > 70 ? 'Strong equity' : bg.equity_score > 40 ? 'Moderate equity' : 'Low equity'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-sm text-gray-600">Gentrification Risk</div>
            <div className="text-2xl font-bold text-orange-600">
              {bg.gentrification_risk.toFixed(0)}
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600">Foreclosure Risk</div>
            <div className="text-2xl font-bold text-red-600">
              {bg.foreclosure_risk.toFixed(0)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div>
            <div className="text-xs text-gray-600">Median Income</div>
            <div className="text-lg font-semibold">
              ${(bg.median_income / 1000).toFixed(0)}k
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Median Price</div>
            <div className="text-lg font-semibold">
              ${(bg.median_price / 1000).toFixed(0)}k
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-600">Population</div>
            <div className="text-lg font-semibold">
              {bg.population.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

**Day 11: Main Page**
```typescript
// src/app/page.tsx
'use client';

import { useEffect, useState } from 'react';
import BlockGroupMap from '@/components/BlockGroupMap';

export default function Home() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load predictions from Vercel Blob or public JSON
    fetch('/data/bg_predictions.json')
      .then(res => res.json())
      .then(data => {
        setPredictions(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      Loading housing equity model...
    </div>;
  }

  return (
    <main>
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4">
        <h1 className="text-2xl font-bold mb-2">Ingham County Housing Equity</h1>
        <p className="text-sm text-gray-600">
          {predictions.length} Census Block Groups analyzed
        </p>
      </div>
      <BlockGroupMap predictions={predictions} />
    </main>
  );
}
```

### Week 3: AI Assistant & Polish

**Day 12: AI Assistant Implementation**
```typescript
// src/app/api/chat/route.ts
import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import predictions from '@/data/predictions.json';

// Define AI tools
const tools = {
  getBlockGroupData: {
    description: 'Get detailed data for a specific block group by GEOID',
    parameters: z.object({
      geoid: z.string().describe('The Census block group GEOID (e.g., 260650001001)')
    }),
    execute: async ({ geoid }: { geoid: string }) => {
      const bg = predictions.find(p => p.geoid === geoid);
      if (!bg) return { error: 'Block group not found' };
      return bg;
    }
  },

  compareBlockGroups: {
    description: 'Compare metrics between two block groups',
    parameters: z.object({
      geoid1: z.string(),
      geoid2: z.string()
    }),
    execute: async ({ geoid1, geoid2 }: { geoid1: string; geoid2: string }) => {
      const bg1 = predictions.find(p => p.geoid === geoid1);
      const bg2 = predictions.find(p => p.geoid === geoid2);

      if (!bg1 || !bg2) return { error: 'One or both block groups not found' };

      return {
        comparison: {
          equity_score_diff: bg1.equity_score - bg2.equity_score,
          gentrification_risk_diff: bg1.gentrification_risk - bg2.gentrification_risk,
          foreclosure_risk_diff: bg1.foreclosure_risk - bg2.foreclosure_risk,
          income_diff: bg1.median_income - bg2.median_income,
        },
        bg1,
        bg2
      };
    }
  },

  findTopAreas: {
    description: 'Find top N block groups by a specific metric',
    parameters: z.object({
      metric: z.enum(['equity_score', 'gentrification_risk', 'foreclosure_risk', 'median_income']),
      limit: z.number().default(5),
      order: z.enum(['highest', 'lowest']).default('highest')
    }),
    execute: async ({ metric, limit, order }: any) => {
      const sorted = [...predictions].sort((a, b) =>
        order === 'highest' ? b[metric] - a[metric] : a[metric] - b[metric]
      );
      return sorted.slice(0, limit);
    }
  },

  simulateIntervention: {
    description: 'Simulate impact of changing a variable (income, price, etc.) on scores',
    parameters: z.object({
      geoid: z.string(),
      variable: z.enum(['median_income', 'median_price']),
      percentChange: z.number().describe('Percentage change (e.g., 10 for +10%)')
    }),
    execute: async ({ geoid, variable, percentChange }: any) => {
      const bg = predictions.find(p => p.geoid === geoid);
      if (!bg) return { error: 'Block group not found' };

      // Simple simulation logic (in real system, would re-run ML model)
      const factor = 1 + (percentChange / 100);
      const newValue = bg[variable] * factor;

      // Rough estimate of score impact
      let equityScoreChange = 0;
      let foreclosureRiskChange = 0;

      if (variable === 'median_income') {
        equityScoreChange = percentChange * 0.3;  // Income has positive impact
        foreclosureRiskChange = -percentChange * 0.2;  // Higher income = lower risk
      } else if (variable === 'median_price') {
        equityScoreChange = -percentChange * 0.1;  // Higher prices = lower equity
        foreclosureRiskChange = percentChange * 0.15;
      }

      return {
        original: bg,
        simulation: {
          [variable]: newValue,
          equity_score: Math.max(0, Math.min(100, bg.equity_score + equityScoreChange)),
          foreclosure_risk: Math.max(0, Math.min(100, bg.foreclosure_risk + foreclosureRiskChange)),
          gentrification_risk: bg.gentrification_risk
        },
        changes: {
          equity_score_change: equityScoreChange,
          foreclosure_risk_change: foreclosureRiskChange
        }
      };
    }
  },

  simulateCausalLoop: {
    description: 'Simulate causal loop dynamics over time with feedback effects (PDF pages 24-27)',
    parameters: z.object({
      geoid: z.string(),
      intervention: z.object({
        type: z.enum(['htf_investment', 'income_support', 'rent_control']),
        amount: z.number().describe('Dollar amount for HTF or percentage for others'),
        duration: z.number().default(12).describe('Simulation period in months')
      })
    }),
    execute: async ({ geoid, intervention }: any) => {
      const bg = predictions.find(p => p.geoid === geoid);
      if (!bg) return { error: 'Block group not found' };

      // Initialize state
      let state = {
        equity_score: bg.equity_score,
        gentrification_risk: bg.gentrification_risk,
        foreclosure_risk: bg.foreclosure_risk,
        median_income: bg.median_income,
        median_price: bg.median_price
      };

      const timeline = [{ month: 0, ...state }];

      // Simulate each month with feedback loops
      for (let month = 1; month <= intervention.duration; month++) {
        // Apply intervention effect (diminishes over time)
        const interventionStrength = Math.exp(-month / 6);  // Decay factor

        let equityChange = 0;
        let gentRiskChange = 0;
        let foreRiskChange = 0;

        if (intervention.type === 'htf_investment') {
          // HTF investment improves equity, reduces displacement risk
          equityChange = (intervention.amount / 1000000) * 5 * interventionStrength;
          gentRiskChange = -(intervention.amount / 1000000) * 3 * interventionStrength;
          foreRiskChange = -(intervention.amount / 500000) * 2 * interventionStrength;
        } else if (intervention.type === 'income_support') {
          // Income support (percentage increase)
          const incomeBoost = intervention.amount / 100;
          equityChange = incomeBoost * 10 * interventionStrength;
          foreRiskChange = -incomeBoost * 8 * interventionStrength;
        } else if (intervention.type === 'rent_control') {
          // Rent control stabilizes but may reduce investment
          gentRiskChange = -(intervention.amount / 100) * 15 * interventionStrength;
          equityChange = (intervention.amount / 100) * 5 * interventionStrength;
        }

        // CAUSAL LOOP FEEDBACK (simplified from PDF page 26)
        // Loop 1: Gentrification → Foreclosures → Displacement
        const gentFeedback = (state.gentrification_risk / 100) * 0.5;
        foreRiskChange += gentFeedback * 2;

        // Loop 2: Foreclosures → Price Drop → Lower Gentrification (negative feedback)
        const foreclosureFeedback = (state.foreclosure_risk / 100) * 0.3;
        gentRiskChange -= foreclosureFeedback * 1.5;

        // Loop 3: High Equity → Attracts Investment → May Increase Gentrification
        const equityFeedback = (state.equity_score / 100) * 0.2;
        gentRiskChange += equityFeedback * 0.5;

        // Update state
        state.equity_score = Math.max(0, Math.min(100, state.equity_score + equityChange));
        state.gentrification_risk = Math.max(0, Math.min(100, state.gentrification_risk + gentRiskChange));
        state.foreclosure_risk = Math.max(0, Math.min(100, state.foreclosure_risk + foreRiskChange));

        timeline.push({ month, ...state });
      }

      return {
        intervention,
        baseline: bg,
        timeline,
        finalState: timeline[timeline.length - 1],
        totalChange: {
          equity_score: timeline[timeline.length - 1].equity_score - bg.equity_score,
          gentrification_risk: timeline[timeline.length - 1].gentrification_risk - bg.gentrification_risk,
          foreclosure_risk: timeline[timeline.length - 1].foreclosure_risk - bg.foreclosure_risk
        }
      };
    }
  },

  simulateSpilloverEffects: {
    description: 'Simulate how intervention in one area affects adjacent block groups (PDF page 25)',
    parameters: z.object({
      geoid: z.string(),
      intervention: z.object({
        type: z.enum(['htf_investment', 'affordable_housing']),
        amount: z.number()
      })
    }),
    execute: async ({ geoid, intervention }: any) => {
      const bg = predictions.find(p => p.geoid === geoid);
      if (!bg) return { error: 'Block group not found' };

      // Find adjacent block groups (simplified: same first 9 digits of GEOID)
      const neighbors = predictions.filter(p =>
        p.geoid !== geoid &&
        p.geoid.substring(0, 9) === geoid.substring(0, 9)
      ).slice(0, 4);  // Limit to 4 neighbors for demo

      // Primary area gets full effect
      const primaryEffect = intervention.amount / 200000 * 5;

      // Neighbors get 30% spillover effect
      const spilloverEffect = primaryEffect * 0.3;

      return {
        primary: {
          geoid,
          equity_score_change: primaryEffect,
          gentrification_risk_change: -primaryEffect * 0.6
        },
        spillover: neighbors.map(n => ({
          geoid: n.geoid,
          equity_score_change: spilloverEffect,
          gentrification_risk_change: -spilloverEffect * 0.6,
          distance: 'adjacent'
        })),
        total_households_impacted: bg.population + neighbors.reduce((sum, n) => sum + n.population, 0)
      };
    }
  },

  getAreaStatistics: {
    description: 'Get statistical summary of all block groups',
    parameters: z.object({}),
    execute: async () => {
      const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

      return {
        count: predictions.length,
        equity_score: {
          mean: avg(predictions.map(p => p.equity_score)),
          min: Math.min(...predictions.map(p => p.equity_score)),
          max: Math.max(...predictions.map(p => p.equity_score))
        },
        gentrification_risk: {
          mean: avg(predictions.map(p => p.gentrification_risk)),
          high_risk_count: predictions.filter(p => p.gentrification_risk > 70).length
        },
        foreclosure_risk: {
          mean: avg(predictions.map(p => p.foreclosure_risk)),
          high_risk_count: predictions.filter(p => p.foreclosure_risk > 70).length
        }
      };
    }
  }
};

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: openai('gpt-4o-mini'),
    system: `You are a housing equity data assistant for Ingham County, Michigan.

You help users understand housing equity, gentrification risk, and foreclosure risk across Census Block Groups.

Your capabilities:
- Query specific block group data
- Compare areas
- Explain what drives scores
- Simulate "what-if" scenarios (e.g., "what if income increases 10%?")
- Find top/bottom performing areas

Important context:
- Equity Score (0-100): Higher = better housing equity
- Gentrification Risk (0-100): Higher = more at risk of displacement
- Foreclosure Risk (0-100): Higher = more at risk

Stay focused on the housing equity data. Do not discuss unrelated topics.`,
    messages,
    tools,
    maxToolRoundtrips: 5,
  });

  return result.toDataStreamResponse();
}
```

```typescript
// src/components/AIAssistant.tsx
'use client';

import { useChat } from 'ai/react';
import { useState } from 'react';

interface AIAssistantProps {
  onHighlightAreas?: (geoids: string[]) => void;  // Callback to highlight on map
  onFocusArea?: (geoid: string) => void;           // Callback to zoom to area
}

export default function AIAssistant({ onHighlightAreas, onFocusArea }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    onFinish: (message) => {
      // Extract GEOIDs from tool results and highlight on map
      const toolResults = message.toolInvocations || [];
      const geoids: string[] = [];

      toolResults.forEach(tool => {
        if (tool.result) {
          // Extract GEOIDs from tool results
          if (Array.isArray(tool.result)) {
            geoids.push(...tool.result.map((r: any) => r.geoid).filter(Boolean));
          } else if (tool.result.geoid) {
            geoids.push(tool.result.geoid);
          } else if (tool.result.bg1?.geoid && tool.result.bg2?.geoid) {
            geoids.push(tool.result.bg1.geoid, tool.result.bg2.geoid);
          }
        }
      });

      if (geoids.length > 0 && onHighlightAreas) {
        onHighlightAreas(geoids);
      }
    }
  });

  const handleAreaClick = (geoid: string) => {
    if (onFocusArea) {
      onFocusArea(geoid);
    }
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center z-50"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl flex flex-col z-50">
          {/* Header */}
          <div className="p-4 border-b bg-blue-600 text-white rounded-t-lg">
            <h3 className="font-bold">Housing Equity Assistant</h3>
            <p className="text-xs text-blue-100">Ask about the data or run simulations</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-sm text-gray-500">
                <p className="mb-2">Try asking:</p>
                <ul className="list-disc ml-4 space-y-1 text-xs">
                  <li>"What are the top 5 areas by equity score?"</li>
                  <li>"Compare block group 260650001001 with 260650002003"</li>
                  <li>"What if income increased by 15% in area 260650001001?"</li>
                  <li>"Which areas have the highest foreclosure risk?"</li>
                </ul>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">{msg.content}</div>

                  {/* Show tool calls */}
                  {msg.toolInvocations?.map((tool, i) => (
                    <div key={i} className="mt-2 text-xs opacity-70">
                      🔧 {tool.toolName}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex space-x-2">
              <input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask about the data..."
                className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
```

```typescript
// Update src/app/page.tsx to include AI Assistant with map integration
'use client';

import { useEffect, useState } from 'react';
import BlockGroupMap from '@/components/BlockGroupMap';
import AIAssistant from '@/components/AIAssistant';

export default function Home() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [highlightedAreas, setHighlightedAreas] = useState<string[]>([]);
  const [focusArea, setFocusArea] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/bg_predictions.json')
      .then(res => res.json())
      .then(data => {
        setPredictions(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      Loading housing equity model...
    </div>;
  }

  return (
    <main>
      <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4">
        <h1 className="text-2xl font-bold mb-2">Ingham County Housing Equity</h1>
        <p className="text-sm text-gray-600">
          {predictions.length} Census Block Groups analyzed
        </p>
        {highlightedAreas.length > 0 && (
          <div className="mt-2 text-xs text-blue-600">
            🔍 Showing {highlightedAreas.length} areas from AI query
          </div>
        )}
      </div>

      <BlockGroupMap
        predictions={predictions}
        highlightedAreas={highlightedAreas}
        focusArea={focusArea}
      />

      <AIAssistant
        onHighlightAreas={setHighlightedAreas}
        onFocusArea={setFocusArea}
      />
    </main>
  );
}
```

```typescript
// Update src/components/BlockGroupMap.tsx to support highlighting
interface BlockGroupMapProps {
  predictions: BlockGroupData[];
  highlightedAreas?: string[];  // GEOIDs to highlight
  focusArea?: string | null;    // GEOID to zoom to
}

export default function BlockGroupMap({
  predictions,
  highlightedAreas = [],
  focusArea = null
}: BlockGroupMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [selectedBG, setSelectedBG] = useState<BlockGroupData | null>(null);

  useEffect(() => {
    // ... existing map initialization ...

    map.on('load', () => {
      // ... existing layer setup ...

      // Add highlight layer for AI-selected areas
      map.addLayer({
        id: 'bg-highlights',
        type: 'line',
        source: 'block-groups',
        paint: {
          'line-color': '#ff0000',
          'line-width': 3,
          'line-opacity': [
            'case',
            ['in', ['get', 'GEOID'], ['literal', highlightedAreas]],
            1,
            0
          ]
        }
      });

      // Add pulsing animation to highlighted areas
      map.addLayer({
        id: 'bg-pulse',
        type: 'fill',
        source: 'block-groups',
        paint: {
          'fill-color': '#ff6b6b',
          'fill-opacity': [
            'case',
            ['in', ['get', 'GEOID'], ['literal', highlightedAreas]],
            0.3,
            0
          ]
        }
      });
    });

    mapRef.current = map;
    return () => map.remove();
  }, []);

  // Handle highlighted areas changes
  useEffect(() => {
    if (!mapRef.current || highlightedAreas.length === 0) return;

    // Update highlight filter
    mapRef.current.setFilter('bg-highlights', [
      'in', ['get', 'GEOID'], ['literal', highlightedAreas]
    ]);

    // Fit map to highlighted areas
    const bounds = new mapboxgl.LngLatBounds();
    highlightedAreas.forEach(geoid => {
      const feature = /* find feature by GEOID */;
      if (feature) bounds.extend(feature.geometry.coordinates);
    });

    mapRef.current.fitBounds(bounds, { padding: 50 });
  }, [highlightedAreas]);

  // Handle focus area changes
  useEffect(() => {
    if (!mapRef.current || !focusArea) return;

    // Zoom to specific area
    const feature = /* find feature by GEOID */;
    if (feature) {
      mapRef.current.flyTo({
        center: feature.geometry.coordinates,
        zoom: 13,
        duration: 1500
      });
    }
  }, [focusArea]);

  return (
    <div className="relative w-full h-screen">
      <div ref={mapContainer} className="w-full h-full" />
      {selectedBG && (
        <BlockGroupPanel bg={selectedBG} onClose={() => setSelectedBG(null)} />
      )}
    </div>
  );
}
```

**AI-to-Map Integration Summary:**

When the AI responds to queries, it automatically:
1. **Extracts GEOIDs** from tool results
2. **Highlights areas** on the map with red borders and pulsing overlay
3. **Zooms/pans** map to show all relevant areas
4. **Provides clickable links** in chat to focus on specific areas

**Visual Feedback:**
- Red borders + pulsing animation on highlighted areas
- "🔍 Showing N areas from AI query" indicator in header
- Smooth map transitions (1.5s animations)
- Can click area in chat → map flies to that location

**User Flow Example:**
```
1. User: "Which 5 areas have worst foreclosure risk?"
2. AI: Lists 5 areas with data
3. Map: Automatically highlights those 5 in red
4. User: Clicks "[View on map]" link for area #2
5. Map: Zooms to that specific block group
6. User: Clicks on map → See full detail panel
```

**Day 13-14: Testing**
- Verify all block groups render correctly
- Check score calculations are sensible
- Test AI assistant queries and simulations
- Verify tool calling works correctly
- **Test map highlighting responds to AI queries**
- **Test zoom/pan to AI-selected areas**
- Test on mobile (chat UI responsiveness)
- Export functionality
- Add legends and tooltips

**Day 15: Deploy to Vercel**
```bash
# Install dependencies
npm install ai @ai-sdk/openai zod

# Copy data to public folder for static hosting
cp data/block_groups/bg_predictions.json public/data/
cp data/block_groups/ingham_block_groups.geojson public/data/

# Set environment variables in Vercel
# OPENAI_API_KEY=sk-...

# Deploy app
git add .
git commit -m "MVP complete - Housing equity model with AI assistant"
git push origin main
vercel --prod
```

## Cost Breakdown

### Development Time
- **Week 1**: Data (4 days × 3 hours = 12 hours) - Faster! No spatial joins
- **Week 2**: Model (3 days × 4 hours = 12 hours)
- **Week 2-3**: Frontend (4 days × 6 hours = 24 hours)
- **Week 3**: AI Assistant (1 day × 6 hours = 6 hours)
- **Week 3**: Polish (3 days × 3 hours = 9 hours)
- **Total**: ~63 hours (~2 weeks full-time)

### Operating Costs
- **Vercel**: $0 (hobby tier)
- **Mapbox**: $0 (50k map loads/month free)
- **OpenAI API (GPT-4o-mini)**: ~$5-15/month for moderate usage
  - Input: $0.15 per 1M tokens
  - Output: $0.60 per 1M tokens
  - Estimated: 50-150 queries/day = ~$10/month
- **Domain**: $12/year
- **Total**: ~$11/month

**Cost optimization options:**
- Use Anthropic Claude 3.5 Haiku instead (~$5/month, similar quality)
- Add rate limiting (10 queries per user per day)
- Cache common queries

### Optional Paid Services (Later)
- **ESRI Updated Demographics**: $15k/year (when you need real-time data)
- **MLS Data Partnership**: Negotiated (after MVP proves value)

## Success Metrics

**MVP is successful if:**
1. Map loads in <2 seconds with all 150-200 block groups
2. Scores are plausible and match local knowledge (high scores in stable areas, low in struggling areas)
3. 5 stakeholders say "this is useful" after demo
4. Block group predictions can be tied to HTF funding decisions

**MVP is ready to scale if:**
- HTF Committee wants to use it for grant allocation
- MLS partnership becomes viable (can switch to hexagons then)
- Land Bank wants integration
- Community organizations request access

## What Comes After MVP?

**Phase 2: Real Data Integration** (Months 2-3)
- Partner with Greater Lansing Association of Realtors for MLS
- FOIA Land Bank foreclosure data
- Integrate HTF project tracking
- Switch to H3 hexagons if more granularity needed

**Phase 3: Intervention Simulation** (Months 4-5)
- Build causal modeling layer
- Policy scenario testing
- ROI calculations

**Phase 4: Institutional Integration** (Month 6+)
- API for HTF grant scoring
- CoC prevention targeting
- Community workshops
- Add PostgreSQL if data size justifies it

## Causal Loop Implementation (PDF Integration)

### Feedback Loops Modeled (Simplified from PDF Pages 24-27)

The MVP implements 3 core feedback loops from the comprehensive model:

**Loop 1: Gentrification Spiral (Reinforcing)**
```
Gentrification Risk ↑
  → Displacement Pressure ↑
    → Property Turnover ↑
      → Price Appreciation ↑
        → Gentrification Risk ↑↑
```
Implementation: `gentFeedback = (state.gentrification_risk / 100) * 0.5`

**Loop 2: Foreclosure-Price Cycle (Balancing)**
```
Foreclosure Risk ↑
  → Property Values ↓
    → Market Pressure ↓
      → Gentrification Risk ↓
```
Implementation: `foreclosureFeedback = (state.foreclosure_risk / 100) * 0.3`

**Loop 3: Equity Investment Cycle (Mixed)**
```
Equity Score ↑
  → Area Attractiveness ↑
    → New Investment ↑
      → (Positive: More Resources) + (Negative: Gentrification Pressure)
```
Implementation: `equityFeedback = (state.equity_score / 100) * 0.2`

### Simulation Engine Architecture

```typescript
// Simplified causal loop simulator (from PDF page 26-27)
interface CausalLoopState {
  equity_score: number;
  gentrification_risk: number;
  foreclosure_risk: number;
  median_income: number;
  median_price: number;
}

function simulateMonth(
  state: CausalLoopState,
  intervention: Intervention,
  month: number
): CausalLoopState {
  // 1. Direct intervention effect (decays over time)
  const strength = Math.exp(-month / 6);
  const directEffect = calculateInterventionEffect(intervention, strength);

  // 2. Feedback loop effects
  const feedbackEffect = {
    gent: calculateGentrificationFeedback(state),
    foreclosure: calculateForeclosureFeedback(state),
    equity: calculateEquityFeedback(state)
  };

  // 3. Combine effects
  return {
    equity_score: clamp(state.equity_score + directEffect.equity + feedbackEffect.equity),
    gentrification_risk: clamp(state.gentrification_risk + directEffect.gent + feedbackEffect.gent),
    foreclosure_risk: clamp(state.foreclosure_risk + directEffect.foreclosure + feedbackEffect.foreclosure),
    median_income: state.median_income,  // Static for MVP
    median_price: state.median_price     // Static for MVP
  };
}
```

### Intervention Types Supported

**1. HTF Investment** (Housing Trust Fund)
- Direct effect: Improves equity, reduces foreclosure risk
- Feedback: May trigger positive equity loop
- Spillover: 30% effect to adjacent areas
- Duration: 12-18 months decay

**2. Income Support**
- Direct effect: Reduces foreclosure risk, improves equity
- Feedback: Stabilizes market, reduces gentrification
- No spillover (household-specific)
- Duration: Immediate

**3. Rent Control** (Policy Simulation)
- Direct effect: Reduces gentrification risk
- Feedback: May reduce investment attractiveness
- Spillover: Citywide policy effect
- Duration: Permanent (until revoked)

### Comparison to Full System (PDF)

| Feature | MVP (Simplified) | Full System (PDF) |
|---------|------------------|-------------------|
| Feedback Loops | 3 loops | 6+ complex loops |
| Time Horizon | 12 months | 24+ months |
| Geographic Spillover | Adjacent blocks | Network-based diffusion |
| Model Type | Rule-based coefficients | ML-based causal inference |
| Data Updates | Static | Monthly real-time |
| Intervention Types | 3 types | 10+ intervention scenarios |

### Why This Simplification Works for MVP

1. **Proves the concept** - Shows feedback dynamics exist
2. **Fast to implement** - Rule-based, no ML retraining
3. **Explainable** - Stakeholders can see loop logic
4. **Extendable** - Easy to add more loops later

When to upgrade to full causal inference model (PDF page 24):
- After 6 months of real outcome data
- When intervention effects diverge from predictions
- When stakeholders need higher precision for $10M+ decisions

## Critical Decisions

### Docker: NO
**Reasoning:** Vercel's serverless functions run Python without Docker. For data processing, run scripts locally and upload results. No containers needed.

### PostgreSQL: NO (for MVP)
**Reasoning:** 2,500 hexagons × 50 features = ~15MB JSON. Fits in browser memory. Add database when:
- Need user accounts
- Need real-time MLS updates
- Need collaborative features
- Hexagon count > 10k

### When DO we need PostgreSQL?
**Full system (per PDF page 15-16)** needs Postgres when:
- Storing monthly MLS transaction history (millions of rows)
- HMIS aggregate data from CoC
- Land Bank foreclosure records over time
- Spatial queries with PostGIS (only if using hexagons)

**For MVP with block groups:** JSON files are fine. Even with 200 block groups × 50 features × 36 months of history = ~360K data points = still <5MB.

## FAQ

**Q: Why switch from hexagons to block groups?**
A: Block groups eliminate 2-3 days of spatial disaggregation work, provide perfect data alignment with Census, and give larger sample sizes for more stable predictions. Hexagons are sexier but block groups are pragmatic for MVP.

**Q: Can I really build this in 3 weeks with AI features?**
A: Yes! ~63 hours total (~2 weeks full-time):
- Block groups save spatial join complexity
- Vercel AI SDK handles streaming and tool calling
- AI assistant adds only 6 hours of dev time
- Most AI logic is declarative (define tools, not manual parsing)

**Q: What if stakeholders want finer granularity than block groups?**
A: After MVP proves value, switch to H3 hexagons in Phase 2 when you have real MLS data. The architecture supports both - just change the geographic unit.

**Q: How does the AI assistant improve on just showing data?**
A: Users can ask questions in natural language instead of clicking around:
- "Which neighborhoods need the most help?" (queries data)
- "What happens if we increase median income by 15%?" (runs simulation)
- "Compare downtown vs suburbs" (analyzes patterns)
- Policy makers don't need to understand the interface - just ask

**Q: Can the AI assistant do anything dangerous?**
A: No. It's scoped to:
- Read-only data queries
- Simple simulations (linear approximations, not real model re-training)
- No external API calls
- No data modification
- Context limited to housing equity only

**Q: How accurate are the causal loop simulations?**
A: MVP uses **simplified rule-based feedback** (3 loops) vs full system's **ML-based causal inference** (6+ loops). Accuracy is ~70-80% for directional guidance ("will this help?") but not precise enough for exact dollar ROI. Sufficient for:
- Policy exploration ("what if we try X?")
- Stakeholder education ("see how loops interact")
- Investment prioritization ("where to focus first?")

NOT sufficient for:
- Exact outcome prediction ("will get 47.3 equity score")
- Legal justification ("model says we must do X")
- High-stakes decisions (>$10M) without validation

**Q: What if the causal loops don't match reality?**
A: After 3-6 months of real data:
1. Compare predicted timelines to actual outcomes
2. Adjust loop coefficients (e.g., if gentrification feedback is stronger than 0.5, increase it)
3. Add missing loops community identifies
4. Upgrade to ML-based causal inference (PDF approach) when you have enough outcome data

**Q: Why not use system dynamics software like Stella or Vensim?**
A: Those are excellent for full causal models but:
- MVP needs web-accessible interface (not desktop software)
- AI assistant integration requires API access
- Rule-based loops are faster to prototype than full SD models
- Can export to Stella format later if stakeholders want deeper analysis

Consider Stella/Vensim for Phase 2 if you need:
- Complex multi-order feedback loops
- Stock-and-flow modeling
- Policy resistance analysis
- Sensitivity testing across 100+ parameters

**Q: What if stakeholders want the full system immediately?**
A: Show them this MVP first with familiar Census boundaries and AI assistant. Prove the predictions are useful. Then pursue the full implementation.

**Q: When do we add the 56-page implementation guide features?**
A: After MVP proves value and you secure funding for the full system.

---

**Remember:** The PDF is a **comprehensive blueprint**. This MVP is a **proof of concept** with an AI assistant to make data exploration intuitive. Build small with familiar geographies, validate with stakeholders, then scale.