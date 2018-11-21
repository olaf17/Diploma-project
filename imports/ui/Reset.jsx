import React from 'react';
import UIWrapper from './UIWrapper.jsx';
import { login } from '../api/accounts';
// Login component - represents the whole app
class Reset extends React.Component {
  constructor() {
    super();
    Template.reset.events({
      'click #signin': function(e) {
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
          <h4 className="light-font">Reset:</h4>
        </div>
        <div className="row">
            <div className="row vcentr">
              <div className="col-md-4"></div>
              <div className="col-md-4 dashed-border">
                <div className="row" style={{"height":"1em"}}></div>
                <div>
                  <p className = " light-font">
                    <h5 className = "centr">Lost your pass? Please follow these steps</h5>
                    <div className="col-12">
                      
                       <ul className="centr">
                          <li className = "li-none-marker"> Enter your Email or Login </li>
                          <li className = "li-none-marker"> Follow instruction int the sent email better</li>
                        </ul>
                    </div>
                    
                  </p>
                </div>
                      
                <UIWrapper template="reset" />
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
        

export default Reset;