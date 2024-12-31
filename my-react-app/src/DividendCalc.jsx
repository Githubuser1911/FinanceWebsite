import React, { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Cookies from 'js-cookie';

function DividendCalc() {
    const [rows, setRows] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        shares: '',
        purchaseDate: '',
        reinvestDividend: false,
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    // Load saved rows from cookies on component mount
    useEffect(() => {
        const savedRows = Cookies.get('dividendRows');
        if (savedRows) {
            const parsedRows = JSON.parse(savedRows);
            console.log("Loaded saved rows from cookies:", parsedRows);
            setRows(parsedRows);
        } else {
            console.log("No saved rows found in cookies.");
        }
    }, []);

    // Save rows to cookies whenever they change
    useEffect(() => {
        console.log("Saving rows to cookies:", rows);
        Cookies.set('dividendRows', JSON.stringify(rows));
    }, [rows]);

    // Handle input changes
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    // Handle checkbox change for reinvesting dividends
    const handleCheckboxChange = (e) => {
        setFormData({
            ...formData,
            reinvestDividend: e.target.checked,
        });
    };

    // Validate input fields
    const validate = (values) => {
        const errors = {};
        if (!values.name) errors.name = "Stock name is required.";
        if (!values.shares || isNaN(values.shares) || values.shares <= 0)
            errors.shares = "Valid number of shares is required.";
        if (!values.purchaseDate) errors.purchaseDate = "Purchase date is required.";
        return errors;
    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();

        // Validate the input values
        const validationErrors = validate(formData);
        setErrors(validationErrors);

        // If no errors, add the new row
        if (Object.keys(validationErrors).length === 0) {
            const newRow = {
                ticker: formData.name,
                shares: parseFloat(formData.shares),
                earningsYr: 0, // Placeholder, replace with your calculation logic
                earningsLifetime: 0, // Placeholder
                totalInvested: 0, // Placeholder
                purchaseDate: formData.purchaseDate,
                reinvestDividend: formData.reinvestDividend,
            };

            setRows([...rows, newRow]);
            setFormData({
                name: '',
                shares: '',
                purchaseDate: '',
                reinvestDividend: false,
            });
        }
    };

    // Handle row deletion
    const handleDelete = (index) => {
        console.log(`Deleting row at index ${index}`);
        const newRows = rows.filter((_, i) => i !== index);
        setRows(newRows);

        // Update cookies after deletion
        console.log("Updated rows after deletion:", newRows);
        Cookies.set('dividendRows', JSON.stringify(newRows));
    };

    // Calculate total earnings, total invested, and percent yield
    const calculateTotals = () => {
        const totalEarningsPerYear = rows.reduce((total, row) => total + (row.earningsYr || 0), 0);
        const totalLifetimeEarnings = rows.reduce((total, row) => total + (row.earningsLifetime || 0), 0);
        const totalInvested = rows.reduce((total, row) => total + (row.totalInvested || 0), 0);
        const percentYield = totalInvested > 0 ? (totalEarningsPerYear / totalInvested) * 100 : 0;
        return { totalEarningsPerYear, totalLifetimeEarnings, totalInvested, percentYield };
    };

    const { totalEarningsPerYear, totalLifetimeEarnings, totalInvested, percentYield } = calculateTotals();

    return (
        <div className="container" style={{ paddingTop: '150px' }}>
            <h1 className="text-center mb-4">Dividend Calculator</h1>
            <h4 className="text-center mb-4">
                Total Earnings Per Year: ${totalEarningsPerYear.toFixed(2)} | 
                Total Lifetime Earnings: ${totalLifetimeEarnings.toFixed(2)} | 
                Total Invested: ${totalInvested.toFixed(2)} | 
                Percent Yield: {percentYield.toFixed(2)}%
            </h4>

            {/* Form for adding dividends */}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Stock Name (Ticker)</label>
                    <input 
                        type="text" 
                        className={`form-control ${errors.name ? 'is-invalid' : ''}`} 
                        id="name" 
                        value={formData.name} 
                        onChange={handleChange} 
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="shares" className="form-label">Amount of Shares</label>
                    <input 
                        type="number" 
                        className={`form-control ${errors.shares ? 'is-invalid' : ''}`} 
                        id="shares" 
                        value={formData.shares} 
                        onChange={handleChange} 
                    />
                    {errors.shares && <div className="invalid-feedback">{errors.shares}</div>}
                </div>
                <div className="mb-3">
                    <label htmlFor="purchaseDate" className="form-label">Purchase Date</label>
                    <input 
                        type="date" 
                        className={`form-control ${errors.purchaseDate ? 'is-invalid' : ''}`} 
                        id="purchaseDate" 
                        value={formData.purchaseDate} 
                        onChange={handleChange} 
                    />
                    {errors.purchaseDate && <div className="invalid-feedback">{errors.purchaseDate}</div>}
                </div>
                <div className="form-check mb-3">
                    <input 
                        type="checkbox" 
                        className="form-check-input" 
                        id="reinvestDividend" 
                        checked={formData.reinvestDividend} 
                        onChange={handleCheckboxChange} 
                    />
                    <label className="form-check-label" htmlFor="reinvestDividend">Reinvest Dividends</label>
                </div>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </form>

            {/* Table for displaying dividend information */}
            <TableContainer component={Paper} className="mt-4">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Stock</TableCell>
                            <TableCell align="right">Shares</TableCell>
                            <TableCell align="right">Earnings/Year</TableCell>
                            <TableCell align="right">Lifetime Earnings</TableCell>
                            <TableCell align="right">Total Invested</TableCell>
                            <TableCell align="right">Purchase Date</TableCell>
                            <TableCell align="right">Reinvest Dividends</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell>{row.ticker}</TableCell>
                                <TableCell align="right">{row.shares}</TableCell>
                                <TableCell align="right">${row.earningsYr.toFixed(2)}</TableCell>
                                <TableCell align="right">${row.earningsLifetime.toFixed(2)}</TableCell>
                                <TableCell align="right">${row.totalInvested.toFixed(2)}</TableCell>
                                <TableCell align="right">{row.purchaseDate}</TableCell>
                                <TableCell align="right">{row.reinvestDividend ? 'Yes' : 'No'}</TableCell>
                                <TableCell align="center">
                                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(index)}>Delete</button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default DividendCalc;
