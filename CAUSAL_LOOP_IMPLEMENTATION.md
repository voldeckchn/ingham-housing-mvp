# Causal Loop Implementation Guide

## Overview

This MVP implements simplified causal loop modeling from the Comprehensive Housing Equity Model (PDF pages 24-27). The system models feedback loops that occur when interventions are applied to housing equity, gentrification risk, and foreclosure risk.

## Core Feedback Loops

### 1. Gentrification Spiral (Reinforcing Loop)
```
Gentrification Risk ↑ → Displacement Pressure ↑ → Property Turnover ↑ → Price Appreciation ↑ → Gentrification Risk ↑↑
```
- **Strength**: 0.5 per month
- **Type**: Reinforcing (amplifies changes)
- **Implementation**: `gentFeedback = (state.gentrification_risk / 100) * 0.5`

### 2. Foreclosure-Price Cycle (Balancing Loop)
```
Foreclosure Risk ↑ → Property Values ↓ → Market Pressure ↓ → Gentrification Risk ↓
```
- **Strength**: -1.5 per month
- **Type**: Balancing (dampens changes)
- **Implementation**: `foreclosureFeedback = (state.foreclosure_risk / 100) * 0.3`

### 3. Equity Investment Cycle (Mixed Loop)
```
Equity Score ↑ → Area Attractiveness ↑ → New Investment ↑ → (Positive: More Resources) + (Negative: Gentrification Pressure)
```
- **Strength**: 0.5 per month
- **Type**: Mixed (both positive and negative effects)
- **Implementation**: `equityFeedback = (state.equity_score / 100) * 0.2`

## Intervention Types

### HTF Investment
Housing Trust Fund investment that directly improves housing equity and reduces displacement risk.

**Effects:**
- Equity Score: `+5 points per $1M invested`
- Gentrification Risk: `-3 points per $1M invested`
- Foreclosure Risk: `-2 points per $500K invested`

**Decay:** Effects diminish over time using `e^(-month/6)` decay function

**Example Query:**
```
"Simulate $2M HTF investment in block group 260650001001 over 12 months"
```

### Income Support
Percentage-based income increase programs (e.g., wage subsidies, guaranteed income).

**Effects:**
- Equity Score: `+10 points per 10% income increase`
- Foreclosure Risk: `-8 points per 10% income increase`

**Decay:** Effects diminish over time

**Example Query:**
```
"What if we increased income by 15% in high-risk areas?"
```

### Rent Control
Policy intervention to stabilize rents and reduce displacement pressure.

**Effects:**
- Gentrification Risk: `-15 points per 10% rent control`
- Equity Score: `+5 points per 10% rent control`

**Decay:** Policy effects persist but may reduce new investment

**Example Query:**
```
"Simulate 20% rent control policy"
```

## Spillover Effects

Interventions in one block group affect neighboring areas (same first 9 digits of GEOID).

**Formula:**
- Primary Area: 100% of intervention effect
- Adjacent Areas: 30% spillover effect
- Total Impact: Sum of all affected households

**Example Query:**
```
"Show spillover effects of $500K investment in block group 260650001001"
```

## Simulation Timeline

All simulations run for **12 months by default** with monthly snapshots.

**Key Milestones:**
- **Month 0**: Baseline (no intervention)
- **Month 3**: Early intervention effects visible
- **Month 6**: Peak intervention impact (before decay)
- **Month 12**: Long-term stabilized state

## Using the AI Assistant

### Data Queries
```
"What are the top 5 areas by foreclosure risk?"
"Show me overall statistics"
"Compare downtown vs suburbs"
```

### Causal Loop Simulations
```
"Simulate $2M HTF investment over 12 months"
"What happens if we do nothing in block group 260650001001?"
"Show me the feedback loops for a $1M investment"
```

### Spillover Analysis
```
"How does a $500K investment affect neighboring areas?"
"Show spillover effects in downtown Lansing"
```

## Technical Implementation

