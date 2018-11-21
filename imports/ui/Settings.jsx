import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

// Task component - represents a single todo item
export default class Settings extends Component {
  formSubmit(e){
    e.preventDefault();
    const isAdmin = Roles.userIsInRole(Meteor.userId(),['admin']);
    if(isAdmin){
      const requestDelta = ReactDOM.findDOMNode(this.refs.requestDelta).value;
      const cpuThreshold = ReactDOM.findDOMNode(this.refs.cpuThreshold).value/100;
      const bigDataCount = ReactDOM.findDOMNode(this.refs.bigDataCount).value;
      const expiryDelta = ReactDOM.findDOMNode(this.refs.expiryDelta).value;
      Meteor.call("settings.all.set",
        {
          requestDelta, 
          cpuThreshold
        }, 
        { 
          bigDataCount, 
          expiryDelta
        }
      );
    } else {
      const requestDelta = ReactDOM.findDOMNode(this.refs.requestDelta).value;
      const cpuThreshold = ReactDOM.findDOMNode(this.refs.cpuThreshold).value;
      Meteor.call("settings.user.set",{requestDelta, cpuThreshold});
    }
    $(".menu__breadcrumbs").children()[0].click();
    $("#dashboard")[0].click();
    window.worker.start();
  }
  componentDidMount(){
    ReactDOM.findDOMNode(this.refs.requestDelta).value = this.props.id.user.requestDelta;
    ReactDOM.findDOMNode(this.refs.cpuThreshold).value = this.props.id.user.cpuThreshold*100;
    if(Roles.userIsInRole(Meteor.userId(),['admin'])){
      ReactDOM.findDOMNode(this.refs.bigDataCount).value = this.props.id.server.bigDataCount;
      ReactDOM.findDOMNode(this.refs.expiryDelta).value = this.props.id.server.expiryDelta;
    }
  }
  render() {
    // Give tasks a different className when they are checked off,
    // so that we can style them nicely in CSS

      return(
      <div className={this.props.className}>
        <div className="col-md-12">
         <header>
          <h1>Setting</h1>
        </header>
          <form onSubmit={this.formSubmit.bind(this)}>
            <div className="col-md-12" style = {{"marginTop":"20px"}}>
              <div className="row">
                <div className="col-md-4">
                  <label style = {{"margin":"0 auto","fontSize":"18px"}} htmlFor="">Interval between task requests (ms):</label>
                </div>
                <div className="col-md-8">
                  <input 
                    type="number" 
                    min="0" 
                    className="form-control"
                    ref="requestDelta"/>
                </div>
              </div>
            </div>
            <div className="col-md-12" style = {{"marginTop":"20px"}}>
              <div className="row">
                <div className="col-md-4">
                  <label style = {{"margin":"0 auto","fontSize":"18px"}} htmlFor="">High CPU load level:%</label>
                </div>
                <div className="col-md-8">
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    className="form-control"
                    ref="cpuThreshold"/>
                </div>
              </div>
            </div>
            {(Roles.userIsInRole(Meteor.userId(),['admin'])) ?
              <div className="col-md-12" style = {{"marginTop":"20px"}}>
                <div className="row">
                  <div className="col-md-4">
                    <label style = {{"margin":"0 auto","fontSize":"18px"}} htmlFor="">Data split level:</label>
                  </div>
                  <div className="col-md-8">
                    <input 
                      type="number" 
                      min="0" 
                      className="form-control"
                      ref="bigDataCount"/>
                  </div>
                </div>
              </div>
              : null
            }
            {(Roles.userIsInRole(Meteor.userId(),['admin'])) ?
              <div className="col-md-12" style = {{"marginTop":"20px"}}>
                <div className="row">
                  <div className="col-md-4">
                    <label style = {{"margin":"0 auto","fontSize":"18px"}} htmlFor="">Expiry time (ms):</label>
                  </div>
                  <div className="col-md-8">
                    <input 
                      type="number" 
                      min="0"  
                      className="form-control"
                      ref="expiryDelta"/>
                  </div>
                </div>
              </div>
            : null
            }


            <div className="col-md-12" style = {{"marginTop":"30px"}}>
              <div className="row">
                <div className="text-center">
                  <input type="submit" className = "btn btn-info" value="Save"/>
                </div>
              </div>
            </div>

            
          </form>
        </div>
      </div>
      );
  }
}
