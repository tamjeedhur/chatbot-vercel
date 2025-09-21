'use client';
import React, { useState } from 'react';
import { ArrowLeft, Upload, FileText, X, Download } from 'lucide-react';
import Link from 'next/link';
import AdminLayout from '@/components/adminlayout/AdminLayout';
import { useChatBotMachineState } from '@/providers/ChatBotMachineProvider';
import { useMachine } from '@xstate/react';
import uploadProgressMachine from '@/machines/uploadProgressMachine';


const FileUploadDataSource: React.FC = () => {
  const [state, send] = useChatBotMachineState();
  const accessToken = state.context.accessToken;
  const [uploadState, uploadSend] =useMachine(uploadProgressMachine, { input: { accessToken } })
  const [uploadedFiles, setUploadedFiles] = useState([
    { name: 'user-manual.pdf', size: '2.4 MB', type: 'PDF', status: 'processed' },
    { name: 'product-guide.docx', size: '1.8 MB', type: 'Word Document', status: 'processing' },
    { name: 'faq-data.txt', size: '456 KB', type: 'Text File', status: 'uploaded' },
  ]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFiles = (files: File[]) => {
    files.forEach((file) => {
      // Upload file using the progress machine
      uploadSend({
        type: 'START',
        file: file,
      });

      const newFile = {
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(1) + ' MB',
        type: file.type.includes('pdf')
          ? 'PDF'
          : file.type.includes('word')
          ? 'Word Document'
          : file.type.includes('text')
          ? 'Text File'
          : 'Document',
        status: 'uploaded',
      };
      setUploadedFiles((prev) => [...prev, newFile]);
    });
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'uploaded':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <AdminLayout>
      <div className='p-4'>
        {/* Header */}
        <div className='flex items-center mb-6'>
          <Link href={`/${state.context.tenantId}/${state.context.selectedChatbot?._id}/data-sources`} className='mr-4'>
            <ArrowLeft className='w-5 h-5 text-muted-foreground hover:text-foreground' />
          </Link>
          <div className='flex items-center space-x-2'>
            <Upload className='w-5 h-5 text-green-600' />
            <h1 className='text-2xl font-bold text-foreground'>File Upload</h1>
          </div>
        </div>

        <div className='bg-card rounded-lg shadow-sm border border-border p-6'>
          {/* File Upload Area */}
          <div className='mb-6'>
            <label className='block text-sm font-medium text-foreground mb-2'>Upload Files</label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-primary bg-accent' : 'border-border hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}>
              <div className='flex flex-col items-center'>
                <Upload className='w-12 h-12 text-muted-foreground mb-4' />
                <p className='text-lg font-medium text-foreground mb-2'>Drop files here or click to browse</p>
                <p className='text-sm text-muted-foreground mb-4'>Supports PDF, Word documents, text files, and more</p>
                <input type='file' multiple onChange={(e) => handleFiles(Array.from(e.target.files || []))} className='hidden' id='file-upload' />
                <label
                  htmlFor='file-upload'
                  className='px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors cursor-pointer'>
                  Select Files
                </label>
              </div>
            </div>
          </div>

          {/* Uploaded Files */}
          {uploadedFiles.length > 0 && (
            <div className='border border-border rounded-lg p-4'>
              <h3 className='text-lg font-medium text-foreground mb-4'>Uploaded Files</h3>

              <div className='space-y-2'>
                <div className='grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground uppercase tracking-wider pb-2 border-b border-border'>
                  <div className='col-span-1'></div>
                  <div className='col-span-4'>File Name</div>
                  <div className='col-span-2'>Size</div>
                  <div className='col-span-2'>Type</div>
                  <div className='col-span-2'>Status</div>
                  <div className='col-span-1'></div>
                </div>

                {uploadedFiles.map((file, index) => (
                  <div key={index} className='grid grid-cols-12 gap-4 items-center py-3 border-b border-border hover:bg-accent'>
                    <div className='col-span-1'>
                      <FileText className='w-4 h-4 text-muted-foreground' />
                    </div>
                    <div className='col-span-4'>
                      <div className='text-sm font-medium text-foreground'>{file.name}</div>
                    </div>
                    <div className='col-span-2'>
                      <div className='text-sm text-muted-foreground'>{file.size}</div>
                    </div>
                    <div className='col-span-2'>
                      <div className='text-sm text-muted-foreground'>{file.type}</div>
                    </div>
                    <div className='col-span-2'>
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(file.status)}`}>{file.status}</span>
                    </div>
                    <div className='col-span-1'>
                      <button onClick={() => removeFile(index)} className='p-1 text-muted-foreground hover:text-red-600'>
                        <X className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Processing Options */}
          <div className='mt-6 p-4 bg-muted rounded-lg'>
            <h4 className='text-sm font-medium text-foreground mb-2'>Processing Options</h4>
            <div className='space-y-2'>
              <label className='flex items-center'>
                <input type='checkbox' className='mr-2' defaultChecked />
                <span className='text-sm text-foreground'>Extract text from images (OCR)</span>
              </label>
              <label className='flex items-center'>
                <input type='checkbox' className='mr-2' defaultChecked />
                <span className='text-sm text-foreground'>Split large documents into chunks</span>
              </label>
              <label className='flex items-center'>
                <input type='checkbox' className='mr-2' />
                <span className='text-sm text-foreground'>Remove headers and footers</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className='flex justify-end space-x-3 mt-6'>
            <Link
              href={`/${state.context.tenantId}/${state.context.selectedChatbot?._id}/data-sources`}
              className='px-4 py-2 border border-border rounded-lg text-muted-foreground hover:bg-accent transition-colors'>
              Cancel
            </Link>
            <button 
             
              className='px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>
              Process Files
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default FileUploadDataSource;
