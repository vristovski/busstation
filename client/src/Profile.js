import React, { Component } from 'react';
import axios from 'axios';
import './Profile.css';
import Home from "./Home";
import {BrowserRouter as Router, Routes, Route, Navigate, Link} from "react-router-dom";
import {TextField} from "@mui/material";

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            name: '',
            lastname: '',
            role: '',
            dateOfBirth: new Date(),
        };
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    getUserData = async () => {
        try {
            const response = await axios.post('/getUserData', {
                userID: localStorage.getItem('userID'),
            });
            const userData = response.data;
            console.log("response data", response.data)
            this.state.email=userData.Email;

            this.setState({
                email: userData.Email,
                name: userData.First_Name,
                lastname: userData.Last_Name,
                role: userData.Role,
                dateOfBirth: new Date(userData.Date_Of_Birth).toLocaleDateString('en-GB'),

            });
            console.log("date",this.state.dateOfBirth);
        } catch (error) {
            console.error('Error retrieving user data:', error);
        }
    }

    handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { email, name, lastname, role, dateOfBirth } = this.state;
            const response = await axios.post('/updateProfile', {
                userID: localStorage.getItem('userID'),
                email,
                firstName: name,
                lastName: lastname,
                role,
                dateOfBirth,
            });
            console.log('Profile updated successfully:', response.data);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    componentDidMount() {
        this.getUserData()
            .then(() => {
                console.log("User data retrieved successfully.");
                // Additional code to execute after user data is fetched
            })
            .catch(error => {
                console.error("Error retrieving user data:", error);
                // Additional error handling if needed
            });
        this.state.firstLetter = localStorage.getItem("email").charAt(0).toUpperCase();
        this.setState({firstLetter: localStorage.getItem("email").charAt(0).toUpperCase()});
    }

    render() {
            return (
                <div className="master">
                    <div className="navBarReservation">
                        <div className="mainContainer">
                            <div className="firstNav">
                                <nav>
                                    <ul>
                                        <li>
                                            <Link to="/">Contact</Link>
                                        </li>
                                        <li>
                                            <Link to="/">About us</Link>
                                        </li>
                                        <li>
                                            <Link to="/routeReviews">Reviews</Link>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                            <div className="middleNav">
                                <div style={{width: '210px'}}>
                                    <p>Меѓународна - Меѓуградска <b>Автобуска станица - Скопје</b></p>
                                </div>
                                <div className='imgReservation'>

                                </div>
                                <div style={{width: '150px'}}>
                                    <p>International - Intercity <b>Bus Station - Skopje</b></p>
                                </div>
                            </div>
                            <div className="button-container" style={{marginLeft: '150px'}}>
                                <button className="signin-button-reservation" style={{marginLeft: '15px'}}><Link to="/">Одјави се</Link></button>
                                <button className="circle-reservation" style={{marginLeft: '15px'}}><Link to="/profile">{this.state.firstLetter}</Link></button>
                            </div>
                        </div>
                    </div>
                    <div className="mainDiv">
                        <div className="profile">
                            <h2>Информации за профилот</h2>
                            <form className="profileForm" style={{display: "block"}} onSubmit={this.handleSubmit}>
                                <div>
                                    <TextField
                                        name="email"
                                        label="Е-пошта"
                                        type="text"
                                        value={this.state.email}
                                        onChange={this.handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <TextField
                                        name="name"
                                        label="Име"
                                        type="text"
                                        value={this.state.name}
                                        onChange={this.handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <TextField
                                        name="lastname"
                                        label="Презиме"
                                        type="text"
                                        value={this.state.lastname}
                                        onChange={this.handleChange}
                                        required
                                    />
                                </div>
                                <div>
                                    <TextField
                                        name="role"
                                        label="Улога"
                                        type="text"
                                        value={this.state.role}
                                        onChange={this.handleChange}
                                        disabled
                                    />
                                </div>
                                <div>
                                    <TextField
                                        name="dateOfBirth"
                                        label="Датум на раѓање"
                                        type="text"
                                        value={this.state.dateOfBirth}
                                        onChange={this.handleChange}
                                        required
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                    />
                                </div>
                                <button type="submit" style={{marginTop: '10px'}}>Зачувај</button>
                            </form>
                        </div>
                        <div className="leftAside">
                            <div className="links">
                                <div style={{borderBottom: '2px solid gray'}}><p><Link to="/futureTours">Идни патувања</Link></p></div>
                                <div><p><Link to="/pastTours">Историја на патувања</Link></p></div>
                            </div>
                        </div>
                    </div>
                    <div className="footer">
                        <div className="middleNav" style={{marginLeft: '535px'}}>
                            <div style={{width: '210px'}}>
                                <p>Меѓународна - Меѓуградска <b>Автобуска станица - Скопје</b></p>
                            </div>
                            <div className='img1'>

                            </div>
                            <div style={{width: '150px'}}>
                                <p>International - Intercity <b>Bus Station - Skopje</b></p>
                            </div>
                        </div>
                        <div style={{borderTop: '1px solid gray', width: '1300px', marginLeft: '100px', marginRight: '100px'}}>

                        </div>
                        <div>
                            <nav >
                                <ul style={{width: '1450px'}}>
                                    <li>
                                        <Link to="/" style={{color: 'white'}}>Privacy Policy</Link>
                                    </li>
                                    <li>
                                        <Link to="/" style={{color: 'white'}}>Terms of Service</Link>
                                    </li>
                                    <li>
                                        <Link to="/" style={{color: 'white'}}>Cookies Settings</Link>
                                    </li>
                                    <li style={{marginLeft: '650px'}}>
                                        2023 International Intercity bus station Skopje. All right reserved.
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            );
        }
}

export default Profile;
