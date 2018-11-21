import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

const ids = [

];

class About extends React.Component {
  
  render(){
    return(
      <div className={this.props.className}>
        <header>
          <h1>About:</h1>
        </header>
        <div className="col-md-12">
          {
            ids.map(id =>
              <div className="col-md-4">
                <div>
                   <img style={{display:"block"}} width="100%" src={id[0]+".jpg"} alt=""/>
                </div>
                <div className="row">
                  <div className="text-with-description text-center">
                    {id[1]}
                  </div>
                </div>
                <div className="row">
                  <div className="link-social"></div>
                </div>
              </div>
            )
          }
        </div>
        
      </div>
    );
  }
}

export default About;





