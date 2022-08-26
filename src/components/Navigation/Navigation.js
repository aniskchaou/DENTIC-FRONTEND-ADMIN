import React from 'react';
import Header from '../Header/Header';
import { NavLink } from "react-router-dom"
import CurrentUser from '../../main/config/user';

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (


      <aside id="left-panel" className="left-panel" style={{ display: (CurrentUser.CONNECTED_USER ? 'block' : 'none') }}>
        <nav className="navbar navbar-expand-sm navbar-default">

          <div id="main-menu" className="main-menu collapse navbar-collapse">
            <ul className="nav navbar-nav">
              <li >
                <NavLink to="/dashboard" activeClassName="activeNavLink"><i className="menu-icon fa fa-laptop"></i>Dashboard</NavLink>
              </li>


              <li class="menu-item-has-children dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="menu-icon fa fa-calendar"></i>Consultations</a>
                <ul class="sub-menu children dropdown-menu">

                  <li>
                    <NavLink to="/rendezvous" activeClassName="activeNavLink">Appointements</NavLink>
                  </li>
                  <li>
                    <NavLink to="/quick-test" activeClassName="activeNavLink">Quick test </NavLink>
                  </li>

                </ul>
              </li>

              <li>
                <NavLink to="/patient" activeClassName="activeNavLink"><i className="menu-icon fa fa-user"></i>Patients </NavLink>
              </li>

              <li class="menu-item-has-children dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="menu-icon fa fa-certificate"></i>Cartifications</a>
                <ul class="sub-menu children dropdown-menu">
                  <li>
                    <NavLink to="/certificate" activeClassName="activeNavLink">Certificate </NavLink>
                  </li>
                  <li>
                    <NavLink to="/certificate-template" activeClassName="activeNavLink">certificate templates </NavLink>
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
                    <NavLink to="/invoice" activeClassName="activeNavLink">Invoices </NavLink>
                  </li>
                  <li>
                    <NavLink to="/expense" activeClassName="activeNavLink">Expenses </NavLink>
                  </li>

                </ul>
              </li>

              <li class="menu-item-has-children dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="menu-icon fa fa-hotel"></i>Medecines</a>
                <ul class="sub-menu children dropdown-menu">
                  <li>
                    <NavLink to="/medicaments" activeClassName="activeNavLink">Medicaments </NavLink>
                  </li>
                  <li>
                    <NavLink to="/medicament-manufacture" activeClassName="activeNavLink">Manufactues </NavLink>
                  </li>
                  <li>
                    <NavLink to="/medicament-category" activeClassName="activeNavLink">Categories </NavLink>
                  </li>
                </ul>
              </li>


              <li>
                <NavLink to="/prescription" activeClassName="activeNavLink"><i className="menu-icon fa fa-bars"></i>Prescriptions </NavLink>
              </li>

              <li class="menu-item-has-children dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="menu-icon fa fa-bookmark"></i>CMS</a>
                <ul class="sub-menu children dropdown-menu">
                  <li>
                    <NavLink to="/homepage" activeClassName="activeNavLink">HomePage</NavLink>
                  </li>
                  <li>
                    <NavLink to="/openinghourpage" activeClassName="activeNavLink">Opening Hours </NavLink>
                  </li>
                  <li>
                    <NavLink to="/servicepage" activeClassName="activeNavLink">Service </NavLink>
                  </li>
                  <li>
                    <NavLink to="/blogpage" activeClassName="activeNavLink">Blog</NavLink>
                  </li>
                  <li>
                    <NavLink to="/contactpage" activeClassName="activeNavLink">Contact </NavLink>
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
                  <li>
                    <NavLink to="/sale-analytics" activeClassName="activeNavLink">Sales </NavLink>
                  </li>

                </ul>
              </li>


              <li class="menu-item-has-children dropdown">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="menu-icon fa fa-handshake-o"></i>Customers</a>
                <ul class="sub-menu children dropdown-menu">
                  <li>
                    <NavLink to="/service" activeClassName="activeNavLink">Services </NavLink>
                  </li>
                  <li>
                    <NavLink to="/testimonials" activeClassName="activeNavLink">Testimonials </NavLink>
                  </li>
                  <li>
                    <NavLink to="/schedule" activeClassName="activeNavLink">Schedule </NavLink>
                  </li>
                  <li>
                    <NavLink to="/messages" activeClassName="activeNavLink">Messages </NavLink>
                  </li>
                  <li>
                    <NavLink to="/newsletters" activeClassName="activeNavLink">NewsLetters </NavLink>
                  </li>

                </ul>
              </li>




              <li>
                <NavLink to="/configuration" activeClassName="activeNavLink"><i class="menu-icon fa fa-cogs"></i>Settings </NavLink>
              </li>


            </ul>
          </div>
        </nav>
      </aside>);

  }
}



Navigation.propTypes = {};

Navigation.defaultProps = {};

export default Navigation;
