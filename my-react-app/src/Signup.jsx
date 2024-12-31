import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import Signupvalidation from './SignupValidation';
import { Link, useNavigate } from 'react-router-dom';

function Signup({ onSignupSuccess }) {
    const [values, setValues] = useState({
        email: '',
        password: '',
        name: ''
    });
    const navigate = useNavigate();
    const [errors, setErrors] = useState({});

    const handleInput = (event) => {
        setValues((prev) => ({
            ...prev,
            [event.target.name]: event.target.value
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = Signupvalidation(values);
        setErrors(validationErrors);

        if (!validationErrors.name && !validationErrors.email && !validationErrors.password) {
            axios.post('http://localhost:8081/signup', values)
                .then((res) => {
                    if (res.data.status === "Success") {
                        // Call the callback to update the username in App.jsx
                        onSignupSuccess(res.data.username);
                        navigate('/');
                    } else {
                        console.log("Signup failed:", res.data.message);
                    }
                })
                .catch((err) => console.log("Error:", err));
        }
    };

    return (
        <div className="d-flex vh-100 justify-content-center align-items-center bg-white">
            <div className="p-3 bg-black rounded w-25">
                <form onSubmit={handleSubmit}>
                    <h2 className="text-white">Sign up</h2>
                    <div className="mb-3">
                        <label htmlFor="name"><strong className="text-white">Name</strong></label>
                        <input
                            type="text"
                            placeholder="Enter Name"
                            className="form-control"
                            name="name"
                            onChange={handleInput}
                        />
                        {errors.name && <span className="text-danger">{errors.name}</span>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email"><strong className="text-white">Email</strong></label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            className="form-control"
                            name="email"
                            onChange={handleInput}
                        />
                        {errors.email && <span className="text-danger">{errors.email}</span>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password"><strong className="text-white">Password</strong></label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            className="form-control"
                            name="password"
                            onChange={handleInput}
                        />
                        {errors.password && <span className="text-danger">{errors.password}</span>}
                    </div>
                    <button className="btn btn-success w-100"><strong className="text-white">Sign up</strong></button>
                    <p className="text-white">You agree to our terms and policies</p>
                    <Link to="/login" className="text-white btn btn-default border w-100 text-decoration-none">Login</Link>
                </form>
            </div>
        </div>
    );
}

export default Signup;
