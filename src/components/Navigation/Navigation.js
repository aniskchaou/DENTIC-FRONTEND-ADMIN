import React from 'react';
import Header from '../Header/Header';
import {  Link } from "react-router-dom"

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
            <li className="active">
              <Link to="/dashboard"><i className="menu-icon fa fa-laptop"></i>Tableau de bord </Link>
            </li>
            <li>
              <Link to="/prescription"><i className="menu-icon fa fa-laptop"></i>Prescriptions </Link>
            </li>
            <li>
              <Link to="/patient"><i className="menu-icon fa fa-laptop"></i>Patients </Link>
            </li>
            <li>
              <Link to="/medicaments"><i className="menu-icon fa fa-laptop"></i>Médicments </Link>
            </li>
            <li>
              <Link to="/rendezvous"><i className="menu-icon fa fa-laptop"></i>Rendez vous </Link>
            </li>
            <li>
              <Link to="/payment"><i className="menu-icon fa fa-laptop"></i>Paiement </Link>
            </li>
            <li>
              <Link to="/configuration"><i className="menu-icon fa fa-laptop"></i>Paramètres </Link>
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
