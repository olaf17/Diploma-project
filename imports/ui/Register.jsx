import React from 'react';
import UIWrapper from './UIWrapper.jsx';
import { login } from '../api/accounts';


// Register component - represents the whole app
class Register extends React.Component {
  constructor() {
    super();
    Template.register.events({
      'click #signup': function(e) {
        e.preventDefault();
        var username = $("#login").val();
        var email = $("#email").val();
        var password = $("#password").val();
        // console.log(register("password"));
        Meteor.call('register', {type:"password", username, email, password}, (err, res) => {
          if (err) {
            alert(err);
          } else {
            login("password")(username,password);
            FlowRouter.go('/');
          }
        });
        // register("password")({username, email, password}, error => {
        //   if(error) {
        //     alert(error);
        //   } else {
        //     FlowRouter.go('/');
        //   }
        // });
      },
      'click #back': function(e) {
        e.preventDefault();
        FlowRouter.go('/login');
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
          <h4 className="light-font">Register:</h4>
        </div>
        <div className="row">
            <div className="row vcentr">
              <div className="col-md-4"></div>
              <div className="col-md-4 dashed-border">
                <div className="row" style={{"height":"1em"}}></div>
                <UIWrapper template="register" />
              </div>
              <div className="col-md-4"></div>
            </div>
          <div className="col-md-2 col-xs-1"></div>
        </div>
        <div className="row" style={{"height":"1em"}}></div>
      </div>
    );
  }
}
        

export default Register;