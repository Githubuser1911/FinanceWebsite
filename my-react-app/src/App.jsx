import React, { useState, useEffect } from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import Title from './Title.jsx';
import UserGreeting from './UserGreeting.jsx';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Cookies from 'js-cookie';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Card from './Card.jsx';
import Mission from './Mission.jsx';
import Contact from './Contact.jsx';
import DividendCalc from './DividendCalc.jsx';
import Team from './Team.jsx';
import pensulogo from './assets/pensulogo.PNG'; // Default image (optional)
import budget from './assets/budget.png';
import dividend from './assets/dividend.jpg';
import mortgage from './assets/mortgage.png';
import retirement from './assets/retirement.png';
import dcf from './assets/dcf.png';
import lbo from './assets/lbo.jpg';
import option from './assets/option.jpg';
import trading from './assets/trading.png';
import BlackScholesForm from './options.jsx';
import MortgageCalc from './MortgageCalc.jsx';
import BudgetingTool from './budgeting.jsx';


function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");

    // Check cookies on page load
    useEffect(() => {
        const storedUsername = Cookies.get('username');
        const storedToken = Cookies.get('token');
        if (storedUsername && storedToken) {
            setIsLoggedIn(true);
            setUsername(storedUsername);
        }
    }, []);

    const handleLoginSuccess = (name, userId) => {
        setIsLoggedIn(true);
        setUsername(name);
        // Save the user_id to cookies
        Cookies.set('user_id', userId);
    };
    

    return (
        <BrowserRouter>
            <Header />
            <Routes>
                {/* Home Route */}
                <Route 
                    path="/" 
                    element={
                        <>
                            <Title />
                            <UserGreeting isLoggedIn={isLoggedIn} username={username} />
                        </>
                    }
                />

                {/* Login Route */}
                <Route 
                    path="/login" 
                    element={<Login onLoginSuccess={handleLoginSuccess} />} 
                />

                {/* Contact Route */}
                <Route 
                    path="/contact" 
                    element={<Contact />} 
                />

                {/* Personal Finance Route */}
                <Route
                    path="/personal-finance"
                    element={
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{ minHeight: '100vh' }}>
                        <div className="d-flex flex-wrap justify-content-around mt-4">
                            <Card
                                title="Dividend Calculator"
                                text="Calculate potential dividend income based on investments."
                                link="/dividend-calculator"
                                linkText="Try Now"
                                image={dividend}
                            />
                            <Card
                                title="Mortgage Calculator"
                                text="Estimate your mortgage payments and interest rates."
                                link="/mortgage-calculator"
                                linkText="Try Now"
                                image={mortgage}
                            />
                            <Card
                                title="Budgeting Tool"
                                text="Plan your monthly expenses and savings efficiently."
                                link="/budgeting-tool"
                                linkText="Try Now"
                                image={budget}
                            />
                            <Card
                                title="Retirement Savings Forecaster"
                                text="Project your retirement savings over time."
                                link="/retirement-savings"
                                linkText="Try Now"
                                image={retirement}
                            />
                        </div>
                        </div>
                    }
                />

                {/* Financial Tools Route */}

                <Route
                    path="/financial-tools"
                    element={
                        <div
                            className="d-flex justify-content-center align-items-center"
                            style={{ minHeight: '100vh' }}>
                        <div className="d-flex flex-wrap justify-content-around mt-4">
                            <Card
                                title="DCF Creator"
                                text="Uses Edgar API to craft DCFs"
                                link="/DCF"
                                linkText="Try Now"
                                image={dcf}
                            />
                            <Card
                                title="Options Pricer"
                                text="Uses the Black-Scholes model to price options"
                                link="/options-pricer"
                                linkText="Try Now"
                                image={option}
                            />
                            <Card
                                title="Trading Model"
                                text="AI powered trading model"
                                link="/trading-model"
                                linkText="Try Now"
                                image={trading}
                            />
                            <Card
                                title="LBO Creator"
                                text="Calculates the proceeds and cash flow projection of aquired companies"
                                link="/retirement-savings"
                                linkText="Try Now"
                                image={lbo}
                            />
                        </div>
                        </div>
                    }
                />

                {/* Signup Route */}
                <Route 
                    path="/signup" 
                    element={<Signup onSignupSuccess={handleLoginSuccess} />} 
                />

                {/* Mission Route */}
                <Route 
                    path="/mission" 
                    element={<Mission />} 
                />

                {/* Team Route */}
                <Route 
                    path="/team" 
                    element={<Team />} 
                />
                {/* Dividend Calc Route */}
                <Route 
                    path="/dividend-calculator" 
                    element={<DividendCalc />} 
                />
                {/* Options Pricer Route */}
                <Route 
                    path="/options-pricer" 
                    element={<BlackScholesForm />} 
                />
                {/* Mortgage Calculator Route */}
                <Route 
                path="/mortgage-calculator" 
                element={<MortgageCalc />} 
                />
                {/* Budgeting Calculator Route */}
                <Route 
                path="/budgeting-tool" 
                element={<BudgetingTool />} 
                />                
            </Routes>
            <Footer />
        </BrowserRouter>
    );
}

export default App;