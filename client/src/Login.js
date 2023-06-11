import React, { Component } from 'react';
import axios from 'axios';
import './Login.css';

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post('/login', this.state);
            console.log(response.data);
        } catch (error) {
            console.error('Error logging in:', error);
        }
    };

    render() {
        return (
            <div className="body">
                <div className="main">
                    <div className="container">
                        <h2>Најави се</h2>
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

                            <button type="submit">Login</button>
                        </form>
                    </div>
                </div>
            </div>

        );
    }
}

export default Login;
