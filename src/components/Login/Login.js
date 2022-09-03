import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './Login.css';
import CurrentUser from '../../main/config/user';
import showMessage from '../../libraries/messages/messages';
import { useHistory } from 'react-router';
import { useForm } from 'react-hook-form';
import { LoadJS, LoadJSFiles } from '../init';

const Login = (props) => {
  let history = useHistory()
  const { register, handleSubmit, errors } = useForm()

  useEffect(() => {
    LoadJSFiles()
  }, []);

  const onSubmit = (data) => {
    props.rerender();
    CurrentUser.CONNECTED_USER = true
    showMessage('', "Welcome  admin !", 'success')
    history.push("/dashboard")
  }


  return (
    <div className="bg-dark">
      <div className="sufee-login d-flex align-content-center flex-wrap">
        <div className="container">
          <div className="login-content" style={{ display: (!CurrentUser.CONNECTED_USER ? 'block' : 'none') }}>

            <div className="login-form">

              <div className="login-logo">
                <a href="index.html">
                  <img className="align-content" src="images/logo.png" alt="" />
                </a>
              </div>
              <div class="login-form">
                <form onSubmit={handleSubmit(onSubmit)} method="post">
                  <div class="form-group">
                    <label>Email address</label>
                    <input type="email" class="form-control" placeholder="Email" value="admin@admin.com" />
                  </div>
                  <div class="form-group">
                    <label>Password</label>
                    <input type="password" class="form-control" placeholder="Password" value="admin" />
                  </div>
                  <div class="checkbox">
                    <label>
                      <input type="checkbox" /> Remember Me
                    </label>
                    <label class="pull-right">
                      <a href="#">Forgotten Password?</a>
                    </label>

                  </div>
                  <button type="submit" class="btn btn-success btn-flat m-b-30 m-t-30">Sign in</button>
                  <div class="social-login-content">
                    <div class="social-button">
                      <button type="button" class="btn social facebook btn-flat btn-addon mb-3"><i class="ti-facebook"></i>Sign in with facebook</button>
                      <button type="button" class="btn social twitter btn-flat btn-addon mt-2"><i class="ti-twitter"></i>Sign in with twitter</button>
                    </div>
                  </div>
                  <div class="register-link m-t-15 text-center">
                    <p>Don't have account ? <a href="#"> Sign Up Here</a></p>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>


  )
};

Login.propTypes = {};

Login.defaultProps = {};

export default Login;
