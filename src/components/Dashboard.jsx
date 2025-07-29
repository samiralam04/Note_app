import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaEdit, FaSignOutAlt, FaUserCircle, FaStickyNote } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard = ({ user, onLogout }) => {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/notes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data);
    } catch (err) {
      setError('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(res.data);
    } catch (err) {
      setError('Failed to fetch user information');
    }
  };

  const handleAddNote = async () => {
    if (!text.trim()) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post(
        '/api/notes',
        { content: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText('');
      setSuccess('Note added successfully!');
      setTimeout(() => setSuccess(''), 3000);
      await fetchNotes();
    } catch (err) {
      setError('Failed to add note');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNote = async () => {
    if (!text.trim() || !editingId) return;
    
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.put(
        `/api/notes/${editingId}`,
        { content: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText('');
      setEditingId(null);
      setSuccess('Note updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
      await fetchNotes();
    } catch (err) {
      setError('Failed to update note');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async id => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.delete(`/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess('Note deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
      await fetchNotes();
    } catch (err) {
      setError('Failed to delete note');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = note => {
    setText(note.content);
    setEditingId(note.id);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    onLogout();
    navigate('/login');
  };

  useEffect(() => {
    fetchNotes();
    fetchUserInfo();
  }, []);

  return (
    <div className="dashboard-container">
      <style>{styles}</style>
      
      <div className="dashboard-header">
        <div className="user-info">
          <FaUserCircle className="user-icon" />
          <div>
            <h2>Welcome, {userInfo?.name || user?.email}</h2>
            <p className="user-email">{user?.email}</p>
            {userInfo?.createdAt && (
              <p className="user-meta">Member since: {new Date(userInfo.createdAt).toLocaleDateString()}</p>
            )}
          </div>
        </div>
        <button className="logout-button" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            className="alert-message error"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {error}
            <button onClick={() => setError('')} className="close-alert">×</button>
          </motion.div>
        )}
        {success && (
          <motion.div 
            className="alert-message success"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {success}
            <button onClick={() => setSuccess('')} className="close-alert">×</button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="note-form">
        <input
          type="text"
          placeholder={editingId ? "Edit your note..." : "Write a new note..."}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && (editingId ? handleUpdateNote() : handleAddNote())}
          className="note-input"
          autoFocus
        />
        <button 
          onClick={editingId ? handleUpdateNote : handleAddNote}
          className={`action-button ${editingId ? 'update' : 'add'}`}
          disabled={loading || !text.trim()}
        >
          {loading ? (
            <span className="spinner"></span>
          ) : editingId ? (
            <>
              Update <FaEdit />
            </>
          ) : (
            <>
              Add <FaPlus />
            </>
          )}
        </button>
        {editingId && (
          <button 
            onClick={() => {
              setEditingId(null);
              setText('');
            }}
            className="action-button cancel"
          >
            Cancel
          </button>
        )}
      </div>

      <div className="notes-header">
        <h3>
          <FaStickyNote /> Your Notes
        </h3>
        <span className="notes-count">{notes.length} note{notes.length !== 1 ? 's' : ''}</span>
      </div>

      {loading && notes.length === 0 ? (
        <div className="loading">
          <div className="spinner"></div>
          Loading your notes...
        </div>
      ) : notes.length === 0 ? (
        <div className="empty-state">
          <FaStickyNote className="empty-icon" />
          <p>You don't have any notes yet</p>
          <p>Add your first note above!</p>
        </div>
      ) : (
        <div className="notes-list">
          <AnimatePresence>
            {notes.map(note => (
              <motion.div 
                key={note.id}
                className="note-item"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.2 }}
                layout
              >
                <div className="note-content">{note.content}</div>
                <div className="note-actions">
                  <button 
                    onClick={() => handleEdit(note)} 
                    className="action-button edit"
                    title="Edit note"
                  >
                    <FaEdit />
                  </button>
                  <button 
                    onClick={() => handleDelete(note.id)} 
                    className="action-button delete"
                    title="Delete note"
                  >
                    <FaTrash />
                  </button>
                </div>
                {note.createdAt && (
                  <div className="note-date">
                    {new Date(note.createdAt).toLocaleString()}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

// Enhanced CSS Styles
const styles = `
  .dashboard-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 30px 20px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
    color: #2d3748;
  }

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
    background: #ffffff;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .user-icon {
    font-size: 42px;
    color: #4f46e5;
  }

  .user-info h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #1a202c;
  }

  .user-email {
    margin: 4px 0 0;
    font-size: 14px;
    color: #718096;
  }

  .user-meta {
    margin: 4px 0 0;
    font-size: 12px;
    color: #a0aec0;
  }

  .logout-button {
    background: #f56565;
    color: white;
    border: none;
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    transition: all 0.2s ease;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .logout-button:hover {
    background: #e53e3e;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  }

  .logout-button:active {
    transform: translateY(0);
  }

  .alert-message {
    padding: 14px 16px;
    border-radius: 8px;
    margin-bottom: 24px;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  }

  .alert-message.error {
    background: #fff5f5;
    color: #e53e3e;
    border-left: 4px solid #e53e3e;
  }

  .alert-message.success {
    background: #f0fff4;
    color: #38a169;
    border-left: 4px solid #38a169;
  }

  .close-alert {
    background: none;
    border: none;
    color: inherit;
    font-size: 18px;
    cursor: pointer;
    padding: 0 0 0 10px;
    opacity: 0.7;
    transition: opacity 0.2s;
  }

  .close-alert:hover {
    opacity: 1;
  }

  .note-form {
    display: flex;
    gap: 12px;
    margin-bottom: 30px;
    flex-wrap: wrap;
  }

  .note-input {
    flex: 1;
    min-width: 200px;
    padding: 14px 16px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 15px;
    transition: all 0.2s;
    background: #ffffff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .note-input:focus {
    outline: none;
    border-color: #818cf8;
    box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.2);
  }

  .note-input::placeholder {
    color: #a0aec0;
  }

  .action-button {
    padding: 14px 20px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
    transition: all 0.2s ease;
    border: none;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .action-button.add {
    background: #4f46e5;
    color: white;
  }

  .action-button.add:hover:not(:disabled) {
    background: #4338ca;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  }

  .action-button.update {
    background: #3182ce;
    color: white;
  }

  .action-button.update:hover:not(:disabled) {
    background: #2c5282;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  }

  .action-button.cancel {
    background: #e2e8f0;
    color: #4a5568;
  }

  .action-button.cancel:hover {
    background: #cbd5e0;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  }

  .action-button.edit {
    background: #ebf8ff;
    color: #3182ce;
    padding: 8px 12px;
  }

  .action-button.edit:hover {
    background: #bee3f8;
  }

  .action-button.delete {
    background: #fff5f5;
    color: #e53e3e;
    padding: 8px 12px;
  }

  .action-button.delete:hover {
    background: #fed7d7;
  }

  .action-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none !important;
  }

  .notes-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #edf2f7;
  }

  .notes-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    color: #2d3748;
  }

  .notes-count {
    background: #e2e8f0;
    color: #4a5568;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
  }

  .loading {
    text-align: center;
    color: #718096;
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .empty-state {
    text-align: center;
    padding: 40px 20px;
    background: #f8fafc;
    border-radius: 12px;
    color: #718096;
  }

  .empty-icon {
    font-size: 48px;
    color: #cbd5e0;
    margin-bottom: 16px;
  }

  .empty-state p {
    margin: 8px 0;
  }

  .notes-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .note-item {
    background: white;
    border: 1px solid #edf2f7;
    border-radius: 10px;
    padding: 18px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.2s;
    position: relative;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  }

  .note-item:hover {
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
    transform: translateY(-2px);
    border-color: #e2e8f0;
  }

  .note-content {
    flex: 1;
    color: #2d3748;
    word-break: break-word;
    padding-right: 15px;
    line-height: 1.5;
  }

  .note-actions {
    display: flex;
    gap: 8px;
  }

  .note-date {
    position: absolute;
    bottom: 5px;
    right: 20px;
    font-size: 11px;
    color: #a0aec0;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
    display: inline-block;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  @media (max-width: 640px) {
    .dashboard-container {
      padding: 20px 15px;
    }
    
    .dashboard-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 15px;
      padding: 15px;
    }
    
    .logout-button {
      width: 100%;
      justify-content: center;
    }
    
    .note-form {
      flex-direction: column;
    }
    
    .action-button {
      width: 100%;
      justify-content: center;
      padding: 12px;
    }
    
    .note-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 15px;
    }
    
    .note-actions {
      align-self: flex-end;
    }
    
    .note-date {
      position: static;
      align-self: flex-end;
      margin-top: 5px;
    }
  }
`;