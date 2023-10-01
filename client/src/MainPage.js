import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import './MainPage.css';
import Register from "./Register";
import Login from "./Login";
import { TextField } from '@mui/material';

class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            from: '',
            to: '',
            departureDate: '',
            returnDate: '',
            passengers: '1',
            schedule: [],
            show: true,
            schedule1: [],
        };
    }

    handleInputChange = (event) => {
        this.setState({ passengers: event.target.value });
    };

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleSubmit = async (event) => {
        event.preventDefault();

        const { from, to } = this.state;

        try {
            const response = await axios.post('/searchRoute', { startLocation: from, endLocation: to });
            this.state.show = false;
            this.state.schedule1 = response.data;
            this.setState({ schedule1: response.data });
            console.log("schedule", this.state.schedule1)
        } catch (error) {
            console.error('Error searching route:', error);
        }
    };

    fetchSchedule = async () => {
        try {
            const response = await axios.get('/schedule'); // Replace '/schedule' with the appropriate endpoint on your server
            this.setState({ schedule: response.data });
        } catch (error) {
            console.error('Error fetching schedule:', error);
        }
    };

    componentDidMount() {
        this.fetchSchedule();
    }


    render() {
        return (
            <div className="master">
                <div className="navBar">
                    <div className="mainContainer">
                        <div className="firstNav">
                            <nav>
                                <ul>
                                    <li>
                                        <Link to="/" style={{color: 'white'}}>Contact</Link>
                                    </li>
                                    <li>
                                        <Link to="/" style={{color: 'white'}}>About us</Link>
                                    </li>
                                    <li>
                                        <Link to="/routeReviews" style={{color: 'white'}}>Reviews</Link>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                        <div className="middleNav">
                            <div style={{width: '210px'}}>
                                <p>Меѓународна - Меѓуградска <b>Автобуска станица - Скопје</b></p>
                            </div>
                            <div className='img'>

                            </div>
                            <div style={{width: '150px'}}>
                                <p>International - Intercity <b>Bus Station - Skopje</b></p>
                            </div>
                        </div>
                        <div className="button-container" style={{marginLeft: '110px'}}>
                            <button className="signin-button"><Link to="/login">Најави се</Link></button>
                            <button className="signup-button"><Link to="/register">Регистрирај се</Link></button>
                        </div>
                    </div>
                </div>
                <div className="mainDiv">
                    <div className="searchRoute">
                        <form onSubmit={this.handleSubmit}>
                            <TextField
                                name="from"
                                label="Од"
                                type="text"
                                value={this.state.from}
                                onChange={this.handleChange}
                                required
                            />
                            <TextField
                                name="to"
                                label="До"
                                type="text"
                                value={this.state.to}
                                onChange={this.handleChange}
                                required
                            />
                            <TextField
                                name="departureDate"
                                label="Датум"
                                type="date"
                                value={this.state.departureDate}
                                onChange={this.handleChange}
                                required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <TextField
                                id="outlined-number"
                                label="Патници"
                                type="number"
                                value={this.state.passengers}
                                onChange={this.handleInputChange}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                            <button type="submit" style={{marginLeft: '10px'}}>Пребарувај</button>
                        </form>
                    </div>
                    <div className="table">
                        <table style={{display: this.state.show ?  'block' : 'none'}}>
                            <thead>
                            <tr>
                                <th style={{width: '30px'}}></th>
                                <th>Компанија</th>
                                <th>Почетна точка</th>
                                <th>Крајна точка</th>
                                <th>Заминува</th>
                                <th>Пристигнува</th>
                                <th>Растојание</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.schedule.map((row) => (
                                <tr key={row.ID_Route}>
                                    <td id="pictureColumn"></td>
                                    <td>{row.bus_company}</td>
                                    <td>{row.Start_Point}</td>
                                    <td>{row.End_Point}</td>
                                    <td>{row.Departure_Time}</td>
                                    <td>{row.Arrival_Time}</td>
                                    <td>{row.Distance}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <table style={{display: this.state.show ? 'none' : 'block'}}>
                            <thead>
                            <tr>
                                <th style={{width: '30px'}}></th>
                                <th>Почетна точка</th>
                                <th>Крајна точка</th>
                                <th>Заминува</th>
                                <th>Пристигнува</th>
                                <th>Растојание</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.schedule1.map((row) => (
                                <tr key={row.id_route}>
                                    <td id="pictureColumn"></td>
                                    <td>{row.start_point}</td>
                                    <td>{row.end_point}</td>
                                    <td>{row.departure_time}</td>
                                    <td>{row.arrival_time}</td>
                                    <td>{row.distance}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="footer">
                    <div className="middleNav" style={{marginLeft: '535px'}}>
                        <div style={{width: '210px'}}>
                            <p>Меѓународна - Меѓуградска <b>Автобуска станица - Скопје</b></p>
                        </div>
                        <div className='img'>

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

export default MainPage;
