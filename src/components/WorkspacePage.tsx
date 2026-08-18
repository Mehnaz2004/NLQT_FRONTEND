import React, { useState, useEffect, useRef } from 'react';
import { sendQuery, type QueryResponse } from '../services/api';
import { NellyAnimation } from './NellyAnimation';
import {
  Send,
  RefreshCw,
  ArrowLeft,
  Database,
  Terminal,
  AlertTriangle,
  CheckCircle2,
  Download,
  Search,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Inbox
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'nelly';
  text: string;
  status?: 'success' | 'error';
  errorMsg?: string | null;
  rowCount?: number;
  timestamp: Date;
}

interface WorkspacePageProps {
  onBack: () => void;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({ onBack }) => {
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [showColdStartWarning, setShowColdStartWarning] = useState<boolean>(false);
  const [currentRows, setCurrentRows] = useState<Array<Record<string, any>> | null>(null);

  // Table sorting and filtering states
  const [tableSearch, setTableSearch] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSampleQueryClick = (query: string) => {
    setInputText(query);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  // Initialize or fetch existing Session ID
  useEffect(() => {
    let savedSession = sessionStorage.getItem('nelly_session_id');
    if (!savedSession) {
      savedSession = 'session_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now();
      sessionStorage.setItem('nelly_session_id', savedSession);
    }
    setSessionId(savedSession);

    // Initial Greeting from Nelly
    setMessages([
      {
        id: 'greet-1',
        sender: 'nelly',
        text: "Hello! I am Nelly, your intelligent database assistant. Send me any natural language request like: \"top colleges in Pune\" or \"private universities with high placements\", and I will execute the query for you.",
        status: 'success',
        timestamp: new Date()
      }
    ]);
  }, []);

  // Scroll to bottom of chat when messages update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Restart Chat - Generates a new session ID and clears history
  const handleResetSession = () => {
    const newSession = 'session_' + Math.random().toString(36).substring(2, 10) + '_' + Date.now();
    sessionStorage.setItem('nelly_session_id', newSession);
    setSessionId(newSession);
    setCurrentRows(null);
    setTableSearch('');
    setSortConfig(null);
    setMessages([
      {
        id: 'greet-reset',
        sender: 'nelly',
        text: "Database session reset successfully! I have started a clean conversation state. How can I help you query the database now?",
        status: 'success',
        timestamp: new Date()
      }
    ]);
  };

  // Submit User Message
  const handleSubmitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userMessageText = inputText.trim();
    setInputText('');

    // Append user message
    const userMsg: Message = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      text: userMessageText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    setShowColdStartWarning(false);

    const coldStartTimer = setTimeout(() => {
      setShowColdStartWarning(true);
    }, 4500);

    try {
      const response: QueryResponse = await sendQuery({
        session_id: sessionId,
        message: userMessageText
      });

      const nellyMsg: Message = {
        id: `msg-${Date.now()}-n`,
        sender: 'nelly',
        text: response.response || (response.status === 'success' ? 'Query processed successfully.' : 'I ran into an error executing that query.'),
        status: response.status,
        errorMsg: response.error,
        rowCount: response.rows ? response.rows.length : undefined,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, nellyMsg]);

      if (response.rows) {
        setCurrentRows(response.rows);
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          id: `msg-${Date.now()}-err`,
          sender: 'nelly',
          text: 'I could not process the query request due to an internal system error.',
          status: 'error',
          errorMsg: err instanceof Error ? err.message : String(err),
          timestamp: new Date()
        }
      ]);
    } finally {
      clearTimeout(coldStartTimer);
      setShowColdStartWarning(false);
      setLoading(false);
    }
  };

  // Table Column Headers mapping (filtered to hide IDs)
  const tableHeaders = currentRows && currentRows.length > 0
    ? Object.keys(currentRows[0]).filter(key => {
      const lower = key.toLowerCase();
      return lower !== 'id' && !lower.endsWith('_id') && lower !== '_id';
    })
    : [];

  // Sorting Handler
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter & Sort Rows
  const getFilteredAndSortedRows = () => {
    if (!currentRows) return [];

    let processed = [...currentRows];

    // Filter by text search
    if (tableSearch.trim()) {
      const query = tableSearch.toLowerCase().trim();
      processed = processed.filter(row =>
        Object.values(row).some(val =>
          String(val).toLowerCase().includes(query)
        )
      );
    }

    // Sort by configuration
    if (sortConfig) {
      const { key, direction } = sortConfig;
      processed.sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];

        if (aVal == null) return 1;
        if (bVal == null) return -1;

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return direction === 'asc' ? aVal - bVal : bVal - aVal;
        }

        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();

        if (aStr < bStr) return direction === 'asc' ? -1 : 1;
        if (aStr > bStr) return direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return processed;
  };

  const processedRows = getFilteredAndSortedRows();

  // Export to CSV helper
  const handleExportCSV = () => {
    if (!currentRows || currentRows.length === 0) return;

    const csvContent = [
      tableHeaders.join(','), // Header row
      ...currentRows.map(row =>
        tableHeaders.map(header => {
          const val = row[header];
          // Handle values with commas or quotes
          const strVal = val === null ? '' : String(val);
          if (strVal.includes(',') || strVal.includes('"') || strVal.includes('\n')) {
            return `"${strVal.replace(/"/g, '""')}"`;
          }
          return strVal;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `query_results_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="workspace-container animate-fade-in">
      {/* Sidebar - Chat Interface */}
      <aside className="sidebar glass-panel">
        <div className="sidebar-header">
          <button className="back-btn" onClick={onBack} title="Back to Landing Page">
            <ArrowLeft size={16} />
          </button>
          <div className="bot-profile">
            <div className="nelly-avatar-glow">
              <Sparkles size={16} className="avatar-spark" />
            </div>
            <div>
              <h3>Nelly</h3>
              <span className="online-tag">
                <span className="dot" /> DB Assistant
              </span>
            </div>
          </div>
          <button className="reset-btn" onClick={handleResetSession} title="Reset Chat State">
            <RefreshCw size={16} />
          </button>
        </div>

        {/* Chat Feed */}
        <div className="chat-feed">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-bubble-wrapper ${msg.sender}`}>
              {msg.sender === 'nelly' && (
                <div className="bubble-avatar">N</div>
              )}
              <div className={`chat-bubble ${msg.sender === 'nelly' && msg.status === 'error' ? 'error' : ''}`}>
                <p className="bubble-text">{msg.text}</p>

                {msg.sender === 'nelly' && msg.status === 'success' && msg.rowCount !== undefined && (
                  <div className="bubble-meta-success">
                    <CheckCircle2 size={12} />
                    <span>Loaded {msg.rowCount} records in data view.</span>
                  </div>
                )}

                {msg.sender === 'nelly' && msg.status === 'error' && (
                  <div className="bubble-meta-error">
                    <AlertTriangle size={12} />
                    <span>Failed execution: {msg.errorMsg || 'Validator reject'}</span>
                  </div>
                )}

                <span className="bubble-time">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}

          {/* Typing/Loading Indicator */}
          {loading && (
            <div className="chat-bubble-wrapper nelly animate-fade-in d-flex flex-column align-items-start gap-1">
              <div className="d-flex align-items-center gap-2">
                <div className="bubble-avatar loader-avatar">N</div>
                <div className="chat-bubble loader-bubble">
                  <div className="typing-loader">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>
              {showColdStartWarning && (
                <div
                  className="cold-start-warning border rounded p-2 text-warning animate-fade-in ms-4 mt-1"
                  style={{
                    fontSize: '0.75rem',
                    maxWidth: '280px',
                    background: 'rgba(245, 158, 11, 0.05)',
                    borderColor: 'rgba(245, 158, 11, 0.25) !important'
                  }}
                >
                  <div className="d-flex align-items-center gap-1 font-weight-bold mb-1" style={{ fontWeight: 600 }}>
                    <AlertTriangle size={12} />
                    <span>Server Cold-Starting...</span>
                  </div>
                  <span>Nelly is waking up. Render free tier servers take about 50 seconds to boot when idle. Thank you for waiting!</span>
                </div>
              )}
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggested Queries Horizontal Scroll Tray */}
        <div className="suggestion-chips-row">
          {[
            "top engineering colleges in pune",
            "only private ones",
            "with high placements",
            "computer science specializations in mumbai",
            "medical colleges in nagpur with hostel rating high",
            "remove hostel, any rating is fine"
          ].map((query, idx) => (
            <button
              key={idx}
              type="button"
              className="suggestion-chip"
              onClick={() => handleSampleQueryClick(query)}
              title="Click to load suggestion"
            >
              {query}
            </button>
          ))}
        </div>

        {/* Input box */}
        <form className="chat-input-area" onSubmit={handleSubmitMessage}>
          <input
            ref={inputRef}
            type="text"
            className="input-field chat-input"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask Nelly about tables or query data..."
            disabled={loading}
          />
          <button type="submit" className="send-btn" disabled={!inputText.trim() || loading}>
            <Send size={16} />
          </button>
        </form>

        <div className="sidebar-footer">
          <Terminal size={12} />
          <span>Session: {sessionId.substring(0, 16)}...</span>
        </div>
      </aside>

      {/* Main Panel - Data Table Representation */}
      <main className="data-viewer glass-panel">
        {currentRows ? (
          <div className="table-workspace animate-fade-in">
            {/* Table Control Header */}
            <div className="table-header-bar">
              <div className="table-title">
                <h2>Database Output</h2>
                <span className="row-badge">
                  {processedRows.length} of {currentRows.length} rows
                </span>
              </div>

              <div className="table-actions">
                <div className="search-box">
                  <Search className="search-icon" size={14} />
                  <input
                    type="text"
                    placeholder="Search results..."
                    className="search-input"
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                  />
                </div>

                <button className="btn-secondary compact" onClick={handleExportCSV}>
                  <Download size={14} />
                  Export CSV
                </button>
              </div>
            </div>

            {/* Rendered Table */}
            {processedRows.length > 0 ? (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      {tableHeaders.map((header) => {
                        const isSorted = sortConfig?.key === header;
                        return (
                          <th key={header} onClick={() => handleSort(header)} className="sortable-header">
                            <div className="header-cell-content">
                              <span>{header.replace(/_/g, ' ').toUpperCase()}</span>
                              {isSorted ? (
                                sortConfig.direction === 'asc' ? <ArrowUp size={12} className="sort-icon active" /> : <ArrowDown size={12} className="sort-icon active" />
                              ) : (
                                <ArrowUpDown size={12} className="sort-icon" />
                              )}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {processedRows.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {tableHeaders.map((header) => {
                          const val = row[header];
                          return (
                            <td key={header}>
                              {val === null || val === undefined ? (
                                <span className="null-val">null</span>
                              ) : typeof val === 'boolean' ? (
                                <span className={`bool-val ${val}`}>{String(val)}</span>
                              ) : (
                                String(val)
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-table-state">
                <Inbox size={48} className="empty-icon" />
                <h3>No records match search filter</h3>
                <p>Try refining or clearing your search text above.</p>
              </div>
            )}
          </div>
        ) : (
          /* Empty / Welcome State for Data Viewer */
          <div className="data-empty-state d-flex flex-column align-items-center justify-content-start overflow-y-auto w-100 h-100 p-4 text-center">
            <div className="mascot-avatar-container my-2">
              <NellyAnimation width="220px" height="220px" />
            </div>
            <h2 className="mb-2">Nelly's Data Terminal</h2>

            {/* Database Scope Info */}
            <div className="db-info-panel mb-4 p-3 rounded glass-panel-glow border-1 w-100" style={{ maxWidth: '520px' }}>
              <h4 className="text-light-info mb-2 fs-6 text-uppercase tracking-wider">Connected Database Scope</h4>
              <p className="small text-light-muted mb-0">
                You are querying an <strong>Indian Higher Education Database</strong> containing college profiles (engineering, medical, management), course specializations (e.g. BTech, MBA), placement package metrics, hostel/campus ratings, and entrance exams.
              </p>
            </div>

            <p className="text-light-muted mb-4 small" style={{ maxWidth: '460px' }}>
              Ask Nelly a database search request in the chat sidebar. The matching records will compile and display in this interactive panel.
            </p>

            {/* Database Schema Reference Grid */}
            <div className="w-100 mt-2" style={{ maxWidth: '520px' }}>
              <h3 className="fs-6 mb-3 text-start text-light-muted d-flex align-items-center gap-2">
                <Database size={14} className="text-primary" />
                <span>Searchable Database Entities:</span>
              </h3>
              <div className="row g-2 text-start">
                <div className="col-6">
                  <div className="p-3 rounded glass-panel-glow border border-secondary border-opacity-25 h-100" style={{ background: 'rgba(255,255,255,0.01)' }}>
                    <strong className="d-block text-primary small mb-1">Colleges &amp; Ratings</strong>
                    <span className="d-block text-light-muted" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>Name, City, State, Type (Private/Public), hostel, campus, and placement package ratings.</span>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 rounded glass-panel-glow border border-secondary border-opacity-25 h-100" style={{ background: 'rgba(255,255,255,0.01)' }}>
                    <strong className="d-block text-primary small mb-1">Courses &amp; Exams</strong>
                    <span className="d-block text-light-muted" style={{ fontSize: '0.8rem', lineHeight: '1.4' }}>Entrance exams (e.g. BTech, MBA), course specializations, and degree configurations.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Embedded Component Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .workspace-container {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 1.5rem;
          padding: 1.5rem;
          height: 100vh;
          max-width: 1600px;
          margin: 0 auto;
          overflow: hidden;
        }

        @media (max-width: 960px) {
          .workspace-container {
            grid-template-columns: 1fr;
            grid-template-rows: 1fr 1fr;
            height: auto;
            min-height: 100vh;
            overflow: visible;
          }
          .sidebar, .data-viewer {
            height: 600px !important;
          }
        }

        /* Sidebar Styling */
        .sidebar {
          display: flex;
          flex-direction: column;
          height: 100%;
          overflow: hidden;
          background: rgba(15, 22, 42, 0.55);
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          border-bottom: 1px solid var(--color-border);
        }

        .back-btn, .reset-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--color-border);
          color: var(--color-text-muted);
          width: 32px;
          height: 32px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .back-btn:hover, .reset-btn:hover {
          color: var(--color-primary);
          border-color: var(--color-primary-glow);
          background: rgba(0, 240, 255, 0.05);
        }

        .bot-profile {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .bot-profile h3 {
          font-size: 1rem;
          font-weight: 600;
        }

        .online-tag {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .online-tag .dot {
          width: 6px;
          height: 6px;
          background-color: var(--color-success);
          border-radius: 50%;
          display: inline-block;
          box-shadow: 0 0 6px var(--color-success);
        }

        .nelly-avatar-glow {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: radial-gradient(circle, var(--color-primary) 0%, var(--color-secondary) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          box-shadow: 0 0 10px var(--color-primary-glow);
        }

        .avatar-spark {
          color: #070a13;
        }

        /* Chat Feed */
        .chat-feed {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .chat-bubble-wrapper {
          display: flex;
          gap: 8px;
          max-width: 85%;
        }

        .chat-bubble-wrapper.user {
          margin-left: auto;
          flex-direction: row-reverse;
        }

        .chat-bubble-wrapper.nelly {
          margin-right: auto;
        }

        .bubble-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: rgba(0, 240, 255, 0.1);
          border: 1px solid rgba(0, 240, 255, 0.2);
          color: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.8rem;
          flex-shrink: 0;
        }

        .loader-avatar {
          animation: pulse 1.5s infinite ease-in-out;
        }

        .chat-bubble {
          padding: 10px 14px;
          border-radius: 12px;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 6px;
          font-size: 0.95rem;
          line-height: 1.4;
        }

        .chat-bubble-wrapper.user .chat-bubble {
          background: linear-gradient(135deg, rgba(0, 240, 255, 0.15) 0%, rgba(189, 0, 255, 0.15) 100%);
          border: 1px solid rgba(0, 240, 255, 0.15);
          color: var(--color-text-main);
          border-top-right-radius: 2px;
        }

        .chat-bubble-wrapper.nelly .chat-bubble {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--color-border);
          color: var(--color-text-main);
          border-top-left-radius: 2px;
        }

        .chat-bubble.error {
          border-color: rgba(239, 68, 68, 0.3) !important;
          background: rgba(239, 68, 68, 0.05) !important;
        }

        .bubble-text {
          word-break: break-word;
          white-space: pre-wrap;
        }

        .bubble-time {
          font-size: 0.7rem;
          color: var(--color-text-dark);
          align-self: flex-end;
        }

        .bubble-meta-success {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--color-success-bg);
          border: 1px solid rgba(16, 185, 129, 0.2);
          color: var(--color-success);
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.75rem;
          margin-top: 4px;
        }

        .bubble-meta-error {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--color-error-bg);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: var(--color-error);
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.75rem;
          margin-top: 4px;
        }

        /* Typing Loader */
        .typing-loader {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 6px;
        }

        .typing-loader span {
          width: 6px;
          height: 6px;
          background: var(--color-primary);
          border-radius: 50%;
          display: inline-block;
          animation: jump 1.4s infinite ease-in-out both;
        }

        .typing-loader span:nth-child(1) { animation-delay: -0.32s; }
        .typing-loader span:nth-child(2) { animation-delay: -0.16s; }

        @keyframes jump {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1) translateY(-6px); }
        }

        /* Chat Input Area */
        .chat-input-area {
          padding: 1rem;
          border-top: 1px solid var(--color-border);
          display: flex;
          gap: 8px;
        }

        .chat-input {
          flex: 1;
          padding: 10px 14px;
          font-size: 0.95rem;
        }

        .send-btn {
          background: var(--color-primary);
          border: none;
          color: #070a13;
          width: 42px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .send-btn:hover:not(:disabled) {
          box-shadow: 0 0 10px var(--color-primary);
          filter: brightness(1.1);
        }

        .send-btn:disabled {
          background: rgba(255, 255, 255, 0.05);
          color: var(--color-text-dark);
          cursor: not-allowed;
        }

        .sidebar-footer {
          padding: 0.5rem 1rem;
          background: rgba(0,0,0,0.1);
          border-top: 1px solid var(--color-border);
          font-size: 0.75rem;
          color: var(--color-text-dark);
          display: flex;
          align-items: center;
          gap: 6px;
        }

        /* Data Viewer Right Pane Styling */
        .data-viewer {
          height: 100%;
          overflow: hidden;
          background: rgba(15, 22, 42, 0.35);
        }

        .data-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 3rem;
          text-align: center;
        }

        .mascot-avatar-container {
          margin-bottom: 1rem;
        }

        .data-empty-state h2 {
          font-size: 1.8rem;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .data-empty-state p {
          color: var(--color-text-muted);
          max-width: 460px;
          margin-bottom: 2rem;
          font-size: 1rem;
          line-height: 1.5;
        }

        .empty-features {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
          max-width: 480px;
          text-align: left;
        }

        .empty-feature-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid var(--color-border);
          padding: 10px 14px;
          border-radius: 8px;
        }

        .empty-feature-item .num {
          background: rgba(0, 240, 255, 0.1);
          color: var(--color-primary);
          border: 1px solid rgba(0, 240, 255, 0.2);
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.75rem;
          font-weight: 700;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .empty-feature-item strong {
          display: block;
          font-size: 0.9rem;
          margin-bottom: 2px;
        }

        .empty-feature-item span {
          color: var(--color-text-muted);
          font-size: 0.8rem;
        }

        /* Table Workspace Area */
        .table-workspace {
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .table-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--color-border);
          flex-wrap: wrap;
          gap: 1rem;
        }

        .table-title h2 {
          font-size: 1.3rem;
          display: inline-block;
          margin-right: 10px;
        }

        .row-badge {
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--color-border);
          padding: 4px 8px;
          border-radius: 50px;
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }

        .table-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .search-box {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-icon {
          position: absolute;
          left: 10px;
          color: var(--color-text-dark);
        }

        .search-input {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--color-border);
          border-radius: 6px;
          padding: 6px 12px 6px 28px;
          color: var(--color-text-main);
          outline: none;
          font-size: 0.85rem;
          transition: all 0.2s ease;
          width: 180px;
        }

        .search-input:focus {
          border-color: var(--color-primary);
          background: rgba(15, 22, 42, 0.4);
          width: 240px;
        }

        .btn-secondary.compact {
          padding: 6px 12px;
          font-size: 0.85rem;
          border-radius: 6px;
        }

        /* Responsive Table Container */
        .table-container {
          flex: 1;
          overflow: auto;
          padding: 1rem 1.5rem;
        }

        .custom-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 0.9rem;
        }

        .custom-table th {
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 2px solid var(--color-border);
          color: var(--color-text-muted);
          padding: 10px 12px;
          font-weight: 600;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 0.8rem;
          letter-spacing: 0.05em;
        }

        .sortable-header {
          cursor: pointer;
          user-select: none;
          transition: background 0.2s ease;
        }

        .sortable-header:hover {
          background: rgba(255, 255, 255, 0.05);
          color: var(--color-primary);
        }

        .header-cell-content {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .sort-icon {
          color: var(--color-text-dark);
          transition: color 0.2s ease;
        }

        .sort-icon.active {
          color: var(--color-primary);
        }

        .custom-table td {
          padding: 10px 12px;
          border-bottom: 1px solid var(--color-border);
          color: var(--color-text-main);
          white-space: nowrap;
          max-width: 260px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .custom-table tr:hover td {
          background: rgba(255, 255, 255, 0.015);
        }

        .null-val {
          color: rgba(239, 68, 68, 0.6);
          font-style: italic;
          font-family: monospace;
        }

        .bool-val {
          font-family: monospace;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .bool-val.true {
          background: rgba(16, 185, 129, 0.1);
          color: var(--color-success);
        }

        .bool-val.false {
          background: rgba(239, 68, 68, 0.1);
          color: var(--color-error);
        }

        .empty-table-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          padding: 2rem;
          color: var(--color-text-muted);
        }

        .empty-icon {
          color: var(--color-text-dark);
          margin-bottom: 10px;
        }

        .text-light-muted {
          color: var(--color-text-muted) !important;
        }

        .text-light-info {
          color: var(--color-primary) !important;
          text-shadow: 0 0 10px rgba(0, 240, 255, 0.2);
        }

        .suggestion-chips-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding: 8px 12px;
          border-top: 1px solid var(--color-border);
          background: rgba(0, 0, 0, 0.15);
          scrollbar-width: none;
        }

        .suggestion-chips-row::-webkit-scrollbar {
          display: none;
        }

        .suggestion-chip {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--color-border);
          border-radius: 50px;
          padding: 4px 12px;
          font-size: 0.8rem;
          color: var(--color-primary);
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s ease;
          font-family: inherit;
        }

        .suggestion-chip:hover {
          background: rgba(0, 240, 255, 0.08);
          border-color: var(--color-primary);
          transform: translateY(-1px);
        }
      `}} />
    </div>
  );
};
