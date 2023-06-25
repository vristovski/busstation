import React, { Component } from 'react';
import axios from 'axios';
import './Route_Review.css';
import Home from "./Home";
import {BrowserRouter as Router, Routes, Route, Navigate, Link} from "react-router-dom";
import {TextField} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';

class Route_Review extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstLetter: '',
            reviews: [],
        };
    }

    fetchRouteReviews = async () => {
        try {
            const response = await axios.get('/routeReviews');
            console.log(response.data);
            this.state.reviews = response.data;
            this.setState({ reviews: response.data });
        } catch (error) {
            console.error('Error fetching schedule:', error);
        }
    };

    componentDidMount() {
        this.state.firstLetter = localStorage.getItem("email").charAt(0).toUpperCase();
        this.setState({firstLetter: localStorage.getItem("email").charAt(0).toUpperCase()});
        this.fetchRouteReviews();
    }

    render() {
        if(this.state.reviews.length === 0)
        {
            return (
                <CircularProgress />
            )
        }
        else
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
                    <div className="table">
                        <table>
                            <thead>
                            <tr>
                                <th>Компанија</th>
                                <th>Почетна точка</th>
                                <th>Крајна точка</th>
                                <th>Оценка</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.reviews.map((row) => (
                                <tr key={row.ID_Route}>
                                    <td>{row.company_name}</td>
                                    <td>{row.start_point}</td>
                                    <td>{row.end_point}</td>
                                    <td>{Number(row.avg).toFixed(2)}</td>
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
export default Route_Review;
