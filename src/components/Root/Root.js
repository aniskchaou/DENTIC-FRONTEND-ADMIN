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
import ForgotPassword from '../ForgotPassword/ForgotPassword';
import { BrowserRouter } from 'react-router-dom/cjs/react-router-dom';

// Public pages
import PublicAbout from '../public/PublicAbout';
import PublicDentists from '../public/PublicDentists';
import PublicDentistDetail from '../public/PublicDentistDetail';
import PublicServices from '../public/PublicServices';
import PublicServiceDetail from '../public/PublicServiceDetail';
import PublicLocations from '../public/PublicLocations';
import PublicLocationDetail from '../public/PublicLocationDetail';
import PublicEmergency from '../public/PublicEmergency';
import PublicNewPatient from '../public/PublicNewPatient';
import PublicPatientInfo from '../public/PublicPatientInfo';
import PublicReviews from '../public/PublicReviews';
import PublicBeforeAfter from '../public/PublicBeforeAfter';
import PublicFinancing from '../public/PublicFinancing';
import PublicFAQ from '../public/PublicFAQ';
import PublicBlog from '../public/PublicBlog';
import PublicBlogArticle from '../public/PublicBlogArticle';
import PublicContact from '../public/PublicContact';
import PublicCareers from '../public/PublicCareers';
import PublicAIAssistant from '../public/PublicAIAssistant';
import PublicSearch from '../public/PublicSearch';
import PublicLegal from '../public/PublicLegal';

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

          {/* Public pages */}
          <Route exact path="/about"><PublicAbout /></Route>
          <Route exact path="/dentists"><PublicDentists /></Route>
          <Route exact path="/dentists/:id"><PublicDentistDetail /></Route>
          <Route exact path="/services"><PublicServices /></Route>
          <Route exact path="/services/:slug"><PublicServiceDetail /></Route>
          <Route exact path="/locations"><PublicLocations /></Route>
          <Route exact path="/locations/:id"><PublicLocationDetail /></Route>
          <Route exact path="/emergency"><PublicEmergency /></Route>
          <Route exact path="/new-patient"><PublicNewPatient /></Route>
          <Route exact path="/patient-information"><PublicPatientInfo /></Route>
          <Route exact path="/reviews"><PublicReviews /></Route>
          <Route exact path="/before-after"><PublicBeforeAfter /></Route>
          <Route exact path="/financing"><PublicFinancing /></Route>
          <Route exact path="/faq"><PublicFAQ /></Route>
          <Route exact path="/blog"><PublicBlog /></Route>
          <Route path="/blog/:slug"><PublicBlogArticle /></Route>
          <Route exact path="/contact"><PublicContact /></Route>
          <Route exact path="/careers"><PublicCareers /></Route>
          <Route exact path="/ai"><PublicAIAssistant /></Route>
          <Route exact path="/search"><PublicSearch /></Route>
          <Route exact path="/privacy"><PublicLegal type="privacy" /></Route>
          <Route exact path="/terms"><PublicLegal type="terms" /></Route>
          <Route exact path="/cookies"><PublicLegal type="cookies" /></Route>
          <Route exact path="/accessibility"><PublicLegal type="accessibility" /></Route>

          {/* Auth & legacy public */}
           <Route exact path="/register" >
           <Register />
           </Route>
            <Route exact path="/send-message" >
           <SendMessage />
           </Route>
           <Route path="/book-appointment">
            <BookAppointment />
           </Route>
           <Route exact path="/forgot-password">
            <ForgotPassword />
           </Route>
          <Route path="*">
            {connected === true ? (
              <div>
                <Navigation connected={connected} />
                <div id="right-panel" className="right-panel">
                  <Header connected={connected} handleClick={handleClick} />
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
