import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { TestTokenizer } from '../core/CalcCore';
import TextFileUploader from './TextFileUploader';

class Creator extends React.Component {
  handleSubmit(event) {
    event.preventDefault();
    // Find the text field via the React ref
    const algorithm = this.refs.algorithm.getInput().trim();
    const data = this.refs.data
                  .getInput()
                  .trim()
                  .split("\n")
                  .map(x=>(x
                    .match(/[\-\+]?\d+(\.\d+)?/g)||[])
                    .map(x=>+x));
    const name = ReactDOM.findDOMNode(this.refs.name).value.trim();
    const description = ReactDOM.findDOMNode(this.refs.description).value.trim();
    // Validation
    var valid = true;

    // Algorithm validation
    try{
      valid = valid && (TestTokenizer(algorithm).type != "error");
    } catch(e) {
      valid = false;
      alert("Please, check your input: algorithm is incorrect");
      return;
    }

    // Data validation
    var indexes = [];
    var inRX = /in\((\d+)\)/g;
    var match = inRX.exec(algorithm);
    while(match !== null) {
        indexes.push(+match[1]);
        // console.log("Pushed ", match[1]);
        match = inRX.exec(algorithm);
    }

    // console.log(indexes, valid, TestTokenizer(algorithm));

    if(indexes.length>0){
      const maxIn = indexes.reduce((a,b)=>Math.max(a,b));
      // console.log(indexes);
      // console.log(data);
      valid = valid && (data.filter(x=>x.length<maxIn+1).length == 0);
      // console.log(valid);
      // valid = false;// for debugging purposes
    }
    
    if(!valid){
      alert("Please, check your input: data validation went wrong");
      return;
    }
    // Insertion
    Meteor.call('tasks.insert', {algorithm, data, name, description});
    $(".menu__breadcrumbs").children()[0].click();
    $("#dashboard")[0].click();
    // this.props.go("content");
  }
  render(){
    return(
      <div className={this.props.className}>
        <header>
          <h1>Create a new task:</h1>
        </header>
        <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
          <div className="col-md-12">
            <label htmlFor="name" className="col-md-2 col-xs-6">Task name:&nbsp;&nbsp;</label>
            <input
              className="col-md-3 col-xs-6"
              type="text"
              ref="name"
              name="name"
              placeholder="Type task name here"/>
          </div>
          <div className="col-md-12">
            <label htmlFor="description" className="col-md-2 col-xs-6">Task description:&nbsp;&nbsp;</label>
            <textarea
              className="col-md-5 col-xs-6 description-area"
              type="text"
              ref="description"
              name="description"
              placeholder="Type task description here"/>
          </div>
          <div className="col-md-12 row">
            <div className="col-md-6 col-xs-12">
              <TextFileUploader 
                className="col-md-12" 
                name="algorithm"
                caption="Data processing algorithm:"
                ref="algorithm"/>
            </div>
            <div className="col-md-6 col-xs-12">
              <TextFileUploader 
                className="col-md-12" 
                name="data"
                caption="Data to process(CSV):"
                ref="data"/>
            </div>
            
          </div>
          <div className="col-md-12 centr">
            <button>Submit task</button>
          </div>
        </form>
      </div>
    );
  }
}

export default Creator;

//TODO: Implement dragover animations
//<div className="col-md-4 col-xs-12"><div className="col-md-12 dummy">REDUCER(OPTIONAL):<br/>COMING SOON</div></div>


