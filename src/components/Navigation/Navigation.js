import React, { useEffect, useState } from 'react';
import Header from '../Header/Header';
import { NavLink } from "react-router-dom"
import CurrentUser from '../../main/config/user';
import { LoadJSFiles } from '../init';
import messageHTTPService from '../../main/services/messageHTTPService';
import './Navigation.css'
const Navigation = ({ connected }) => {

  const [messages, setMessages] = useState(0);


  useEffect(() => {

    getMessages()
    // getUsers()
    // LoadJS()


  }, []);

  const getMessages = () => {
    messageHTTPService.getCount().then(data => {
      setMessages(data.data.message)
    })
  }

  return (

    <aside id="left-panel" class="left-panel" style={{ display: (connected ? 'block' : 'none') }}>
      <nav class="navbar navbar-expand-sm navbar-default">



        <div id="main-menu" class="main-menu collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <li >
              <NavLink to="/dashboard" activeClassName="activeNavLink"><i class="menu-icon fa fa-laptop"></i>Dashboard</NavLink>
            </li>


            <li class="menu-item-has-children dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="menu-icon fa fa-calendar"></i>Consultations</a>
              <ul class="sub-menu children dropdown-menu">

                <li>
                  <NavLink to="/rendezvous" activeClassName="activeNavLink">Appointements</NavLink>
                </li>
                <li>
                  <NavLink to="/quick-test" activeClassName="activeNavLink">Quick tests </NavLink>
                </li>

              </ul>
            </li>

            <li>
              <NavLink to="/patient" activeClassName="activeNavLink"><i class="menu-icon fa fa-user"></i>Patients </NavLink>
            </li>
            <li>
              <NavLink to="/messages" activeClassName="activeNavLink"><i class="menu-icon fa fa-envelope-open"></i>Messages <span className="badge badge-primary">{messages}</span></NavLink>
            </li>

            <li class="menu-item-has-children dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="menu-icon fa fa-certificate"></i>Patents</a>
              <ul class="sub-menu children dropdown-menu">
                <li>
                  <NavLink to="/certificate" activeClassName="activeNavLink">Certificates </NavLink>
                </li>
                <li>
                  <NavLink to="/certificate-template" activeClassName="activeNavLink">Templates </NavLink>
                </li>

              </ul>
            </li>

            <li class="menu-item-has-children dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="menu-icon fa fa-usd"></i>Finances</a>
              <ul class="sub-menu children dropdown-menu">
                <li>
                  <NavLink to="/payment" activeClassName="activeNavLink">Payments </NavLink>
                </li>
                <li>
                  <NavLink to="/expense" activeClassName="activeNavLink">Expenses </NavLink>
                </li>

              </ul>
            </li>

            <li class="menu-item-has-children dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="menu-icon fa fa-hotel"></i>Pharmaceuticals</a>
              <ul class="sub-menu children dropdown-menu">
                <li>
                  <NavLink to="/medicaments" activeClassName="activeNavLink">Medicaments </NavLink>
                </li>
                <li>
                  <NavLink to="/medicament-manufacture" activeClassName="activeNavLink">Manufactures </NavLink>
                </li>
                <li>
                  <NavLink to="/medicament-category" activeClassName="activeNavLink">Categories </NavLink>
                </li>
              </ul>
            </li>


            <li>
              <NavLink to="/prescription" activeClassName="activeNavLink"><i class="menu-icon fa fa-bars"></i>Prescriptions </NavLink>
            </li>

            <li class="menu-item-has-children dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="menu-icon fa fa-bookmark"></i>CMS</a>
              <ul class="sub-menu children dropdown-menu">
                <li>
                  <NavLink to="/homepage" activeClassName="activeNavLink">HomePage</NavLink>
                </li>
                <li>
                  <NavLink to="/openinghourpage" activeClassName="activeNavLink">Opening Hours Page </NavLink>
                </li>
                <li>
                  <NavLink to="/servicepage" activeClassName="activeNavLink">Service Page</NavLink>
                </li>
                <li>
                  <NavLink to="/blogpage" activeClassName="activeNavLink">Blog Page</NavLink>
                </li>
              </ul>
            </li>


            <li class="menu-item-has-children dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="menu-icon fa fa-area-chart"></i>Analytics</a>
              <ul class="sub-menu children dropdown-menu">
                <li>
                  <NavLink to="/patient-analytics" activeClassName="activeNavLink">Patient </NavLink>
                </li>
                <li>
                  <NavLink to="/medicament-analytics" activeClassName="activeNavLink">Medicament </NavLink>
                </li>


              </ul>
            </li>


            <li class="menu-item-has-children dropdown">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="menu-icon fa fa-handshake-o"></i>Front Office</a>
              <ul class="sub-menu children dropdown-menu">
                <li>
                  <NavLink to="/service" activeClassName="activeNavLink">Services </NavLink>
                </li>
              </ul>
            </li>




            <li>
              <NavLink to="/configuration" activeClassName="activeNavLink"><i class="menu-icon fa fa-cogs"></i>Settings </NavLink>
            </li>


          </ul>
        </div>
      </nav>
    </aside>

  );


}



Navigation.propTypes = {};

Navigation.defaultProps = {};

export default Navigation;
