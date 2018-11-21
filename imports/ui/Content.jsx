import React from 'react';
import ReactDOM from 'react-dom';
import {createContainer} from 'meteor/react-meteor-data';
import {Meteor} from 'meteor/meteor';
import {Tasks} from '../api/tasks.js';
import Task from './Task.jsx';


class Content extends React.Component {
	constructor(props) {
        super(props);

        this.state = {
            hideCompleted: false,
        };
    }

    

    toggleHideCompleted() {
        this.setState({
            hideCompleted: !this.state.hideCompleted,
        });
    }

    renderTasks() {
        let filteredTasks = this.props.tasks;
        if (this.state.hideCompleted) {
            filteredTasks = filteredTasks.filter(task => !task.checked);
        }  
         return filteredTasks.map((task) => {
          const currentUserId = this.props.currentUser && this.props.currentUser._id;
          const showPrivateButton = task.owner === currentUserId;
     
          return (
            <Task
              key={task._id}
              task={task}
              showPrivateButton={showPrivateButton}
              go={this.props.go}
            />
          );
    });
    }

    render(){
		return(
			<div className={this.props.className}>
				<header>
					<h1>Task List ({this.props.incompleteCount} in progress)</h1>
					<label className="hide-completed">
						<input
						type="checkbox"
						readOnly
						checked={this.state.hideCompleted}
						onClick={this.toggleHideCompleted.bind(this)}
						/>
						Hide Completed Tasks
					</label>
				</header>
				<ul>
					{this.renderTasks()}
				</ul>
			</div>
		);
    }
}

Content.propTypes = {
    tasks: React.PropTypes.array.isRequired,
    incompleteCount: React.PropTypes.number.isRequired,
    currentUser: React.PropTypes.object,
};



export default createContainer(() => {
   Meteor.subscribe('tasks');
    return {
        tasks: Tasks.find({}, {
            sort: {
                createdAt: -1
            }
        }).fetch(),
        incompleteCount: Tasks.find({
            checked: {
                $ne: true
            }
        }).count(),
         currentUser: Meteor.user(),
    };
}, Content);

