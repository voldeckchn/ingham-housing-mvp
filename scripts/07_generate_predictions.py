#!/usr/bin/env python3
"""
Script 07: Generate Predictions

Loads trained ML models and generates predictions for all block groups.
Creates final JSON file with all scores for deployment.
"""

import pandas as pd
import numpy as np
import joblib
import json
import os

def calculate_gentrification_risk(row):
    """
    Calculate gentrification risk using rule-based formula.
    Based on price growth, income, and demographics.
    """
    # High price growth + low income + minority population = higher risk
    price_factor = np.clip(row['price_yoy_change'] * 1000, 0, 50)
    income_factor = max(0, (1 - row['median_income'] / 75000) * 30)
    displacement_risk = row['pct_minority'] * 20

    gent_risk = price_factor + income_factor + displacement_risk
    return np.clip(gent_risk, 0, 100)


def generate_predictions():
    """Generate predictions for all block groups using trained models."""

    print("=" * 60)
    print("STEP 7: GENERATE PREDICTIONS")
    print("=" * 60)

    # Load trained models
    equity_model_file = '../models/equity_model.pkl'
    foreclosure_model_file = '../models/foreclosure_model.pkl'

    if not os.path.exists(equity_model_file) or not os.path.exists(foreclosure_model_file):
        print("\n❌ Error: Model files not found")
        print("   Run script 06_train_model.py first")
        return

    print("\n📥 Loading trained models...")
    equity_model = joblib.load(equity_model_file)
    foreclosure_model = joblib.load(foreclosure_model_file)
    print("   ✓ Models loaded")

    # Load features
    features_file = '../data/processed/bg_features.csv'
    features = pd.read_csv(features_file)
    print(f"   ✓ Features loaded: {len(features)} block groups")

    # Prepare feature matrix
    feature_cols = equity_model.feature_names_in_
    X = features[feature_cols].copy()
    X = X.fillna(X.median())

    print(f"\n🔮 Generating predictions...")

    # Generate ML predictions
    equity_predictions = equity_model.predict(X)
    foreclosure_predictions = foreclosure_model.predict(X)

    # Calculate gentrification risk (rule-based)
    gentrification_risks = features.apply(calculate_gentrification_risk, axis=1)

    print(f"   ✓ Equity Score predictions generated")
    print(f"   ✓ Foreclosure Risk predictions generated")
    print(f"   ✓ Gentrification Risk calculated")

    # Create output JSON
    print("\n📊 Creating output JSON...")

    output = []
    for i, row in features.iterrows():
        output.append({
            'geoid': str(row['GEOID']),
            'name': str(row['NAME']) if pd.notna(row['NAME']) else '',
            'equity_score': round(float(equity_predictions[i]), 1),
            'gentrification_risk': round(float(gentrification_risks.iloc[i]), 1),
            'foreclosure_risk': round(float(foreclosure_predictions[i]), 1),
            'median_income': int(row['median_income']) if pd.notna(row['median_income']) else 0,
            'median_price': int(row['median_sale_price']) if pd.notna(row['median_sale_price']) else 0,
            'population': int(row['total_population']) if pd.notna(row['total_population']) else 0,
            'days_on_market': int(row['days_on_market']) if pd.notna(row['days_on_market']) else 0,
            'price_yoy_change': round(float(row['price_yoy_change']), 4) if pd.notna(row['price_yoy_change']) else 0.0,
        })

    # Save to JSON
    output_file = '../data/block_groups/bg_predictions.json'
    os.makedirs('../data/block_groups', exist_ok=True)

    with open(output_file, 'w') as f:
        json.dump(output, f, indent=2)

    print(f"   ✓ Saved {len(output)} predictions to {output_file}")

    # Calculate statistics
    equity_scores = [p['equity_score'] for p in output]
    gent_risks = [p['gentrification_risk'] for p in output]
    fc_risks = [p['foreclosure_risk'] for p in output]

    # Summary
    print("\n" + "=" * 60)
    print("PREDICTION SUMMARY")
    print("=" * 60)
    print(f"Total block groups: {len(output)}")

    print(f"\nEquity Score (0-100, higher = better):")
    print(f"  Mean:   {np.mean(equity_scores):.1f}")
    print(f"  Median: {np.median(equity_scores):.1f}")
    print(f"  Range:  {min(equity_scores):.1f} - {max(equity_scores):.1f}")
    print(f"  High equity areas (>70): {sum(1 for s in equity_scores if s > 70)}")
    print(f"  Low equity areas (<40): {sum(1 for s in equity_scores if s < 40)}")

    print(f"\nGentrification Risk (0-100, higher = more risk):")
    print(f"  Mean:   {np.mean(gent_risks):.1f}")
    print(f"  Median: {np.median(gent_risks):.1f}")
    print(f"  Range:  {min(gent_risks):.1f} - {max(gent_risks):.1f}")
    print(f"  High risk areas (>70): {sum(1 for s in gent_risks if s > 70)}")

    print(f"\nForeclosure Risk (0-100, higher = more risk):")
    print(f"  Mean:   {np.mean(fc_risks):.1f}")
    print(f"  Median: {np.median(fc_risks):.1f}")
    print(f"  Range:  {min(fc_risks):.1f} - {max(fc_risks):.1f}")
    print(f"  High risk areas (>70): {sum(1 for s in fc_risks if s > 70)}")

    # File size
    file_size_kb = os.path.getsize(output_file) / 1024
    print(f"\nOutput file: {output_file}")
    print(f"File size: {file_size_kb:.1f} KB")

    # Top 5 by each metric
    print(f"\n🏆 TOP 5 AREAS BY EQUITY SCORE:")
    top_equity = sorted(output, key=lambda x: x['equity_score'], reverse=True)[:5]
    for i, area in enumerate(top_equity, 1):
        print(f"   {i}. {area['geoid']}: {area['equity_score']:.1f} (Income: ${area['median_income']:,})")

    print(f"\n⚠️  TOP 5 AREAS BY GENTRIFICATION RISK:")
    top_gent = sorted(output, key=lambda x: x['gentrification_risk'], reverse=True)[:5]
    for i, area in enumerate(top_gent, 1):
        print(f"   {i}. {area['geoid']}: {area['gentrification_risk']:.1f} (YoY: {area['price_yoy_change']:.1%})")

    print(f"\n🚨 TOP 5 AREAS BY FORECLOSURE RISK:")
    top_fc = sorted(output, key=lambda x: x['foreclosure_risk'], reverse=True)[:5]
    for i, area in enumerate(top_fc, 1):
        print(f"   {i}. {area['geoid']}: {area['foreclosure_risk']:.1f} (Income: ${area['median_income']:,})")

    print("\n✅ Predictions generated successfully!")
    print("\n🎉 DATA PIPELINE COMPLETE!")
    print("\n📦 Next steps:")
    print("   1. Initialize Next.js app")
    print("   2. Copy bg_predictions.json and ingham_block_groups.geojson to public/data/")
    print("   3. Build frontend components")
    print("   4. Deploy to Vercel")

if __name__ == "__main__":
    generate_predictions()
