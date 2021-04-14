import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './Login.css';
import CurrentUser from '../../main/config/user';
import showMessage from '../../libraries/messages/messages';
import { useHistory } from 'react-router';
import { useForm } from 'react-hook-form';
import { LoadJS } from '../init';

const Login = (props) => {
  let history = useHistory()
  const { register, handleSubmit, errors } = useForm()

  useEffect(() => {
    LoadJS()
  }, []);

  const onSubmit = (data) => {
    props.rerender();
    CurrentUser.CONNECTED_USER = true
    showMessage('Succés', "Bienvenue  admin !", 'success')
    history.push("/dashboard")
  }


  return (

    <div className="login-content" style={{ display: (!CurrentUser.CONNECTED_USER ? 'block' : 'none') }}>

      <div className="login-form">

        <div className="login-logo">
          <a href="index.html">
            <img className="align-content" src="images/logo.png" alt="" />
          </a>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} method="post">
          <div className="form-group">
            <label>Email</label>
            <input type="text" className="form-control" placeholder="Email" value="admin@admin.com" />
          </div>
          <div className="form-group">
            <label>Mot de passe</label>
            <input type="password" className="form-control" placeholder="Password" value="admin" />
          </div>
          <div className="checkbox">
          </div>
          <button type="submit" className="btn btn-success btn-flat m-b-30 m-t-30">Connexion</button>
        </form>
      </div>
    </div>
  )
};

Login.propTypes = {};

Login.defaultProps = {};

export default Login;