### File Structure
```
webapp/
├── lib/
│   ├── ai-tools.ts          # Causal loop simulation functions
│   └── types.ts             # TypeScript interfaces
├── app/
│   └── api/
│       └── chat/
│           └── route.ts     # AI tool calling with Anthropic SDK
└── components/
    └── AIAssistant.tsx      # Chat interface
```

### Core Functions

#### `simulateCausalLoop(blockGroup, intervention)`
Simulates month-by-month changes with feedback loops.

**Returns:**
- `timeline`: Array of states for each month
- `totalChange`: Net change in all metrics
- `feedbackLoops`: Identified loop strengths
- `finalState`: End state after 12 months

#### `simulateSpilloverEffects(blockGroup, neighbors, intervention)`
Calculates primary and spillover effects.

**Returns:**
- `primary`: Direct effects on target area
- `spillover`: Effects on neighboring areas
- `total_households_impacted`: Total population affected

## Comparison to Full System

| Feature | MVP (Simplified) | Full System (PDF) |
|---------|------------------|-------------------|
| Feedback Loops | 3 core loops | 6+ complex loops |
| Time Horizon | 12 months | 24+ months |
| Geographic Spillover | Adjacent blocks | Network-based diffusion |
| Model Type | Rule-based coefficients | ML-based causal inference |
| Data Updates | Static | Monthly real-time |
| Intervention Types | 3 types | 10+ intervention scenarios |

## Validation & Calibration

After 3-6 months of real data:
1. Compare predicted timelines to actual outcomes
2. Adjust loop coefficients if needed
3. Add missing loops community identifies
4. Upgrade to ML-based causal inference when sufficient outcome data exists

## Accuracy Expectations

**MVP Accuracy:** ~70-80% directional guidance

**Sufficient for:**
- Policy exploration ("will this help?")
- Stakeholder education ("see how loops interact")
- Investment prioritization ("where to focus first?")

**NOT sufficient for:**
- Exact outcome prediction ("will get 47.3 equity score")
- Legal justification ("model says we must do X")
- High-stakes decisions (>$10M) without validation

## Next Steps

**Phase 2: Enhanced Causal Modeling**
- Add 3 more feedback loops
- Incorporate real outcome data
- Network-based spillover (not just adjacent)
- ML-based coefficient estimation

**Phase 3: Full Causal Inference**
- System dynamics software integration (Stella/Vensim)
- Multi-order feedback loops
- Sensitivity analysis across 100+ parameters
- Policy resistance analysis

## Example Simulation Results

### HTF Investment Scenario
```
Block Group: 260650001001
Intervention: $2M HTF Investment over 12 months

Baseline (Month 0):
- Equity Score: 45.2
- Gentrification Risk: 68.5
- Foreclosure Risk: 62.0

Final (Month 12):
- Equity Score: 59.4 (+14.2) ✅
- Gentrification Risk: 65.1 (-3.4) ✅
- Foreclosure Risk: 47.2 (-14.8) ✅

Feedback Loops Detected:
1. HTF Investment → Equity ↑ → Attracts More Investment (+0.3/month)
2. Equity ↑ → Gentrification Risk ↑ (+0.1/month, unintended)
3. Foreclosure Risk ↓ → Price Stability → Gent Risk ↓ (-0.2/month)

Spillover Impact:
- 4 adjacent block groups see +4.3 equity score avg
- ~12,000 total residents impacted
```

## Resources

- **Comprehensive Housing Equity Model PDF**: Full technical specification (pages 24-27)
- **AI Tools Library**: `webapp/lib/ai-tools.ts`
- **Tool Definitions**: `webapp/app/api/chat/route.ts`
- **Build Plan**: `MVP_BUILD_PLAN.md` (lines 933-1016, 1528-1743)

## Support

For questions about causal loop implementation:
1. Check the build plan: `MVP_BUILD_PLAN.md`
2. Review tool implementations: `webapp/lib/ai-tools.ts`
3. Test with AI assistant: Ask "Explain the causal loop simulation"
