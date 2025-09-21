'use client';
import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { QuestionsAnswersDocument } from '@/redux/slices/scrapSlice';

import { useMachine } from '@xstate/react';
import { crawlerMachine } from '@/machines/crawlerMachine/crawlerMachine';

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
    min-height: 100px !important;
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
  qaPair: QuestionsAnswersDocument | null;
  onUpdate: (updatedPair: QuestionsAnswersDocument) => void;
}

const EditModal: React.FC<EditModalProps> = ({ isOpen, onClose, qaPair, onUpdate }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('General');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [crawlerState, crawlerSend] = useMachine(crawlerMachine);
  const categories = ['General', 'Support', 'Billing', 'Account', 'Technical'];

  // Check if update is in progress
  const isUpdating = false;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update form when qaPair changes
  useEffect(() => {
    if (qaPair) {
      setQuestion(qaPair.metadata.question);
      setAnswer(qaPair.metadata.answer);
      setCategory(qaPair.metadata.category);
    }
  }, [qaPair]);

  // Close modal when update is successful
  useEffect(() => {
    // TODO: Add proper success state checking
  }, [crawlerState, onClose]);

  // Helper function to strip HTML tags and check for meaningful content
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const handleUpdate = () => {
    const questionText = question.trim();
    const answerText = stripHtml(answer).trim();

    if (qaPair && questionText && answerText) {
      const updatedDocument: QuestionsAnswersDocument = {
        ...qaPair,
        title: questionText,
        content: `Q: ${questionText}\nA: ${answerText}`,
        metadata: {
          ...qaPair.metadata,
          question: questionText,
          answer: answerText,
          category,
        },
        updatedAt: new Date().toISOString(),
      };

      // Send update to API with the correct payload format
      crawlerSend({
        type: 'UPDATE_QUESTIONS_ANSWERS_DOCUMENT',
        payload: {
          documentId: (qaPair as any)._id || (qaPair as any).id,
          chatbotId: qaPair.chatbotId,
          question: questionText,
          answer: answerText,
          category: category,
          tags: qaPair.metadata.tags || [],
          metadata: {
            ...qaPair.metadata,
            question: questionText,
            answer: answerText,
            category: category,
          },
        },
      });

      onUpdate(updatedDocument);
      onClose();
    }
  };

  if (!isOpen || !qaPair) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
      <style dangerouslySetInnerHTML={{ __html: quillStyles }} />
      <div className='bg-card rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto'>
        <div className='p-6'>
          <div className='flex items-center justify-between mb-6'>
            <h3 className='text-lg font-medium text-foreground'>Edit Q&A Pair</h3>
            <button onClick={onClose} className='text-muted-foreground hover:text-foreground'>
              <X className='w-5 h-5' />
            </button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
            <div className='md:col-span-2'>
              <label className='block text-sm font-medium text-foreground mb-2'>Question</label>
              <input
                type='text'
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder='Enter the question...'
                className='w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground'
              />
            </div>
            <div className='relative' ref={dropdownRef}>
              <label className='block text-sm font-medium text-foreground mb-2'>Category</label>
              <div
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className='w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background cursor-pointer flex items-center justify-between min-h-[42px]'>
                <span className='text-sm text-foreground'>{category}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              {isDropdownOpen && (
                <div className='absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto'>
                  {categories.map((cat) => (
                    <div
                      key={cat}
                      onClick={() => {
                        setCategory(cat);
                        setIsDropdownOpen(false);
                      }}
                      className={`px-3 py-2 text-sm cursor-pointer hover:bg-accent first:rounded-t-lg last:rounded-b-lg ${
                        category === cat ? 'bg-accent text-accent-foreground' : 'text-popover-foreground'
                      }`}>
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className='mb-6'>
            <label className='block text-sm font-medium text-foreground mb-2'>Answer</label>
            <div className='quill-wrapper border border-input rounded-lg overflow-hidden bg-background focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent'>
              <ReactQuill
                theme='snow'
                value={answer}
                onChange={setAnswer}
                placeholder='Enter the answer...'
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
                  minHeight: '120px',
                }}
              />
            </div>
          </div>

          <div className='flex justify-end space-x-3'>
            <button
              onClick={onClose}
              className='px-4 py-2 border border-border rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground'>
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={!question.trim() || !stripHtml(answer).trim() || isUpdating}
              className='px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed'>
              {isUpdating ? 'Updating...' : 'Update Q&A Pair'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
