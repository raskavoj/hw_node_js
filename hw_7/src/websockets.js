import { WebSocketServer } from 'ws'
import ejs from 'ejs'
import { getAllTodos, getTodoById } from './db.js'

const connections = new Set()

export const createWebSocketServer = (server) => {
  const wss = new WebSocketServer({ server })

  wss.on('connection', (socket) => {
    connections.add(socket)

    console.log('New connection', connections.size)

    socket.on('close', () => {
      connections.delete(socket)

      console.log('Closed connection', connections.size)
    })
  })
}

export const sendTodoListToAllConnections = async () => {
  const todoList = await ejs.renderFile('views/_todos.ejs', {
    todos: await getAllTodos(),
  })

  for (const connection of connections) {
    connection.send(
      JSON.stringify({
        type: 'todoList',
        html: todoList,
      })
    )
  }
}

export const sendTodoUpdateToAllConnections = async (todoId = null) => {
  const todo = await getTodoById(todoId);
  let todoDetail = "Dané Todo již neexistuje, bylo smazáno! <br> <a href='/'>Zpět na seznam</a>";
  
  if (todo) {
    todoDetail = await ejs.renderFile('views/todo.ejs', {
      todo: todo,
    })
  }

  for (const connection of connections) {
    connection.send(
      JSON.stringify({
        type: 'todoUpdate',
        todoId: todoId,
        html: todoDetail,
      })
    )
  }
}

export const sendTodoUpdates = async (todoId = null) => {
  await sendTodoListToAllConnections()
  await sendTodoUpdateToAllConnections(todoId)
}
