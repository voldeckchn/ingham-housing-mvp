#!/usr/bin/env python3
"""
Script 06: Train ML Models

Trains two Random Forest models:
1. Housing Equity Score (0-100) - predicts overall housing equity
2. Foreclosure Risk Score (0-100) - predicts foreclosure risk

Models are saved as .pkl files for generating predictions.
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
import os

np.random.seed(42)

def calculate_equity_score(row):
    """
    Calculate Housing Equity Score (0-100).
    Composite of: affordability, stability, opportunity, quality.
    """
    # 1. Affordability (40% weight) - lower cost burden = higher score
    affordability = 100 - min(row['cost_burden_pct'], 100)

    # 2. Stability (30% weight) - lower foreclosure risk = higher score
    stability = 100 - (row['foreclosure_rate'] * 100)

    # 3. Opportunity (20% weight) - proxy: income level vs county median
    opportunity = min((row['median_income'] / 55000) * 50, 100)

    # 4. Quality (10% weight) - proxy: property age and market liquidity
    quality = (100 - row['property_age_estimate']) * 0.5 + row['market_liquidity'] * 0.5

    # Weighted average
    equity_score = (
        0.40 * affordability +
        0.30 * stability +
        0.20 * opportunity +
        0.10 * quality
    )

    return np.clip(equity_score, 0, 100)


def calculate_foreclosure_risk(row):
    """
    Calculate Foreclosure Risk Score (0-100).
    Based on: cost burden, price volatility, income stability.
    """
    # 1. Cost Burden Risk (50% weight)
    cost_burden_risk = min(row['cost_burden_pct'], 100)

    # 2. Price Volatility Risk (30% weight) - high volatility = higher risk
    price_volatility = abs(row['price_yoy_change']) * 500  # Scale to 0-100
    price_volatility = min(price_volatility, 100)

    # 3. Income Risk (20% weight) - low income = higher risk
    income_risk = max(0, 100 - (row['median_income'] / 75000 * 100))

    # Weighted average
    foreclosure_risk = (
        0.50 * cost_burden_risk +
        0.30 * price_volatility +
        0.20 * income_risk
    )

    return np.clip(foreclosure_risk, 0, 100)


def train_models():
    """Train Random Forest models for equity and foreclosure prediction."""

    print("=" * 60)
    print("STEP 6: TRAIN ML MODELS")
    print("=" * 60)

    # Load features
    features_file = '../data/processed/bg_features.csv'

    if not os.path.exists(features_file):
        print(f"\n❌ Error: {features_file} not found")
        print("   Run script 05_engineer_features.py first")
        return

    features = pd.read_csv(features_file)
    print(f"\n✓ Loaded features: {len(features)} block groups")

    # Create target variables
    print("\n🎯 Creating target variables...")
    features['equity_score'] = features.apply(calculate_equity_score, axis=1)
    features['foreclosure_risk_score'] = features.apply(calculate_foreclosure_risk, axis=1)

    print(f"   Equity Score - Mean: {features['equity_score'].mean():.1f}, Range: [{features['equity_score'].min():.1f}, {features['equity_score'].max():.1f}]")
    print(f"   Foreclosure Risk - Mean: {features['foreclosure_risk_score'].mean():.1f}, Range: [{features['foreclosure_risk_score'].min():.1f}, {features['foreclosure_risk_score'].max():.1f}]")

    # Define feature columns for ML models
    feature_cols = [
        'median_income',
        'pct_owner_occupied',
        'pct_cost_burdened',
        'pct_minority',
        'median_sale_price',
        'price_yoy_change',
        'days_on_market',
        'affordability_ratio',
        'cost_burden_pct',
        'market_liquidity',
        'owner_stability',
        'price_to_assessed_ratio'
    ]

    X = features[feature_cols].copy()
    y_equity = features['equity_score']
    y_foreclosure = features['foreclosure_risk_score']

    # Handle any remaining NaNs
    X = X.fillna(X.median())

    print(f"\n📊 Feature matrix: {X.shape[0]} samples × {X.shape[1]} features")

    # Split data (80/20 train/test)
    X_train, X_test, y_equity_train, y_equity_test = train_test_split(
        X, y_equity, test_size=0.2, random_state=42
    )
    _, _, y_fc_train, y_fc_test = train_test_split(
        X, y_foreclosure, test_size=0.2, random_state=42
    )

    print(f"   Train set: {len(X_train)} samples")
    print(f"   Test set: {len(X_test)} samples")

    # Train Equity Score Model
    print("\n🌲 Training Equity Score Model (Random Forest)...")
    equity_model = RandomForestRegressor(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    equity_model.fit(X_train, y_equity_train)

    # Evaluate
    y_equity_pred = equity_model.predict(X_test)
    equity_r2 = r2_score(y_equity_test, y_equity_pred)
    equity_mae = mean_absolute_error(y_equity_test, y_equity_pred)

    print(f"   ✓ R² Score: {equity_r2:.3f}")
    print(f"   ✓ MAE: {equity_mae:.2f} points")

    # Cross-validation
    cv_scores = cross_val_score(equity_model, X_train, y_equity_train, cv=5, scoring='r2')
    print(f"   ✓ CV R² (5-fold): {cv_scores.mean():.3f} ± {cv_scores.std():.3f}")

    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': feature_cols,
        'importance': equity_model.feature_importances_
    }).sort_values('importance', ascending=False)

    print(f"\n   Top 5 Features for Equity Score:")
    for _, row in feature_importance.head(5).iterrows():
        print(f"      {row['feature']}: {row['importance']:.3f}")

    # Train Foreclosure Risk Model
    print("\n🌲 Training Foreclosure Risk Model (Random Forest)...")
    foreclosure_model = RandomForestRegressor(
        n_estimators=100,
        max_depth=10,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    foreclosure_model.fit(X_train, y_fc_train)

    # Evaluate
    y_fc_pred = foreclosure_model.predict(X_test)
    fc_r2 = r2_score(y_fc_test, y_fc_pred)
    fc_mae = mean_absolute_error(y_fc_test, y_fc_pred)

    print(f"   ✓ R² Score: {fc_r2:.3f}")
    print(f"   ✓ MAE: {fc_mae:.2f} points")

    # Cross-validation
    cv_scores_fc = cross_val_score(foreclosure_model, X_train, y_fc_train, cv=5, scoring='r2')
    print(f"   ✓ CV R² (5-fold): {cv_scores_fc.mean():.3f} ± {cv_scores_fc.std():.3f}")

    # Feature importance
    feature_importance_fc = pd.DataFrame({
        'feature': feature_cols,
        'importance': foreclosure_model.feature_importances_
    }).sort_values('importance', ascending=False)

    print(f"\n   Top 5 Features for Foreclosure Risk:")
    for _, row in feature_importance_fc.head(5).iterrows():
        print(f"      {row['feature']}: {row['importance']:.3f}")

    # Save models
    os.makedirs('../models', exist_ok=True)

    equity_model_file = '../models/equity_model.pkl'
    foreclosure_model_file = '../models/foreclosure_model.pkl'

    print(f"\n💾 Saving models...")
    joblib.dump(equity_model, equity_model_file)
    joblib.dump(foreclosure_model, foreclosure_model_file)

    print(f"   ✓ {equity_model_file}")
    print(f"   ✓ {foreclosure_model_file}")

    # Summary
    print("\n" + "=" * 60)
    print("MODEL TRAINING SUMMARY")
    print("=" * 60)
    print(f"Equity Score Model:")
    print(f"  R²:  {equity_r2:.3f}")
    print(f"  MAE: {equity_mae:.2f} points")
    print(f"\nForeclosure Risk Model:")
    print(f"  R²:  {fc_r2:.3f}")
    print(f"  MAE: {fc_mae:.2f} points")
    print(f"\nModels saved to: ../models/")

    print("\n✅ ML model training complete!")
    print("\n📊 Ready to generate predictions (script 07)")

if __name__ == "__main__":
    train_models()
