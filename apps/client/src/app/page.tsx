"use client";

import React from "react";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { serverType } from "server";
import { Todo } from "types";

const trpcClientInstance = createTRPCClient<serverType>({
  links: [
    httpBatchLink({
      url: "http://localhost:4040",
    }),
  ],
});

export default function Home() {
  const [todos, setTodos] = React.useState<Todo[] | []>([]);

  const taskRef = React.useRef<HTMLInputElement>(null);

  async function loadTodos() {
    const todosRes = await trpcClientInstance.todo.getAll.query();
    setTodos(todosRes);
  }

  React.useEffect(() => {
    (() => loadTodos())();
  }, []);

  async function hndleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!taskRef.current?.value) return;

    const upatedTodos = await trpcClientInstance.todo.add.mutate({
      task: taskRef.current.value,
    });

    taskRef.current.value = "";
    setTodos(upatedTodos);
  }

  return (
    <div>
      <hr />
      <form onSubmit={hndleSubmit}>
        <input type="text" name="task" ref={taskRef} />
        <button type="submit">ADD</button>
      </form>
      <hr />

      <h1>Todos</h1>

      {todos?.length
        ? todos.map((todo) => (
            <li key={todo.id} style={{ display: "flex", gap: "1rem" }}>
              <div
                style={{
                  textDecoration: todo.isCompleted ? "line-through" : "none",
                }}
              >
                {todo.task}
              </div>

              <button
                type="button"
                onClick={async () => {
                  const udatedTodos =
                    await trpcClientInstance.todo.toggle.mutate({
                      id: todo.id,
                    });
                  setTodos(udatedTodos);
                }}
              >
                Toggle Complete
              </button>

              <button
                type="button"
                onClick={async () => {
                  const updatedTodos =
                    await trpcClientInstance.todo.remove.mutate({
                      id: todo.id,
                    });
                  setTodos(updatedTodos);
                }}
              >
                Delete
              </button>
            </li>
          ))
        : []}
    </div>
  );
}
