# Testing Causal Loop Functionality

## Quick Start

### 1. Set Up Environment
```bash
cd webapp
cp .env.local.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to http://localhost:3000

### 4. Click AI Assistant Button
Look for the 💬 button in bottom-right corner

## Test Scenarios

### Scenario 1: Basic Causal Loop Simulation
**Goal**: Verify 12-month HTF investment simulation works

**Steps:**
1. Click AI assistant button
2. Type: `"Simulate $2M HTF investment over 12 months"`
3. Wait for AI to process (will call simulateCausalLoop tool)

**Expected Output:**
```
Running causal loop simulation for $2M HTF investment over 12 months...

🔄 FEEDBACK LOOPS DETECTED:
1. HTF Investment → Equity ↑ → Attracts More Investment (reinforcing loop, +0.3 per month)
2. Equity ↑ → Gentrification Risk ↑ (unintended consequence) (reinforcing loop, +0.1 per month)
3. Foreclosure Risk ↓ → Price Stability → Gent Risk ↓ (balancing loop, -0.2 per month)

📊 TIMELINE (key months):

Month 0 (Baseline):
• Equity Score: [initial value]
• Gentrification Risk: [initial value]
• Foreclosure Risk: [initial value]

Month 6:
• Equity Score: [+improvement]
• Gentrification Risk: [slight change]
• Foreclosure Risk: [reduction]

Month 12 (Final):
• Equity Score: [final value] (+X points) ✅
• Gentrification Risk: [final value] (change)
• Foreclosure Risk: [final value] (-X points) ✅

💡 INSIGHTS:
- Investment effect strongest in first 6 months
- Foreclosure risk drops fastest (direct impact)
- [Additional insights from AI]
```

**Verification:**
- ✅ Response includes 3 feedback loops
- ✅ Timeline shows months 0, 3, 6, 12
- ✅ All 3 metrics tracked (equity, gent risk, fore risk)
- ✅ Total change calculations present

---

### Scenario 2: Spillover Effects Analysis
**Goal**: Verify neighbor impact calculations

**Steps:**
1. Type: `"Show spillover effects of $500K investment"`
2. AI should ask which block group or use top result
3. Confirm block group selection

**Expected Output:**
```
Spillover analysis for $500K investment...

📍 PRIMARY AREA:
Block Group [GEOID]
• Equity Score Change: +X points
• Gentrification Risk Change: -X points
• Foreclosure Risk Change: -X points

📍 SPILLOVER TO NEIGHBORS:
1. Block Group [GEOID] - Equity +Y points (adjacent)
2. Block Group [GEOID] - Equity +Y points (adjacent)
3. Block Group [GEOID] - Equity +Y points (adjacent)
4. Block Group [GEOID] - Equity +Y points (adjacent)

💡 TOTAL IMPACT:
- [X] households in primary area
- [Y] households in spillover areas
- [Total] total residents impacted
```

**Verification:**
- ✅ Primary area shows 100% effect
- ✅ Neighbors show ~30% effect
- ✅ Total households calculated
- ✅ 4 neighboring block groups identified

---

### Scenario 3: Do-Nothing Baseline
**Goal**: Show negative projection without intervention

**Steps:**
1. Type: `"What happens if we do nothing in high-risk areas?"`
2. AI should identify high-risk areas using findTopAreas
3. Run simulation with zero intervention

**Expected Output:**
```
Projecting natural dynamics WITHOUT intervention in [high-risk areas]...

🔄 UNCHECKED FEEDBACK LOOPS:
1. Gentrification → Foreclosures → Displacement (accelerating spiral)
2. Low Equity → Disinvestment → Lower Equity (vicious cycle)

📉 12-MONTH PROJECTION (no intervention):
Month 0: Equity X, Gent Risk Y, Fore Risk Z
Month 12: Equity [lower], Gent Risk [higher], Fore Risk [higher]

⚠️ WARNING:
- Area may cross into "high risk" territory (>70)
- Estimated [X] households at displacement risk
- Without intervention, equity continues declining

💰 ESTIMATED COST OF INACTION:
[Based on population and risk scores]
```

**Verification:**
- ✅ Shows decline trajectory
- ✅ Identifies vicious cycles
- ✅ Warns about threshold crossings
- ✅ Estimates household impact

---

### Scenario 4: Top Areas Query
**Goal**: Test basic data queries and map highlighting

**Steps:**
1. Type: `"What are the top 5 areas with worst foreclosure risk?"`
2. Watch for map highlighting

**Expected Output:**
```
Here are the 5 block groups with highest foreclosure risk:

1. Block Group [12-digit GEOID] - Foreclosure Risk: 87
   • Median Income: $28,400
   • Equity Score: 32
   [View on map]

2. Block Group [12-digit GEOID] - Foreclosure Risk: 82
   • Median Income: $31,200
   • Equity Score: 38
   [View on map]

[... 3 more areas ...]

These areas share common characteristics: low median income (<$35k),
high cost burden (>45%), and recent price volatility.
```

**Verification:**
- ✅ 5 areas listed with GEOIDs
- ✅ Map highlights those 5 areas in red
- ✅ Each area shows key metrics
- ✅ AI provides context/insights

---

### Scenario 5: Area Comparison
**Goal**: Compare two block groups side-by-side

**Steps:**
1. First query top/bottom areas to get GEOIDs
2. Type: `"Compare block group [GEOID1] with [GEOID2]"`

**Expected Output:**
```
Comparing Block Group [GEOID1] with Block Group [GEOID2]:

