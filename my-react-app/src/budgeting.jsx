import React, { useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import 'bootstrap/dist/css/bootstrap.min.css';

// Register the necessary chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Function to calculate income tax based on the progressive tax brackets
const calculateTax = (income) => {
  let tax = 0;

  if (income <= 11000) {
    tax = income * 0.10;
  } else if (income <= 44725) {
    tax = 1100 + (income - 11000) * 0.12;
  } else if (income <= 95375) {
    tax = 5142 + (income - 44725) * 0.22;
  } else if (income <= 182100) {
    tax = 16290 + (income - 95375) * 0.24;
  } else if (income <= 231250) {
    tax = 37104 + (income - 182100) * 0.32;
  } else if (income <= 578100) {
    tax = 52832 + (income - 231250) * 0.35;
  } else {
    tax = 174238 + (income - 578100) * 0.37;
  }

  return tax;
};

function budgeting(income, lifestyle, retirementEstimate, yearsToRetirement) {
  // Define lifestyle expense percentages
  const lifestyleData = {
    cheap: {
      food: 0.12,
      mortgageRent: 0.18,
      entertainment: 0.05,
      car: 0.08,
      clothing: 0.03,
      savings: 0.40,
      other: 0.07,
      travel: 0.02,
      healthcare: 0.05,
      insurance: 0.05
    },
    moderate: {
      food: 0.15,
      mortgageRent: 0.25,
      entertainment: 0.10,
      car: 0.10,
      clothing: 0.05,
      savings: 0.15,
      other: 0.05,
      travel: 0.05,
      healthcare: 0.05,
      insurance: 0.05
    },
    luxury: {
      food: 0.20,
      mortgageRent: 0.30,
      entertainment: 0.15,
      car: 0.10,
      clothing: 0.07,
      savings: 0.10,
      other: 0.03,
      travel: 0.10,
      healthcare: 0.05,
      insurance: 0.10
    }
  };

  // Get the percentage allocations for the selected lifestyle
  const lifestyleAllocations = lifestyleData[lifestyle.toLowerCase()] || lifestyleData['moderate'];

  // Calculate total expenses based on the percentages
  const totalExpenses = {
    food: income * lifestyleAllocations.food,
    mortgageRent: income * lifestyleAllocations.mortgageRent,
    entertainment: income * lifestyleAllocations.entertainment,
    car: income * lifestyleAllocations.car,
    clothing: income * lifestyleAllocations.clothing,
    savings: income * lifestyleAllocations.savings,
    other: income * lifestyleAllocations.other,
    travel: income * lifestyleAllocations.travel,
    healthcare: income * lifestyleAllocations.healthcare,
    insurance: income * lifestyleAllocations.insurance
  };

  // Calculate the income tax
  const taxAmount = calculateTax(income);
  const afterTaxIncome = income - taxAmount;

  // Calculate total annual expenses
  const annualExpenses = Object.values(totalExpenses).reduce((acc, val) => acc + val, 0);

  // Calculate total amount needed for retirement, factoring in 20 years post-retirement
  const totalNeededForRetirement = annualExpenses * 20; // 20 years after retirement

  // Calculate the total savings required before retirement, factoring in how many years to save
  const totalSavingsBeforeRetirement = annualExpenses * yearsToRetirement;

  // Prepare data for the pie chart
  const chartData = {
    labels: ['Food', 'Mortgage/Rent', 'Entertainment', 'Car', 'Clothing', 'Savings', 'Other', 'Travel', 'Healthcare', 'Insurance'],
    datasets: [
      {
        data: [
          totalExpenses.food,
          totalExpenses.mortgageRent,
          totalExpenses.entertainment,
          totalExpenses.car,
          totalExpenses.clothing,
          totalExpenses.savings,
          totalExpenses.other,
          totalExpenses.travel,
          totalExpenses.healthcare,
          totalExpenses.insurance
        ],
        backgroundColor: [
          '#FF6347', // Food
          '#4682B4', // Mortgage/Rent
          '#FFD700', // Entertainment
          '#98FB98', // Car
          '#D2691E', // Clothing
          '#32CD32', // Savings
          '#8A2BE2', // Other
          '#FF1493', // Travel
          '#20B2AA', // Healthcare
          '#8B0000'  // Insurance
        ],
        hoverBackgroundColor: [
          '#FF4500', // Food
          '#4169E1', // Mortgage/Rent
          '#FFEC8B', // Entertainment
          '#66CDAA', // Car
          '#A0522D', // Clothing
          '#228B22', // Savings
          '#6A5ACD', // Other
          '#FF69B4', // Travel
          '#3CB371', // Healthcare
          '#B22222'  // Insurance
        ]
      }
    ]
  };

  // Return the chart data and some additional information
  return {
    chartData,
    totalExpenses,
    taxAmount,
    afterTaxIncome,
    totalNeededForRetirement,
    totalSavingsBeforeRetirement
  };
}

function BudgetingTool() {
  const [income, setIncome] = useState(5000); // Example: $5000 income
  const [lifestyle, setLifestyle] = useState('moderate');
  const [retirementEstimate, setRetirementEstimate] = useState(500);
  const [yearsToRetirement, setYearsToRetirement] = useState(30); // Default to 30 years

  // Call the budgeting function to get chart data and expenses
  const { chartData, totalExpenses, taxAmount, afterTaxIncome, totalNeededForRetirement, totalSavingsBeforeRetirement } = budgeting(
    income,
    lifestyle,
    retirementEstimate,
    yearsToRetirement
  );

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Budgeting Tool</h2>

      <div className="row mb-3">
        <div className="col-md-4">
          <label htmlFor="income" className="form-label">Income</label>
          <input
            type="number"
            className="form-control"
            id="income"
            value={income}
            onChange={(e) => setIncome(parseFloat(e.target.value))}
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="yearsToRetirement" className="form-label">Years to Retirement</label>
          <input
            type="number"
            className="form-control"
            id="yearsToRetirement"
            value={yearsToRetirement}
            onChange={(e) => setYearsToRetirement(parseFloat(e.target.value))}
          />
        </div>

        <div className="col-md-4">
          <label htmlFor="lifestyle" className="form-label">Lifestyle</label>
          <select
            className="form-select"
            id="lifestyle"
            value={lifestyle}
            onChange={(e) => setLifestyle(e.target.value)}
          >
            <option value="cheap">Cheap</option>
            <option value="moderate">Moderate</option>
            <option value="luxury">Luxury</option>
          </select>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col">
          <h4>Total Expenses</h4>
          <ul className="list-group">
            {Object.keys(totalExpenses).map((key) => (
              <li key={key} className="list-group-item">
                {key.charAt(0).toUpperCase() + key.slice(1)}: ${totalExpenses[key].toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col">
          <h4>Tax Information</h4>
          <ul className="list-group">
            <li className="list-group-item">Tax: ${taxAmount.toFixed(2)}</li>
            <li className="list-group-item">After-Tax Income: ${afterTaxIncome.toFixed(2)}</li>
          </ul>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col">
          <h4>Retirement Financial Estimates</h4>
          <ul className="list-group">
            <li className="list-group-item">Total Savings Needed Before Retirement: ${totalSavingsBeforeRetirement.toFixed(2)}</li>
            <li className="list-group-item">Total Needed for Retirement (20 years post-retirement): ${totalNeededForRetirement.toFixed(2)}</li>
          </ul>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col text-center">
          <h4>Expense Allocation (Pie Chart)</h4>
          <div style={{ maxWidth: '400px', margin: 'auto' }}>
            <Pie data={chartData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default BudgetingTool;
