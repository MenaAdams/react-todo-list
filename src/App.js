import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';


function Task(props) {
  let task = null;
  if (props.unlocked === true) {
    task =  <li>
              <input 
                id={props.id}
                value={props.id}
                type="checkbox" 
                onClick={props.handleTaskCompletion}
                checked={props.completedAt}
              /> 
              <label htmlFor={props.id}>
                {props.description}
              </label>
            </li>;
  } else {
    task =  <li className="locked">
              <img alt="locked" src="locked.svg" />
              {props.description}
            </li>;
  }
  return task;
}

class TaskGroup extends Component {
  constructor(props) {
    super(props);
    this.state= {
      tasks: this.props.tasks,
    };
  }

  render(props) {
    const tasks = this.props.tasks.map(task => {
      let unlocked = true;
      if (task.dependencyIds !== []) {
        task.dependencyIds.forEach(id => {
          unlocked = this.props.completedTasks.includes(id)}
        );
      }

      return (
          <Task 
            key={task.id}
            id={task.id}
            description={task.task}
            unlocked={unlocked}
            completedAt={task.completedAt}
            handleTaskCompletion={this.props.handleTaskCompletion}
          />
      );
    })

    return (
        <div>
          <h1>
            {this.state.tasks[0].group} 
            <span 
              className="header"
              onClick={() =>this.props.toggleActiveGroup(null)}>
              ALL GROUPS
            </span>
          </h1> 
          <ul>
            {tasks}
          </ul>
        </div>
    );
  }
}

class App extends Component {
  constructor() {
    super();
    this.state= {
      tasks: [],
      completedTasks: [],
      activeGroup: null
    };
    this.handleTaskCompletion = this.handleTaskCompletion.bind(this);
    this.toggleActiveGroup = this.toggleActiveGroup.bind(this);
  }

  componentDidMount() {
    fetch('data.json')
      .then(response => response.json())
      .then(tasks => {
        this.setState({ tasks: tasks });
      });      
  }

  handleTaskCompletion(evt) {
    for (let task of this.state.tasks) {
      if (task.id == evt.target.value){
        if (task.completedAt === true){
          task.completedAt = false;
        } else {
          task.completedAt = true;
        }
      }
    }
 
    const completedTasks = [];
    for (let task of this.state.tasks) {
      if (task.completedAt === true && !(completedTasks.includes(task.id))) {
        completedTasks.push(task.id);
      }
    }
    this.setState({
      completedTasks: completedTasks
    });
  }

  toggleActiveGroup(group) {
    this.setState({
      activeGroup: group
    });
  }

  render() {
    // separate task groups into an object with key as group name
    const groups = {};
    for (let task of this.state.tasks) {
      if (task.group in groups) {
        groups[task.group].push(task);
      } else {
        groups[task.group] = [];
        groups[task.group].push(task);
      }
    }

    // create task group elements to display
    const taskGroups = [];
    if (this.state.activeGroup === null) {
      for (let group in groups) {
        // count number of tasks in group that are complete
        let numTasksComplete = 0;
        for (let task of groups[group]) {
          if (this.state.completedTasks.includes(task.id)) {
            numTasksComplete = numTasksComplete + 1;
          }
        }
        // create group div element
        let taskGroup = <div 
                          className="group"
                          onClick={() => 
                            this.toggleActiveGroup(groups[group][0].group)
                          }
                          key={groups[group][0].group}
                        > 
                          <img alt="group" src="group.svg" />
                          <label>
                            {groups[group][0].group}
                            <br />
                            <span className="group">                            
                              {numTasksComplete} OF {groups[group].length} TASKS COMPLETED
                            </span>
                          </label>
                        </div>;
        taskGroups.push(taskGroup);
      }
    } else {
      let taskGroup = <TaskGroup 
                        key={this.state.activeGroup}
                        tasks={groups[this.state.activeGroup]}
                        completedTasks={this.state.completedTasks}
                        handleTaskCompletion={this.handleTaskCompletion}
                        toggleActiveGroup={this.toggleActiveGroup}
                      />
      taskGroups.push(taskGroup);
    }

    return (
      <div id="body">
        <h1 hidden={this.state.activeGroup}> Things To Do </h1>
        {taskGroups}
      </div>
    );
  }
}

export default App;
