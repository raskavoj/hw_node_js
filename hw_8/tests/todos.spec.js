import test from "ava"
import supertest from "supertest"
import { app } from "../src/app.js"
import { db } from "../src/db.js"

test.beforeEach(async () => {
  await db.migrate.latest()
});

test.afterEach(async () => {
  await db.migrate.rollback()
});

// Test - get all todos
test.serial("it renders a list of todos", async (t) => {
  const response = await supertest.agent(app).get("/")

  t.assert(response.text.includes("<h1>Todos</h1>"))
});

// Test - insert new todo to DB
test.serial("create new todo", async (t) => {
  await db("todos").insert({
    title: "Moje todo",
  })

  const response = await supertest.agent(app).get("/")

  t.assert(response.text.includes("Moje todo"))
});

// Test - insert new todo via form
test.serial("create new todo via form", async (t) => {
  const response = await supertest
    .agent(app)
    .post("/add-todo")
    .type("form")
    .send({ title: "Nějaký název" })
    .redirects(1)

  t.assert(response.text.includes("Nějaký název"))
});

// Test - remove todo
test.serial("remove todo", async (t) => {
  const insertedTodo = await db("todos").insert({
    title: "Moje todo ke smazání",
  })

  const response = await supertest
    .agent(app)
    .get(`/remove-todo/${insertedTodo[0]}`)
    .redirects(1);

  t.assert(!response.text.includes("Moje todo ke smazání"))
});

// Test - toggle todo status
test.serial("toggle todo status", async (t) => {
  const insertedTodo = await db("todos").insert({
    title: "Moje todo pro toggle",
    done: false,
  })

  const response = await supertest
    .agent(app)
    .get(`/toggle-todo/${insertedTodo[0]}`)
    .redirects(1)

  t.is(response.status, 200)
  t.assert(response.text.includes("hotovo"))
});

// Test - detail of todo
test.serial("render todo detail page for existing todo", async (t) => {
  const insertedTodo = await db("todos").insert({
    title: "Todo test",
  })

  const response = await supertest
    .agent(app)
    .get(`/todo/${insertedTodo[0]}`)

  t.is(response.status, 200)
  t.assert(response.text.includes("Todo test"))
});

// Test - update todo
test.serial("update existing todo", async (t) => {
  const insertedTodo = await db("todos").insert({
    title: "Old Todo Title",
    priority: "low",
  })

  await supertest.agent(app)
    .post(`/update-todo/${insertedTodo[0]}`)
    .type("form")
    .send({
      title: "New Todo Title",
      priority: "high",
    })

  const updatedTodo = await db("todos").select("*").where("id", insertedTodo[0]).first()

  t.is(updatedTodo.title, "New Todo Title");
  t.is(updatedTodo.priority, "high");
});
