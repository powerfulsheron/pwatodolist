import Todo from './components/todo/todo.js';
import Form from './components/form/form.js';
import { openDB } from '../node_modules/idb/build/esm/index.js';
import checkConnectivity from '/js/connection.js';

(async function (document) {

  const app = document.querySelector('#app');
  const listPage = document.querySelector('#list');
  const route = "http://localhost:3000/posts";
  let connected = true;
  const database = await openDB('app-store', 1, {
    upgrade(db) {
      db.createObjectStore('items');
    }
  });
  let json = [];
  await database.put('items', json, 'items');

  // We check connectivity : if we are connected and if there is data in IndexDb, we move the data from IndexDB to the api
  checkConnectivity();
  document.addEventListener('connection-changed', async ({ detail }) => {
    console.log(detail);
    connected = detail;
    if(detail==true){
      let json = await database.get('items', 'items');
      if(json && json.length !== 0){
        json.forEach(function (result, index) {
          var xhr = new XMLHttpRequest();
          xhr.open("POST", route, true);
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.send(JSON.stringify(result));
          json.splice(index, 1);
        });
        database.put('items', json, 'items');
      }
    }
  });

  // Startup
  if (connected) {
    try {
      const data = await fetch(route).then(response => {
        return response.json();
      }).catch(err => {
        console.log(err);
      })
      //await database.put('items', data, 'items');
      const todos = data.map(item => {
        const todoElement = new Todo();
        todoElement.initTodo(
          item.title,
          item.description,
          item.date,
          item.priority,
          item.id
        );
        listPage.appendChild(todoElement);
        return todoElement;
      });
    } catch (error) {
      console.error(error);
    }
  }

  //Add form element to view
  app.appendChild(new Form());

  //EventListeners
  document.addEventListener('new-todo', async e => {
    let date = new Date().toJSON();
    let newTodo = {
      title: e.detail[0],
      description: e.detail[1],
      priority: e.detail[2],
      date: date,
      id: e.detail[3]
    };
    if (connected) {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", route, true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(JSON.stringify(newTodo));
    }else{
      let json = await database.get('items', 'items');
      json.push(newTodo);
      database.put('items', json, 'items');
    }
    const todoElement = new Todo();
    todoElement.initTodo(
      e.detail[0],
      e.detail[1],
      date,
      e.detail[2],
      e.id);
    listPage.appendChild(todoElement);
    return todoElement;
  });

  document.addEventListener('remove-todo', async e => {
    if (connected) {
      fetch(route + "/" + e.detail.value, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
    }else{
      let json = await database.get('items', 'items');
      findAndRemove(json, 'id', e.detail.value);
      database.put('items', json, 'items');
    }
  });

  //Helper
  function findAndRemove(array, property, value) {
    array.forEach(function (result, index) {
      if (result[property] === value) {
        array.splice(index, 1);
      }
    });
  }

})(document);