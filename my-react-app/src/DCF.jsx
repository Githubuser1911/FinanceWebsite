import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const DCFCalculator = () => {
  const [inputs, setInputs] = useState({
    ticker: "",
    initialFCF: "",
    growthRate: "",
    discountRate: "",
    projectionPeriod: "",
    terminalGrowthRate: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("User Inputs:", inputs);
    alert("DCF calculation functionality is not yet implemented!");
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: "30rem" }}>
        <h2 className="text-center mb-4">Discounted Cash Flow Calculator</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="ticker" className="form-label">
              Ticker Symbol
            </label>
            <input
              type="text"
              className="form-control"
              id="ticker"
              name="ticker"
              value={inputs.ticker}
              onChange={handleInputChange}
              placeholder="Enter ticker (e.g., AAPL)"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="initialFCF" className="form-label">
              Initial Free Cash Flow ($)
            </label>
            <input
              type="number"
              className="form-control"
              id="initialFCF"
              name="initialFCF"
              value={inputs.initialFCF}
              onChange={handleInputChange}
              placeholder="Enter initial FCF"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="growthRate" className="form-label">
              Growth Rate (%)
            </label>
            <input
              type="number"
              className="form-control"
              id="growthRate"
              name="growthRate"
              value={inputs.growthRate}
              onChange={handleInputChange}
              placeholder="Enter growth rate"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="discountRate" className="form-label">
              Discount Rate (%)
            </label>
            <input
              type="number"
              className="form-control"
              id="discountRate"
              name="discountRate"
              value={inputs.discountRate}
              onChange={handleInputChange}
              placeholder="Enter discount rate"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="projectionPeriod" className="form-label">
              Projection Period (Years)
            </label>
            <input
              type="number"
              className="form-control"
              id="projectionPeriod"
              name="projectionPeriod"
              value={inputs.projectionPeriod}
              onChange={handleInputChange}
              placeholder="Enter projection period"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="terminalGrowthRate" className="form-label">
              Terminal Growth Rate (%)
            </label>
            <input
              type="number"
              className="form-control"
              id="terminalGrowthRate"
              name="terminalGrowthRate"
              value={inputs.terminalGrowthRate}
              onChange={handleInputChange}
              placeholder="Enter terminal growth rate"
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Calculate DCF
          </button>
        </form>
      </div>
    </div>
  );
};

export default DCFCalculator;
