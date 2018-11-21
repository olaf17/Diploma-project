import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Settings = new Mongo.Collection('settings');
Ground.Collection(Settings);

  Meteor.methods({
    'settings.user.get'() {
      // console.log("settings.user.get got called");
      const settings = Settings.findOne({owner: this.userId, type: 'user'});
      if(settings && settings.settings) return settings.settings;
      else return {
        requestDelta: 10000,
        cpuThreshold: 0.7
      };
    },
    'settings.server.get'() {
      // console.log("settings.server.get got called");
      const settings = Settings.findOne({type: 'server'});
      if(settings && settings.settings) return settings.settings;
      else return {
        bigDataCount: 2,
        expiryDelta: 300000
      };
    },
    'settings.all.get'(){
      return {
        user: Meteor.call('settings.user.get'),
        server: Meteor.call('settings.server.get')
      }
    },
  });
if(Meteor.isServer){
  Meteor.methods({
    'settings.all.set'(newUserSettings, newServerSettings){
      Meteor.call('settings.user.set', newUserSettings);
      Meteor.call('settings.server.set', newServerSettings);
    },
    'settings.user.set'(newSettings) {
      // console.log("settings.user.set got called");
      const settings = Settings.findOne({owner: this.userId, type: 'user'});
      if(settings) {
        Settings.update(
          {
            _id: settings._id
          },
          {
            $set: {
              settings: newSettings
            }
          }
        );
      } else {
        Settings.insert({
          owner: this.userId,
          type: 'user',
          settings: newSettings
        });
      }
    },
    'settings.server.set'(newSettings) {
      // console.log("settings.server.set got called");
      if(!Roles.userIsInRole(this.userId,['admin'])) throw new Meteor.Error('not-authorized');
      const settings = Settings.findOne({type: 'server'});
      if(settings) {
        Settings.update(
          {
            _id: settings._id
          },
          {
            $set: {
              settings: newSettings
            }
          }
        );
      } else {
        Settings.insert({
          owner: this.userId,
          type: 'server',
          settings: newSettings
        });
      }
    }
  });
}