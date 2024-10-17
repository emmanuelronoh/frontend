import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Signup from './components/Signup';
import Home from './components/Home';
import Contact from './components/Contact';
import Login from './components/Login';
import './App.css';
import Help from './components/Help';
import Footer from './components/Footer';
import Carousel from './components/Carousel';
import Notes from './components/Notes';

const App = () => {
    const [showCarousel, setShowCarousel] = useState(true);

    // Function to handle clicks anywhere on the page
    const handleClick = () => {
        setShowCarousel(false);
    };

    // Set up a click event listener when the component mounts
    useEffect(() => {
        // Attach event listener
        document.addEventListener('click', handleClick);

        // Clean up the event listener on component unmount
        return () => {
            document.removeEventListener('click', handleClick);
        };
    }, []);

    return (
        <Router>
            <Header />
            {/* Main content area */}
            <div className="app-container">
                <Routes>
                    <Route path='/help' element={<Help />} />
                    <Route path='/contact' element={<Contact />} />
                    <Route path='/home' element={<Home />} />
                    <Route path='/signup' element={<Signup />} />
                    <Route path='/login' element={<Login />} />
                    <Route path='/blog' element={<Notes />} />
                </Routes>
                {/* Conditionally render the Swiper carousel */}
                {showCarousel && <Carousel />}
            </div>
            <Footer />
        </Router>
    );
};

export default App;
