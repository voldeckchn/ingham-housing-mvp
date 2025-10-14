#!/bin/bash
#
# Ingham County Housing Equity MVP - Data Pipeline Runner
#
# Runs all 7 Python scripts in sequence to generate predictions.
# Run with: bash run_pipeline.sh
#

set -e  # Exit on error

echo "========================================"
echo "INGHAM COUNTY HOUSING EQUITY MVP"
echo "Data Pipeline Runner"
echo "========================================"
echo ""

# Check Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Error: python3 not found"
    echo "   Install Python 3.8+ first"
    exit 1
fi

# Check if venv exists, if not create it
if [ ! -d "venv" ]; then
    echo "📦 Creating Python virtual environment..."
    python3 -m venv venv
    echo "✓ Virtual environment created"
fi

# Activate venv
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -q --upgrade pip
pip install -q -r requirements.txt
echo "✓ Dependencies installed"

echo ""
echo "========================================"
echo "RUNNING DATA PIPELINE (7 SCRIPTS)"
echo "========================================"
echo ""

# Run each script
cd scripts

echo "▶️  Script 1/7: Fetching block group boundaries..."
python3 01_fetch_block_groups.py
echo ""

echo "▶️  Script 2/7: Fetching Census ACS data..."
python3 02_fetch_census.py
echo ""

echo "▶️  Script 3/7: Fetching assessor data (synthetic)..."
python3 03_fetch_assessor.py
echo ""

echo "▶️  Script 4/7: Generating synthetic MLS data..."
python3 04_generate_synthetic_mls.py
echo ""

echo "▶️  Script 5/7: Engineering features..."
python3 05_engineer_features.py
echo ""

echo "▶️  Script 6/7: Training ML models..."
python3 06_train_model.py
echo ""

echo "▶️  Script 7/7: Generating predictions..."
python3 07_generate_predictions.py
echo ""

cd ..

echo "========================================"
echo "✅ PIPELINE COMPLETE!"
echo "========================================"
echo ""
echo "📊 Generated files:"
echo "   - data/block_groups/ingham_block_groups.geojson"
echo "   - data/block_groups/bg_predictions.json"
echo "   - models/equity_model.pkl"
echo "   - models/foreclosure_model.pkl"
echo ""
echo "📦 Next steps:"
echo "   1. Initialize Next.js: cd .. && npx create-next-app@latest webapp"
echo "   2. Copy data files to webapp/public/data/"
echo "   3. Build frontend components"
echo "   4. Deploy to Vercel"
echo ""
