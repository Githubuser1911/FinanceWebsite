import React, { useState } from "react";

// Utility Function: Cumulative Distribution Function for a Standard Normal Distribution
function normCDF(x) {
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x < 0 ? -1 : 1;
    const absX = Math.abs(x) / Math.sqrt(2.0);

    const t = 1.0 / (1.0 + p * absX);
    const erf = 1.0 - ((((a5 * t + a4) * t) + a3) * t + a2) * t * a1 * Math.exp(-absX * absX);

    return 0.5 * (1.0 + sign * erf);
}

function BlackScholesForm() {
    const [inputs, setInputs] = useState({
        stockPrice: "",
        strikePrice: "",
        timeToMaturity: "",
        riskFreeRate: "",
        volatility: "",
    });

    const [callPrice, setCallPrice] = useState(null);
    const [putPrice, setPutPrice] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs({ ...inputs, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const S = parseFloat(inputs.stockPrice);
        const K = parseFloat(inputs.strikePrice);
        const T = parseFloat(inputs.timeToMaturity);
        const r = parseFloat(inputs.riskFreeRate) / 100;
        const sigma = parseFloat(inputs.volatility) / 100;

        if (isNaN(S) || isNaN(K) || isNaN(T) || isNaN(r) || isNaN(sigma)) {
            alert("Please enter valid numbers for all fields.");
            return;
        }

        const d1 = (Math.log(S / K) + (r + (sigma ** 2) / 2) * T) / (sigma * Math.sqrt(T));
        const d2 = d1 - sigma * Math.sqrt(T);

        const call = S * normCDF(d1) - K * Math.exp(-r * T) * normCDF(d2);
        const put = K * Math.exp(-r * T) * normCDF(-d2) - S * normCDF(-d1);

        setCallPrice(call.toFixed(2));
        setPutPrice(put.toFixed(2));
    };

    return (
        <div className="p-4 bg-light rounded shadow-sm" style={{ maxWidth: "600px", margin: "auto" }}>
            <form onSubmit={handleSubmit}>
                <h3 className="text-center mb-4">Black-Scholes Option Calculator</h3>

                <div className="mb-3">
                    <label htmlFor="stockPrice" className="form-label">
                        Stock Price (S)
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="stockPrice"
                        name="stockPrice"
                        placeholder="Enter stock price"
                        value={inputs.stockPrice}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="strikePrice" className="form-label">
                        Strike Price (K)
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="strikePrice"
                        name="strikePrice"
                        placeholder="Enter strike price"
                        value={inputs.strikePrice}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="timeToMaturity" className="form-label">
                        Time to Maturity (T) (in years)
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="timeToMaturity"
                        name="timeToMaturity"
                        placeholder="Enter time to maturity"
                        step="0.01"
                        value={inputs.timeToMaturity}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="riskFreeRate" className="form-label">
                        Risk-Free Rate (r) (%)
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="riskFreeRate"
                        name="riskFreeRate"
                        placeholder="Enter risk-free rate"
                        step="0.01"
                        value={inputs.riskFreeRate}
                        onChange={handleChange}
                    />
                </div>

                <div className="mb-3">
                    <label htmlFor="volatility" className="form-label">
                        Volatility (σ) (%)
                    </label>
                    <input
                        type="number"
                        className="form-control"
                        id="volatility"
                        name="volatility"
                        placeholder="Enter volatility"
                        step="0.01"
                        value={inputs.volatility}
                        onChange={handleChange}
                    />
                </div>

                <button type="submit" className="btn btn-primary w-100">
                    Calculate Option Prices
                </button>
            </form>

            {callPrice !== null && putPrice !== null && (
                <div className="mt-4">
                    <h5 className="color-black text-center">
                        Call Option Price: ${callPrice}
                    </h5>
                    <h5 className="color-black text-center">
                        Put Option Price: ${putPrice}
                    </h5>
                </div>
            )}

            <div className="mt-4 p-3 bg-white border rounded">
                <h5>Model Assumptions</h5>
                <ul className="mb-0">
                    <li>Markets are efficient (no arbitrage opportunities).</li>
                    <li>The stock price follows a geometric Brownian motion.</li>
                    <li>The risk-free rate and volatility are constant over time.</li>
                    <li>No dividends are paid during the option's life.</li>
                    <li>The options can only be exercised at expiration (European-style).</li>
                </ul>
            </div>
        </div>
    );
}

export default BlackScholesForm;