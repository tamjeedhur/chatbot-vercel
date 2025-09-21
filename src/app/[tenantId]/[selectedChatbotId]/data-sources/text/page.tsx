'use client';
import React, { useState } from 'react';
import { ArrowLeft, FileText, Plus, X, Edit } from 'lucide-react';
import Link from 'next/link';
import AdminLayout from '@/components/adminlayout/AdminLayout';
import EditModal from './EditModal';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { TextContent } from '@/types/interfaces';
import { useChatBotMachineState } from '@/providers/ChatBotMachineProvider';

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

const TextContentDataSource: React.FC = () => {
  const [state, send] = useChatBotMachineState();
  const [title, setTitle] = useState('');
  const [textContent, setTextContent] = useState('');
  const [savedContent, setSavedContent] = useState<TextContent[]>([
    {
      id: 1,
      title: 'About Our Company',
      content: 'We are a leading technology company focused on innovative solutions...',
      createdAt: '2024-01-15',
      wordCount: 245,
    },
    {
      id: 2,
      title: 'Product Features',
      content: 'Our product offers comprehensive features including advanced analytics...',
      createdAt: '2024-01-14',
      wordCount: 180,
    },
    {
      id: 3,
      title: 'Support Guidelines',
      content: 'When contacting support, please provide detailed information about...',
      createdAt: '2024-01-13',
      wordCount: 320,
    },
  ]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<TextContent | null>(null);

  // Helper function to strip HTML tags and check for meaningful content
  const stripHtml = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const handleSaveContent = () => {
    const contentText = stripHtml(textContent).trim();
    const titleText = title.trim();
    if (contentText && titleText) {
      const newContent: TextContent = {
        id: Date.now(),
        title: titleText,
        content: textContent,
        createdAt: new Date().toISOString().split('T')[0],
        wordCount: contentText.split(/\s+/).length,
      };
      setSavedContent((prev) => [newContent, ...prev]);
      setTitle('');
      setTextContent('');
    }
  };

  const handleEditContent = (content: TextContent) => {
    setEditingContent(content);
    setIsEditModalOpen(true);
  };

  const handleUpdateContent = (updatedContent: TextContent) => {
    setSavedContent((prev) => prev.map((c) => (c.id === updatedContent.id ? updatedContent : c)));
  };

  const handleRemoveContent = (id: number) => {
    setSavedContent((prev) => prev.filter((c) => c.id !== id));
  };

  const totalWords = savedContent.reduce((total, content) => total + content.wordCount, 0);

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
            <FileText className='w-5 h-5 text-purple-600' />
            <h1 className='text-2xl font-bold text-foreground'>Text Content</h1>
          </div>
        </div>

        <div className='bg-card rounded-lg shadow-sm border border-border p-6'>
          {/* Text Content Editor */}
          <div className='mb-6'>
            <div className='mb-4'>
              <label className='block text-sm font-medium text-foreground mb-2'>Title</label>
              <input
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder='Enter content title...'
                className='w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground'
              />
            </div>
            <div className='flex items-center justify-between mb-2'>
              <label className='block text-sm font-medium text-foreground'>Content</label>
              <div className='text-sm text-muted-foreground'>{stripHtml(textContent).length} characters</div>
            </div>
            <div className='quill-wrapper border border-input rounded-lg overflow-hidden bg-background focus-within:ring-2 focus-within:ring-ring focus-within:border-transparent'>
              <ReactQuill
                theme='snow'
                value={textContent}
                onChange={setTextContent}
                placeholder='Enter your text content here. You can add multiple blocks of content...'
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
            <div className='flex justify-end space-x-2 mt-2'>
              <button
                onClick={handleSaveContent}
                disabled={!title.trim() || !stripHtml(textContent).trim()}
                className='px-3 py-1 text-sm bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed'>
                Add Content
              </button>
            </div>
          </div>

          {/* Content Statistics */}
          <div className='grid grid-cols-3 gap-4 mb-6'>
            <div className='bg-muted rounded-lg p-4'>
              <div className='text-2xl font-bold text-foreground'>{savedContent.length}</div>
              <div className='text-sm text-muted-foreground'>Content Blocks</div>
            </div>
            <div className='bg-muted rounded-lg p-4'>
              <div className='text-2xl font-bold text-foreground'>{totalWords}</div>
              <div className='text-sm text-muted-foreground'>Total Words</div>
            </div>
            <div className='bg-muted rounded-lg p-4'>
              <div className='text-2xl font-bold text-foreground'>{Math.round(totalWords / 200)}</div>
              <div className='text-sm text-muted-foreground'>Est. Reading Time (min)</div>
            </div>
          </div>

          {/* Saved Content */}
          {savedContent.length > 0 && (
            <div className='border border-border rounded-lg p-4'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-lg font-medium text-foreground'>Saved Content</h3>
                <Plus className='w-5 h-5 text-muted-foreground' />
              </div>

              <div className='space-y-4'>
                {savedContent.map((content) => (
                  <div key={content.id} className='border border-border rounded-lg p-4 hover:bg-accent'>
                    <div className='flex items-start justify-between'>
                      <div className='flex-1'>
                        <div className='flex items-center space-x-2 mb-2'>
                          <h4 className='text-sm font-medium text-foreground'>{content.title}</h4>
                          <span className='text-xs text-muted-foreground'>{content.wordCount} words</span>
                          <span className='text-xs text-muted-foreground'>{content.createdAt}</span>
                        </div>
                        <div
                          className='text-sm text-muted-foreground line-clamp-2 prose prose-sm max-w-none'
                          dangerouslySetInnerHTML={{
                            __html: stripHtml(content.content).length > 150 ? stripHtml(content.content).substring(0, 150) + '...' : content.content,
                          }}
                        />
                      </div>
                      <div className='flex items-center space-x-2 ml-4'>
                        <button onClick={() => handleEditContent(content)} className='p-1 text-muted-foreground hover:text-primary'>
                          <Edit className='w-4 h-4' />
                        </button>
                        <button onClick={() => handleRemoveContent(content.id)} className='p-1 text-muted-foreground hover:text-red-600'>
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
          <div className='flex justify-end space-x-3 mt-6'>
            <Link
              href={`/${state.context.tenantId}/${state.context.selectedChatbot?._id}/data-sources`}
              className='px-4 py-2 border border-border rounded-lg text-muted-foreground hover:bg-accent transition-colors'>
              Cancel
            </Link>
            <button className='px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors'>
              Save Data Source
            </button>
          </div>
        </div>

        {/* Edit Modal */}
        <EditModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingContent(null);
          }}
          textContent={editingContent}
          onUpdate={handleUpdateContent}
        />
      </div>
    </AdminLayout>
  );
};

export default TextContentDataSource;
