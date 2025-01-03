import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function MortgageCalc() {
  const [inputs, setInputs] = useState({
    propertyPrice: "",
    creditScore: "",
    term: "",
    downPayment: "",
    downPaymentPercent: 0,
  });
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [loanDetails, setLoanDetails] = useState({
    rate: null,
    incomeRequired: null,
    crossoverMonth: null,
  });
  const [amortizationSchedule, setAmortizationSchedule] = useState([]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs({ ...inputs, [name]: value });

    if (name === "downPaymentPercent") {
      const downPayment = (parseFloat(inputs.propertyPrice) * value) / 100;
      setInputs((prev) => ({
        ...prev,
        downPayment: downPayment.toFixed(2),
      }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const propertyPrice = parseFloat(inputs.propertyPrice);
    const creditScore = parseInt(inputs.creditScore, 10);
    const term = parseInt(inputs.term, 10);
    const downPayment = parseFloat(inputs.downPayment);

    const principal = propertyPrice - downPayment;

    let rate;
    if (creditScore >= 750) {
      rate = 0.035;
    } else if (creditScore >= 700) {
      rate = 0.040;
    } else if (creditScore >= 650) {
      rate = 0.050;
    } else {
      rate = 0.065;
    }

    const monthlyRate = rate / 12;
    const totalPayments = term * 12;

    const payment =
      principal *
      (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
      (Math.pow(1 + monthlyRate, totalPayments) - 1);

    setMonthlyPayment(payment.toFixed(2));

    const schedule = [];
    let remainingBalance = principal;
    let crossoverMonth = null;

    for (let i = 1; i <= totalPayments; i++) {
      const interestPayment = remainingBalance * monthlyRate;
      const principalPayment = payment - interestPayment;
      remainingBalance -= principalPayment;

      schedule.push({
        month: i,
        principalPayment: principalPayment.toFixed(2),
        interestPayment: interestPayment.toFixed(2),
        remainingBalance: remainingBalance > 0 ? remainingBalance.toFixed(2) : "0.00",
      });

      if (!crossoverMonth && principalPayment > interestPayment) {
        crossoverMonth = i;
      }
    }

    setAmortizationSchedule(schedule);

    const incomeRequired = (payment * 100) / 28;

    setLoanDetails({
      rate: (rate * 100).toFixed(2),
      incomeRequired: incomeRequired.toFixed(2),
      crossoverMonth,
    });
  };

  return (
    <div className="p-4 bg-light rounded shadow-sm" style={{ maxWidth: "600px", margin: "auto" }}>
      <form onSubmit={handleSubmit}>
        <h3 className="text-center mb-4">Mortgage Calculator</h3>

        <div className="mb-3">
          <label htmlFor="propertyPrice" className="form-label">
            Property Price
          </label>
          <input
            type="number"
            className="form-control"
            id="propertyPrice"
            name="propertyPrice"
            placeholder="Enter property price"
            value={inputs.propertyPrice}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="creditScore" className="form-label">
            Credit Score
          </label>
          <input
            type="number"
            className="form-control"
            id="creditScore"
            name="creditScore"
            placeholder="Enter credit score"
            value={inputs.creditScore}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="term" className="form-label">
            Loan Term (Years)
          </label>
          <input
            type="number"
            className="form-control"
            id="term"
            name="term"
            placeholder="Enter loan term in years"
            value={inputs.term}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="downPayment" className="form-label">
            Down Payment
          </label>
          <input
            type="number"
            className="form-control"
            id="downPayment"
            name="downPayment"
            placeholder="Enter down payment"
            value={inputs.downPayment}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="downPaymentPercent" className="form-label">
            Down Payment Percentage: {inputs.downPaymentPercent}%
          </label>
          <input
            type="range"
            className="form-range"
            id="downPaymentPercent"
            name="downPaymentPercent"
            min="0"
            max="100"
            value={inputs.downPaymentPercent}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Calculate Monthly Payment
        </button>
      </form>

      {monthlyPayment && (
        <div className="mt-4">
          <h4>Loan Details</h4>
          <p>Interest Rate: {loanDetails.rate}%</p>
          <p>Monthly Payment: ${monthlyPayment}</p>
          <p>Principal {">"} Interest Starts: Month {loanDetails.crossoverMonth}</p>
          <p>Recommended Income: ${loanDetails.incomeRequired} per year</p>
        </div>
      )}

      {amortizationSchedule.length > 0 && (
        <div className="mt-4">
          <h4>Amortization Schedule</h4>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Month</th>
                <th>Principal</th>
                <th>Interest</th>
                <th>Remaining Balance</th>
              </tr>
            </thead>
            <tbody>
              {amortizationSchedule.map((item) => (
                <tr key={item.month}>
                  <td>{item.month}</td>
                  <td>${item.principalPayment}</td>
                  <td>${item.interestPayment}</td>
                  <td>${item.remainingBalance}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default MortgageCalc;
