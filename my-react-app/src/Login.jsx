import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import validation from './LoginValidation';
import Cookies from 'js-cookie';  // Import js-cookie

function Login({ onLoginSuccess }) {
    const [values, setValues] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleInput = (event) => {
        const { name, value } = event.target;
        setValues(prevValues => ({ ...prevValues, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const validationErrors = validation(values);
        setErrors(validationErrors);
    
        if (!validationErrors.email && !validationErrors.password) {
            try {
                const response = await axios.post('http://localhost:8081/login', values);
    
                console.log("Login response:", response.data);
    
                // Directly access response fields
                const status = response.data.status;
                const username = response.data.username;
                const user_id = response.data.user_id;
                const token = response.data.token;
    
                console.log("Before setting cookies - user_id:", user_id, "token:", token);
    
                if (status === "Success" && user_id && token) {
                    Cookies.set('username', username, { expires: 7 });
                    Cookies.set('user_id', String(user_id), { expires: 7 }); // Ensure user_id is stored as a string
                    Cookies.set('token', token, { expires: 7 });
    
                    console.log("Cookies after setting:", Cookies.get());
                    onLoginSuccess(username);
                    navigate('/');
                } else {
                    console.error("Login failed:", response.data.message || "Invalid response");
                }
            } catch (err) {
                console.error("Error during login:", err);
            }
        }
    };
    
    

    return (
        <div className="d-flex vh-100 justify-content-center align-items-center bg-white">
            <div className="p-3 bg-black rounded w-25">
                <form onSubmit={handleSubmit}>
                    <h2 className="text-white">Log in</h2>

                    <div className="mb-3">
                        <label htmlFor="email" className="text-white"><strong>Email</strong></label>
                        <input
                            type="email"
                            placeholder="Enter Email"
                            className="form-control"
                            name="email"
                            value={values.email}
                            onChange={handleInput}
                        />
                        {errors.email && <span className='text-danger'>{errors.email}</span>}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="text-white"><strong>Password</strong></label>
                        <input
                            type="password"
                            placeholder="Enter Password"
                            className="form-control"
                            name="password"
                            value={values.password}
                            onChange={handleInput}
                        />
                        {errors.password && <span className='text-danger'>{errors.password}</span>}
                    </div>

                    <button type="submit" className="btn btn-success w-100">
                        <strong className="text-white">Login</strong>
                    </button>
                    <p className="text-white">You agree to our terms and policies</p>

                    <Link to="/signup" className="btn btn-default border w-100 text-decoration-none text-white">
                        Create Account
                    </Link>
                </form>
            </div>
        </div>
    );
}

export default Login;
