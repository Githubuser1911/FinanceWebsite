import React, { useState } from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import DCF from './DCF.jsx';
import Card from './Card.jsx';
import UserGreeting from './UserGreeting.jsx';
import ProfilePicture from './ProfilePicture.jsx';
import Title from './Title.jsx';
import Login from './Login.jsx';
import Signup from './Signup.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function Home(){

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");

    // Callback function to set username after signup
    const handleSignupSuccess = (name) => {
        setIsLoggedIn(true);
        setUsername(name);
    };
    
    return(
        <>
        <ProfilePicture />
        <Header />
        
        <Title />
        <UserGreeting isLoggedIn={isLoggedIn} username={username} />
        <Card />
        <DCF />
        <Footer />
    </>
    )
}

export default Home