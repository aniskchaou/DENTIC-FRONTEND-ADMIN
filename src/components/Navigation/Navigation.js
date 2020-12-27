import React from 'react';
import Header from '../Header/Header';
import {  NavLink } from "react-router-dom"

class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return(

      
    <aside id="left-panel" className="left-panel">
      <nav className="navbar navbar-expand-sm navbar-default">

        <div id="main-menu" className="main-menu collapse navbar-collapse">
          <ul className="nav navbar-nav">
            <li >
              <NavLink to="/dashboard" activeClassName="activeNavLink"><i className="menu-icon fa fa-laptop"></i>Tableau de bord </NavLink>
            </li>
            <li>
              <NavLink to="/prescription" activeClassName="activeNavLink"><i className="menu-icon fa fa-clipboard"></i>Prescriptions </NavLink>
            </li>
            <li>
              <NavLink to="/patient" activeClassName="activeNavLink"><i className="menu-icon fa fa-head-side-cough"></i>Patients </NavLink>
            </li>
            <li>
              <NavLink to="/medicaments" activeClassName="activeNavLink"><i className="menu-icon fa fa-capsules"></i>Médicaments </NavLink>
            </li>
            <li>
              <NavLink to="/rendezvous" activeClassName="activeNavLink"><i className="menu-icon fa fa-user-md"></i>Rendez vous </NavLink>
            </li>
            <li>
              <NavLink to="/payment" activeClassName="activeNavLink"><i className="menu-icon fa fa-money-bill-alt"></i>Paiement </NavLink>
            </li>
            <li>
              <NavLink to="/configuration" activeClassName="activeNavLink"><i className="menu-icon fa fa-cog"></i>Paramètres </NavLink>
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
