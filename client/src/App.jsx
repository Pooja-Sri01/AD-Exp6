import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import {
  BookOpen,
  Database,
  RefreshCw,
  Plus,
  AlertTriangle,
  CheckCircle,
  X,
  FileText,
  Search,
  ServerOff,
} from 'lucide-react';
import NoteForm from './components/NoteForm';
import NoteCard from './components/NoteCard';
import SearchBar from './components/SearchBar';

// API Base URL - default to relative /api/notes (supported by Vite proxy) or explicit backend URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/notes';

function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Display toast notification with auto-dismiss
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
  };

  useEffect(() => {
    if (!toast.show) return;
    const timer = setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast]);

  // Fetch all notes from MongoDB API
  const fetchNotes = async () => {
    setLoading(true);
    setServerError(null);
    try {
      const response = await axios.get(API_URL);
      if (response.data && response.data.success) {
        setNotes(response.data.data || []);
      } else {
        setNotes(response.data || []);
      }
    } catch (err) {
      console.error('Error fetching notes from server:', err);
      const errMsg =
        err.response?.data?.message ||
        'Unable to connect to the backend server or MongoDB database. Please ensure the server is running on port 5000.';
      setServerError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Handle Save Note (both Add and Edit)
  const handleSaveNote = async ({ title, description }) => {
    setIsSubmitting(true);
    try {
      if (editingNote) {
        // Edit existing note
        const response = await axios.put(`${API_URL}/${editingNote._id}`, {
          title,
          description,
        });

        const updated = response.data?.data;
        if (updated) {
          setNotes((prevNotes) =>
            prevNotes.map((n) => (n._id === updated._id ? updated : n))
          );
        } else {
          await fetchNotes();
        }

        showToast('Note updated successfully!', 'success');
        setEditingNote(null);
      } else {
        // Create new note
        const response = await axios.post(API_URL, {
          title,
          description,
        });

        const created = response.data?.data;
        if (created) {
          setNotes((prevNotes) => [created, ...prevNotes]);
        } else {
          await fetchNotes();
        }

        showToast('Note added successfully to MongoDB!', 'success');
      }
    } catch (err) {
      console.error('Error saving note:', err);
      const errorMsg =
        err.response?.data?.message ||
        'Failed to save note to MongoDB. Please check your connection and try again.';
      showToast(errorMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Start editing a note
  const handleStartEdit = (note) => {
    setEditingNote(note);
    // Smooth scroll to form
    const formElement = document.getElementById('note-form-section');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setEditingNote(null);
  };

  // Open delete confirmation modal
  const handleRequestDelete = (note) => {
    setNoteToDelete(note);
  };

  // Confirm delete note
  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;
    setIsDeleting(true);

    try {
      await axios.delete(`${API_URL}/${noteToDelete._id}`);

      // Remove from state immediately
      setNotes((prevNotes) => prevNotes.filter((n) => n._id !== noteToDelete._id));

      // If user was currently editing this note, exit edit mode
      if (editingNote?._id === noteToDelete._id) {
        setEditingNote(null);
      }

      showToast(`Note "${noteToDelete.title}" deleted successfully.`, 'success');
      setNoteToDelete(null);
    } catch (err) {
      console.error('Error deleting note:', err);
      const errMsg =
        err.response?.data?.message || 'Failed to delete note. Please try again.';
      showToast(errMsg, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter notes based on search query (case-insensitive search on title and description)
  const filteredNotes = useMemo(() => {
    if (!searchQuery.trim()) return notes;
    const q = searchQuery.toLowerCase().trim();
    return notes.filter(
      (n) =>
        n.title?.toLowerCase().includes(q) ||
        n.description?.toLowerCase().includes(q)
    );
  }, [notes, searchQuery]);

  return (
    <div className="app-layout">
      {/* Toast Notification */}
      {toast.show && (
        <div
          className={`toast-notification ${
            toast.type === 'error' ? 'toast-error' : 'toast-success'
          }`}
          role="alert"
        >
          <div className="toast-content">
            {toast.type === 'error' ? (
              <AlertTriangle className="toast-icon error" size={18} />
            ) : (
              <CheckCircle className="toast-icon success" size={18} />
            )}
            <span className="toast-text">{toast.message}</span>
          </div>
          <button
            type="button"
            className="toast-close"
            onClick={() => setToast({ show: false, message: '', type: 'success' })}
            aria-label="Close notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <header className="app-header">
        <div className="header-container">
          <div className="brand-group">
            <div className="brand-logo">
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="brand-title">My Notes</h1>
              <p className="brand-tagline">MERN Stack • MongoDB Database Lab</p>
            </div>
          </div>

          <div className="header-badges">
            <div className="db-badge" title="Connected to MongoDB notesDB collection">
              <span className="db-indicator"></span>
              <Database size={14} />
              <span>notesDB</span>
            </div>
            <button
              type="button"
              className="refresh-btn"
              onClick={fetchNotes}
              disabled={loading}
              title="Refresh notes from MongoDB"
            >
              <RefreshCw size={14} className={loading ? 'spinning' : ''} />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="main-content">
        {/* Server Connection Error Alert */}
        {serverError && (
          <div className="error-banner">
            <div className="error-banner-content">
              <ServerOff className="error-banner-icon" size={24} />
              <div>
                <h4 className="error-banner-title">Backend Connection Error</h4>
                <p className="error-banner-desc">{serverError}</p>
              </div>
            </div>
            <button
              type="button"
              className="retry-btn"
              onClick={fetchNotes}
              disabled={loading}
            >
              <RefreshCw size={14} className={loading ? 'spinning' : ''} />
              <span>Try Reconnecting</span>
            </button>
          </div>
        )}

        {/* Note Creation / Editing Form */}
        <section className="form-section">
          <NoteForm
            onSaveNote={handleSaveNote}
            editingNote={editingNote}
            onCancelEdit={handleCancelEdit}
            isSubmitting={isSubmitting}
          />
        </section>

        {/* Notes Grid Section */}
        <section className="notes-list-section">
          <div className="section-toolbar">
            <div className="toolbar-title-group">
              <h2 className="section-title">Saved Notes</h2>
              <span className="notes-counter-badge">
                {notes.length} {notes.length === 1 ? 'Note' : 'Notes'}
              </span>
            </div>

            {/* Search Bar */}
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              totalNotes={notes.length}
              filteredCount={filteredNotes.length}
            />
          </div>

          {/* Loading State */}
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p className="loading-text">Fetching your notes from MongoDB...</p>
            </div>
          ) : notes.length === 0 ? (
            /* Empty State: No Notes Saved */
            <div className="empty-state">
              <div className="empty-icon-wrap">
                <FileText size={42} />
              </div>
              <h3 className="empty-title">No Notes Available</h3>
              <p className="empty-desc">
                Your notes collection is empty. Use the form above to add your first note
                and save it permanently to MongoDB!
              </p>
            </div>
          ) : filteredNotes.length === 0 ? (
            /* Empty State: Search Found No Matches */
            <div className="empty-state no-search-match">
              <div className="empty-icon-wrap">
                <Search size={36} />
              </div>
              <h3 className="empty-title">No Matching Notes Found</h3>
              <p className="empty-desc">
                No notes matched your search query <strong>"{searchQuery}"</strong>. Try
                searching with different keywords or clear the filter.
              </p>
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                Clear Search Filter
              </button>
            </div>
          ) : (
            /* Notes Card Grid */
            <div className="notes-grid">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note._id}
                  note={note}
                  onEdit={handleStartEdit}
                  onDelete={handleRequestDelete}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Delete Confirmation Modal */}
      {noteToDelete && (
        <div className="modal-backdrop" onClick={() => !isDeleting && setNoteToDelete(null)}>
          <div
            className="modal-box"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-icon-wrap">
              <AlertTriangle size={28} />
            </div>
            <h3 id="modal-title" className="modal-title">
              Delete This Note?
            </h3>
            <p className="modal-desc">
              Are you sure you want to permanently delete{' '}
              <strong className="delete-target-title">"{noteToDelete.title}"</strong>?
              This note will be permanently removed from MongoDB notesDB.
            </p>
            <div className="modal-actions">
              <button
                type="button"
                className="modal-cancel-btn"
                onClick={() => setNoteToDelete(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                id="confirm-delete-button"
                className="modal-delete-btn"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Note'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Notes-Taking Application • Built with <strong>MongoDB</strong>,{' '}
          <strong>Express.js</strong>, <strong>React.js</strong>, and{' '}
          <strong>Node.js</strong>
        </p>
      </footer>
    </div>
  );
}

export default App;
