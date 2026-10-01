import { TRPCError } from "@trpc/server";
import { Todo } from "types";
import { Task } from "../procedures/todos/validation";

export let id = 0;
export let todos: Todo[] = [];

export function checkIfIdIsValid(id: number) {
  if (!todos.find((todo: Todo) => todo.id == id))
    throw new TRPCError({ code: "NOT_FOUND", message: "Todo Not Found" });
}

export function deleteTodoHelper({ id }: { id: number }) {
  checkIfIdIsValid(id);
  return (todos = todos.filter((todo) => todo.id !== id));
}

export function toggleTodoHelper({ id }: { id: number }) {
  checkIfIdIsValid(id);
  return (todos = todos.map((todo) =>
    todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo,
  ));
}

export function addTodoHelper(todo: Task) {
  todos.push({
    id: ++id,
    task: todo.task,
    isCompleted: false,
  });
  return todos;
}

export function getTodoByIdHelper({ id }: { id: number }) {
  checkIfIdIsValid(id);
  return todos.find((todo) => todo.id === id);
}

export function getAllTodosHelper() {
  return todos;
}
