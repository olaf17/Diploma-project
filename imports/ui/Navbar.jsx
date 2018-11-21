import React from 'react';
import {logout} from '../api/accounts';

const MenuItemLink = (props) => {
  return(
    <li className="menu__item"><a id={props.id} className="menu__link" onClick={props.action} href="#">{props.caption}</a></li>
  );
}

const SubMenuLink = (props) => {
  return(
    <li className="menu__item"><a id={props.id} className="menu__link" data-submenu={props.submenu} href="#">{props.caption}</a></li>
  );
}

const Menu = (props) => {
  return(
    <ul data-menu={props.name} className="menu__level">
      {
        props.items.filter(x=>x!==undefined).map((x,i)=>
          x[0]=="submenu"?
            <SubMenuLink key={i} submenu={x[2]} caption={x[1]} id={x[3]} />
          :
            <MenuItemLink key={i} caption={x[1]} action={x[2]} id={x[3]} />
        )
      }
    </ul>
  );
}

const taskCreate = go => () => {
  go("creator");
}

const home = go => () => {
  go("content");
}

const cordovaToggle = () => {
  if(Meteor.isCordova){
    let plugin = cordova.plugins.backgroundMode;
    plugin.setEnabled(!plugin.isEnabled());
  }
}

const settings = go => () => {
  window.worker.pause();
  Meteor.call("settings.all.get",(err,res)=>{
    go("settings",res);
  });
}

const help = go => () => {
  go("help");
}

const about = go => () => {
  go("about");
}

const nop = () => {};//TODO: Remove me

class Navbar extends React.Component {
  render(){
  	return(
	    <nav id="ml-menu" className="menu">
          <button className="action action--close" aria-label="Close Menu"><span className="icon icon--cross"></span></button>
          <div className="menu__wrap">
            <Menu name="main" items={[
              ["link", "Dashboard", home(this.props.go), "dashboard"],
              ["submenu", "Actions", "submenu-1", "actions"],
              ["link", "Settings", settings(this.props.go), "settings"],
              ["submenu", "Info", "submenu-2", "info"],
              ["link", "Logout", logout, "logout"],
            ]} />
            <Menu name="submenu-1" items={[
              ["link", "Create a new task", taskCreate(this.props.go), "create"],
              Meteor.isCordova ? ["link", "Toggle availability", cordovaToggle, "toggle"] : undefined,
            ]} />
            <Menu name="submenu-2" items={[
              ["link", "Help", help(this.props.go), "help"],
              // ["link", "About", about(this.props.go), "about"],
            ]} />
          </div>
        </nav>
	 );
  }
}

export default Navbar;