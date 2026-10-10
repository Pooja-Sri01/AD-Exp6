import React, { useState, useEffect, useRef } from 'react';
import { PlusCircle, CheckCircle2, XCircle, AlertCircle, Sparkles } from 'lucide-react';

const NoteForm = ({ onSaveNote, editingNote, onCancelEdit, isSubmitting }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({ title: '', description: '' });
  const [touched, setTouched] = useState({ title: false, description: false });
  const titleInputRef = useRef(null);

  // Sync form fields when editingNote changes
  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title || '');
      setDescription(editingNote.description || '');
      setErrors({ title: '', description: '' });
      setTouched({ title: false, description: false });
      // Focus the title input when entering edit mode
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
    } else {
      setTitle('');
      setDescription('');
      setErrors({ title: '', description: '' });
      setTouched({ title: false, description: false });
    }
  }, [editingNote]);

  const validate = (currentTitle, currentDesc) => {
    const errs = { title: '', description: '' };
    if (!currentTitle.trim()) {
      errs.title = 'Title is required and cannot be empty.';
    }
    if (!currentDesc.trim()) {
      errs.description = 'Description is required and cannot be empty.';
    }
    return errs;
  };

  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (touched.title) {
      setErrors((prev) => ({
        ...prev,
        title: !val.trim() ? 'Title is required and cannot be empty.' : '',
      }));
    }
  };

  const handleDescriptionChange = (e) => {
    const val = e.target.value;
    setDescription(val);
    if (touched.description) {
      setErrors((prev) => ({
        ...prev,
        description: !val.trim() ? 'Description is required and cannot be empty.' : '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ title: true, description: true });

    const validationErrors = validate(title, description);
    setErrors(validationErrors);

    if (validationErrors.title || validationErrors.description) {
      return;
    }

    onSaveNote({
      title: title.trim(),
      description: description.trim(),
    });
  };

  return (
    <div className={`note-form-card ${editingNote ? 'is-editing' : ''}`} id="note-form-section">
      <div className="form-header">
        <div className="form-title-group">
          <div className="form-badge">
            {editingNote ? <Sparkles size={16} /> : <PlusCircle size={16} />}
          </div>
          <div>
            <h2 className="form-title">
              {editingNote ? 'Edit Note' : 'Create a New Note'}
            </h2>
            <p className="form-subtitle">
              {editingNote
                ? 'Update your note details below and click Save Changes.'
                : 'Jot down your thoughts, tasks, or study reminders.'}
            </p>
          </div>
        </div>

        {editingNote && (
          <button
            type="button"
            className="cancel-edit-btn"
            onClick={onCancelEdit}
            disabled={isSubmitting}
          >
            <XCircle size={15} />
            <span>Cancel Edit</span>
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* Title Field */}
        <div className="form-group">
          <div className="form-label-row">
            <label htmlFor="note-title" className="form-label">
              Note Title <span className="required-star">*</span>
            </label>
            <span className="char-count">{title.length}/120</span>
          </div>
          <input
            ref={titleInputRef}
            id="note-title"
            type="text"
            className={`form-input ${errors.title && touched.title ? 'input-error' : ''}`}
            placeholder="e.g., Database Lab Assignment 6"
            value={title}
            maxLength={120}
            onChange={handleTitleChange}
            onBlur={() => setTouched((prev) => ({ ...prev, title: true }))}
            disabled={isSubmitting}
          />
          {errors.title && touched.title && (
            <div className="error-message">
              <AlertCircle size={14} />
              <span>{errors.title}</span>
            </div>
          )}
        </div>

        {/* Description Field */}
        <div className="form-group">
          <div className="form-label-row">
            <label htmlFor="note-description" className="form-label">
              Description <span className="required-star">*</span>
            </label>
            <span className="char-count">{description.length}/2000</span>
          </div>
          <textarea
            id="note-description"
            className={`form-textarea ${errors.description && touched.description ? 'input-error' : ''}`}
            placeholder="Enter the full note details, key takeaways, links, or instructions..."
            rows={4}
            maxLength={2000}
            value={description}
            onChange={handleDescriptionChange}
            onBlur={() => setTouched((prev) => ({ ...prev, description: true }))}
            disabled={isSubmitting}
          />
          {errors.description && touched.description && (
            <div className="error-message">
              <AlertCircle size={14} />
              <span>{errors.description}</span>
            </div>
          )}
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="submit"
            id="save-note-btn"
            className={`submit-btn ${editingNote ? 'update-btn' : 'create-btn'}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="btn-spinner"></span>
                <span>{editingNote ? 'Updating Note...' : 'Saving to MongoDB...'}</span>
              </>
            ) : editingNote ? (
              <>
                <CheckCircle2 size={16} />
                <span>Save Changes</span>
              </>
            ) : (
              <>
                <PlusCircle size={16} />
                <span>Save Note</span>
              </>
            )}
          </button>

          {!editingNote && (title || description) && (
            <button
              type="button"
              className="reset-btn"
              onClick={() => {
                setTitle('');
                setDescription('');
                setErrors({ title: '', description: '' });
                setTouched({ title: false, description: false });
              }}
              disabled={isSubmitting}
            >
              Clear
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default NoteForm;
