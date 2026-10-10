import React from 'react';
import { Calendar, Clock, Edit3, Trash2 } from 'lucide-react';

const NoteCard = ({ note, onEdit, onDelete }) => {
  // Format dates gracefully
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const isUpdated =
    note.updatedAt &&
    note.createdAt &&
    new Date(note.updatedAt).getTime() - new Date(note.createdAt).getTime() > 1000;

  return (
    <article className="note-card" id={`note-card-${note._id}`}>
      <div className="note-card-header">
        <h3 className="note-card-title">{note.title}</h3>
        <div className="note-card-actions">
          <button
            type="button"
            className="action-btn edit-btn"
            id={`edit-note-${note._id}`}
            onClick={() => onEdit(note)}
            title="Edit note"
            aria-label={`Edit ${note.title}`}
          >
            <Edit3 size={16} />
            <span>Edit</span>
          </button>
          <button
            type="button"
            className="action-btn delete-btn"
            id={`delete-note-${note._id}`}
            onClick={() => onDelete(note)}
            title="Delete note"
            aria-label={`Delete ${note.title}`}
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>

      <div className="note-card-body">
        <p className="note-card-description">{note.description}</p>
      </div>

      <div className="note-card-footer">
        <div className="note-meta-date" title={`Created: ${formatDate(note.createdAt)}`}>
          <Calendar size={13} />
          <span>Created: {formatDate(note.createdAt)}</span>
        </div>
        {isUpdated && (
          <div className="note-meta-updated" title={`Updated: ${formatDate(note.updatedAt)}`}>
            <Clock size={12} />
            <span>Updated: {formatDate(note.updatedAt)}</span>
          </div>
        )}
      </div>
    </article>
  );
};

export default NoteCard;
