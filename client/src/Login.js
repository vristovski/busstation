import React, { Component } from 'react';
import axios from 'axios';
import './Login.css';
import Home from "./Home";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isLoggedIn: false,
            role: '',
            message: '',
        };
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('/login', this.state);

            if(response.data.userID !== null)
            {
                console.log(response.data);
                localStorage.setItem('userID', response.data.userID.ID_User);
                localStorage.setItem('email', response.data.email);
                localStorage.setItem('role', response.data.userID.Role);
                this.setState({isLoggedIn: true, role: response.data.userID.Role})
            }
            else{
                this.setState({message: 'Неточна е-пошта или лозинка'});
            }

        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    render() {
        if (!this.state.isLoggedIn) {
            return (
                <div className="body">
                    <div className="main">
                        <div className="container">
                            <h2>Најави се</h2>
                            <div style={{display: this.state.message !== '' ? 'block' : 'none'}} className='errorMessage'>{this.state.message}</div>
                            <form onSubmit={this.handleSubmit}>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={this.state.email}
                                    onChange={this.handleChange}
                                    required
                                />

                                <input
                                    type="password"
                                    name="password"
                                    placeholder="Password"
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                    required
                                />

                                <button type="submit">Најави се</button>
                            </form>
                        </div>
                    </div>
                </div>

            );
        }
        return <Navigate to="/home" />;
    }
}

export default Login;
