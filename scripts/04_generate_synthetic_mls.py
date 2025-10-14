#!/usr/bin/env python3
"""
Script 04: Generate Synthetic MLS Data

Creates realistic-looking MLS-style sales data based on Census data.
For MVP only - real production system would use actual MLS data from
Greater Lansing Association of Realtors.
"""

import pandas as pd
import geopandas as gpd
import numpy as np
import os

np.random.seed(42)  # Reproducible synthetic data

def generate_synthetic_mls():
    """Generate synthetic MLS sales data for each block group."""

    print("=" * 60)
    print("STEP 4: GENERATE SYNTHETIC MLS DATA")
    print("=" * 60)

    print("\n⚠️  NOTE: Generating synthetic data for MVP demonstration")
    print("   Real production system would use actual MLS feed")

    # Load Census data and block group geometries
    census_file = '../data/processed/census_by_bg.csv'
    bg_file = '../data/block_groups/ingham_block_groups.geojson'

    if not os.path.exists(census_file) or not os.path.exists(bg_file):
        print("\n❌ Error: Required files not found")
        print("   Run scripts 01 and 02 first")
        return

    census = pd.read_csv(census_file)
    bg_geo = gpd.read_file(bg_file)

    print(f"\n✓ Loaded {len(census)} block groups")

    # Ensure GEOID is string in both dataframes
    census['GEOID'] = census['GEOID'].astype(str)
    bg_geo['GEOID'] = bg_geo['GEOID'].astype(str)

    # Merge census data with geometries
    bg_data = bg_geo.merge(census, on='GEOID')

    # Calculate centroids for distance calculations
    bg_data['centroid_lon'] = bg_data.geometry.centroid.x
    bg_data['centroid_lat'] = bg_data.geometry.centroid.y

    # Downtown Lansing coordinates (approximate Capitol building)
    DOWNTOWN_LON = -84.5555
    DOWNTOWN_LAT = 42.7325

    # Calculate distance to downtown (in degrees - rough proxy)
    bg_data['dist_to_downtown'] = np.sqrt(
        (bg_data['centroid_lon'] - DOWNTOWN_LON)**2 +
        (bg_data['centroid_lat'] - DOWNTOWN_LAT)**2
    )

    print("\n🏠 Generating synthetic MLS sales data...")

    sales_data = []

    for _, row in bg_data.iterrows():
        # Base price from Census median home value
        base_price = row['median_home_value'] if pd.notna(row['median_home_value']) else 150000

        # Price trend: closer to downtown = higher appreciation
        # Also factor in median income (proxy for gentrification pressure)
        distance_factor = 1 - (row['dist_to_downtown'] / bg_data['dist_to_downtown'].max())
        income_factor = (row['median_income'] / bg_data['median_income'].max()) if pd.notna(row['median_income']) else 0.5

        # YoY price change: baseline 3% + distance boost + income boost + noise
        yoy_change = 0.03  # 3% baseline
        yoy_change += distance_factor * 0.04  # Up to 4% boost near downtown
        yoy_change += income_factor * 0.02  # Up to 2% boost in higher income areas
        yoy_change += np.random.normal(0, 0.02)  # ±2% random noise
        yoy_change = np.clip(yoy_change, -0.05, 0.15)  # Clip to [-5%, 15%]

        # Days on market: inversely related to demand
        # Lower income + far from downtown = longer on market
        base_dom = 45  # days
        dom = base_dom + (1 - distance_factor) * 30  # +0-30 days if far
        dom = dom + (1 - income_factor) * 20  # +0-20 days if low income
        dom = dom + np.random.normal(0, 10)  # Random variation
        dom = int(np.clip(dom, 7, 180))  # Clip to reasonable range

        # Sale count: based on total units and turnover rate
        turnover_rate = 0.05  # 5% annual turnover baseline
        # Higher turnover in high-appreciation areas (flipping)
        if yoy_change > 0.08:
            turnover_rate += 0.02
        sale_count = int(row['total_units'] * turnover_rate) if pd.notna(row['total_units']) else 5
        sale_count = max(2, sale_count)  # At least 2 sales per area

        # Sale price: apply YoY change to median
        median_sale_price = base_price * (1 + yoy_change)

        # Price per square foot (synthetic - typical range $80-180)
        price_per_sqft = 80 + (median_sale_price / 300000) * 100
        price_per_sqft = np.clip(price_per_sqft, 60, 200)

        sales_data.append({
            'GEOID': row['GEOID'],
            'median_sale_price': int(median_sale_price),
            'price_yoy_change': round(yoy_change, 4),
            'days_on_market': dom,
            'sale_count_12mo': sale_count,
            'price_per_sqft': int(price_per_sqft),
            'dist_to_downtown': round(row['dist_to_downtown'], 4)
        })

    sales_df = pd.DataFrame(sales_data)

    # Save to CSV
    output_file = '../data/processed/synthetic_mls_by_bg.csv'
    sales_df.to_csv(output_file, index=False)

    # Summary statistics
    print("\n" + "=" * 60)
    print("SUMMARY (SYNTHETIC DATA)")
    print("=" * 60)
    print(f"Total block groups: {len(sales_df)}")
    print(f"\nMedian Sale Price:")
    print(f"  Mean:   ${sales_df['median_sale_price'].mean():,.0f}")
    print(f"  Range:  ${sales_df['median_sale_price'].min():,.0f} - ${sales_df['median_sale_price'].max():,.0f}")
    print(f"\nPrice Appreciation (YoY):")
    print(f"  Mean:   {sales_df['price_yoy_change'].mean():.1%}")
    print(f"  Range:  {sales_df['price_yoy_change'].min():.1%} to {sales_df['price_yoy_change'].max():.1%}")
    print(f"  Hot markets (>8% growth): {(sales_df['price_yoy_change'] > 0.08).sum()}")
    print(f"\nDays on Market:")
    print(f"  Mean:   {sales_df['days_on_market'].mean():.0f} days")
    print(f"  Range:  {sales_df['days_on_market'].min()} - {sales_df['days_on_market'].max()} days")
    print(f"\nTotal Sales (12mo): {sales_df['sale_count_12mo'].sum():,}")
    print(f"Output file: {output_file}")

    print("\n✅ Synthetic MLS data ready!")
    print("\n💡 NEXT STEPS FOR PRODUCTION:")
    print("   1. Partner with Greater Lansing Association of Realtors")
    print("   2. Get MLS data feed (RETS or Spark API)")
    print("   3. Geocode property addresses to lat/lon")
    print("   4. Spatial join to block groups")
    print("   5. Calculate metrics: median price, DOM, sale volume")

if __name__ == "__main__":
    generate_synthetic_mls()
