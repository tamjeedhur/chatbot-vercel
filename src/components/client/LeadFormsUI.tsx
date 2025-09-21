'use client';

import { useState } from 'react';
import { Plus, Trash2, Edit, Trash, MessageSquare, Bot, Send, RefreshCw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { LeadFormConfig, FormField } from '@/types/leadForms';
import { showSuccessToast, showErrorToast } from '@/utils/errorHandling';
import AdminLayout from '../adminlayout/AdminLayout';
import { useChatBotMachineState } from '@/providers/ChatBotMachineProvider';

import { FieldValidationModal } from './FieldValidationModal';
import { getFieldValidationSummary, validateForm, validateField } from '@/utils/leadForms/fieldValidation';

interface LeadFormsUIProps {
  savedLogics: LeadFormConfig[];
  currentConfig: Omit<LeadFormConfig, 'id' | 'createdAt'>;
  editingLogicId: string | null;
  validationError: string | null;
  showCreateForm: boolean;
  triggeredForm: LeadFormConfig | null;
  error: string | null;
  fieldErrors: Record<string, string[]>;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  isCheckingTriggers: boolean;
  isSuccess: boolean;
  isError: boolean;
  onLoadForms: () => void;
  onCreateForm: () => void;
  onUpdateForm: () => void;
  onDeleteForm: (id: string) => void;
  onEditForm: (id: string) => void;
  onConfigChange: (updates: Partial<LeadFormConfig>) => void;
  onCheckTriggers: (message: string) => void;
  onSubmitLeadForm: (formId: string, data: Record<string, any>, metadata?: Record<string, any>) => void;
  onResetForm: () => void;
  onClearError: () => void;
  onShowCreateForm: () => void;
  onCancelEdit: () => void;
}

export function LeadFormsUI(props: LeadFormsUIProps) {
  const [state] = useChatBotMachineState();
  const selectedChatbot = state.context.selectedChatbot;
  
  // Determine theme from selectedChatbot configuration
  const theme = selectedChatbot?.ui?.theme || "light";
  
  const [newKeyword, setNewKeyword] = useState('');
  const [previewMessage, setPreviewMessage] = useState('');
  const [previewMessages, setPreviewMessages] = useState([
    { role: 'bot', content: 'Hello! I\'m here to help you. How can I assist you today?', timestamp: 'Just now' }
  ]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  
  // Validation modal state
  const [validationModalOpen, setValidationModalOpen] = useState(false);
  const [selectedField, setSelectedField] = useState<FormField | null>(null);

  const addKeyword = () => {
    if (newKeyword.trim() && !props.currentConfig.keywords.includes(newKeyword.trim())) {
      props.onConfigChange({
        keywords: [...props.currentConfig.keywords, newKeyword.trim()]
      });
      setNewKeyword('');
    }
  };

  const removeKeyword = (keyword: string) => {
    props.onConfigChange({
      keywords: props.currentConfig.keywords.filter(k => k !== keyword)
    });
  };

  const addField = () => {
    const newField: FormField = {
      id: Date.now().toString(),
      type: 'text',
      label: '',
      placeholder: '',
      required: false
    };
    props.onConfigChange({
      fields: [...props.currentConfig.fields, newField]
    });
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    props.onConfigChange({
      fields: props.currentConfig.fields.map(field => 
        field.id === id ? { ...field, ...updates } : field
      )
    });
  };

  const removeField = (id: string) => {
    props.onConfigChange({
      fields: props.currentConfig.fields.filter(field => field.id !== id)
    });
  };

  // Validation modal handlers
  const openValidationModal = (field: FormField) => {
    setSelectedField(field);
    setValidationModalOpen(true);
  };

  const closeValidationModal = () => {
    setValidationModalOpen(false);
    setSelectedField(null);
  };

  const handleValidationSave = (fieldId: string, validation: FormField['validation'], required: boolean, autoFocus: boolean) => {
    props.onConfigChange({
      fields: props.currentConfig.fields.map(field => 
        field.id === fieldId ? { ...field, validation, required, autoFocus } : field
      )
    });
  };

  // Form data handlers
  const handleFormFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const transformFormDataToLabels = (formData: Record<string, string>, triggeredForm: LeadFormConfig) => {
    const transformedData: Record<string, string> = {};
    
    Object.entries(formData).forEach(([fieldId, value]) => {
      const field = triggeredForm.fields.find(f => f.id === fieldId);
      if (field) {
        transformedData[field.label] = value;
      }
    });
    
    return transformedData;
  };

  const handleFormSubmit = () => {
    if (!props.triggeredForm) return;
    
    // Transform form data to use field labels instead of IDs
    const transformedData = transformFormDataToLabels(formData, props.triggeredForm);
    
    // Validate form data
    const validationErrors = validateForm(props.triggeredForm.fields, transformedData);
    
    if (validationErrors.length > 0) {
      // Show validation errors
      const errorMessages = validationErrors.map(error => 
        `${error.fieldLabel}: ${error.errors.join(', ')}`
      ).join('\n');
      
      showErrorToast(`Form validation failed:\n${errorMessages}`);
      return;
    }
    
    // Send the submit event to XState machine
    props.onSubmitLeadForm(
      props.triggeredForm.id,
      transformedData,
      {
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        source: 'chat_interface'
      }
    );
    
    // Clear form data after sending to machine
    setFormData({});
  };

  // Reset chat messages to initial state
  const resetChat = () => {
    setPreviewMessages([
      { role: 'bot', content: 'Hello! I\'m here to help you. How can I assist you today?', timestamp: 'Just now' }
    ]);
  };

  const handlePreviewSendMessage = () => {
    if (!previewMessage.trim()) return;

    const userMessage = { 
      role: 'user', 
      content: previewMessage, 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Add user message and keep only last 8 messages
    setPreviewMessages(prev => {
      const newMessages = [...prev, userMessage];
      return newMessages.slice(-8); // Keep only last 8 messages
    });

    // Test if this message triggers the form
    props.onCheckTriggers(previewMessage);
    
    // Clear form data when triggering new form
    setFormData({});

    // Add bot response
    setTimeout(() => {
      const botResponse = { 
        role: 'bot', 
        content: props.currentConfig.title 
          ? 'I\'d be happy to help! To get started, could you please fill out this form?'
          : 'Thank you for your message. How can I assist you further?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setPreviewMessages(prev => {
        const newMessages = [...prev, botResponse];
        return newMessages.slice(-8); // Keep only last 8 messages
      });
    }, 1000);

    setPreviewMessage('');
  };

  if (props.isSuccess) {
    showSuccessToast(props.editingLogicId ? 'Form updated successfully' : 'Form created successfully');
  }

  if (props.isError && props.error) {
    showErrorToast(props.error);
  }

  return (
    <AdminLayout>
      <div className="flex h-[calc(100vh-73px)]">
        <div className="w-1/2 p-6 overflow-y-auto border-r border-border">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Lead Form Configuration</h3>
              <p className="text-sm text-muted-foreground">Configure when and how to collect lead information</p>
            </div>

            {props.error && (
              <Alert variant="destructive">
                <AlertDescription>
                  {props.error}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={props.onClearError}
                    className="ml-2"
                  >
                    Dismiss
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {props.validationError && (
              <Alert variant="destructive">
                <AlertDescription>{props.validationError}</AlertDescription>
              </Alert>
            )}

            {props.isLoading && (
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            )}

            {!props.isLoading && props.savedLogics.map((logic) => (
              <Card key={logic.id} className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-green-700 dark:text-green-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      {logic.title}
                    </div>
                    <div className="flex">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => props.onEditForm(logic.id)}
                        className="text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-800"
                        disabled={props.isDeleting}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => props.onDeleteForm(logic.id)}
                        className="text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900"
                        disabled={props.isDeleting}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                  <div className='flex gap-2 items-center'>
                    <Label className="text-sm font-medium text-green-700 dark:text-green-300">When to Collect:</Label>
                    <p className="text-sm text-green-600 dark:text-green-400 capitalize">
                      {logic.collectCondition === 'keywords' ? 'When certain keywords are used' :
                       logic.collectCondition === 'always' ? 'Ask for information all at once' :
                       'After a time delay'}
                    </p>
                  </div>
                  
                  {logic.collectCondition === 'keywords' && logic.keywords.length > 0 && (
                    <div className='flex gap-2 items-center'>
                      <Label className="text-sm font-medium text-green-700 dark:text-green-300">Keywords:</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {logic.keywords.map((keyword) => (
                          <span key={keyword} className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 px-2 py-1 rounded text-xs">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className='flex gap-2 items-center'>
                    <Label className="text-sm font-medium text-green-700 dark:text-green-300">What to Collect:</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {logic.fields.map((field) => (
                        <span key={field.id} className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 px-2 py-1 rounded text-xs">
                          {field.label} ({field.type})
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className='flex gap-2 items-center'>
                    <Label className="text-sm font-medium text-green-700 dark:text-green-300">How Fields are Shown:</Label>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {logic.fieldsDisplay === 'all-at-once' ? 'Ask for information all at once' : 'Ask for information one by one'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}

            {props.savedLogics.length > 0 && !props.showCreateForm && (
              <div className="text-center">
                <Button 
                  onClick={props.onShowCreateForm}
                  className="bg-blue-500 hover:bg-blue-600 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-black"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Logic
                </Button>
              </div>
            )}

            {(props.savedLogics.length === 0 || props.showCreateForm) && (
              <div className="space-y-4">
                {props.editingLogicId && (
                  <Alert>
                    <AlertDescription>
                      Editing Logic: {props.currentConfig.title}
                    </AlertDescription>
                  </Alert>
                )}
                
                <Card>
                  <CardHeader>
                    <CardTitle>When to Collect Info</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="form-name" className="text-base font-semibold">
                        Form Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="form-name"
                        placeholder="Enter form name (e.g., Contact Form, Lead Capture)"
                        value={props.currentConfig.title}
                        onChange={(e) => props.onConfigChange({ title: e.target.value })}
                        className="w-full text-base"
                        required
                      />
                      {!props.currentConfig.title?.trim() && (
                        <p className="text-sm text-red-500">Form name is required</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="form-description">Form Description (Optional)</Label>
                      <Input
                        id="form-description"
                        placeholder="Describe when this form will be shown (e.g., When users ask for help)"
                        value={props.currentConfig.description}
                        onChange={(e) => props.onConfigChange({ description: e.target.value })}
                        className="w-full"
                      />
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

                    <div className="space-y-2">
                      <Label className="text-base font-semibold">When to Show This Form</Label>
                      <Select 
                        value={props.currentConfig.collectCondition} 
                        onValueChange={(value: any) => props.onConfigChange({ collectCondition: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="keywords">When certain keywords are used</SelectItem>
                          <SelectItem 
                            value="always"
                            disabled={props.savedLogics.some(logic => logic.collectCondition === 'always' && logic.id !== props.editingLogicId)}
                          >
                            Ask for information all at once
                          </SelectItem>
                          <SelectItem value="after_time">After a time delay</SelectItem>
                        </SelectContent>
                      </Select>

                      {props.currentConfig.collectCondition === 'keywords' && (
                        <div className="space-y-3">
                          <Label>Keywords</Label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="Add keyword"
                              value={newKeyword}
                              onChange={(e) => setNewKeyword(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                            />
                            <Button onClick={addKeyword} size="sm">
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {props.currentConfig.keywords.map((keyword) => (
                              <div key={keyword} className="flex items-center gap-1 bg-secondary px-2 py-1 rounded text-sm">
                                {keyword}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-4 w-4 p-0"
                                  onClick={() => removeKeyword(keyword)}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>What to Collect</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {props.currentConfig.fields.map((field) => (
                      <div key={field.id} className="space-y-2 p-4 border rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Label>Field {props.currentConfig.fields.indexOf(field) + 1}</Label>
                            {field.validation && (
                              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs rounded-full">
                                Validation Rules
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openValidationModal(field)}
                              className={`${field.validation ? 'text-blue-600' : 'text-gray-500'} hover:text-blue-800`}
                              title="Field validation settings"
                            >
                              <Settings className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeField(field.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <Input
                          placeholder="Field label"
                          value={field.label}
                          onChange={(e) => updateField(field.id, { label: e.target.value })}
                        />
                        <Select 
                          value={field.type} 
                          onValueChange={(value: any) => updateField(field.id, { type: value })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="select">Select</SelectItem>
                            <SelectItem value="textarea">Text Area</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="Placeholder text"
                          value={field.placeholder}
                          onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                        />
                        
                        {/* Validation Summary */}
                        {(field.required || field.validation) && (
                          <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-xs">
                            <div className="font-medium text-gray-700 dark:text-gray-300 mb-1">Validation Rules:</div>
                            <div className="flex flex-wrap gap-1">
                              {getFieldValidationSummary(field).map((rule, index) => (
                                <span 
                                  key={index} 
                                  className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded"
                                >
                                  {rule}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    <Button onClick={addField} variant="outline" className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Field
                    </Button>
                  </CardContent>
                </Card>

                <div className="flex gap-2">
                  <Button 
                    onClick={props.onCreateForm}
                    disabled={props.isCreating}
                    className="flex-1"
                  >
                    {props.isCreating ? 'Creating...' : 'Create Form'}
                  </Button>
                  {props.editingLogicId && (
                    <Button 
                      onClick={props.onUpdateForm}
                      disabled={props.isUpdating}
                      variant="outline"
                      className="flex-1"
                    >
                      {props.isUpdating ? 'Updating...' : 'Update Form'}
                    </Button>
                  )}
                  <Button 
                    onClick={props.onCancelEdit}
                    variant="ghost"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-1/2 p-6 overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Chat Preview</h3>
              <p className="text-sm text-muted-foreground">Preview how your form will appear in chat</p>
            </div>
            
            <Card className="h-[600px] flex flex-col border-0 shadow-sm bg-background/50 backdrop-blur-sm overflow-hidden">
              <div className="bg-gradient-to-br from-muted/20 to-muted/40 rounded-2xl border border-border/30 h-full flex flex-col">
                {/* Chatbot Header */}
                <div 
                  className="flex items-center justify-between p-4 border-b-0 rounded-t-2xl shadow-sm relative"
                  style={{ backgroundColor: selectedChatbot?.ui?.primaryColor || "#3B82F6" }}
                >
                  {/* Background overlay for glassmorphism effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent pointer-events-none rounded-t-2xl" />
                  
                  <div className="flex items-center gap-3 z-10">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center overflow-hidden border-2 border-white/20"
                      style={{ backgroundColor: selectedChatbot?.ui?.primaryColor || "#3B82F6" }}
                    >
                      {selectedChatbot?.ui?.logoUrl ? (
                        <img
                          src={selectedChatbot.ui.logoUrl}
                          alt="Bot logo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                          <path d="m2 17 10 5 10-5"></path>
                          <path d="m2 12 10 5 10-5"></path>
                        </svg>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-base">
                        {selectedChatbot?.ui?.displayName || "AI Assistant"}
                      </div>
                      <div className="text-xs text-white/90 flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        Online
                      </div>
                    </div>
                  </div>
                                      <button 
                      onClick={resetChat}
                      className="p-1.5 hover:bg-white/10 rounded-full transition-colors z-10"
                      title="Reset chat"
                    >
                      <RefreshCw className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Customer Info Panel */}
                <div className="bg-gray-50/80 dark:bg-[#020817] px-4 py-3 border-b border-border/30 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span className="text-sm font-medium text-gray-700">Test User</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12,6 12,12 16,14"></polyline>
                    </svg>
                    <span>Just now</span>
                  </div>
                </div>

                              
                  <div className="flex-1 p-4 overflow-y-auto bg-white" style={{ maxHeight: '350px', minHeight: '350px' }}>
                    <div className="space-y-4">
                    {previewMessages.map((message, index) => (
                      <div key={index} className={`flex items-start gap-2 ${message.role === 'user' ? 'justify-end' : ''}`}>
                        {message.role === 'bot' && (
                          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: selectedChatbot?.ui?.primaryColor || "#3B82F6" }}>
                            {selectedChatbot?.ui?.logoUrl ? (
                              <img
                                src={selectedChatbot.ui.logoUrl}
                                alt="Bot avatar"
                                className="w-full h-full object-cover rounded-full"
                              />
                            ) : (
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                                <path d="m2 17 10 5 10-5"></path>
                                <path d="m2 12 10 5 10-5"></path>
                              </svg>
                            )}
                          </div>
                        )}
                        <div className={`flex flex-col max-w-[80%] ${message.role === 'user' ? 'items-end' : ''}`}>
                          <div 
                            className={`p-3 rounded-2xl ${
                              message.role === 'user' 
                                ? 'rounded-br-sm text-white' 
                                : 'rounded-bl-sm'
                            }`}
                            style={message.role === 'bot' ? { 
                              backgroundColor: selectedChatbot?.ui?.botColor || selectedChatbot?.ui?.primaryColor || "#3B82F6",
                              color: '#FFFFFF',
                              border: theme === 'dark' ? '1px solid #4B5563' : '1px solid #E5E7EB'
                            } : {
                              backgroundColor: selectedChatbot?.ui?.primaryColor || "#3B82F6"
                            }}
                          >
                            <span className="text-sm">{message.content}</span>
                          </div>
                          <span className="text-xs text-gray-500 mt-1">{message.timestamp}</span>
                        </div>
                      </div>
                    ))}

                    {/* Show all available lead forms */}
                    {props.savedLogics.length > 0 && (
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: selectedChatbot?.ui?.primaryColor || "#3B82F6" }}>
                          {selectedChatbot?.ui?.logoUrl ? (
                            <img
                              src={selectedChatbot.ui.logoUrl}
                              alt="Bot avatar"
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                              <path d="m2 17 10 5 10-5"></path>
                              <path d="m2 12 10 5 10-5"></path>
                            </svg>
                          )}
                        </div>
                        <div className="flex flex-col max-w-[80%]">
                          <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm p-4 shadow-sm">
                            <div className="space-y-3">
                              <div className="border-b border-gray-200 pb-2">
                                <h4 className="font-semibold text-sm text-gray-900">
                                  Available Lead Forms
                                </h4>
                                <p className="text-xs text-gray-600 mt-1">
                                  These forms can be triggered in your chat
                                </p>
                              </div>
                              
                              <div className="space-y-2">
                                {props.savedLogics.map((form, index) => (
                                  <div 
                                    key={form.id} 
                                    className="border border-gray-100 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                                    onClick={() => props.onCheckTriggers(form.id)}
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <h5 className="font-medium text-sm text-gray-900">{form.title}</h5>
                                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                        {form.collectCondition === 'keywords' ? `${form.keywords.length} keywords` : form.collectCondition}
                                      </span>
                                    </div>
                                    {form.description && (
                                      <p className="text-xs text-gray-600 mb-2">{form.description}</p>
                                    )}
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                      <span>{form.fields.length} fields</span>
                                      <span>•</span>
                                      <span>{form.fieldsDisplay}</span>
                                      {form.collectCondition === 'keywords' && form.keywords.length > 0 && (
                                        <>
                                          <span>•</span>
                                          <span>Triggers: {form.keywords.slice(0, 3).join(', ')}{form.keywords.length > 3 ? '...' : ''}</span>
                                        </>
                                      )}
                                    </div>
                                    <div className="mt-2 pt-2 border-t border-gray-200">
                                      <button 
                                        className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          props.onCheckTriggers(form.id);
                                        }}
                                      >
                                        🎯 Test Trigger
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Show form preview if triggered */}
                    {props.triggeredForm && (
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: selectedChatbot?.ui?.primaryColor || "#3B82F6" }}>
                          {selectedChatbot?.ui?.logoUrl ? (
                            <img
                              src={selectedChatbot.ui.logoUrl}
                              alt="Bot avatar"
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                              <path d="m2 17 10 5 10-5"></path>
                              <path d="m2 12 10 5 10-5"></path>
                            </svg>
                          )}
                        </div>
                        <div className="flex flex-col max-w-[80%]">
                          <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm p-4 shadow-sm">
                            <div className="space-y-4">
                              <div className="border-b border-gray-200 pb-3">
                                <h4 className="font-semibold text-sm text-gray-900">
                                  {props.triggeredForm.title}
                                </h4>
                                {props.triggeredForm.description && (
                                  <p className="text-xs text-gray-600 mt-1">
                                    {props.triggeredForm.description}
                                  </p>
                                )}
                              </div>

                              {/* Form Fields Preview */}
                              {props.triggeredForm.fieldsDisplay === 'all-at-once' ? (
                                // Show all fields at once
                                <div className="space-y-3">
                                  {props.triggeredForm.fields?.map((field) => (
                                    <div key={field.id} className="space-y-1">
                                      <Label className="text-xs font-medium text-gray-700">
                                        {field.label} {field.required && <span className="text-red-500">*</span>}
                                      </Label>
                                      {field.type === 'select' ? (
                                        <Select onValueChange={(value) => handleFormFieldChange(field.id, value)}>
                                          <SelectTrigger className="h-8 text-xs bg-white border-gray-300">
                                            <SelectValue placeholder={field.placeholder} />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {field.options?.map((option) => (
                                              <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      ) : field.type === 'textarea' ? (
                                        <textarea
                                          className="w-full h-16 px-3 py-2 text-xs border border-gray-300 rounded-md resize-none bg-white text-gray-900 placeholder:text-gray-500"
                                          placeholder={field.placeholder}
                                          value={formData[field.id] || ''}
                                          onChange={(e) => handleFormFieldChange(field.id, e.target.value)}
                                        />
                                      ) : (
                                        <Input
                                          type={field.type}
                                          placeholder={field.placeholder}
                                          className="h-8 text-xs bg-white border-gray-300"
                                          value={formData[field.id] || ''}
                                          onChange={(e) => handleFormFieldChange(field.id, e.target.value)}
                                        />
                                      )}
                                      
                                      {/* Field Error Display */}
                                      {props.fieldErrors[field.id] && props.fieldErrors[field.id].length > 0 && (
                                        <div className="mt-1">
                                          {props.fieldErrors[field.id].map((error: string, index: number) => (
                                            <p key={index} className="text-xs text-red-500">
                                              {error}
                                            </p>
                                          ))}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                  <Button 
                                    size="sm" 
                                    className="w-full text-xs mt-4" 
                                    style={{ backgroundColor: selectedChatbot?.ui?.primaryColor || "#3B82F6" }}
                                    onClick={handleFormSubmit}
                                  >
                                    Submit Form
                                  </Button>
                                </div>
                              ) : (
                                // Show one field at a time
                                props.triggeredForm.fields?.length > 0 && (
                                  <div className="space-y-3">
                                    <div className="space-y-1">
                                      <Label className="text-xs font-medium text-gray-700">
                                        {props.triggeredForm.fields[0].label} 
                                        {props.triggeredForm.fields[0].required && <span className="text-red-500">*</span>}
                                      </Label>
                                      {props.triggeredForm.fields[0].type === 'select' ? (
                                        <Select>
                                          <SelectTrigger className="h-8 text-xs bg-white border-gray-300">
                                            <SelectValue placeholder={props.triggeredForm.fields[0].placeholder} />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {props.triggeredForm.fields[0].options?.map((option) => (
                                              <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                              </SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                      ) : props.triggeredForm.fields[0].type === 'textarea' ? (
                                        <textarea
                                          className="w-full h-16 px-3 py-2 text-xs border border-gray-300 rounded-md resize-none bg-white text-gray-900 placeholder:text-gray-500"
                                          placeholder={props.triggeredForm.fields[0].placeholder}
                                        />
                                      ) : (
                                        <Input
                                          type={props.triggeredForm.fields[0].type}
                                          placeholder={props.triggeredForm.fields[0].placeholder}
                                          className="h-8 text-xs bg-white border-gray-300"
                                        />
                                      )}
                                    </div>
                                    <div className="flex gap-2">
                                      <Button size="sm" className="flex-1 text-xs" style={{ backgroundColor: selectedChatbot?.ui?.primaryColor || "#3B82F6" }}>
                                        Next
                                      </Button>
                                      <Button variant="outline" size="sm" className="text-xs">
                                        Skip
                                      </Button>
                                    </div>
                                    {props.triggeredForm.fields.length > 1 && (
                                      <p className="text-xs text-gray-500 text-center mt-2">
                                        Step 1 of {props.triggeredForm.fields.length}
                                      </p>
                                    )}
                                  </div>
                                )
                              )}

                              {/* Show empty state if no fields */}
                              {(!props.triggeredForm.fields || props.triggeredForm.fields.length === 0) && (
                                <div className="text-center py-6">
                                  <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
                                    <MessageSquare className="h-6 w-6 text-gray-400" />
                                  </div>
                                  <p className="text-xs text-gray-500">Add fields to see the form preview</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Show placeholder if no form configured */}
                    {!props.currentConfig.title && (
                      <div className="flex items-start gap-2">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: selectedChatbot?.ui?.primaryColor || "#3B82F6" }}>
                          {selectedChatbot?.ui?.logoUrl ? (
                            <img
                              src={selectedChatbot.ui.logoUrl}
                              alt="Bot avatar"
                              className="w-full h-full object-cover rounded-full"
                            />
                          ) : (
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                              <path d="m2 17 10 5 10-5"></path>
                              <path d="m2 12 10 5 10-5"></path>
                            </svg>
                          )}
                        </div>
                        <div className="flex flex-col max-w-[80%]">
                          <div className="p-3 rounded-2xl rounded-bl-sm bg-gray-100 text-gray-600 border border-gray-200">
                            <span className="text-sm">Configure your form to see how it will appear in chat</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Bar */}
                <div className="border-t border-gray-200 px-4 py-3 bg-white">
                  <div className="flex items-center justify-between mb-3">
                    {selectedChatbot?.routing?.escalationEnabled && (
                      <button className="text-blue-600 text-xs font-medium flex items-center gap-1 hover:text-blue-700 transition-colors">
                        🎧 Talk to Human Agent
                      </button>
                    )}
                    <button className="text-gray-500 hover:text-gray-700 transition-colors ml-auto">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7,10 12,15 17,10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    </button>
                  </div>

                  {/* Input Section */}
                  <div className="flex items-end gap-2">
                    <button className="text-gray-500 hover:text-gray-700 transition-colors p-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66L9.64 16.2a2 2 0 0 1-2.83-2.83l8.49-8.49"></path>
                      </svg>
                    </button>
                    <div className="flex-1 border border-gray-200 rounded-lg bg-white">
                      <input
                        type="text"
                        placeholder={selectedChatbot?.ui?.messagePlaceholder || "Type your message..."}
                        value={previewMessage}
                        onChange={(e) => setPreviewMessage(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handlePreviewSendMessage();
                          }
                        }}
                        className="w-full px-3 py-2 bg-transparent text-sm text-gray-900 placeholder:text-gray-500 outline-none rounded-lg"
                      />
                    </div>
                    <button
                      onClick={handlePreviewSendMessage}
                      disabled={!previewMessage.trim()}
                      className="p-2 rounded-lg transition-colors disabled:opacity-50"
                      style={{ backgroundColor: selectedChatbot?.ui?.primaryColor || "#3B82F6" }}
                    >
                      <Send className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Bottom Section - Feature Indicators */}
                <div className="px-4 pb-4 bg-white space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {selectedChatbot?.settings?.aiChat && (
                      <span className="px-2 py-1 bg-blue-500/20 text-blue-600 text-xs rounded-full border border-blue-500/30">✨ AI Powered</span>
                    )}
                    {selectedChatbot?.settings?.collectFeedback && (
                      <span className="px-2 py-1 bg-green-500/20 text-green-600 text-xs rounded-full border border-green-500/30">
                        Feedback Enabled
                      </span>
                    )}
                    {selectedChatbot?.settings?.allowRegenerate && (
                      <span className="px-2 py-1 bg-purple-500/20 text-purple-600 text-xs rounded-full border border-purple-500/30">
                        Regenerate
                      </span>
                    )}
                    {props.currentConfig.title && (
                      <span className="px-2 py-1 bg-orange-500/20 text-orange-600 text-xs rounded-full border border-orange-500/30">
                        Lead Form
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Card>


          </div>
        </div>
      </div>

      {/* Field Validation Modal */}
      <FieldValidationModal
        isOpen={validationModalOpen}
        onClose={closeValidationModal}
        field={selectedField}
        onSave={handleValidationSave}
      />
    </AdminLayout>
  );
}

export default LeadFormsUI;