BLOCK GROUP [GEOID1]:
• Equity Score: X
• Gentrification Risk: Y
• Foreclosure Risk: Z
• Median Income: $A
• Population: B

BLOCK GROUP [GEOID2]:
• Equity Score: X2
• Gentrification Risk: Y2
• Foreclosure Risk: Z2
• Median Income: $A2
• Population: B2

KEY DIFFERENCES:
• Equity Score: [±X points]
• Income: [±$Y]
• [Other insights]
```

**Verification:**
- ✅ Both areas shown side-by-side
- ✅ Differences calculated
- ✅ AI provides interpretation
- ✅ Map highlights both areas

---

### Scenario 6: Statistical Summary
**Goal**: Get county-wide overview

**Steps:**
1. Type: `"Show me overall statistics for the county"`

**Expected Output:**
```
Ingham County Housing Equity Statistics:

📊 COVERAGE:
• [X] Census Block Groups analyzed
• [Y] total population

📈 EQUITY SCORES:
• Mean: Z
• Range: [min] to [max]

⚠️ HIGH-RISK AREAS:
• [X] block groups with gentrification risk >70
• [Y] block groups with foreclosure risk >70

🏘️ POPULATION IMPACT:
• [X] residents in high-risk areas
```

**Verification:**
- ✅ Count of block groups
- ✅ Average scores for all 3 metrics
- ✅ High-risk area counts
- ✅ Population totals

---

## Debugging Tips

### Issue: AI not calling tools
**Symptom**: AI responds with text but doesn't run simulations
**Fix**: Check that:
- ANTHROPIC_API_KEY is set in .env.local
- Runtime is 'nodejs' not 'edge' in route.ts
- Tools array is defined before anthropic.messages.create()

### Issue: "Block group not found"
**Symptom**: Tool returns error for valid GEOID
**Fix**: Check that:
- bg_predictions.json exists in webapp/public/data/
- GEOID is 12 digits (e.g., 260650001001)
- Data loaded correctly in loadPredictions()

### Issue: Map not highlighting
**Symptom**: AI responds but map doesn't show red highlights
**Fix**: Check that:
- AI includes 12-digit GEOIDs in response text
- GEOID pattern regex matches (\b\d{12}\b)
- Map has bg-highlights layer
- highlightedAreas prop passed to map

### Issue: Simulation numbers seem wrong
**Symptom**: Results don't match expected values
**Fix**: Check that:
- Intervention amount is reasonable ($1M-$5M for HTF)
- Loop coefficients in ai-tools.ts are correct
- Decay function is applied (Math.exp(-month/6))
- All 3 feedback loops are included

---

## Console Debugging

### Enable Verbose Logging
Add to webapp/app/api/chat/route.ts:

```typescript
console.log('Tool called:', toolName, toolInput)
console.log('Tool result:', result)
```

### Check Network Tab
1. Open browser DevTools (F12)
2. Go to Network tab
3. Filter by "chat"
4. Watch for POST requests to /api/chat
5. Check request/response payloads

### Test Tools Directly
Create webapp/app/api/test-tools/route.ts:

```typescript
import { simulateCausalLoop } from '@/lib/ai-tools'

export async function GET() {
  const testBG = {
    geoid: '260650001001',
    equity_score: 45.2,
    gentrification_risk: 68.5,
    foreclosure_risk: 62.0,
    median_income: 42000,
    median_price: 150000,
    population: 1200,
    // ... other fields
  }

  const result = simulateCausalLoop(testBG, {
    type: 'htf_investment',
    amount: 2000000,
    duration: 12
  })

  return Response.json(result)
}
```

Visit http://localhost:3000/api/test-tools to see raw output.

---

## Success Checklist

Before considering implementation complete:

- [ ] All 6 AI tools callable by assistant
- [ ] Causal loop simulation runs 12 months
- [ ] 3 feedback loops identified in results
- [ ] Spillover effects calculate neighbors
- [ ] Map highlights queried areas
- [ ] TypeScript build succeeds (npm run build)
- [ ] No console errors in browser
- [ ] All test scenarios pass

---

## Performance Benchmarks

**Expected Response Times:**
- Simple query (findTopAreas): 2-4 seconds
- Causal loop simulation: 3-6 seconds
- Spillover analysis: 3-5 seconds
- With cold start: +2-3 seconds

**Memory Usage:**
- Predictions cache: ~2-5 MB
- Per simulation: ~1 KB

**API Costs (Claude 3.5 Sonnet):**
- Simple query: ~$0.01
- Causal simulation: ~$0.02-0.03
- Daily budget (100 queries): ~$2

---

## Next Steps After Testing

1. **Collect Feedback**: Ask stakeholders to try queries
2. **Calibrate Loops**: Adjust coefficients if results seem off
3. **Add Visualizations**: Timeline charts, loop diagrams
4. **Document Patterns**: Common query types, failure modes
5. **Monitor Usage**: Track most-used tools, average response times

---

## Getting Help

1. Check error messages in browser console
2. Review CAUSAL_LOOP_IMPLEMENTATION.md
3. Read MVP_BUILD_PLAN.md lines 1528-1743
4. Test with simple queries first (statistics, top areas)
5. Then test complex simulations

Good luck! 🚀
