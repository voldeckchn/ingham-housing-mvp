#!/usr/bin/env python3
"""
Script 05: Engineer Features for ML Models

Combines Census, assessor, and synthetic MLS data into a single feature matrix.
Creates derived features used for predicting equity score and foreclosure risk.
"""

import pandas as pd
import numpy as np
import os

def engineer_features():
    """Combine all data sources and engineer features for ML."""

    print("=" * 60)
    print("STEP 5: FEATURE ENGINEERING")
    print("=" * 60)

    # Load all data sources
    census_file = '../data/processed/census_by_bg.csv'
    mls_file = '../data/processed/synthetic_mls_by_bg.csv'
    assessor_file = '../data/processed/assessor_by_bg.csv'

    # Check files exist
    missing_files = []
    for f in [census_file, mls_file, assessor_file]:
        if not os.path.exists(f):
            missing_files.append(f)

    if missing_files:
        print("\n❌ Error: Missing required files:")
        for f in missing_files:
            print(f"   - {f}")
        print("\n   Run scripts 02, 03, and 04 first")
        return

    print("\n📥 Loading data sources...")
    census = pd.read_csv(census_file)
    mls = pd.read_csv(mls_file)
    assessor = pd.read_csv(assessor_file)

    print(f"   Census: {len(census)} rows")
    print(f"   MLS: {len(mls)} rows")
    print(f"   Assessor: {len(assessor)} rows")

    # Merge on GEOID - direct joins, no spatial operations needed!
    print("\n🔗 Merging datasets on GEOID...")
    features = census.merge(mls, on='GEOID', how='left')
    features = features.merge(assessor, on='GEOID', how='left')

    print(f"✓ Merged to {len(features)} rows with {len(features.columns)} columns")

    # Engineer derived features
    print("\n🔧 Engineering derived features...")

    # 1. Affordability Ratio (higher = less affordable)
    features['affordability_ratio'] = (
        features['median_sale_price'] / features['median_income']
    ).fillna(3.0).clip(0, 10)

    # 2. Cost Burden (percentage)
    features['cost_burden_pct'] = (features['pct_cost_burdened'] * 100).clip(0, 100)

    # 3. Gentrification Pressure (composite indicator)
    features['gentrification_pressure'] = (
        features['price_yoy_change'] * 100 *  # Price momentum
        (50000 / features['median_income'].clip(lower=20000)) *  # Income vulnerability
        features['pct_minority']  # Displacement risk
    ).fillna(0).clip(0, 100)

    # 4. Market Liquidity (inverse of days on market)
    features['market_liquidity'] = (
        100 - (features['days_on_market'] / 180 * 100)
    ).clip(0, 100)

    # 5. Owner Stability (owner-occupied rate as percentage)
    features['owner_stability'] = (features['pct_owner_occupied'] * 100).clip(0, 100)

    # 6. Foreclosure Rate Proxy (placeholder - cost burden is main predictor)
    features['foreclosure_rate'] = (features['cost_burden_pct'] / 100).clip(0, 1)

    # 7. Price-to-Assessed Ratio (market heat indicator)
    features['price_to_assessed_ratio'] = (
        features['median_sale_price'] / features['assessed_value_median']
    ).fillna(1.0).clip(0.5, 2.0)

    # 8. Population Density Proxy (population per unit)
    features['pop_per_unit'] = (
        features['total_population'] / features['total_units']
    ).fillna(2.5).clip(1, 8)

    print("✓ Created 8 derived features")

    # Select final feature set for ML models
    final_features = [
        # Identifiers
        'GEOID', 'NAME',

        # Census Demographics
        'median_income', 'total_population', 'total_units',
        'pct_owner_occupied', 'pct_renter_occupied',
        'pct_cost_burdened', 'pct_minority',

        # MLS Market Data
        'median_sale_price', 'price_yoy_change',
        'days_on_market', 'sale_count_12mo',
        'price_per_sqft', 'dist_to_downtown',

        # Assessor Data
        'assessed_value_median', 'property_age_estimate',

        # Engineered Features
        'affordability_ratio', 'cost_burden_pct',
        'gentrification_pressure', 'market_liquidity',
        'owner_stability', 'foreclosure_rate',
        'price_to_assessed_ratio', 'pop_per_unit'
    ]

    features_final = features[final_features].copy()

    # Handle missing values
    print("\n🧹 Handling missing values...")
    missing_before = features_final.isnull().sum().sum()

    # Fill numeric columns with median
    numeric_cols = features_final.select_dtypes(include=[np.number]).columns
    for col in numeric_cols:
        if col not in ['GEOID']:
            features_final[col] = features_final[col].fillna(features_final[col].median())

    missing_after = features_final.isnull().sum().sum()
    print(f"   Missing values: {missing_before} → {missing_after}")

    # Save feature matrix
    output_file = '../data/processed/bg_features.csv'
    features_final.to_csv(output_file, index=False)

    # Summary statistics
    print("\n" + "=" * 60)
    print("FEATURE MATRIX SUMMARY")
    print("=" * 60)
    print(f"Total block groups: {len(features_final)}")
    print(f"Total features: {len(final_features) - 2}")  # Exclude GEOID, NAME
    print(f"\nKey Derived Features:")
    print(f"  Affordability Ratio (median): {features_final['affordability_ratio'].median():.2f}")
    print(f"  Cost Burden % (mean): {features_final['cost_burden_pct'].mean():.1f}%")
    print(f"  Gentrification Pressure (mean): {features_final['gentrification_pressure'].mean():.1f}")
    print(f"  Owner Stability (mean): {features_final['owner_stability'].mean():.1f}%")

    # Feature correlation check (top absolute correlations)
    print(f"\nTop Feature Correlations:")
    corr_matrix = features_final[numeric_cols].corr()
    # Get upper triangle, exclude diagonal
    corr_pairs = []
    for i in range(len(corr_matrix.columns)):
        for j in range(i+1, len(corr_matrix.columns)):
            corr_pairs.append((
                corr_matrix.columns[i],
                corr_matrix.columns[j],
                abs(corr_matrix.iloc[i, j])
            ))
    top_corrs = sorted(corr_pairs, key=lambda x: x[2], reverse=True)[:5]
    for feat1, feat2, corr in top_corrs:
        print(f"  {feat1} <-> {feat2}: {corr:.3f}")

    print(f"\nOutput file: {output_file}")
    print("\n✅ Feature engineering complete!")
    print("\n📊 Ready for ML model training (script 06)")

if __name__ == "__main__":
    engineer_features()
