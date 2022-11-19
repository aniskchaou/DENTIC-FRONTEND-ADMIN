import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './Header.css';
import { Link, useHistory } from 'react-router-dom';
import CurrentUser from '../../main/config/user';
import messageHTTPService from '../../main/services/messageHTTPService'
import showMessage from '../../libraries/messages/messages';
import { LinearProgress } from '@mui/material';
import appointementHTTPService from '../../main/services/appointementHTTPService';

const Header = ({ connected, handleClick }) => {
    let history = useHistory()
    const [loading, setLoading] = useState(false);
    const [messsage, setmessage] = useState([]);

    const [appointements, setAppointements] = useState([]);
    const initialState = {
        input: '',
    };
    const [activity, setActivity] = useState(initialState);
    const logout = () => {
        handleClick(false)
        localStorage.clear()
        history.push("/login")
    }

    useEffect(() => {
        // LoadJS()
        //  getAllExpenses()
    }, []);


    const print = () => {
        history.replace("/result/" + activity.input)
    }

    const handleInputChange = event => {
        const { name, value } = event.target;
        setActivity({ ...activity, [name]: value });
    };

    const search = (event) => {
        if (event.keyCode === 13) {
            history.replace("/result/" + activity.input)
        }
    }


    const getAllExpenses = () => {
        setLoading(true);
        messageHTTPService.getAllMessage()
            .then(response => {
                console.log(response.data)
                setmessage(response.data);
                setLoading(false);
            })
            .catch(e => {
                showMessage('Error', CurrentUser.ERR_MSG, 'warning')
            });
    };

    const getAllAppointements = () => {
        setLoading(true);
        appointementHTTPService.getAllAppointement()
            .then(response => {
                setAppointements(response.data);
                setLoading(false);
            })
            .catch(e => {
                showMessage('Error', CurrentUser.ERR_MSG, 'warning')
            });
    };


    return (
        <div id="right-panel" className="right-panel" style={{ display: (connected ? 'block' : 'none') }}>
            <header id="header" className="header">
                <div className="top-left">
                    <div className="navbar-header">
                        <a className="navbar-brand" ><img src="images/logo.png" alt="Logo" /></a>
                        <a className="navbar-brand hidden" ><img src="images/logo2.png" alt="Logo" /></a>

                    </div>
                </div>
                <div className="top-right">
                    <div className="header-menu">
                        <div className="header-left">
                            <button className="search-trigger"><i className="fa fa-search"></i></button>
                            <div className="form-inline">
                                <form className="search-form">
                                    <input onChange={handleInputChange} name="input" value={activity.input} onKeyDown={(e) => search(e)} className="form-control mr-sm-2" type="text" placeholder="Search ..." aria-label="Search" />
                                    <button onClick={print} className="search-close" type="submit"><i className="fa fa-close"></i></button>
                                </form>
                            </div>

                            <div className="dropdown for-notification">
                                <button onClick={getAllAppointements} className="btn btn-secondary dropdown-toggle" type="button" id="notification" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i class="fas fa-calendar-check"></i>
                                    <span className="count bg-info">{appointements?.length}</span>
                                </button>
                                <div className="dropdown-menu" aria-labelledby="notification">
                                    <p className="red">You have {appointements.length} Appointements</p>
                                    {loading ? <span>loading...</span> :


                                        appointements.map(itemm =>
                                            <Link to="/rendezvous" className="dropdown-item media">
                                                <i className="fa fa-check"></i>
                                                {itemm.patient}
                                            </Link>
                                        )}


                                </div>
                            </div>

                            <div className="dropdown for-message">
                                <button onClick={getAllExpenses} className="btn btn-secondary dropdown-toggle" type="button" id="message" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <i className="fa fa-envelope"></i>
                                    <span className="count bg-primary">{messsage?.length}</span>
                                </button>
                                <div className="dropdown-menu" aria-labelledby="message">
                                    <p className="red">You have {messsage?.length}  Mails</p>
                                    {loading ? <span>loading...</span> :


                                        messsage.map(itemm =>
                                            <Link to="/messages" className="dropdown-item media" >
                                                <span className="photo media-left"><img alt="avatar" src="../images/avatar/1.jpg" /></span>
                                                <div className="message media-body">
                                                    <span className="name float-left">{itemm.name}</span>
                                                    <span className="time float-right">{itemm.datee}</span>
                                                    <p>{itemm.subject}</p>
                                                </div>
                                            </Link>
                                        )



                                    }

                                </div>
                            </div>
                        </div>

                        <div className="user-area dropdown float-right">
                            <a href="#" className="dropdown-toggle active" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img className="user-avatar rounded-circle" src="images/admin.png" alt="User Avatar" />
                            </a>

                            <div className="user-menu dropdown-menu">


                                <Link to="/configuration" className="nav-link" href="#"><i className="fa fa-cog"></i>Settings</Link>
                                <Link to="/profile" className="nav-link" href="#"><i className="fa fa-user"></i>My Profile</Link>

                                <Link onClick={logout} className="nav-link" href="#"><i className="fa fa-power-off"></i>Log Out</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    )
};

Header.propTypes = {};

Header.defaultProps = {};

export default Header;
