import { useState } from "react";

export default function KanbanBoard() {
  const [tasks, setTasks] = useState({
    todo: ["タスク 1", "タスク 2"],
    inProgress: ["タスク 3"],
    done: ["タスク 4", "タスク 5"],
  });

  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (!newTask.trim()) return;
    setTasks({ ...tasks, todo: [...tasks.todo, newTask] });
    setNewTask("");
  };

  return (
    <div>
      <div style={{ marginBottom: "1em" }}>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="タスク名を入力"
        />
        <button onClick={addTask}>追加</button>
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        {["todo", "inProgress", "done"].map((column) => (
          <div key={column} style={{ flex: 1, background: "#f8f8f8", padding: "1rem", borderRadius: "5px" }}>
            <h3 style={{ textAlign: "center" }}>
              {column === "todo"
                ? "予定"
                : column === "inProgress"
                ? "進行中"
                : "完了"}
            </h3>
            {tasks[column].map((task, i) => (
              <div key={i} style={{ background: "#fff", marginBottom: "0.5rem", padding: "0.5rem", borderRadius: "4px" }}>
                {task}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
