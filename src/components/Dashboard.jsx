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

  const fetchUserInfo = async () => {
    // try {
    //   const token = getTokenFromCookie();
    //   const res = await axios.get('/api/auth/me', {
    //     headers: { Authorization: `Bearer ${token}` },
    //   });
    //   setUserInfo(res.data);
    // } catch (err) {
    //   setError('Failed to fetch user information');
    // }
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
    // fetchUserInfo();
  }, []);

  return (
    <div className="dashboard-container">
      <style>{`
        .dashboard-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 1rem;
          font-family: Arial, sans-serif;
        }
        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .user-info {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }
        .user-icon {
          font-size: 2rem;
        }
        .user-email,
        .user-meta {
          font-size: 0.9rem;
          color: gray;
        }
        .logout-button {
          background: #e74c3c;
          color: white;
          padding: 0.5rem 1rem;
          border: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          border-radius: 4px;
        }
        .alert-message {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          position: relative;
        }
        .alert-message.error {
          background: #f8d7da;
          color: #721c24;
        }
        .alert-message.success {
          background: #d4edda;
          color: #155724;
        }
        .close-alert {
          position: absolute;
          right: 10px;
          top: 5px;
          background: none;
          border: none;
          font-size: 1.2rem;
          cursor: pointer;
        }
        .note-form {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-top: 1rem;
        }
        .note-input {
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .action-button {
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          padding: 0.4rem 0.8rem;
          font-size: 0.9rem;
          border: none;
          cursor: pointer;
          border-radius: 4px;
        }
        .action-button.add {
          background-color: #3498db;
          color: white;
        }
        .action-button.update {
          background-color: #f39c12;
          color: white;
        }
        .action-button.cancel {
          background-color: #bdc3c7;
          color: black;
        }
        .action-button.edit {
          background-color: #f1c40f;
        }
        .action-button.delete {
          background-color: #e74c3c;
          color: white;
        }
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid white;
          border-top: 2px solid transparent;
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
          margin-top: 2rem;
        }
        .notes-count {
          font-size: 0.9rem;
          color: gray;
        }
        .notes-list {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .note-item {
          padding: 1rem;
          border: 1px solid #ccc;
          border-radius: 8px;
          background: #f9f9f9;
          position: relative;
        }
        .note-title {
          font-weight: bold;
          font-size: 1.1rem;
          margin-bottom: 0.5rem;
        }
        .note-content {
          margin-bottom: 0.5rem;
        }
        .note-actions {
          display: flex;
          gap: 0.5rem;
        }
        .note-date {
          font-size: 0.8rem;
          color: gray;
          margin-top: 0.3rem;
        }
        .empty-state {
          text-align: center;
          margin-top: 2rem;
          color: gray;
        }
        .empty-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
        .loading {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #333;
        }
      `}</style>

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
        <div style={{ display: 'flex', gap: '0.5rem' }}>
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
