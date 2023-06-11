import React, { Component } from 'react';
import axios from 'axios';
import './Register.css';

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
        } catch (error) {
            console.error('Error registering user:', error);
        }
    };

    render() {
        return (
            <div className="body" style={{marginTop: "100px"}}>
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

                            <input
                                type="text"
                                name="role"
                                placeholder="Role"
                                value={this.state.role}
                                onChange={this.handleChange}
                                required
                            />

                            <input
                                type="date"
                                name="dateOfBirth"
                                placeholder="Date of Birth"
                                value={this.state.dateOfBirth}
                                onChange={this.handleChange}
                                required
                            />

                            <button type="submit">Register</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

export default Register;