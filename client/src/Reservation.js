import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import './Reservation.css';
import Register from "./Register";
import Login from "./Login";
import { TextField } from '@mui/material';

class Reservation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            firstLetter: '',
            route: 'Рута',
            from: '',
            to: '',
            date: '',
            seat: '',
            firstNext: false,
            price: '0',
            ticketID: 0,
            blueFirst: true,
            blueSecond: false,
            blueThird: false,
            showFirst: true,
            showSecond: false,
            showThird: false,
            selectedOption: '',
            weight: '',
            size: '',
            baggage: 'Багаж',
            selectedInsurance: '',
            IDCompany: '',
            dateFrom: '',
            dateTo: '',
            insurance: 'Осигурување',
            showReview: false,
            departureTime: '',
            busCompany: '',
        };
    }


    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    calculatePrice = async (event) => {
        event.preventDefault();
        //const userID = localStorage.getItem('userID');

        try {
            const response = await axios.post('/calculatePrice', {
                startLocation: this.state.from,
                endLocation: this.state.to
            });
            this.state.price = response.data + " ден.";
            this.setState({price: response.data + " ден."});
            console.log("price", this.state.price)
        } catch (error) {
            console.error('Error searching route:', error);
        }
    }


    handleSubmit = async (event) => {
        event.preventDefault();
        const userID = localStorage.getItem('userID');

        try {
            const response = await axios.post('/bookTicket', {
                userID,
                startLocation: this.state.from,
                endLocation: this.state.to,
                seat: this.state.seat,
                tourdate: this.state.date
            });
            console.log("ticketID", response.data)
            this.setState({ticketID: response.data});
            this.state.ticketID = response.data;
            this.setState({route: this.state.from + " - " + this.state.to + " - " + this.state.date})
            this.setState({showFirst: false, showSecond: true, blueFirst: false, blueSecond: true});
        } catch (error) {
            console.error('Error searching route:', error);
        }
    };

    handleOptionChange = (event) => {
        this.setState({
            selectedOption: event.target.name
        });
    }

    handleSubmitBaggage = async (event) => {
        console.log("Baggage Ticket ID", this.state.ticketID);
        event.preventDefault();
        const ticketID = parseInt(this.state.ticketID);
        const weight = parseInt(this.state.weight);
        const size = parseInt(this.state.size);
        const baggageType = this.state.selectedOption;

        console.log(ticketID, weight, size, baggageType);

        try {
            const response = await axios.post('/addBaggage', {
                ticketID,
                weight,
                size,
                baggageType
            });
            console.log("baggageID", response.data);
            this.state.baggage = this.state.selectedOption;
            this.setState({showSecond: false, showThird: true, blueSecond: false, blueThird: true});
            // Process the baggage ID if needed
        } catch (error) {
            console.error('Error adding baggage:', error);
        }
    }

    handleOptionChangeInsurance = (event) => {
        this.setState({
            selectedInsurance: event.target.name
        });
    }

    handleSubmitInsurance = async (event) => {
        event.preventDefault();
        const userID = parseInt(localStorage.getItem('userID'));
        const companyID = parseInt(this.state.IDCompany);
        const ticketID = parseInt(this.state.ticketID);
        const Type = this.state.selectedInsurance;
        const from = this.state.dateFrom;
        const to = this.state.dateTo;

        console.log(userID, companyID, Type, from, to);

        try {
            const response = await axios.post('/addInsurance', {
                userID,
                companyID,
                Type,
                from,
                to
            });
            console.log("insuranceId", response.data);
            this.setState({showThird: false, blueThird: false, showReview: true});
            this.state.insurance = this.state.selectedInsurance;

            try {
                const response = await axios.post('/getBusInfo', {
                    ticketID: this.state.ticketID
                });
                this.setState({departureTime: response.data.Departure_Time, busCompany: response.data.company_name});
                console.log("departureTime", this.state.departureTime, "busCompany", this.state.busCompany);
            } catch (error) {
                console.error('Error searching route:', error);
            }

        } catch (error) {
            console.error('Error adding baggage:', error);
        }
    }

    componentDidMount() {
        this.state.firstLetter = localStorage.getItem("email").charAt(0).toUpperCase();
        console.log("firstLetter", this.state.firstLetter);
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
                    <div>
                        <div className="breadcrumbs">
                            <p style={{color: 'gray'}}>
                                <span style={{color: this.state.blueFirst ? 'blue' : 'gray'}}>{this.state.route}</span>
                                /
                                <span style={{color: this.state.blueSecond ? 'blue' : 'gray'}}>{this.state.baggage}</span>
                                /
                                <span style={{color: this.state.blueThird ? 'blue' : 'gray'}}>{this.state.insurance}</span>
                            </p>
                        </div>
                        <div className="reservationTicket">
                            <form onSubmit={this.handleSubmit} className="routeResForm" style={{display: this.state.showFirst ? 'block' : 'none'}}>
                                <h3>Резервирај билет</h3>
                                <TextField
                                    name="from"
                                    label="Од"
                                    type="text"
                                    value={this.state.from}
                                    onChange={this.handleChange}
                                    required
                                    style={{width: '460px', marginBottom: '10px'}}
                                /> <br />
                                <TextField
                                    name="to"
                                    label="До"
                                    type="text"
                                    value={this.state.to}
                                    onChange={this.handleChange}
                                    required
                                    style={{width: '460px', marginBottom: '10px'}}
                                /> <br />
                                <TextField
                                    name="date"
                                    label="Датум"
                                    type="date"
                                    value={this.state.date}
                                    onChange={this.handleChange}
                                    required
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    style={{marginRight: '10px'}}
                                    onFocus={this.calculatePrice}
                                />
                                <TextField
                                    name="seat"
                                    label="Седиште"
                                    type="text"
                                    value={this.state.seat}
                                    onChange={this.handleChange}
                                /> <br />
                                <TextField
                                    disabled
                                    label="Цена"
                                    value={this.state.price}
                                    style={{width: '460px', marginTop: '10px'}}
                                />
                                <br />
                                <button type="submit" style={{marginTop: '10px'}}>Резервирај</button>
                            </form>

                            <form onSubmit={this.handleSubmitBaggage} className="routeBagForm" style={{display: this.state.showSecond ? 'block' : 'none'}}>
                                <h3>Избери багаж</h3>
                                <label className="radio-inline">
                                    <div className="vertical-align">
                                        Carry-on Bag
                                        <div className="imgOp1"></div>
                                        40 x 30
                                        <input
                                            type="radio" name="Carry-on Bag"
                                            checked={this.state.selectedOption === "Carry-on Bag"}
                                            onChange={(event) => {this.handleOptionChange(event); this.setState({
                                                weight: '40',
                                                size: '30'
                                            })}}
                                        />
                                    </div>
                                </label>
                                <label className="radio-inline">
                                    <div className="vertical-align">
                                        Trolley Bag
                                        <div className="imgOp2"></div>
                                        55 x 40
                                        <input
                                            type="radio" name="Trolley Bag"
                                            checked={this.state.selectedOption === "Trolley Bag"}
                                            onChange={(event) => {this.handleOptionChange(event); this.setState({
                                                weight: '55',
                                                size: '40'
                                            })}}
                                        />
                                    </div>
                                </label>
                                <label className="radio-inline">
                                    <div className="vertical-align">
                                        Checked-in Bag
                                        <div className="imgOp3"></div>
                                        149 x 119
                                        <input
                                            type="radio" name="Checked-in Bag"
                                            checked={this.state.selectedOption === "Checked-in Bag"}
                                            onChange={(event) => {this.handleOptionChange(event); this.setState({
                                                weight: '149',
                                                size: '119'
                                            })}}
                                        />
                                    </div>
                                </label>
                                <br />
                                <button type="submit" style={{marginTop: '10px'}}>Следно</button>
                            </form>

                            <form onSubmit={this.handleSubmitInsurance} className="routeInsuranceForm" style={{display: this.state.showThird ? 'block' : 'none'}}>
                                <h3>Избери осигурување</h3>
                                <label className="radio-inline">
                                    <div className="vertical-align">
                                        <input
                                            type="radio" name="Daily"
                                            checked={this.state.selectedInsurance === "Daily"}
                                            onChange={(event) => {this.handleOptionChangeInsurance(event); this.setState({
                                                IDCompany: '1',
                                            })}}
                                        />
                                        Дневно
                                    </div>
                                </label>
                                <label className="radio-inline">
                                    <div className="vertical-align">
                                        <input
                                            type="radio" name="Weekly"
                                            checked={this.state.selectedInsurance === "Weekly"}
                                            onChange={(event) => {this.handleOptionChangeInsurance(event); this.setState({
                                                IDCompany: '2',
                                            })}}
                                        />
                                        Неделно
                                    </div>
                                </label>
                                <TextField
                                    name="dateFrom"
                                    label="Од"
                                    type="date"
                                    value={this.state.dateFrom}
                                    onChange={this.handleChange}
                                    required
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    style={{marginRight: '10px'}}
                                />
                                <TextField
                                    name="dateTo"
                                    label="До"
                                    type="date"
                                    value={this.state.dateTo}
                                    onChange={this.handleChange}
                                    required
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    style={{marginRight: '10px'}}
                                />
                                <button type="submit" style={{marginTop: '10px'}}>Заврши</button>
                            </form>
                            <div className="review" style={{display: this.state.showReview ? 'block' : 'none'}}>
                                <h3 style={{marginLeft: '500px', color: '#3250D5'}}>Преглед</h3>
                                <div className="card">
                                    <h3 style={{color: 'gray'}}>{this.state.from} - {this.state.to}</h3>
                                    <div className="imgCal" style={{display: "inline-block"}}></div><div style={{display: "inline-block", marginLeft: '10px', marginTop: '-15px'}}>2023-06-23{this.state.date}</div><br />
                                    <div className="imgTime" style={{display: "inline-block", marginTop: '10px'}}></div><div style={{display: "inline-block", marginLeft: '10px', marginTop: '-15px'}}>2023-06-23{this.state.departureTime}</div> <br />
                                    <div style={{marginTop: '10px'}}>Седиште: {this.state.seat} </div>
                                    <div style={{marginTop: '10px'}}>Компанија: {this.state.busCompany}</div>
                                    <div style={{marginTop: '10px'}}>Цена: {this.state.price}</div>
                                    <div style={{marginTop: '10px'}}> Багаж: {this.state.baggage}</div>
                                    <div style={{marginTop: '10px'}}>Осигурување: {this.state.insurance}</div>
                                </div>
                            </div>
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

export default Reservation;
