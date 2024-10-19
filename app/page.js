'use client';

import { useState, useEffect } from 'react';

export default function Page() {
  const loadTasks = () => {
    const savedTasks = JSON.parse(localStorage.getItem('tasks'));
    return savedTasks ? savedTasks : [
      { id: 1, title: 'Going for Groceries', description: 'Daily i have to buy groceries', priority: 'high', completed: false },
      { id: 2, title: 'Cricket Academy', description: 'Cricket Academy at evening for practice', priority: 'medium', completed: false },
      { id: 3, title: 'Daily Hangout', description: 'Daily hangout with friends', priority: 'low', completed: false },
      { id: 4, title: 'Notes', description: 'Making notes daily', priority: 'high', completed: true },
      { id: 5, title: 'Daily Exercise', description: 'Daily morning and evening exercise', priority: 'medium', completed: true },
      { id: 6, title: 'Watching movies', description: 'Watching movies or webseries for fun', priority: 'low', completed: false },
    ];
  };

  const [taskList, setTaskList] = useState(loadTasks());
  const [searchresult, updateSearchresult] = useState('');

  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(taskList));
  }, [taskList]);

 
  const toggleCompleted = (id) => {
    setTaskList(prevState =>
      prevState.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  
  const deleteTask = (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this task?');
    if (isConfirmed) {
      setTaskList(prevState => prevState.filter(task => task.id !== id));
    }
  };

  const addonemoreTask = (title, description, priority) => {
    if (!title || !description) {
      alert("Title and description are required fields.");
      return; 
    }
    const newTask = {
      id: taskList.length + 1,
      title,
      description,
      priority,
      completed: false,
    };
    setTaskList(prevState => [...prevState, newTask]);
    document.getElementById('title').value = "";
    document.getElementById('description').value = "";
  };

 
  const saveEditedTask = () => {
    const updatedTitle = document.getElementById('title').value;
    const updatedDescription = document.getElementById('description').value;
    const updatedPriority = document.getElementById('priority').value;

    if (!updatedTitle || !updatedDescription) {
      alert("Title and description are required fields.");
      return; 
    }

    setTaskList(prevState =>
      prevState.map(task =>
        task.id === editingTaskId
          ? { ...task, title: updatedTitle, description: updatedDescription, priority: updatedPriority }
          : task
      )
    );
    
    setEditingTaskId(null);
  };

  
  const filteredTasks = taskList
    .filter(task =>
      task.title.toLowerCase().includes(searchresult.toLowerCase()) ||
      task.description.toLowerCase().includes(searchresult.toLowerCase())
    )
    .sort((a, b) => {
      const priorities = { high: 1, medium: 2, low: 3 };
      return priorities[a.priority] - priorities[b.priority];
    });

  return (
    <div className="container">
      <h1>TaskerApp : App to handle tasks</h1>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search Task You Want"
          value={searchresult}
          onChange={(e) => updateSearchresult(e.target.value)}
        />
      </div>

      
      <div className="task-form">
        <input
          type="text"
          id="title"
          placeholder="Write a Task title here"
          defaultValue={editingTaskId ? taskList.find(task => task.id === editingTaskId).title : ''}
        />
        <textarea
          id="description"
          placeholder="Write a Task description here"
          defaultValue={editingTaskId ? taskList.find(task => task.id === editingTaskId).description : ''}
        />
        <select
          id="priority"
          defaultValue={editingTaskId ? taskList.find(task => task.id === editingTaskId).priority : 'high'}
        >
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        
        <button
          onClick={() => {
            if (editingTaskId) {
              saveEditedTask();
            } else {
              const title = document.getElementById('title').value;
              const description = document.getElementById('description').value;
              const priority = document.getElementById('priority').value;
              addonemoreTask(title, description, priority);
            }
          }}
        >
          {editingTaskId ? 'Save Changes' : 'Add Task'}
        </button>

       
        {editingTaskId && (
          <button onClick={() => setEditingTaskId(null)}>Cancel</button>
        )}
      </div>

      
      <div className="task-list">
        {filteredTasks.map((task) => (
          <div key={task.id} className={`task ${task.priority} ${task.completed ? 'completed' : ''}`}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <div>
              <button onClick={() => toggleCompleted(task.id)}>
                {task.completed ? 'Mark as Pending' : 'Mark as Completed'}
              </button>
              <button onClick={() => deleteTask(task.id)}>Delete Task</button>
              <button
                onClick={() => setEditingTaskId(task.id)} 
              >
                Edit Task
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
