import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Settings } from './settings';

export const Tasks = new Mongo.Collection('tasks');
Ground.Collection(Tasks);
 
// const bigDataCount = 2; // minimum data size to split
// const delta = 1000*60*5; // milliseconds for task capture expiry

const partitionArray = (array, size) => 
  array.map((e,i) => (i % size === 0) ? array.slice(i, i + size) : null)
       .filter(e=>e);

if (Meteor.isServer) {
  // This code only runs on the server
  Meteor.publish('tasks', function tasksPublication() {
    let matcher;
    if(Roles.userIsInRole(this.userId,['admin'])){
      matcher = {
        $match: {}
      }
    } else {
      matcher = { 
        $match: {
          $or: [
            { private: { $ne: true } },
            { owner: this.userId },
          ]
        }
      }
    }
    ReactiveAggregate(this, Tasks, [
      matcher,
      // { $unwind: "$output" },
      { 
        $group: {
          _id: "$groupID", 
          progress: { $avg: { $cond: ["$checked",1,0] } }, 
          results: { $push: "$output" }, 
          name: { $first: "$name" },
          algorithm: { $first: "$algorithm" },
          data: { $push: "$data" },
          name: { $first: "$name" },
          description: { $first: "$description" },
          createdAt: { $first: "$createdAt" },
          owner: { $first: "$owner" },
          username: { $first: "$username" },
          private: { $first: "$private" }
        }
      },
      { 
        $project: {
          progress: 1,
          output: {$cond: [
            {$eq: ["$progress",1]},
            "$results",
            {$concat: [{$substr: [{$multiply: ["$progress", 100]},0,-1]}, "% done."]}
          ]},
          name: 1,
          algorithm: 1,
          data: 1,
          name: 1,
          description: 1,
          createdAt: 1,
          owner: 1,
          username: 1,
          checked: {$cond: [
            {$eq: ["$progress",1]},
            true,
            false
          ]},
          private: 1
        }
      }
    ]);
  });

  Meteor.methods({
    'tasks.get'() {
      const task = Tasks.findOne({checked: false, expiry: {$lt: new Date()}}, {sort:{$natural:-1}});//TODO: priority,etc
      // console.log(Meteor.call('settings.server.get'));
      const delta = Meteor.call('settings.server.get').expiryDelta;
      // console.log(delta);
      if(task){
        Tasks.update({
          _id: task._id
        },{
          $set: {
            expiry: new Date(+(new Date()) + delta)
          }
        })
        return {
          id: task._id,
          algorithm: task.algorithm,
          data: task.data
        }
      } else {
        return 0;
      }
    },
    'tasks.resolve'(id, result) {
      check(result, [[Number]]);

      const task = Tasks.findOne({_id: id});
      if(!task) throw new Meteor.Error('Incorrect task id');

      Tasks.update(
        { _id: id },
        {
          $set: {
            output: result,
            checked: true
          }
        }
      );

      return true;
    },
    'tasks.fail'(id) {
      const task = Tasks.findOne({_id: id});
      if(!task) throw new Meteor.Error('Incorrect task id');
      if(task.failCount > 10) {
        Tasks.update(
          { _id: id },
          {
            $set: {
              output: {type: "error", value: "Subtask failed. Took too long to compute."},
              checked: true
            }
          }
        );
      } else {
        Tasks.update(
          { _id: id },
          {
            $inc: {
              failCount: 1
            }
          }
        );
      }
      return true;
    }
  })
 
 
  Meteor.methods({
    'tasks.insert'(task) {
      check(task.algorithm, String);
      check(task.data, [[Number]]);
      check(task.name, String);
      check(task.description, String);
   
      // Make sure the user is logged in before inserting a task
      if (! this.userId) {
        throw new Meteor.Error('not-authorized');
      }
      
      const groupID = new Meteor.Collection.ObjectID();
      const bigDataCount = Meteor.call('settings.server.get').bigDataCount;
      const newData = partitionArray(task.data, bigDataCount);
      //TODO: do parallellism here by inserting several subtasks
      newData.forEach(chunk => {
        Tasks.insert({
          algorithm: task.algorithm,
          data: chunk,
          name: task.name,
          description: task.description,
          createdAt: new Date(),
          owner: this.userId,
          username: Meteor.users.findOne(this.userId).username,
          checked: false,
          output: [],
          groupID: groupID._str,
          expiry: new Date(),
          failCount: 0,
          private: true
        });
      });
    },
    'tasks.remove'(taskId) {
      check(taskId, String);
      const task = Tasks.find({groupID: taskId});
      if (task.private && task.owner !== this.userId && !(Roles.userIsInRole(this.userId,['admin']))) {
        // If the task is private, make sure only the owner can delete it
        throw new Meteor.Error('not-authorized');
      }
      Tasks.remove({groupID: taskId});    
    },
    'tasks.setChecked'(taskId, setChecked) {
      check(taskId, String);
      check(setChecked, Boolean);
      const task = Tasks.find({groupID: taskId});
      if (task.private && task.owner !== this.userId && !(Roles.userIsInRole(this.userId,['admin']))) {
        // If the task is private, make sure only the owner can check it off
        throw new Meteor.Error('not-authorized');
      }
      console.log("Setting uncheck");
      Tasks.update({groupID: taskId}, { $set: { checked: setChecked, expiry: new Date() } }, {multi: true});
    },
    'tasks.setPrivate'(taskId, setToPrivate) {
      check(taskId, String);
      check(setToPrivate, Boolean);
   
      const task = Tasks.find({groupID: taskId});
   
      // Make sure only the task owner can make a task private
      if (task.owner !== this.userId && !(Roles.userIsInRole(this.userId,['admin']))) {
        throw new Meteor.Error('not-authorized');
      }
   
      Tasks.update({groupID: taskId}, { $set: { private: setToPrivate } }, {multi: true});
    },
    'tasks.updateBatch'(id, newProps){
      check(newProps, Object);
      // console.log(newProps, id);
      Tasks.update({groupID: id}, { $set: { name: newProps.name, description: newProps.description}}, {multi: true});
    }
  });
}