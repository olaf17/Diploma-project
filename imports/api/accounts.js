import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

const logout = () => {
  Meteor.logout();
  FlowRouter.go('/login');
}

const login = type => {
  switch(type){
    case "password":
      return Meteor.loginWithPassword;
  }
};


export { logout, login };