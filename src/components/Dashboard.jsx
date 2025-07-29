import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPlus, FaTrash, FaEdit, FaSignOutAlt, FaUserCircle, FaStickyNote } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { setTokenCookie, getTokenFromCookie } from '../utils/tokenUtils';

const Dashboard = ({ user, onLogout }) => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
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
      const token = getTokenFromCookie();
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

  

  const handleAddNote = async () => {
    if (!title.trim() || !text.trim()) return;

    try {
      setLoading(true);
      const token = getTokenFromCookie();
      await axios.post(
        '/api/notes',
        { title, content: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle('');
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
    if (!title.trim() || !text.trim() || !editingId) return;

    try {
      setLoading(true);
      const token = getTokenFromCookie();
      await axios.put(
        `/api/notes/${editingId}`,
        { title, content: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle('');
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
      const token = getTokenFromCookie();
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
    setTitle(note.title);
    setText(note.content);
    setEditingId(note.id);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="dashboard-container">
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
          placeholder={editingId ? "Edit title..." : "Note title..."}
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="note-input"
        />
        <input
          type="text"
          placeholder={editingId ? "Edit your note..." : "Write a new note..."}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && (editingId ? handleUpdateNote() : handleAddNote())}
          className="note-input"
        />
        <div className="form-actions">
          <button 
            onClick={editingId ? handleUpdateNote : handleAddNote}
            className={`action-button ${editingId ? 'update' : 'add'}`}
            disabled={loading || !text.trim() || !title.trim()}
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
                setTitle('');
              }}
              className="action-button cancel"
            >
              Cancel
            </button>
          )}
        </div>
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
                <div className="note-title">{note.title}</div>
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
    margin: 2rem auto;
    padding: 1.5rem;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  .dashboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #f0f0f0;
  }

  .user-info {
    display: flex;
    gap: 1rem;
    align-items: center;
  }

  .user-icon {
    font-size: 2.5rem;
    color: #4a6cf7;
  }

  .user-info h2 {
    margin: 0;
    font-size: 1.4rem;
    font-weight: 600;
    color: #333;
  }

  .user-email {
    font-size: 0.9rem;
    color: #666;
    margin-top: 0.2rem;
  }

  .user-meta {
    font-size: 0.8rem;
    color: #999;
    margin-top: 0.2rem;
  }

  .logout-button {
    background: #ff4757;
    color: white;
    padding: 0.6rem 1.2rem;
    border: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .logout-button:hover {
    background: #ff6b81;
    transform: translateY(-1px);
  }

  .alert-message {
    margin: 1rem 0;
    padding: 0.8rem 1.2rem;
    border-radius: 8px;
    position: relative;
    font-size: 0.95rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .alert-message.error {
    background: #ffebee;
    color: #c62828;
    border-left: 4px solid #ef5350;
  }

  .alert-message.success {
    background: #e8f5e9;
    color: #2e7d32;
    border-left: 4px solid #66bb6a;
  }

  .close-alert {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    color: inherit;
    opacity: 0.7;
  }

  .close-alert:hover {
    opacity: 1;
  }

  .note-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 2rem 0;
    background: #f9fafb;
    padding: 1.5rem;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }

  .note-input {
    padding: 0.8rem 1rem;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.2s ease;
  }

  .note-input:focus {
    outline: none;
    border-color: #4a6cf7;
    box-shadow: 0 0 0 3px rgba(74, 108, 247, 0.1);
  }

  .form-actions {
    display: flex;
    gap: 0.8rem;
  }

  .action-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1.2rem;
    font-size: 0.95rem;
    border: none;
    cursor: pointer;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .action-button.add {
    background-color: #4a6cf7;
    color: white;
  }

  .action-button.add:hover {
    background-color: #3a5bd9;
    transform: translateY(-1px);
  }

  .action-button.update {
    background-color: #f39c12;
    color: white;
  }

  .action-button.update:hover {
    background-color: #e67e22;
    transform: translateY(-1px);
  }

  .action-button.cancel {
    background-color: #e0e0e0;
    color: #555;
  }

  .action-button.cancel:hover {
    background-color: #d0d0d0;
    transform: translateY(-1px);
  }

  .action-button.edit {
    background-color: #f1c40f;
    color: #333;
  }

  .action-button.edit:hover {
    background-color: #f39c12;
    transform: translateY(-1px);
  }

  .action-button.delete {
    background-color: #ff4757;
    color: white;
  }

  .action-button.delete:hover {
    background-color: #ff6b81;
    transform: translateY(-1px);
  }

  .action-button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none !important;
  }

  .spinner {
    width: 18px;
    height: 18px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .notes-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 2rem 0 1rem;
  }

  .notes-header h3 {
    margin: 0;
    font-size: 1.3rem;
    color: #333;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .notes-count {
    font-size: 0.9rem;
    color: #666;
    background: #f0f0f0;
    padding: 0.3rem 0.8rem;
    border-radius: 20px;
  }

  .notes-list {
    margin-top: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .note-item {
    padding: 1.5rem;
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    background: #ffffff;
    position: relative;
    transition: all 0.2s ease;
  }

  .note-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }

  .note-title {
    font-weight: 600;
    font-size: 1.2rem;
    margin-bottom: 0.8rem;
    color: #333;
  }

  .note-content {
    margin-bottom: 1rem;
    color: #555;
    line-height: 1.5;
  }

  .note-actions {
    display: flex;
    gap: 0.8rem;
  }

  .note-date {
    font-size: 0.8rem;
    color: #999;
    margin-top: 0.8rem;
  }

  .empty-state {
    text-align: center;
    margin: 3rem 0;
    color: #888;
    padding: 2rem;
    background: #f9fafb;
    border-radius: 10px;
  }

  .empty-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
    color: #ccc;
  }

  .empty-state p {
    margin: 0.5rem 0;
  }

  .loading {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: #555;
    margin: 2rem 0;
    justify-content: center;
  }

  .loading .spinner {
    border-color: rgba(74, 108, 247, 0.3);
    border-top-color: #4a6cf7;
  }
`;

// Inject styles into the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);