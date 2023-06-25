import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from './Register';
import Login from './Login';
import MainPage from "./MainPage";
import Home from "./Home"
import Reservation from "./Reservation";
import Profile from "./Profile";
import FutureTours from "./FutureTours";
import PastTours from "./PastTours";
import Route_Review from "./Route_Review";

class App extends Component {
    render() {
        return (
            <div className="App">
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />}/>
                        <Route path="/home" element={<Home />}/>
                        <Route path="/reservation" element={<Reservation />}/>
                        <Route path="/profile" element={<Profile />}/>
                        <Route path="/futureTours" element={<FutureTours />}/>
                        <Route path="/pastTours" element={<PastTours />}/>
                        <Route path="routeReviews" element={<Route_Review />}/>
                    </Routes>

            </div>
        );
    }
}

export default App;
