'use client';
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { TextContent } from '@/redux/slices/dataSourcesSlice';

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// Custom styles for Quill editor
const quillStyles = `
  .quill-wrapper .ql-toolbar {
    border: none !important;
    border-bottom: 1px solid hsl(var(--border)) !important;
    padding: 8px 12px !important;
    background: transparent !important;
  }
  
  .quill-wrapper .ql-container {
    border: none !important;
    font-family: inherit !important;
  }
  
  .quill-wrapper .ql-editor {
    padding: 12px !important;
    min-height: 150px !important;
    font-family: inherit !important;
    color: hsl(var(--foreground)) !important;
  }
  
  .quill-wrapper .ql-editor.ql-blank::before {
    color: hsl(var(--muted-foreground)) !important;
    font-style: normal !important;
  }
  
  .quill-wrapper .ql-toolbar .ql-stroke {
    stroke: hsl(var(--foreground)) !important;
  }
  
  .quill-wrapper .ql-toolbar .ql-fill {
    fill: hsl(var(--foreground)) !important;
  }
  
  .quill-wrapper .ql-toolbar button:hover {
    background-color: hsl(var(--accent)) !important;
  }
  
  .quill-wrapper .ql-toolbar button.ql-active {
    background-color: hsl(var(--accent)) !important;
  }
  
  .quill-wrapper .ql-picker-label {
    color: hsl(var(--foreground)) !important;
  }
  
  .quill-wrapper .ql-picker-options {
    background-color: hsl(var(--popover)) !important;
    border: 1px solid hsl(var(--border)) !important;
  }
  
  .quill-wrapper .ql-picker-item {
    color: hsl(var(--popover-foreground)) !important;
  }
  
  .quill-wrapper .ql-picker-item:hover {
    background-color: hsl(var(--accent)) !important;
  }
`;

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  textContent: TextContent | null;
  onUpdate: (updatedContent: any) => void;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, textContent, onUpdate }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Helper function to strip HTML tags and check for meaningful content
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  // Update form when textContent changes
  useEffect(() => {
    if (textContent) {
      setTitle(textContent.title);
      setContent(textContent.content);
    }
  }, [textContent]);

  const handleUpdate = () => {
    const contentText = stripHtml(content).trim();
    if (textContent && contentText) {
      const updatedContent = {
        title: title.trim() || textContent.title,
        content: content.trim(),
        id: textContent.id,
      };
      onUpdate(updatedContent);
      onClose();
    }
  };

  if (!isOpen || !textContent) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <style dangerouslySetInnerHTML={{ __html: quillStyles }} />
      <div className='bg-card rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
        <div className='p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-lg font-medium text-foreground'>Edit Text Content</h3>
            <button onClick={onClose} className='text-muted-foreground hover:text-foreground'>
              <X className='w-5 h-5' />
            </button>
          </div>

          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-foreground mb-2'>Title</label>
              <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Enter content title...'
                className='w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground'
              />
            </div>
            <div>
              <div className='flex items-center justify-between mb-2'>
                <label className='block text-sm font-medium text-foreground'>Content</label>
                <div className='text-sm text-muted-foreground'>{stripHtml(content).length} characters</div>
              </div>
              <div className='quill-wrapper border border-input rounded-lg overflow-hidden bg-background focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent'>
                <ReactQuill
                  theme='snow'
                  value={content}
                  onChange={setContent}
                  placeholder='Enter your text content here...'
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline'],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      ['link', 'image'],
                      ['clean'],
                    ],
                  }}
                  style={{
                    minHeight: '150px',
                  }}
                />
              </div>
            </div>
          </div>

          <div className='flex justify-end space-x-3 mt-6'>
            <button
              onClick={onClose}
              className='px-4 py-2 border border-border rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground'>
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={!stripHtml(content).trim()}
              className='px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed'>
              Update Content
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
