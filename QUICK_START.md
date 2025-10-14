# Quick Start Guide - Ingham County Housing Equity MVP

## 🚀 Get Running in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- Anthropic API key ([get one here](https://console.anthropic.com/))
- Mapbox token ([get one here](https://account.mapbox.com/access-tokens/))

### Setup Steps

```bash
# 1. Navigate to webapp directory
cd webapp

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.local.example .env.local
# Edit .env.local and add your keys:
# - ANTHROPIC_API_KEY=sk-ant-...
# - NEXT_PUBLIC_MAPBOX_TOKEN=pk....
# - NEXT_PUBLIC_BASE_URL=http://localhost:3000

# 4. Start development server
npm run dev

# 5. Open browser
# Visit http://localhost:3000
```

### You're Done! 🎉

You should see:
- Map of Ingham County with 238 colored block groups
- Legend in bottom-right corner
- Title card in top-left with "Export All Data" button
- Chat button (💬) in bottom-right

---

## 🎮 Try These First

### Click the Map
1. Click any colored area on the map
2. See detailed panel appear on the right
3. View equity scores, demographics, and market data
4. Click "Export Data (CSV)" to download

### Ask the AI
1. Click the chat button (💬) in bottom-right
2. Type: **"What are the top 5 areas by equity score?"**
3. Watch AI query the data and highlight areas on map
4. See red borders appear around the top 5 areas

### Run a Simulation
1. In the chat, type: **"Simulate $2M HTF investment over 12 months"**
2. AI will pick a block group or ask you to specify one
3. Watch timeline chart appear showing 12-month projection
4. See 3 lines tracking equity, gentrification risk, and foreclosure risk

### View Spillover Effects
1. Type: **"Show spillover effects of $500K investment"**
2. See primary area highlighted in red (solid border)
3. See 4 neighboring areas in orange (dashed border)
4. Get total household impact count

---

## 📊 Key Features

### Map Features
- **Green areas** = High equity (70-100)
- **Yellow areas** = Moderate equity (40-70)
- **Red areas** = Low equity (0-40)
- **Click any area** to see details
- **Red borders** = AI selected areas
- **Orange dashed** = Spillover effect zones

### AI Capabilities
- Query specific areas by GEOID
- Find top/bottom performers
- Compare two areas side-by-side
- Run 12-month causal simulations
- Analyze spillover to neighbors
- Get county-wide statistics

### Export Options
- **Main page**: Export all 238 block groups
- **Detail panel**: Export single area
- **Simulations**: Export timeline data (in future update)

---

## 🐛 Troubleshooting

### "Map not loading"
- Check that `NEXT_PUBLIC_MAPBOX_TOKEN` is set in `.env.local`
- Verify token is valid at mapbox.com
- Check browser console for errors

### "AI not responding"
- Check that `ANTHROPIC_API_KEY` is set in `.env.local`
- Verify API key is valid at console.anthropic.com
- Check that you have API credits

### "No data showing"
- Verify files exist in `webapp/public/data/`:
  - `bg_predictions.json` (80 KB)
  - `ingham_block_groups.geojson` (548 KB)
- These should be symlinked from `data/block_groups/`

### "Build fails"
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### "Port 3000 already in use"
```bash
# Use a different port
npm run dev -- -p 3001
```

---

## 📖 Documentation

- **MVP_BUILD_PLAN.md** - Full specification
- **MVP_COMPLETION_REPORT.md** - What was built
- **CAUSAL_LOOP_IMPLEMENTATION.md** - Technical details
- **TESTING_CAUSAL_LOOPS.md** - Test scenarios

---

## 🎯 Sample Queries for Demo

### Easy Queries (30 seconds)
```
"Show me overall statistics"
"What are the top 5 worst areas for foreclosure risk?"
"Which block group has the best equity score?"
```

### Intermediate (1-2 minutes)
```
"Compare downtown Lansing with suburban areas"
"What if income increased by 15% in high-risk areas?"
"Find areas with gentrification risk above 70"
```

### Advanced (2-3 minutes)
```
"Simulate $2M HTF investment over 12 months"
"Show spillover effects of $1M investment in downtown"
"What happens if we do nothing in the highest-risk area?"
```

---

## 💡 Tips

1. **Start with simple queries** to understand the system
2. **Use specific GEOIDs** when you know them (12 digits)
3. **Watch the map** - it highlights areas from AI responses
4. **Export data** for external analysis in Excel/Python
5. **Timeline charts** only appear for causal simulations

---

## 🔥 Quick Demo Script (5 minutes)

**Minute 1**: Show the map
- "This is Ingham County with 238 Census Block Groups"
- "Green = good equity, Red = low equity"
- Click an area, show the detail panel

**Minute 2**: Basic AI query
- Ask: "What are the top 5 areas by equity score?"
- Show how map highlights automatically
- Point out GEOIDs in response

**Minute 3**: Comparison
- Ask: "Compare [top area] with [bottom area]"
- Show differences in metrics

**Minute 4**: Causal simulation
- Ask: "Simulate $2M HTF investment over 12 months"
- Show timeline chart appearing
- Explain the 3 feedback loops

**Minute 5**: Export
- Click "Export All Data (CSV)"
- Show file downloads
- "Can analyze in Excel, import to other systems"

---

## 🎓 Learning Path

### Day 1: Explore the Data
- Click around the map
- View different areas
- Export and open in Excel
- Understand the metrics

### Day 2: Simple Queries
- Ask AI for top/bottom areas
- Get county statistics
- Compare specific areas
- Learn the GEOIDs

### Day 3: Simulations
- Run HTF investment simulation
- Try income support scenario
- View timeline charts
- Understand feedback loops

### Day 4: Advanced Analysis
- Spillover effect analysis
- Multi-area comparisons
- Export simulation data
- Combine with external data

---

## 📞 Need Help?

1. **Check browser console** (F12) for errors
2. **Review error messages** from AI
3. **Verify API keys** in .env.local
4. **Read documentation** in markdown files
5. **Check git status** - ensure all files committed

---

## ⚡ Performance Notes

- **First load**: ~2 seconds (loads 238 areas)
- **AI queries**: 3-6 seconds (includes tool calling)
- **Map interactions**: Instant (client-side)
- **CSV export**: Instant (client-side)
- **Chart rendering**: <500ms

---

## 🎉 Success!

If you can:
- ✅ See the map with colored areas
- ✅ Click areas and view details
- ✅ Ask AI questions and get responses
- ✅ See timeline charts for simulations
- ✅ Export CSV files

**You're ready to demo to stakeholders!**

---

*Last updated: 2025-10-14*
*Build: v1.0.0-mvp*
*Status: ✅ Complete*
