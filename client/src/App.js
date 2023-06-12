import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from './Register';
import Login from './Login';
import MainPage from "./MainPage";

class App extends Component {
    render() {
        return (
            <div className="App">
                    <Routes>
                        <Route path="/" element={<MainPage />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />}/>
                    </Routes>

            </div>
        );
    }
}

export default App;
