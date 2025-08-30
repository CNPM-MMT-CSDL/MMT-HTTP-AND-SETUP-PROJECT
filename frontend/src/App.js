import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [subjects, setSubjects] = useState([]);
  const [newSub, setNewSub] = useState("");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");

  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Load danh sách subjects nếu đã login
  const loadSubjects = () => {
    fetch("http://localhost:3000/api/subjects", {
      credentials: "include",
    })
      .then(res => {
        if (res.status === 401) throw new Error("Chưa đăng nhập");
        return res.json();
      })
      .then(data => setSubjects(data))
      .catch(() => setSubjects([]));
  };

  // Kiểm tra login khi load app
  useEffect(() => {
    fetch("http://localhost:3000/api/subjects", {
      credentials: "include",
    })
      .then(res => {
        if (res.status === 401) return null;
        return res.json();
      })
      .then(data => {
        if (data) {
          setUser({ username: "admin" });
          setSubjects(data);
        }
      });
  }, []);

  // Login
  const login = () => {
    fetch("http://localhost:3000/api/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then(res => {
        if (!res.ok) throw new Error("Login thất bại");
        return res.json();
      })
      .then(() => {
        setUser({ username });
        loadSubjects();
      })
      .catch(err => alert(err.message));
  };

  // Logout
  const logout = () => {
    fetch("http://localhost:3000/api/logout", {
      method: "POST",
      credentials: "include",
    }).then(() => {
      setUser(null);
      setSubjects([]);
    });
  };

  // Add subject
  const addSubject = () => {
    fetch("http://localhost:3000/api/subjects", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newSub }),
    })
      .then(res => res.json())
      .then(data => {
        setSubjects([...subjects, data]);
        setNewSub("");
      });
  };

  // Delete subject
  const deleteSubject = (id) => {
    fetch(`http://localhost:3000/api/subjects/${id}`, {
      method: "DELETE",
      credentials: "include",
    }).then(() => setSubjects(subjects.filter(s => s.id !== id)));
  };

  // Update subject
  const updateSubject = (id) => {
    fetch(`http://localhost:3000/api/subjects/${id}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: editName }),
    })
      .then(res => res.json())
      .then(data => {
        setSubjects(subjects.map(s => (s.id === id ? data : s)));
        setEditId(null);
        setEditName("");
      });
  };

  // Nếu chưa login → hiện form login
  if (!user) {
    return (
      <div className="container">
        <h2>Đăng nhập</h2>
        <input
          className="input"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button className="btn" onClick={login}>Login</button>
      </div>
    );
  }

  // Nếu login rồi → hiện quản lý môn học
  return (
    <div className="container">
      <h1>Quản lý môn học</h1>
      <button className="btn logout" onClick={logout}>Đăng xuất</button>

      <div className="form-row">
        <input
          className="input"
          value={newSub}
          onChange={e => setNewSub(e.target.value)}
          placeholder="Tên môn học mới"
        />
        <button className="btn add" onClick={addSubject}>Thêm</button>
      </div>

      <ul className="list">
        {subjects.map((s) => (
          <li key={s.id} className="list-item">
            {editId === s.id ? (
              <>
                <input
                  className="input"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                />
                <button className="btn save" onClick={() => updateSubject(s.id)}>Lưu</button>
                <button className="btn cancel" onClick={() => setEditId(null)}>Hủy</button>
              </>
            ) : (
              <>
                <span className="subject-name">{s.name}</span>
                <button className="btn edit" onClick={() => { setEditId(s.id); setEditName(s.name); }}>Sửa</button>
                <button className="btn delete" onClick={() => deleteSubject(s.id)}>Xóa</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;