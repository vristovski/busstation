import React, { Component } from 'react';
import axios from 'axios';
import './Register.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            role: '',
            dateOfBirth: '',
            isRegistered: false,
        };
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('/register', this.state);
            console.log(response.data);
            this.setState({isRegistered: true})
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    render() {
        if (!this.state.isRegistered) {
            return (
                <div className="body" style={{marginTop: '100px'}}>
                    <div className="main">
                        <div className="container">
                            <h2>Регистрирај се</h2>
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

                                <input
                                    type="text"
                                    name="firstName"
                                    placeholder="First Name"
                                    value={this.state.firstName}
                                    onChange={this.handleChange}
                                    required
                                />

                                <input
                                    type="text"
                                    name="lastName"
                                    placeholder="Last Name"
                                    value={this.state.lastName}
                                    onChange={this.handleChange}
                                    required
                                />

                                <select // Updated: Use select element instead of input
                                    name="role"
                                    value={this.state.role}
                                    onChange={this.handleChange}
                                    required
                                >
                                    <option value="">Select Role</option>
                                    <option value="user">Passenger</option>
                                    <option value="admin">Driver</option>
                                    <option value="admin">Admin</option>
                                </select>

                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    placeholder="Date of Birth"
                                    value={this.state.dateOfBirth}
                                    onChange={this.handleChange}
                                    required
                                />

                                <button type="submit">Регистрирај се</button>
                            </form>
                        </div>
                    </div>
                </div>
            );
        }
        return <Navigate to="/login" />;
    }
}

export default Register;
