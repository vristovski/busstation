import React, { Component } from 'react';
import axios from 'axios';
import './PastTours.css';
import Home from "./Home";
import {BrowserRouter as Router, Routes, Route, Navigate, Link} from "react-router-dom";
import {TextField} from "@mui/material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

class PastTours extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pastTickets: [],
            open:false,
            feedback: '',
            review: '',
            passengerID: '',
            routeID: '',
        };
    }

    getPastTickets = async () => {
        try {
            const response = await axios.post('/getFutureUserTickets', {
                userID: localStorage.getItem('userID'),
            });

            if (Array.isArray(response.data)) {
                this.setState({ pastTickets: response.data });
            } else {
                this.setState(prevState => ({
                    pastTickets: [...prevState.pastTickets, response.data],
                }));

                console.log("futureTickets", this.state.futureTickets)
            }
        } catch (error) {
            console.error('Error retrieving user data:', error);
        }
    };

    handleOpen () {
        this.setState({open: true});
    }

    handleClose () {
        this.setState({open: false});
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    handleRadioButtonsChange = (event) => {
        if (event.target.checked) {
            this.setState({ review: event.target.value });
        }
    };

    handleSubmitReview = async () => {
        try {
            console.log("UserID", localStorage.getItem('userID'),
                "passengerID", this.state.passengerID,
                "routeID", this.state.routeID,
                "review", this.state.review,
                "feedback", this.state.feedback
            )

            const response = await axios.post('/addReview', {
                ID_Route: this.state.routeID,
                ID_Passenger: this.state.passengerID,
                Review: parseInt(this.state.review),
                Feedback: this.state.feedback
            });
            console.log("reviewID", response.data);
            if(response.data){
                this.setState({open: false, feedback: ''});
            }
        } catch (error) {
        }
    };


    componentDidMount() {
        this.getPastTickets()
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
        const currentDate = new Date();

        // Filter tickets with a future date
        const pastTickets = this.state.pastTickets.filter(ticket => {
            const tourDate = new Date(ticket.Tour_Date);
            return tourDate < currentDate;
        });
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
                    <div>
                        {pastTickets.map(ticket => (
                            <div key={ticket.ID_Ticket} className="futureTours" style={{height: '180px'}}>
                                <div key={ticket.ID_Ticket} className="ticketDiv">
                                    <div style={{ float: 'left' }}>
                                        <div style={{ border: '1px solid #3250D5', borderRadius: '10px', padding: '5px', backgroundColor: '#3250D5', color: 'white' }}>{ticket.company_name}</div>
                                        <div style={{ marginLeft: '3px' }}>{ticket.Departure_Time}</div>
                                        <div style={{ marginLeft: '3px' }}>{ticket.start_city}</div>
                                    </div>
                                    <div style={{ float: 'right' }}>
                                        <div>{ticket.ticket_price} ден.</div>
                                        <div>{ticket.Arrival_Time}</div>
                                        <div>{ticket.end_city}</div>
                                    </div>
                                    <div style={{ clear: 'both', marginTop: '20px' }}>
                                        <div style={{ display: "inline-block"}}>Датум: <span style={{ color: '#3250D5' }}>{new Date(ticket.Tour_Date).toLocaleDateString('en-GB')}</span></div>
                                        <div style={{ display: "inline-block", marginLeft: '55px' }}>Седиште бр. {ticket.Seat}</div>
                                        <div style={{ display: "inline-block", marginLeft: '55px' }}>Багаж: {ticket.Type}</div>
                                    </div>
                                    <div>
                                        <button className="reviewButton" onClick={() => {this.handleOpen(); this.setState({passengerID: ticket.ID_Passenger, routeID: ticket.ID_Route})}}>Оцени патување</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="dialog">
                        <Dialog open={this.state.open} onClose={() => {this.handleClose()}}>
                            <DialogTitle>Оцени го патувањето</DialogTitle>
                            <DialogContent>
                                <FormControl>
                                    <FormLabel id="demo-row-radio-buttons-group-label">Оценка</FormLabel>
                                    <RadioGroup
                                        row
                                        aria-labelledby="demo-row-radio-buttons-group-label"
                                        name="row-radio-buttons-group"
                                        onChange={this.handleRadioButtonsChange}
                                    >
                                        <FormControlLabel value="1" control={<Radio />} label="1" />
                                        <FormControlLabel value="2" control={<Radio />} label="2" />
                                        <FormControlLabel value="3" control={<Radio />} label="3" />
                                        <FormControlLabel value="4" control={<Radio />} label="4" />
                                        <FormControlLabel value="5" control={<Radio />} label="5" />
                                    </RadioGroup>
                                    <TextField
                                        name="feedback"
                                        label="Коментар"
                                        type="text"
                                        value={this.state.feedback}
                                        onChange={this.handleChange}
                                    />
                                </FormControl>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => {this.handleClose()}}>Откажи</Button>
                                <Button onClick={() => {this.handleSubmitReview()}}>Зачувај</Button>
                            </DialogActions>
                        </Dialog>
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

export default PastTours;
