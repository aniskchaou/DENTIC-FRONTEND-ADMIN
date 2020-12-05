import React from 'react';
import Header from '../Header/Header';

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
              <a href="/dashboard"><i className="menu-icon fa fa-laptop"></i>Tableau de bord </a>
            </li>
            <li>
              <a href="/prescription"><i className="menu-icon fa fa-laptop"></i>Prescriptions </a>
            </li>
            <li>
              <a href="/patient"><i className="menu-icon fa fa-laptop"></i>Patients </a>
            </li>
            <li>
              <a href="/medicaments"><i className="menu-icon fa fa-laptop"></i>Médicments </a>
            </li>
            <li>
              <a href="/rendezvous"><i className="menu-icon fa fa-laptop"></i>Rendez vous </a>
            </li>
            <li>
              <a href="/payment"><i className="menu-icon fa fa-laptop"></i>Paiement </a>
            </li>
            <li>
              <a href="/configuration"><i className="menu-icon fa fa-laptop"></i>Paramètres </a>
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
