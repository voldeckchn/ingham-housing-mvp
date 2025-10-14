#!/usr/bin/env python3
"""
Script 01: Fetch Census Block Groups for Ingham County, Michigan

Downloads Census TIGER/Line block group boundaries and filters to Ingham County.
Creates a GeoJSON file with ~150-200 block groups.
"""

import geopandas as gpd
import os

def fetch_block_groups():
    """Download and filter Census block groups for Ingham County."""

    print("=" * 60)
    print("STEP 1: FETCH CENSUS BLOCK GROUPS")
    print("=" * 60)

    # Create output directory
    os.makedirs('../data/block_groups', exist_ok=True)

    # Download Census Block Groups for Michigan (State FIPS: 26)
    print("\n📥 Downloading Census Block Groups for Michigan...")
    url = 'https://www2.census.gov/geo/tiger/TIGER2023/BG/tl_2023_26_bg.zip'

    try:
        bg_all = gpd.read_file(url)
        print(f"✓ Downloaded {len(bg_all)} block groups for Michigan")
    except Exception as e:
        print(f"❌ Error downloading data: {e}")
        return

    # Filter to Ingham County (County FIPS: 065)
    # Full GEOID format: SSCCCTTTTTTG where SS=state, CCC=county
    print("\n🔍 Filtering to Ingham County (FIPS: 26065)...")
    ingham_bg = bg_all[bg_all['COUNTYFP'] == '065'].copy()

    print(f"✓ Found {len(ingham_bg)} block groups in Ingham County")

    # Display sample GEOIDs
    print("\n📋 Sample Block Group GEOIDs:")
    for geoid in ingham_bg['GEOID'].head(5):
        print(f"   - {geoid}")

    # Save to GeoJSON
    output_file = '../data/block_groups/ingham_block_groups.geojson'
    print(f"\n💾 Saving to {output_file}...")
    ingham_bg.to_file(output_file, driver='GeoJSON')

    # Summary statistics
    print("\n" + "=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Total block groups: {len(ingham_bg)}")
    print(f"Columns: {list(ingham_bg.columns)}")
    print(f"CRS: {ingham_bg.crs}")
    print(f"Output file: {output_file}")

    # Calculate total area
    ingham_bg_projected = ingham_bg.to_crs(epsg=3857)  # Web Mercator for area calc
    total_area_sq_km = ingham_bg_projected.geometry.area.sum() / 1_000_000
    print(f"Total area: {total_area_sq_km:.1f} km²")

    print("\n✅ Block group boundaries ready!")

if __name__ == "__main__":
    fetch_block_groups()
