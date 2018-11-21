import React from 'react';
import Navbar from './Navbar.jsx';
import Content from './Content.jsx';
import Creator from './Creator.jsx';
import Edit from './Edit.jsx';
import Settings from './Settings.jsx';
import Help from './Help.jsx';
import About from './About.jsx';
import Classie from './tympanus/classie.js';
import Main from './tympanus/main.js';
import Modernizr from './tympanus/modernizr-custom.js';

const appState = (name,id) => (state, props) => ({show: name, id: id});

const states = ["content", "creator", "edit", "settings", "help", "about"];

// App component - represents the whole app
class App extends React.Component {
  constructor(){
    super();
    this.state = {show: "content"};
  }

  go(name, id){
    if(states.includes(name))
      this.setState(appState(name, id));
    var menuEl = document.getElementById('ml-menu');
    window.classie.remove(menuEl, 'menu--open');
  }

  getContent(){
    switch(this.state.show){
      case "content":
        return (<Content className="content" go={this.go.bind(this)} />);
      case "creator":
        return (<Creator className="content" go={this.go.bind(this)} />);
      case "edit":
        return (<Edit className="content" go={this.go.bind(this)} id={this.state.id} />);
      case "settings":
        return (<Settings className="content" go={this.go.bind(this)} id={this.state.id} />);
      case "help":
        return (<Help className="content" go={this.go.bind(this)} />);
      case "about":
        return (<About className="content" go={this.go.bind(this)} />);
    }
  }

  componentDidMount(){
    Modernizr(window,document);
    Classie(window);
    Main(window);
    var menuEl = document.getElementById('ml-menu'),
        mlmenu = new MLMenu(menuEl, {
          backCtrl : false, // show back button
        });
    var openMenuCtrl = document.querySelector('.action--open'),
        closeMenuCtrl = document.querySelector('.action--close');
    openMenuCtrl.addEventListener('click', openMenu);
    closeMenuCtrl.addEventListener('click', closeMenu);
    
    function openMenu() {
      window.classie.add(menuEl, 'menu--open');
    }
    
    function closeMenu() {
      window.classie.remove(menuEl, 'menu--open');
    }
    
  }

  render() {
    return (
      <div>
        <div className="tympanus-container">
          <header className="bp-header cf">
            <div className="bp-header__main">
              <nav className="bp-nav" />
            </div>
          </header>
          <button className="action action--open" aria-label="Open Menu"><span className="icon icon--menu"></span></button>
          <Navbar go={this.go.bind(this)} />
          { this.getContent() }
        </div>
      </div>
    );
  }
}

export default App;