import { useEffect, useState } from "react";

function CreateTodo() {
  const [todo, setTodo] = useState("");
  const [Data, setData] = useState([]);
  const [editId, setEditId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Fetch all todos from backend
  useEffect(() => {
    async function fetchTodo() {
      try {
        setIsLoading(true);
        const res = await fetch("http://localhost:3000/");
        const data = await res.json();
        setData(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchTodo();
  }, []);

  // ✅ Add new todo
  async function addtodo() {
    if (!todo.trim()) {
      showNotification("Please enter a todo", "error");
      return;
    }

    if (editId) {
      return updateTodo();
    }

    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:3000/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: todo }),
      });

      const newTodo = await res.json();
      setData([...Data, newTodo]);
      setTodo("");
      showNotification("Todo added successfully!", "success");
    } catch (error) {
      console.log(error);
      showNotification("Failed to add todo", "error");
    } finally {
      setIsLoading(false);
    }
  }

  // ✅ Delete todo
  async function Delete(id) {
    try {
      setIsLoading(true);
      await fetch(`http://localhost:3000/${id}`, { method: "DELETE" });
      setData(Data.filter((e) => e._id !== id));
      showNotification("Todo deleted!", "success");
    } catch (error) {
      console.log(error);
      showNotification("Failed to delete todo", "error");
    } finally {
      setIsLoading(false);
    }
  }

  // ✅ Start editing
  function startEdit(item) {
    setEditId(item._id);
    setTodo(item.text);
  }

  // ✅ Update existing todo
  async function updateTodo() {
    try {
      setIsLoading(true);
      const res = await fetch(`http://localhost:3000/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: todo }),
      });

      const updated = await res.json();
      const updatedList = Data.map((item) =>
        item._id === editId ? updated : item
      );

      setData(updatedList);
      setTodo("");
      setEditId(null);
      showNotification("Todo updated successfully!", "success");
    } catch (error) {
      console.log(error);
      showNotification("Failed to update todo", "error");
    } finally {
      setIsLoading(false);
    }
  }

  // ✅ Cancel edit
  function cancelEdit() {
    setEditId(null);
    setTodo("");
  }

  // ✅ Show notification
  function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  // ✅ Handle keyboard events
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      addtodo();
    }
    if (e.key === "Escape" && editId) {
      cancelEdit();
    }
  };

  return (
    <div className="cyber-container">
      <div className="cyber-header">
        <h1 className="cyber-title">
          <span className="cyber-glitch" data-text="CYBER-TODO">
            CYBER-TODO
          </span>
        </h1>
        <div className="cyber-subtitle">SYSTEM ONLINE</div>
      </div>

      <div className="input-container">
        <div className="cyber-input-wrapper">
          <input
            type="text"
            value={todo}
            onChange={(e) => setTodo(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="ENTER TASK COMMAND..."
            className="cyber-input"
            disabled={isLoading}
          />
        </div>

        <div className="button-group">
          <button
            onClick={addtodo}
            className={`cyber-button ${editId ? "edit" : "add"}`}
            disabled={isLoading}
          >
            <span className="button-text">
              {isLoading
                ? "PROCESSING..."
                : editId
                ? "UPDATE SYSTEM"
                : "INITIATE TASK"}
            </span>
            <span className="button-glow"></span>
          </button>

          {editId && (
            <button
              onClick={cancelEdit}
              className="cyber-button cancel"
              disabled={isLoading}
            >
              <span className="button-text">ABORT</span>
              <span className="button-glow"></span>
            </button>
          )}
        </div>
      </div>

      <div className="stats-container">
        <div className="stat-item">
          <span className="stat-label">TOTAL TASKS</span>
          <span className="stat-value">{Data.length}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">ACTIVE</span>
          <span className="stat-value">
            {Data.filter((item) => !item.completed).length}
          </span>
        </div>
        <div className="stat-item">
          <span className="stat-label">STATUS</span>
          <span className="stat-value">
            {isLoading ? "PROCESSING" : "READY"}
          </span>
        </div>
      </div>

      <div className="todos-container">
        {isLoading && Data.length === 0 ? (
          <div className="loading-container">
            <div className="cyber-loader"></div>
            <p className="loading-text">LOADING TASK DATABASE...</p>
          </div>
        ) : Data.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">⚡</div>
            <p className="empty-text">NO TASKS DETECTED</p>
            <p className="empty-subtext">AWAITING NEW COMMANDS</p>
          </div>
        ) : (
          <div className="todos-grid">
            {Data.map((value, index) => (
              <div
                key={value._id}
                className={`cyber-todo-card ${
                  editId === value._id ? "editing" : ""
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="card-header">
                  <span className="task-id">TASK-{index + 1}</span>
                  <span className="task-status">
                    {value.completed ? "COMPLETED" : "PENDING"}
                  </span>
                </div>

                <div className="task-content">
                  <span className="task-text">{value.text}</span>
                </div>

                <div className="card-actions">
                  <button
                    onClick={() => startEdit(value)}
                    className="action-btn edit-btn"
                    disabled={isLoading}
                  >
                    <span className="btn-icon">⚡</span>
                    EDIT
                  </button>
                  <button
                    onClick={() => Delete(value._id)}
                    className="action-btn delete-btn"
                    disabled={isLoading}
                  >
                    <span className="btn-icon">⏻</span>
                    DELETE
                  </button>
                </div>

                <div className="card-glow"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="cyber-footer">
        <div className="terminal-output">
          <div className="terminal-line"> SYSTEM: CYBER-TODO v2.0</div>
          <div className="terminal-line">
            {" "}
            STATUS: {isLoading ? "PROCESSING" : "OPERATIONAL"}
          </div>
          <div className="terminal-line"> TASKS: {Data.length} LOADED</div>
        </div>
      </div>
    </div>
  );
}

export default CreateTodo;
