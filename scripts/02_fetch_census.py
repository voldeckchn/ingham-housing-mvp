#!/usr/bin/env python3
"""
Script 02: Fetch Census ACS Data for Ingham County Block Groups

Downloads demographic and housing data from Census ACS 5-year estimates.
NO SPATIAL JOINS NEEDED - Direct GEOID match with block groups!
"""

import pandas as pd
import requests
import os

def fetch_census_data():
    """Fetch Census ACS data for Ingham County block groups."""

    print("=" * 60)
    print("STEP 2: FETCH CENSUS ACS DATA")
    print("=" * 60)

    # Create output directory
    os.makedirs('../data/processed', exist_ok=True)

    # Census API key (optional - can use without for small requests)
    # Get free key at: https://api.census.gov/data/key_signup.html
    API_KEY = os.environ.get('CENSUS_API_KEY', None)

    # Define ACS 5-year variables (2022 data)
    variables = {
        'B19013_001E': 'median_income',          # Median household income
        'B25003_001E': 'total_units',            # Total housing units
        'B25003_002E': 'owner_occupied',         # Owner-occupied units
        'B25003_003E': 'renter_occupied',        # Renter-occupied units
        'B25070_010E': 'rent_burden_50pct',      # Renters paying ≥50% income on rent
        'B25070_001E': 'total_renters',          # Total renter households
        'B01003_001E': 'total_population',       # Total population
        'B02001_002E': 'white_population',       # White population
        'B02001_003E': 'black_population',       # Black population
        'B25077_001E': 'median_home_value',      # Median home value
    }

    # Build Census API URL
    base_url = 'https://api.census.gov/data/2022/acs/acs5'
    var_list = ','.join(variables.keys())

    # Request block group data for Ingham County
    params = {
        'get': f'NAME,{var_list}',
        'for': 'block group:*',
        'in': 'state:26 county:065',  # Michigan (26), Ingham County (065)
    }

    if API_KEY:
        params['key'] = API_KEY

    print("\n📥 Fetching Census ACS data from API...")
    print(f"   URL: {base_url}")
    print(f"   Variables: {len(variables)}")

    try:
        response = requests.get(base_url, params=params, timeout=30)
        response.raise_for_status()
        data = response.json()
    except requests.exceptions.RequestException as e:
        print(f"❌ Error fetching Census data: {e}")
        print("\n💡 Tip: Get a free Census API key at:")
        print("   https://api.census.gov/data/key_signup.html")
        print("   Then set: export CENSUS_API_KEY='your_key_here'")
        return

    # Convert to DataFrame
    print(f"✓ Received data for {len(data) - 1} block groups")

    headers = data[0]
    rows = data[1:]
    df = pd.DataFrame(rows, columns=headers)

    # Rename columns
    for code, name in variables.items():
        if code in df.columns:
            df[name] = pd.to_numeric(df[code], errors='coerce')

    # Create GEOID (concatenate state + county + tract + block group)
    df['GEOID'] = (df['state'] + df['county'] + df['tract'] + df['block group'])

    print("\n📋 Sample GEOIDs:")
    for geoid in df['GEOID'].head(3):
        print(f"   - {geoid}")

    # Calculate derived metrics
    print("\n🔧 Engineering derived features...")

    df['pct_owner_occupied'] = (df['owner_occupied'] / df['total_units']).fillna(0)
    df['pct_renter_occupied'] = (df['renter_occupied'] / df['total_units']).fillna(0)
    df['pct_cost_burdened'] = (df['rent_burden_50pct'] / df['total_renters']).fillna(0)
    df['pct_minority'] = (1 - (df['white_population'] / df['total_population'])).fillna(0)

    # Clip percentages to [0, 1]
    for col in ['pct_owner_occupied', 'pct_renter_occupied', 'pct_cost_burdened', 'pct_minority']:
        df[col] = df[col].clip(0, 1)

    # Select final columns
    output_cols = [
        'GEOID', 'NAME',
        'median_income', 'total_units', 'owner_occupied', 'renter_occupied',
        'total_renters', 'total_population', 'white_population', 'black_population',
        'median_home_value', 'pct_owner_occupied', 'pct_renter_occupied',
        'pct_cost_burdened', 'pct_minority'
    ]

    df_final = df[output_cols].copy()

    # Save to CSV
    output_file = '../data/processed/census_by_bg.csv'
    df_final.to_csv(output_file, index=False)

    print(f"✓ Derived features calculated")

    # Summary statistics
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Total block groups: {len(df_final)}")
    print(f"\nMedian Income:")
    print(f"  Mean: ${df_final['median_income'].mean():,.0f}")
    print(f"  Min:  ${df_final['median_income'].min():,.0f}")
    print(f"  Max:  ${df_final['median_income'].max():,.0f}")
    print(f"\nCost Burden:")
    print(f"  Mean: {df_final['pct_cost_burdened'].mean():.1%}")
    print(f"  High burden areas (>40%): {(df_final['pct_cost_burdened'] > 0.4).sum()}")
    print(f"\nOutput file: {output_file}")

    print("\n✅ Census data ready!")

if __name__ == "__main__":
    fetch_census_data()
