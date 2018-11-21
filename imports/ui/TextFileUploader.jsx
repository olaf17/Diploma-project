import React from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';

const checkFileAPI = () => window.File && window.FileReader && window.FileList && window.Blob;

const dragOverHandler = e => {
    e.stopPropagation();
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

class TextFileUploader extends React.Component {
  constructor(){
    super();
    this.state = {mode: "text", data: ""};
  }

  onModeChange(){
    const newMode = this.refs.mode.value;
    this.setState((state, props) => ({mode: newMode, data: state.data}));
  }

  onUploadAreaClick(){
    $(ReactDOM.findDOMNode(this.refs.drag)).children("input").click();
  }

  onFileDrop(e){
    e.stopPropagation();
    e.preventDefault();
    let file = e.dataTransfer.files[0];
    let reader = new FileReader();
    reader.onload = e => {
      this.setState((state, props) => {
        state.data = e.target.result;
        return state;
      });
    }
    reader.readAsText(file, "utf-8");
  }

  onFileSelect(e){
    e.stopPropagation();
    e.preventDefault();
    let file = e.target.files[0];
    let reader = new FileReader();
    reader.onload = e => {
      this.setState((state, props) => {
        state.data = e.target.result;
        return state;
      });
    }
    reader.readAsText(file, "utf-8");
  }

  onTextChange(e){
    const val = e.target.value;
    // console.log(val);
    this.setState((state, props) => {
      state.data = val;
      return state;
    });
  }

  getInput(){
    return this.state.data;
  }

  render(){
    return(
      <div className={this.props.className}>
        <h4>{this.props.caption}</h4>
        {
          checkFileAPI() ? 
            <div className="col-xs-12 tfu-head">
              <label htmlFor={this.props.name+"_mode"}>Input mode:&nbsp;&nbsp;</label>
              <select name={this.props.name+"_mode"} ref="mode" onChange={this.onModeChange.bind(this)}>
                <option value="text">Text</option>
                <option value="file">File</option>
              </select>
            </div>
          : ""
        }
        {
          this.state.mode=="text" ?
            <textarea 
              className="col-xs-12 txt-input-area" 
              name={this.props.name+"_input"} 
              ref="text"
              onInput={this.onTextChange.bind(this)}
              value={this.state.data}/>
          :
            <div 
              className="col-xs-12 file-drag-area centr" 
              onClick={this.onUploadAreaClick.bind(this)} 
              ref="drag"
              onDragOver={dragOverHandler}
              onDrop={this.onFileDrop.bind(this)}>
                <input 
                  type="file" 
                  name={this.props.name+"_input"}
                  onChange={this.onFileSelect.bind(this)} />
                Click here or drop file to upload
            </div> 
        }
      </div>
    );
  }
}

export default TextFileUploader;