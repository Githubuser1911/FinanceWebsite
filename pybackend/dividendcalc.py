from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime
from yahoo_fin import stock_info as si
import mysql.connector
import logging

# Setup logging
logging.basicConfig(level=logging.DEBUG)

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Database configuration
db_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'nodejs-login'
}

def get_db_connection():
    """Establishes a connection to the database."""
    try:
        return mysql.connector.connect(**db_config)
    except mysql.connector.Error as err:
        logging.error(f"Database connection error: {err}")
        raise

def fetch_stock_data(ticker):
    """
    Fetch stock data using yahoo_fin.
    Includes stock price, dividend yield, and forward dividend.
    """
    try:
        price = si.get_live_price(ticker)
        stats = si.get_quote_table(ticker, dict_result=True)
        dividend_yield_data = stats.get('Forward Dividend & Yield', 'N/A')

        # Parse dividend and yield
        if dividend_yield_data != 'N/A' and isinstance(dividend_yield_data, str):
            dividend, yield_percentage = dividend_yield_data.split(" ")
            annual_dividend = float(dividend.strip("$"))
            dividend_yield = float(yield_percentage.strip("()%"))
        else:
            annual_dividend = 0.0
            dividend_yield = 0.0

        return {
            'price': price,
            'annual_dividend': annual_dividend,
            'dividend_yield': dividend_yield
        }
    except Exception as e:
        logging.error(f"Error fetching stock data for {ticker}: {e}")
        return None

def calculate_lifetime_earnings(purchase_date, annual_dividend, shares):
    """
    Calculate lifetime earnings based on purchase date, annual dividend, and shares.
    """
    try:
        purchase_date = datetime.strptime(purchase_date, "%Y-%m-%d")
        current_date = datetime.now()

        # Calculate the total number of dividend payouts (quarterly assumed)
        years_held = (current_date - purchase_date).days / 365
        total_payouts = int(years_held * 4)  # 4 payouts per year (quarterly)

        # Lifetime earnings = total payouts × (annual dividend / 4) × shares
        lifetime_earnings = total_payouts * (annual_dividend / 4) * shares
        return lifetime_earnings
    except Exception as e:
        logging.error(f"Error calculating lifetime earnings: {e}")
        return 0.0

@app.route('/calculate-dividends', methods=['POST'])
def calculate_dividends():
    """
    API endpoint to calculate dividend metrics based on user input.
    """
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        ticker = data.get('ticker')
        shares = data.get('shares', 0)
        purchase_date = data.get('purchase_date')

        # Validate input
        if not user_id or not ticker or shares <= 0 or not purchase_date:
            return jsonify({"error": "user_id, ticker, shares > 0, and purchase_date are required"}), 400

        # Fetch stock data
        stock_data = fetch_stock_data(ticker)
        if not stock_data:
            return jsonify({"error": f"Failed to fetch data for ticker {ticker}"}), 500

        # Calculate metrics
        total_invested = shares * stock_data['price']
        lifetime_earnings = calculate_lifetime_earnings(purchase_date, stock_data['annual_dividend'], shares)

        response = {
            "ticker": ticker,
            "shares": shares,
            "price_per_share": stock_data['price'],
            "total_invested": total_invested,
            "annual_dividend": stock_data['annual_dividend'],
            "dividend_yield": stock_data['dividend_yield'],
            "lifetime_earnings": lifetime_earnings,
            "purchase_date": purchase_date
        }

        return jsonify(response), 200
    except Exception as e:
        logging.error(f"Error in calculate_dividends: {e}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/save-dividends', methods=['POST'])
def save_dividends():
    """
    API endpoint to save dividend data to the database.
    """
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        dividends = data.get('dividends', [])

        # Validate input
        if not user_id or not dividends:
            return jsonify({"error": "user_id and dividends data are required"}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        insert_query = """
            INSERT INTO dividends (user_id, ticker, shares, total_invested, lifetime_earnings, dividend_yield, purchase_date)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """

        # Insert each dividend entry
        for dividend in dividends:
            cursor.execute(insert_query, (
                user_id,
                dividend.get('ticker'),
                dividend.get('shares'),
                dividend.get('total_invested'),
                dividend.get('lifetime_earnings'),
                dividend.get('dividend_yield'),
                dividend.get('purchase_date')
            ))

        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "Dividends saved successfully!"}), 200
    except Exception as e:
        logging.error(f"Error saving dividends: {e}")
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True)
