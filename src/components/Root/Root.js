import React, { useState } from 'react';
import Navigation from '../Navigation/Navigation';
import Header from '../Header/Header';
import Content from '../Content/Content';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Footer from '../Footer/Footer';
import Login from '../Login/Login';
import HomePage from '../Home/HomePage';
import Register from '../Register/Register';
import SendMessage from '../Home/SendMessage';
import BookAppointment from '../Appointments/BookAppointment';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom';

const Root = () => {
  const [connected, setConnected] = useState(false);

  const handleClick = num => {
    setConnected(num);
  };

  return (
    <div>
       <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <HomePage />
          </Route>
           <Route exact path="/register" >
           <Register />
           </Route>
            <Route exact path="/send-message" >
           <SendMessage />
           </Route>
           <Route path="/book-appointment">
            <BookAppointment />
           </Route>
          <Route path="*">
            {connected === true ? (
              <div>
                <Navigation connected={connected} />
                <Header connected={connected} handleClick={handleClick} />
                <div id="right-panel" className="right-panel">
                  <div className="content">
                    <div className="animated fadeIn">
                      <div className="row">
                        <Content connected={connected} />
                      </div>
                    </div>
                  </div>
                  <div className="clearfix"></div>
                  <Footer connected={connected} />
                </div>
              </div>
            ) : (
              <Login handleClick={handleClick} />
            )}
          </Route>
        </Switch>
      </BrowserRouter>
    </div>
  );
};

export default Root;
