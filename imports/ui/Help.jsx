import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

const functions = [
  ["sin", "Sine function."],
  ["cos", "Cosine function."],
  ["tan", "Tangent function"],
  ["sqrt", "Square root function."],
  ["exp", "Exponential function."],
  ["log", "Logarithmic function."],
  ["in", "A function that gets a value from current input data row by index. The argument is a zero-based index."],
  ["out", "A function that outputs its argument into the output row and also returns it not to interrupt."]
];

const operators = [
  ["+", "The sum operator."],
  ["-", "The difference operator."],
  ["/", "The division operator."],
  ["*", "The multiplication operator."],
  ["^", "The power operator."],
];

class Help extends React.Component {
  
  render(){
    return(
      <div className={this.props.className}>
        <header>
          <h1>Summary</h1>
          <hr/>
        </header>
        <div className="col-md-12">
        	<div className="col-md-1"></div>
        	<div className="col-md-10">
        		<p className = "text-help">
              The algorithm used to process the data is basically a single-expression application in a purely functional programming language, which is capable of defining a mathematical expression using the operators and functions described below.
            </p>
        	</div>
        	<div className="col-md-1"></div>
        </div>

        <header>
          <h1>Operators</h1>
          <hr/>
        </header>
        <div className="col-md-12">
        	<table className="table">
        		<tbody>
        			{
                operators.map((row,i)=>
                  <tr key={i}>{
                    row.map((el,j)=>
                      <td key={j}>{el}</td>
                    )
                  }</tr>
                )
              }
        		</tbody>
        	</table>
          <br/>
        </div>

        <header>
          <h1>Functions</h1>
          <hr/>
        </header>
        <div className="col-md-12">
        	<table className="table">
        		<tbody>
        			{
                functions.map((row,i)=>
                  <tr key={i}>{
                    row.map((el,j)=>
                      <td key={j}>{el}</td>
                    )
                  }</tr>
                )
              }
        		</tbody>
        	</table>
          <br/>
        </div>
      </div>
    );
  }
}

export default Help;





