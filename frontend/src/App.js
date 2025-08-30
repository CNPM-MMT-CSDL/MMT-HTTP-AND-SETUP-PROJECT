import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Gọi API backend
    fetch('http://localhost:3000/api/test')
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        {/* Hiển thị message từ backend */}
        <p>{message ? message : 'Loading...'}</p>
      </header>
    </div>
  );
}

export default App;
