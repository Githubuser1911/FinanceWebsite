import requests
from bs4 import BeautifulSoup
import pandas as pd

# Constants
SEC_BASE_URL = "https://data.sec.gov"
HEADERS = {
    "User-Agent": "YourAppName/1.0 (your.email@example.com)",  # Replace with your details
    "Accept-Encoding": "gzip, deflate",
}

# Function to fetch CIK based on the stock ticker
def get_cik(ticker):
    """
    Fetches the Central Index Key (CIK) for a given stock ticker.
    """
    cik_map_url = f"{SEC_BASE_URL}/submissions/CIK.json"
    response = requests.get(cik_map_url, headers=HEADERS)
    cik_map = response.json()
    
    ticker = ticker.upper()
    if ticker in cik_map:
        return cik_map[ticker]["cik_str"].zfill(10)  # CIK must be 10 digits
    raise ValueError("Ticker not found in CIK mapping.")

# Function to fetch the latest filing URLs for 10-K and 10-Q
def get_latest_filings(cik):
    """
    Fetches the latest 10-K and 10-Q filing URLs for a given company.
    """
    filings_url = f"{SEC_BASE_URL}/submissions/{cik}.json"
    response = requests.get(filings_url, headers=HEADERS)
    filings = response.json()

    urls = {"10-K": None, "10-Q": None}
    for filing in filings["filings"]["recent"]["form"]:
        if filing == "10-K" and not urls["10-K"]:
            urls["10-K"] = filings["filings"]["recent"]["primaryDocument"][0]
        elif filing == "10-Q" and not urls["10-Q"]:
            urls["10-Q"] = filings["filings"]["recent"]["primaryDocument"][0]
        if all(urls.values()):
            break
    return urls

# Function to extract financial data from 10-K or 10-Q
def extract_financial_data(filing_url):
    """
    Parses the financial data from a given SEC filing.
    """
    response = requests.get(filing_url, headers=HEADERS)
    soup = BeautifulSoup(response.content, "html.parser")

    # Extract tables from the filing
    tables = soup.find_all("table")
    financial_data = {}

    for table in tables:
        if "Consolidated Statements of Cash Flows" in table.text:
            df = pd.read_html(str(table))[0]
            financial_data["cash_flow"] = df
        elif "Consolidated Balance Sheets" in table.text:
            df = pd.read_html(str(table))[0]
            financial_data["balance_sheet"] = df
        elif "Consolidated Statements of Operations" in table.text:
            df = pd.read_html(str(table))[0]
            financial_data["income_statement"] = df

    return financial_data

# Function to compute FCF and other metrics
def compute_dcf_metrics(financial_data):
    """
    Computes the necessary metrics like FCF, revenue growth, etc.
    """
    # Extract relevant tables
    cash_flow = financial_data.get("cash_flow", pd.DataFrame())
    balance_sheet = financial_data.get("balance_sheet", pd.DataFrame())
    income_statement = financial_data.get("income_statement", pd.DataFrame())

    if cash_flow.empty or balance_sheet.empty or income_statement.empty:
        raise ValueError("Unable to find required financial tables.")

    # Free Cash Flow Calculation
    operating_cash_flow = float(
        cash_flow.loc[cash_flow["Description"].str.contains("Net Cash Provided by Operating Activities", case=False, na=False), "Amount"].values[0]
    )
    capex = float(
        cash_flow.loc[cash_flow["Description"].str.contains("Capital Expenditures", case=False, na=False), "Amount"].values[0]
    )
    free_cash_flow = operating_cash_flow - abs(capex)

    # Revenue Calculation
    revenue = float(
        income_statement.loc[income_statement["Description"].str.contains("Revenue", case=False, na=False), "Amount"].values[0]
    )

    # Debt and Equity
    total_debt = float(
        balance_sheet.loc[balance_sheet["Description"].str.contains("Total Debt", case=False, na=False), "Amount"].values[0]
    )
    total_equity = float(
        balance_sheet.loc[balance_sheet["Description"].str.contains("Total Equity", case=False, na=False), "Amount"].values[0]
    )

    return {
        "free_cash_flow": free_cash_flow,
        "revenue": revenue,
        "total_debt": total_debt,
        "total_equity": total_equity,
    }

# Main Function to Run the Process
def main():
    ticker = input("Enter the stock ticker (e.g., AAPL): ").strip()
    try:
        # Get CIK
        cik = get_cik(ticker)

        # Get latest 10-K and 10-Q filings
        filings = get_latest_filings(cik)
        print("Filing URLs:", filings)

        # Extract data from the latest 10-K
        financial_data = extract_financial_data(filings["10-K"])
        dcf_metrics = compute_dcf_metrics(financial_data)

        # Display the metrics
        print("\nDCF Metrics:")
        for key, value in dcf_metrics.items():
            print(f"{key}: {value}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
