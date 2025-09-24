'use client';
import React, { useState, useEffect } from 'react';
import { ArrowLeft, HelpCircle, Plus, X, Edit, Search, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import AdminLayout from '@/components/adminlayout/AdminLayout';
import EditModal from './EditModal';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { useChatBotMachineState } from '@/providers/ChatBotMachineProvider';
import {
  setAllQuestionsAnswersDocuments,
  selectAllQuestionsAnswersDocuments,
  QuestionsAnswersDocument,
  updateQuestionsAnswersDocument,
} from '@/redux/slices/scrapSlice';
import { store } from '@/redux/store';
import { useSelector } from 'react-redux';
import { useMachine } from '@xstate/react';
import { crawlerMachine } from '@/machines/crawlerMachine/crawlerMachine';
// Dynamically import ReactQuill to avoid SSR issues with proper error handling
const ReactQuill = dynamic(() => import('react-quill'), {
  ssr: false,
  loading: () => (
    <div className='flex items-center justify-center h-32 border border-input rounded-lg bg-background'>
      <div className='text-sm text-muted-foreground'>Loading editor...</div>
    </div>
  ),
});

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

const QAPairsDataSource: React.FC<{ questions: QuestionsAnswersDocument[] }> = ({ questions }) => {
  const [state, send] = useChatBotMachineState();
  const [crawlerState, crawlerSend] = useMachine(crawlerMachine);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('General');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingQAPair, setEditingQAPair] = useState<QuestionsAnswersDocument | null>(null);
  const [quillError, setQuillError] = useState(false);
  const categories = ['General', 'Support', 'Billing', 'Account', 'Technical'];

  // Get Q&A documents from Redux store
  const qaDocuments = useSelector(selectAllQuestionsAnswersDocuments);

  // Handle chunk loading errors
  useEffect(() => {
    const handleChunkError = (event: ErrorEvent) => {
      if (event.message && event.message.includes('Loading chunk') && event.message.includes('react-quill')) {
        console.warn('ReactQuill chunk failed to load, falling back to textarea');
        setQuillError(true);
      }
    };

    window.addEventListener('error', handleChunkError);
    return () => window.removeEventListener('error', handleChunkError);
  }, []);

  // Use Redux state for Q&A documents
  useEffect(() => {
    if (questions && questions.length > 0) {
      store.dispatch(setAllQuestionsAnswersDocuments(questions));
    }
  }, [questions]);

  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const handleSaveQAPair = () => {
    const questionText = question.trim();
    const answerText = stripHtml(answer).trim();

    if (questionText && answerText) {
      crawlerSend({
        type: 'ADD_QUESTIONS_ANSWERS_DOCUMENT',
        payload: {
          question: questionText,
          answer: answerText,
          category,
          tags: [],
          chatbotId: state.context.selectedChatbot?._id || '',
        },
      });
      setQuestion('');
      setAnswer('');
      setCategory('General');
    }
  };

  const handleEditQAPair = (qaDocument: QuestionsAnswersDocument) => {
    setEditingQAPair(qaDocument);
    setIsEditModalOpen(true);
  };

  const handleUpdateQAPair = (updatedDocument: QuestionsAnswersDocument) => {};

  const handleRemoveQAPair = (id: string) => {
    // Validate that we have a valid documentId and chatbotId
    if (!id || id === 'undefined' || !state.context.selectedChatbot?._id) {
      console.error('Invalid documentId or chatbotId for delete operation:', { id, chatbotId: state.context.selectedChatbot?._id });
      return;
    }
    crawlerSend({ type: 'DELETE_QUESTIONS_ANSWERS_DOCUMENT', payload: { documentId: id, chatbotId: state.context.selectedChatbot._id } });
  };

  const filteredPairs = (qaDocuments || []).filter(
    (doc) =>
      doc.metadata.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stripHtml(doc.metadata.answer).toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.metadata.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    const colors = {
      General: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      Support: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      Billing: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400',
      Account: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
      Technical: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
    };
    return colors[category as keyof typeof colors] || 'bg-secondary text-secondary-foreground';
  };

  return (
    <AdminLayout>
      <style dangerouslySetInnerHTML={{ __html: quillStyles }} />
      <div className='p-4'>
        {/* Header */}
        <div className='flex items-center mb-6'>
          <Link href={`/${state.context.tenantId}/${state.context.selectedChatbot?._id}/data-sources`} className='mr-4'>
            <ArrowLeft className='w-5 h-5 text-muted-foreground hover:text-foreground' />
          </Link>
          <div className='flex items-center space-x-2'>
            <HelpCircle className='w-5 h-5 text-orange-600' />
            <h1 className='text-2xl font-bold text-foreground'>Q&A Pairs</h1>
          </div>
        </div>

        <div className='bg-card rounded-lg shadow-sm border border-border p-6'>
          {/* Add New Q&A Pair Form */}
          <div className='mb-6 p-4 bg-muted rounded-lg'>
            <h3 className='text-lg font-medium text-foreground mb-4'>Add New Q&A Pair</h3>

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
              <div className='relative'>
                <label className='block text-sm font-medium text-foreground mb-2'>Category</label>
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className='flex items-center justify-between w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-left min-h-[42px]'>
                  <span className='text-sm text-foreground'>{category}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showCategoryDropdown && (
                  <div className='absolute right-0 mt-1 w-full bg-popover rounded-lg shadow-lg border border-border z-10'>
                    <div className='py-1'>
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setCategory(cat);
                            setShowCategoryDropdown(false);
                          }}
                          className={`w-full px-3 py-2 text-sm text-left hover:bg-accent ${
                            category === cat ? 'bg-accent text-accent-foreground' : 'text-popover-foreground'
                          }`}>
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className='mb-4'>
              <label className='block text-sm font-medium text-foreground mb-2'>Answer</label>
              <div className='quill-wrapper border border-input rounded-lg overflow-hidden bg-background focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent'>
                {quillError ? (
                  <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder='Enter the answer...'
                    className='w-full h-32 px-3 py-2 border-none outline-none resize-none bg-transparent text-foreground placeholder:text-muted-foreground'
                    style={{ minHeight: '120px' }}
                  />
                ) : (
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
                )}
              </div>
            </div>

            <div className='flex justify-end'>
              <button
                onClick={handleSaveQAPair}
                disabled={!question.trim() || !stripHtml(answer).trim()}
                className='px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed'>
                Add Q&A Pair
              </button>
            </div>
          </div>

          {/* Statistics */}
          <div className='grid grid-cols-3 gap-4 mb-6'>
            <div className='bg-muted rounded-lg p-4'>
              <div className='text-2xl font-bold text-foreground'>{qaDocuments?.length || 0}</div>
              <div className='text-sm text-muted-foreground'>Total Q&A Pairs</div>
            </div>
            <div className='bg-muted rounded-lg p-4'>
              <div className='text-2xl font-bold text-foreground'>{new Set((qaDocuments || []).map((doc) => doc.metadata.category)).size}</div>
              <div className='text-sm text-muted-foreground'>Categories</div>
            </div>
            <div className='bg-muted rounded-lg p-4'>
              <div className='text-2xl font-bold text-foreground'>
                {Math.round((qaDocuments || []).reduce((acc, doc) => acc + stripHtml(doc.metadata.answer).length, 0) / (qaDocuments?.length || 1)) ||
                  0}
              </div>
              <div className='text-sm text-muted-foreground'>Avg. Answer Length</div>
            </div>
          </div>

          {/* Q&A Pairs List */}
          {(qaDocuments?.length || 0) > 0 && (
            <div className='border border-border rounded-lg p-4'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-medium text-foreground'>Q&A Pairs</h3>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground' />
                  <input
                    type='text'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder='Search Q&A pairs...'
                    className='pl-10 pr-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground'
                  />
                </div>
              </div>

              <div className='space-y-4'>
                {filteredPairs.map((doc) => (
                  <div key={doc.id} className='border border-border rounded-lg p-4 hover:bg-accent'>
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <div className='flex items-center space-x-2 mb-2'>
                          <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(doc.metadata.category)}`}>
                            {doc.metadata.category}
                          </span>
                          <span className='text-xs text-muted-foreground'>{new Date(doc.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h4 className='text-sm font-medium text-foreground mb-2'>{doc.metadata.question}</h4>
                        <div
                          className='text-sm text-muted-foreground prose prose-sm max-w-none'
                          dangerouslySetInnerHTML={{ __html: doc.metadata.answer }}
                        />
                      </div>
                      <div className='flex items-center space-x-2 ml-4'>
                        <button onClick={() => handleEditQAPair(doc)} className='p-1 text-muted-foreground hover:text-primary'>
                          <Edit className='w-4 h-4' />
                        </button>
                        <button
                          onClick={() => handleRemoveQAPair((doc as any)._id || (doc as any).id)}
                          className='p-1 text-muted-foreground hover:text-red-600'>
                          <X className='w-4 h-4' />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {/* <div className='flex justify-end space-x-3 mt-6'>
            <Link
              href={`/${state.context.tenantId}/${state.context.selectedChatbot?._id}/data-sources`}
              className='px-4 py-2 border border-border rounded-lg text-muted-foreground hover:bg-accent transition-colors'>
              Cancel
            </Link>
            <button className='px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'>
              Save Data Source
            </button>
          </div> */}
        </div>

        {/* Edit Modal */}
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingQAPair(null);
          }}
          qaPair={editingQAPair}
          onUpdate={handleUpdateQAPair}
        />
      </div>
    </AdminLayout>
  );
};

export default QAPairsDataSource;
