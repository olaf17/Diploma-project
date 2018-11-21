import React from 'react';
import UIWrapper from './UIWrapper.jsx';
import { login } from '../api/accounts';
// Login component - represents the whole app
class Login extends React.Component {
  constructor() {
    super();
    Template.login.events({
      'click #signin': function(e) {
        e.preventDefault();
        var username = $("#login").val();
        var password = $("#password").val();
        login("password")(username, password, error=>{
          if(error) {
            alert(error);
          } else {
            FlowRouter.go('/');
          }
        });
      },
      'click #signup': function(e) {
        e.preventDefault();
        FlowRouter.go('/register');
      }
    });
  }
  render() {
    return (
      <div>
        <div className="row" style={{"height":"1em"}}></div>
        <div className="row centr">
          <div className="row">
            <img src="/logo.png" width="300" alt="" />
          </div>
          <div className="row loginHeading light-font">
            <h1>Project Cloud</h1>
          </div>
        </div>
        <div className="row centr">
          <h4 className="light-font">Authentication:</h4>
        </div>
        <div className="row">
          <div className="col-md-2 col-xs-1"></div>
          <div className="col-md-8 col-xs-10 dashed-border">
            
            <div className="row vcentr">
              <div className="col-md-5">
                <UIWrapper template="login" />
              </div>
              <div className="col-md-2 centr light-font">
                <h2 className="m0">OR</h2>
              </div>
              <div className="col-md-5">
                <div className="col-md-2"></div>
                <div className="col-md-8">
                  <div className="row" style={{"height":"1em"}}></div>
                  <div className="row">
                    <div className="col-xs-6 alignr">
                      <img width="100%" src="/google.svg" alt=""/>
                    </div>
                    <div className="col-xs-6 alignl">
                      <img width="100%" src="/facebook.svg" alt=""/>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xs-6 alignr">
                      <img width="100%" src="/twitter.svg" alt=""/>
                    </div>
                    <div className="col-xs-6 alignl">
                      <img width="100%" src="/linkedin.svg" alt=""/>
                    </div>
                  </div>
                  <div className="row" style={{"height":"1em"}}></div>
                </div>
                <div className="col-md-2"></div>
              </div>
            </div>
          </div>
          <div className="col-md-2 col-xs-1"></div>
        </div>
        <div className="row" style={{"height":"1em"}}></div>
      </div>
    );
  }
}
        

export default Login;