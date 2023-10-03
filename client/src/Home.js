import React, { Component } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import axios from 'axios';
import './Home.css';
import Register from "./Register";
import Login from "./Login";
import { TextField } from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

class Home extends Component {
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
            firstLetter: '',
            role: '',
            open: false,
            startPoint: '',
            endPoint: '',
            arrivalTime: '',
            departureTime: '',
            distance: '',
            company: '',
            admin: false,
            openEdit: false,
            startPointEdit: '',
            endPointEdit: '',
            arrivalTimeEdit: '',
            departureTimeEdit: '',
            distanceEdit: '',
            idRoute: '',
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
            const response = await axios.get('/schedule');
            this.setState({ schedule: response.data });
        } catch (error) {
            console.error('Error fetching schedule:', error);
        }
    };



    componentDidMount() {
        this.state.firstLetter = localStorage.getItem("email").charAt(0).toUpperCase();
        this.state.role = localStorage.getItem("role");
        this.fetchSchedule();
        this.isAdmin();
    }

    handleOpen () {
        this.setState({open: true});
    }

    handleClose () {
        this.setState({open: false});
    }

    handleCompanyChange = (event) => {
        const selectedCompany = event.target.value;
        this.setState({ company: selectedCompany });
    };

    handleAddRoute = async () => {
        try {
            console.log(
                "company", this.state.company,
                "distance", this.state.distance,
                "startpoint", this.state.startPoint,
                "endpoint", this.state.endPoint,
                "arrivaltime", this.state.arrivalTime,
                "departuretime", this.state.departureTime
            )

            const response = await axios.post('/addRoute', {
                Start_Point: this.state.startPoint,
                End_Point: this.state.endPoint,
                Arrival_Time: this.state.arrivalTime,
                Departure_Time: this.state.departureTime,
                Distance: this.state.distance,
                ID_Bus_Company: parseInt(this.state.company),

            });
            if(response.data){
                this.setState({open: false});
            }
            this.componentDidMount();
        } catch (error) {
        }
    };

    isAdmin () {
        const userRole = localStorage.getItem('role');
        if (userRole === 'Admin') {
            this.setState({ admin: true });
        } else {
            this.setState({ admin: false });
        }
    }

    handleEditRoute = (route) => {
        console.log('Editing route: ', route);
        this.setState({
            startPointEdit: route.Start_Point,
            endPointEdit: route.End_Point,
            arrivalTimeEdit: route.Arrival_Time,
            departureTimeEdit: route.Departure_Time,
            distanceEdit: route.Distance,
            idRoute: route.ID_Route
        });

    }

    handleDeleteRoute = async (route) => {
        if(window.confirm('Are you sure you want to delete this route?')) {
            const response = await axios.post('/deleteRoute', {
                ID_Route: parseInt(route.ID_Route)
            });
            this.componentDidMount();
            if(response.data){
                console.log(response.data);
            }
        }
    }

    handleEdit = async () => {
            console.log(
                "distance", this.state.distanceEdit,
                "startpoint", this.state.startPointEdit,
                "endpoint", this.state.endPointEdit,
                "arrivaltime", this.state.arrivalTimeEdit,
                "departuretime", this.state.departureTimeEdit,
                "idRoute", this.state.idRoute
            )
            this.handleCloseEdit();
            console.log('openEdit', this.state.openEdit);
            const response = await axios.post('/editRoute', {
                Start_Point: this.state.startPointEdit,
                End_Point: this.state.endPointEdit,
                Arrival_Time: this.state.arrivalTimeEdit,
                Departure_Time: this.state.departureTimeEdit,
                Distance: this.state.distanceEdit,
                ID_Route: this.state.idRoute,
            });
    };

    handleCloseEdit () {
        this.setState({openEdit: false});
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
                        <div className="button-container" style={{marginLeft: '105px'}}>
                            <button className="signup-button"><Link to="/reservation">Резервирај</Link></button>
                            <button className="signin-button" style={{marginLeft: '15px'}}><Link to="/">Одјави се</Link></button>
                            <button className="circle" style={{marginLeft: '15px'}}><Link to="/profile">{this.state.firstLetter}</Link></button>
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
                            <button type="submit">Пребарувај</button>
                        </form>
                    </div>
                    <div className="table">
                        <button type="submit" style={{marginLeft: '10px', display: this.state.admin ? 'block' : 'none'}} onClick={() => {this.handleOpen()}}>Додај рута</button>
                        <div className="dialog">
                            <Dialog open={this.state.open} onClose={() => {this.handleClose()}}>
                                <DialogTitle>Додај рута</DialogTitle>
                                <DialogContent>
                                    <FormControl>
                                        <FormLabel id="demo-row-radio-buttons-group-label">Компанија</FormLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            onChange={this.handleCompanyChange}
                                        >
                                            <MenuItem value={1}>ABC Inc.</MenuItem>
                                            <MenuItem value={2}>Acme Industries</MenuItem>
                                            <MenuItem value={3}>MegaCorp Inc.</MenuItem>
                                            <MenuItem value={4}>Globex Corp.</MenuItem>
                                            <MenuItem value={5}>Initech</MenuItem>
                                            <MenuItem value={6}>Mom's Friendly</MenuItem>
                                            <MenuItem value={7}>Hooli</MenuItem>
                                            <MenuItem value={8}>XYZ Corporation</MenuItem>
                                            <MenuItem value={9}>Widget Co.</MenuItem>
                                            <MenuItem value={10}>Stark Industries</MenuItem>
                                        </Select>

                                        <TextField
                                            name="startPoint"
                                            label="Почетна точка"
                                            type="text"
                                            value={this.state.startPoint}
                                            onChange={this.handleChange}
                                        />
                                        <TextField
                                            name="endPoint"
                                            label="Крајна точка"
                                            type="text"
                                            value={this.state.endPoint}
                                            onChange={this.handleChange}
                                        />
                                        <TextField
                                            name="departureTime"
                                            label="Време на тргнување"
                                            type="text"
                                            value={this.state.departureTime}
                                            onChange={this.handleChange}
                                        />
                                        <TextField
                                            name="arrivalTime"
                                            label="Време на пристигнување"
                                            type="text"
                                            value={this.state.arrivalTime}
                                            onChange={this.handleChange}
                                        />
                                        <TextField
                                            name="distance"
                                            label="Растојание"
                                            type="text"
                                            value={this.state.distance}
                                            onChange={this.handleChange}
                                        />
                                    </FormControl>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => {this.handleClose()}}>Откажи</Button>
                                    <Button onClick={() => {this.handleAddRoute()}}>Зачувај</Button>
                                </DialogActions>
                            </Dialog>
                        </div>
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
                                {this.state.admin && <th></th>}
                                {this.state.admin && <th></th>}
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
                                    {
                                        this.state.admin && (
                                            <td>
                                                <button onClick={() => {this.handleEditRoute(row); this.setState({openEdit: true})}} className="EditButton">Edit</button>
                                            </td>
                                        )
                                    }
                                    {
                                        this.state.admin && (
                                            <td>
                                                <button onClick={() => this.handleDeleteRoute(row)} className="DeleteButton">Delete</button>
                                            </td>
                                        )
                                    }
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
                    <div className="dialog1">
                        <Dialog open={this.state.openEdit} onClose={() => {this.handleCloseEdit()}}>
                            <DialogTitle>Уреди рута</DialogTitle>
                            <DialogContent>
                                <FormControl>
                                    <TextField
                                        name="startPointEdit"
                                        label="Почетна точка"
                                        type="text"
                                        value={this.state.startPointEdit}
                                        onChange={this.handleChange}
                                        style={{paddingBottom: '5px', marginTop: '3px'}}
                                    />
                                    <TextField
                                        name="endPointEdit"
                                        label="Крајна точка"
                                        type="text"
                                        value={this.state.endPointEdit}
                                        onChange={this.handleChange}
                                        style={{paddingBottom: '5px'}}
                                    />
                                    <TextField
                                        name="departureTimeEdit"
                                        label="Време на тргнување"
                                        type="text"
                                        value={this.state.departureTimeEdit}
                                        onChange={this.handleChange}
                                        style={{paddingBottom: '5px'}}
                                    />
                                    <TextField
                                        name="arrivalTimeEdit"
                                        label="Време на пристигнување"
                                        type="text"
                                        value={this.state.arrivalTimeEdit}
                                        onChange={this.handleChange}
                                        style={{paddingBottom: '5px'}}
                                    />
                                    <TextField
                                        name="distanceEdit"
                                        label="Растојание"
                                        type="text"
                                        value={this.state.distanceEdit}
                                        onChange={this.handleChange}
                                        style={{paddingBottom: '5px'}}
                                    />
                                </FormControl>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => {this.handleCloseEdit()}}>Откажи</Button>
                                <Button onClick={() => {this.handleEdit(); this.componentDidMount();}}>Зачувај</Button>
                            </DialogActions>
                        </Dialog>
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
                        <nav className="reservationFooter">
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

export default Home;
