import { useEffect, useState } from 'react';

function Hydration() {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/hydration/')
      .then(res => res.json())
      .then(data => setLogs(data))
      .catch(err => console.error('Error fetching data:', err));
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Hydration Logs</h2>
      <ul>
        {logs.map(log => (
          <li key={log.id}>{log.amount}ml</li>
        ))}
      </ul>
    </div>
  );
}

export default Hydration;