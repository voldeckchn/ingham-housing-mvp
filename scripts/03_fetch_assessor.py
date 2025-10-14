#!/usr/bin/env python3
"""
Script 03: Fetch County Assessor Data (Placeholder)

For MVP: We'll skip real assessor data and rely on Census median home values.
Real assessor data would come from Ingham County's open data portal or FOIA request.

This script is a placeholder that shows the structure for when you get real data.
"""

import pandas as pd
import geopandas as gpd
import os

def fetch_assessor_data():
    """Placeholder for county assessor data - uses Census data instead."""

    print("=" * 60)
    print("STEP 3: FETCH ASSESSOR DATA (USING CENSUS DATA FOR MVP)")
    print("=" * 60)

    print("\n⚠️  NOTE: Using Census median home values instead of assessor data")
    print("   For production, integrate with:")
    print("   - Ingham County Treasurer's Office")
    print("   - Michigan.gov Open Data Portal")
    print("   - FOIA request for parcel data")

    # Load Census data (already has median_home_value)
    census_file = '../data/processed/census_by_bg.csv'

    if not os.path.exists(census_file):
        print(f"\n❌ Error: {census_file} not found")
        print("   Run script 02_fetch_census.py first")
        return

    census = pd.read_csv(census_file)
    print(f"\n✓ Loaded Census data: {len(census)} block groups")

    # Create assessor-style aggregations
    # In real system: spatial join parcels → block groups, then aggregate
    assessor_agg = pd.DataFrame({
        'GEOID': census['GEOID'],
        'assessed_value_median': census['median_home_value'],
        'assessed_value_mean': census['median_home_value'] * 1.05,  # Slight adjustment
        'parcel_count_estimated': (census['total_units'] * 0.95).astype(int),  # Est. parcels
    })

    # Add property age estimate (inverse of home value - higher value = newer)
    # This is synthetic - real assessor data would have actual build years
    max_value = assessor_agg['assessed_value_median'].max()
    assessor_agg['property_age_estimate'] = (
        50 - ((assessor_agg['assessed_value_median'] / max_value) * 30)
    ).clip(5, 100).astype(int)

    # Save
    output_file = '../data/processed/assessor_by_bg.csv'
    assessor_agg.to_csv(output_file, index=False)

    # Summary
    print("\n" + "=" * 60)
    print("SUMMARY (SYNTHETIC DATA FOR MVP)")
    print("=" * 60)
    print(f"Total block groups: {len(assessor_agg)}")
    print(f"\nAssessed Values:")
    print(f"  Median: ${assessor_agg['assessed_value_median'].median():,.0f}")
    print(f"  Range: ${assessor_agg['assessed_value_median'].min():,.0f} - ${assessor_agg['assessed_value_median'].max():,.0f}")
    print(f"\nEstimated Parcels: {assessor_agg['parcel_count_estimated'].sum():,}")
    print(f"Output file: {output_file}")

    print("\n✅ Assessor data (synthetic) ready!")
    print("\n💡 NEXT STEPS FOR PRODUCTION:")
    print("   1. Contact Ingham County Equalization Department")
    print("   2. Request parcel shapefile with assessed values")
    print("   3. Spatial join parcels to block groups")
    print("   4. Aggregate: median value, parcel count, avg lot size")

if __name__ == "__main__":
    fetch_assessor_data()
