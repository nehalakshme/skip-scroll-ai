import React, { useState } from 'react';
import './App.css';

function App() {
  const [terms, setTerms] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    setLoading(true);
    const res = await fetch('/api/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ terms }),
    });
    const data = await res.json();
    setSummary(data.summary);
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>Terms & Conditions Summarizer</h1>
      <textarea
        rows={12}
        placeholder="Paste Terms and Conditions text here..."
        value={terms}
        onChange={(e) => setTerms(e.target.value)}
      />
      <button onClick={handleSummarize} disabled={loading || !terms}>
        {loading ? 'Summarizing...' : 'Summarize'}
      </button>
      {summary && (
        <div className="summary-box">
          <h2>Summary:</h2>
          <pre>{summary}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
