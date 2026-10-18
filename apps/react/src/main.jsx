import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
function App() {
  const [result, setResult] = useState('Spring Boot 연결 확인');
  async function check() {
    try {
      const response = await fetch('/api/hello');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      setResult(JSON.stringify(await response.json(), null, 2));
    } catch (error) { setResult(error.message); }
  }
  return <main><h1>React 개발 환경</h1><button onClick={check}>API 호출</button><pre>{result}</pre></main>;
}
createRoot(document.getElementById('root')).render(<App />);
