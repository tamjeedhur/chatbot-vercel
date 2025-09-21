import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ChatbotConfig, DataSource } from './MultiStepForm';
import { Database, Globe, FileText, Code, Brain, Settings, Plus, Trash2, Edit, Upload, MessageSquare, X } from 'lucide-react';

interface DataSourceManagerProps {
  config: ChatbotConfig;
  selectedDataSource: string | null;
}

const dataSourceIcons = {
  website: Globe,
  document: FileText,
  api: Code,
  database: Database,
  'knowledge-base': Brain,
};

interface NewDataSource {
  type: 'website' | 'document' | 'api' | 'database' | 'knowledge-base';
  name: string;
  url?: string;
  description?: string;
  content?: string;
  questions?: Array<{ question: string; answer: string }>;
  files?: File[];
}

export function DataSourceManager({ config, selectedDataSource }: DataSourceManagerProps) {
  const [editingSource, setEditingSource] = useState<DataSource | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDataSource, setNewDataSource] = useState<NewDataSource>({
    type: 'website',
    name: '',
    description: '',
  });
  const [newQuestion, setNewQuestion] = useState({ question: '', answer: '' });

  const resetForm = () => {
    setNewDataSource({
      type: 'website',
      name: '',
      description: '',
    });
    setNewQuestion({ question: '', answer: '' });
  };

  const handleAddDataSource = () => {
    // Here you would typically save to your backend or state management
    console.log('Adding data source:', newDataSource);
    setShowAddForm(false);
    resetForm();
  };

  const addQuestion = () => {
    if (newQuestion.question.trim() && newQuestion.answer.trim()) {
      setNewDataSource((prev) => ({
        ...prev,
        questions: [...(prev.questions || []), { ...newQuestion }],
      }));
      setNewQuestion({ question: '', answer: '' });
    }
  };

  const removeQuestion = (index: number) => {
    setNewDataSource((prev) => ({
      ...prev,
      questions: prev.questions?.filter((_, i) => i !== index) || [],
    }));
  };

  const renderAddForm = () => {
    switch (newDataSource.type) {
      case 'website':
        return (
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label>Sitemap URL or Website URL</Label>
              <Input
                value={newDataSource.url || ''}
                onChange={(e) => setNewDataSource((prev) => ({ ...prev, url: e.target.value }))}
                placeholder='https://example.com/sitemap.xml or https://example.com'
              />
              <p className='text-sm text-muted-foreground'>
                Enter a sitemap URL to crawl all pages, or a website URL to crawl that specific page and its links.
              </p>
            </div>
            <div className='space-y-2'>
              <Label>Description (Optional)</Label>
              <Textarea
                value={newDataSource.description || ''}
                onChange={(e) => setNewDataSource((prev) => ({ ...prev, description: e.target.value }))}
                placeholder='Describe what this data source contains...'
                rows={3}
              />
            </div>
          </div>
        );

      case 'document':
        return (
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label>Upload Files</Label>
              <div className='border-2 border-dashed border-border rounded-lg p-6 text-center'>
                <Upload className='h-8 w-8 mx-auto mb-2 text-muted-foreground' />
                <p className='text-sm text-muted-foreground mb-2'>Drag and drop files here, or click to browse</p>
                <Input
                  type='file'
                  multiple
                  accept='.pdf,.doc,.docx,.txt,.md'
                  className='max-w-xs'
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    setNewDataSource((prev) => ({ ...prev, files }));
                  }}
                />
                <p className='text-xs text-muted-foreground mt-2'>Supported formats: PDF, DOC, DOCX, TXT, MD</p>
              </div>
              {newDataSource.files && newDataSource.files.length > 0 && (
                <div className='space-y-2'>
                  <Label>Selected Files:</Label>
                  {newDataSource.files.map((file, index) => (
                    <div key={index} className='flex items-center justify-between p-2 bg-muted rounded'>
                      <span className='text-sm'>{file.name}</span>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => {
                          setNewDataSource((prev) => ({
                            ...prev,
                            files: prev.files?.filter((_, i) => i !== index),
                          }));
                        }}>
                        <X className='h-4 w-4' />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className='space-y-2'>
              <Label>Description (Optional)</Label>
              <Textarea
                value={newDataSource.description || ''}
                onChange={(e) => setNewDataSource((prev) => ({ ...prev, description: e.target.value }))}
                placeholder='Describe what these documents contain...'
                rows={3}
              />
            </div>
          </div>
        );

      case 'api':
        return (
          <div className='space-y-4'>
            <div className='space-y-2'>
              <Label>Text Content</Label>
              <Textarea
                value={newDataSource.content || ''}
                onChange={(e) => setNewDataSource((prev) => ({ ...prev, content: e.target.value }))}
                placeholder='Paste your text content here...'
                rows={8}
                className='min-h-[200px]'
              />
              <p className='text-sm text-muted-foreground'>Add any text content that you want the chatbot to learn from.</p>
            </div>
            <div className='space-y-2'>
              <Label>Description (Optional)</Label>
              <Textarea
                value={newDataSource.description || ''}
                onChange={(e) => setNewDataSource((prev) => ({ ...prev, description: e.target.value }))}
                placeholder='Describe what this text content is about...'
                rows={3}
              />
            </div>
          </div>
        );

      case 'database':
        return (
          <div className='space-y-4'>
            <div className='space-y-4'>
              <div className='flex gap-3'>
                <Input
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion((prev) => ({ ...prev, question: e.target.value }))}
                  placeholder='Enter a question...'
                  className='flex-1'
                />
                <Input
                  value={newQuestion.answer}
                  onChange={(e) => setNewQuestion((prev) => ({ ...prev, answer: e.target.value }))}
                  placeholder='Enter the answer...'
                  className='flex-1'
                />
                <Button onClick={addQuestion} disabled={!newQuestion.question.trim() || !newQuestion.answer.trim()}>
                  <Plus className='h-4 w-4' />
                </Button>
              </div>

              {newDataSource.questions && newDataSource.questions.length > 0 && (
                <div className='space-y-3'>
                  <Label>Question & Answer Pairs:</Label>
                  {newDataSource.questions.map((qa, index) => (
                    <div key={index} className='p-4 border border-border rounded-lg space-y-2'>
                      <div className='flex items-start justify-between'>
                        <div className='flex-1 space-y-2'>
                          <div>
                            <span className='text-sm font-medium text-muted-foreground'>Q:</span>
                            <p className='text-sm'>{qa.question}</p>
                          </div>
                          <div>
                            <span className='text-sm font-medium text-muted-foreground'>A:</span>
                            <p className='text-sm'>{qa.answer}</p>
                          </div>
                        </div>
                        <Button variant='ghost' size='sm' onClick={() => removeQuestion(index)} className='text-red-500 hover:text-red-700'>
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className='space-y-2'>
              <Label>Description (Optional)</Label>
              <Textarea
                value={newDataSource.description || ''}
                onChange={(e) => setNewDataSource((prev) => ({ ...prev, description: e.target.value }))}
                placeholder='Describe what this Q&A set covers...'
                rows={3}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (selectedDataSource === 'settings') {
    return (
      <div className='space-y-6'>
        <div className='flex items-center gap-3'>
          <Settings className='h-6 w-6 text-muted-foreground' />
          <div>
            <h2 className='text-2xl font-semibold text-foreground'>Chatbot Settings</h2>
            <p className='text-muted-foreground'>Configure your chatbot's behavior and appearance</p>
          </div>
        </div>

        <div className='grid gap-6 md:grid-cols-2'>
          <Card>
            <CardHeader>
              <CardTitle>Basic Configuration</CardTitle>
              <CardDescription>Core chatbot settings</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='space-y-2'>
                <Label>Chatbot Name</Label>
                <Input value={config.name} readOnly />
              </div>
              <div className='space-y-2'>
                <Label>Display Name</Label>
                <Input value={(config as any).displayName || ''} readOnly />
              </div>
              <div className='space-y-2'>
                <Label>Initial Message</Label>
                <Textarea value={(config as any).initialMessages || ''} readOnly />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>Enabled chatbot features</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className='flex items-center justify-between'>
                <Label>AI Chat</Label>
                <Switch checked={(config as any).aiChat || false} disabled />
              </div>
              <div className='flex items-center justify-between'>
                <Label>Collect User Feedback</Label>
                <Switch checked={(config as any).collectUserFeedback || false} disabled />
              </div>
              <div className='flex items-center justify-between'>
                <Label>Regenerate Messages</Label>
                <Switch checked={(config as any).regenerateMessages || false} disabled />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!selectedDataSource) {
    return (
      <div className='space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-2xl font-semibold text-foreground'>Data Sources</h2>
            <p className='text-muted-foreground'>Manage where your chatbot gets information from</p>
          </div>
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button className='flex items-center gap-2'>
                <Plus className='h-4 w-4' />
                Add Data Source
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-2xl max-h-[80vh] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>Add New Data Source</DialogTitle>
                <DialogDescription>Choose a data source type and configure it for your chatbot.</DialogDescription>
              </DialogHeader>

              <div className='space-y-6'>
                <div className='space-y-3'>
                  <Label>Data Source Name</Label>
                  <Input
                    value={newDataSource.name}
                    onChange={(e) => setNewDataSource((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder='Enter a name for this data source...'
                  />
                </div>

                <div className='space-y-3'>
                  <Label>Data Source Type</Label>
                  <Select
                    value={newDataSource.type}
                    onValueChange={(value: any) => {
                      setNewDataSource((prev) => ({
                        ...prev,
                        type: value,
                        url: undefined,
                        content: undefined,
                        questions: undefined,
                        files: undefined,
                      }));
                    }}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='website'>
                        <div className='flex items-center gap-2'>
                          <Globe className='h-4 w-4' />
                          Sitemap / Website URL
                        </div>
                      </SelectItem>
                      <SelectItem value='document'>
                        <div className='flex items-center gap-2'>
                          <FileText className='h-4 w-4' />
                          File Upload
                        </div>
                      </SelectItem>
                      <SelectItem value='api'>
                        <div className='flex items-center gap-2'>
                          <Code className='h-4 w-4' />
                          Text Content
                        </div>
                      </SelectItem>
                      <SelectItem value='database'>
                        <div className='flex items-center gap-2'>
                          <MessageSquare className='h-4 w-4' />
                          Q&A Pairs
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {renderAddForm()}

                <div className='flex justify-end gap-3 pt-4'>
                  <Button
                    variant='outline'
                    onClick={() => {
                      setShowAddForm(false);
                      resetForm();
                    }}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddDataSource} disabled={!newDataSource.name.trim()}>
                    Add Data Source
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {(config as any).dataSources?.length === 0 ? (
          <Card>
            <CardContent className='flex flex-col items-center justify-center py-12'>
              <Database className='h-12 w-12 text-muted-foreground mb-4' />
              <h3 className='text-lg font-medium text-foreground mb-2'>No Data Sources</h3>
              <p className='text-muted-foreground text-center mb-4'>Add data sources to provide your chatbot with information to answer questions.</p>
              <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                <DialogTrigger asChild>
                  <Button>Add Your First Data Source</Button>
                </DialogTrigger>
                <DialogContent className='max-w-2xl'>{/* Same dialog content as above */}</DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            {(config as any).dataSources?.map((source: any) => {
              const Icon = dataSourceIcons[source.type as keyof typeof dataSourceIcons] || Globe;
              return (
                <Card key={source.id} className='hover:shadow-md transition-shadow'>
                  <CardHeader>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <Icon className='h-5 w-5 text-muted-foreground' />
                        <div>
                          <CardTitle className='text-lg'>{source.name}</CardTitle>
                          <div className='flex items-center gap-2 mt-1'>
                            <Badge variant='secondary'>{source.type}</Badge>
                            {source.enabled && <div className='w-2 h-2 rounded-full bg-green-500' />}
                          </div>
                        </div>
                      </div>
                      <div className='flex gap-1'>
                        <Button variant='ghost' size='sm' onClick={() => setEditingSource(source)}>
                          <Edit className='h-4 w-4' />
                        </Button>
                        <Button variant='ghost' size='sm'>
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {source.description && <p className='text-sm text-muted-foreground mb-2'>{source.description}</p>}
                    {source.url && <p className='text-xs text-muted-foreground truncate'>{source.url}</p>}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const selectedSource = (config as any).dataSources?.find((source: any) => source.id === selectedDataSource);

  if (!selectedSource) {
    return (
      <div className='flex items-center justify-center h-64'>
        <p className='text-muted-foreground'>Data source not found</p>
      </div>
    );
  }

  const Icon = dataSourceIcons[selectedSource.type as keyof typeof dataSourceIcons] || Globe;

  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-3'>
        <Icon className='h-6 w-6 text-muted-foreground' />
        <div>
          <h2 className='text-2xl font-semibold text-foreground'>{selectedSource.name}</h2>
          <div className='flex items-center gap-2'>
            <Badge variant='secondary'>{selectedSource.type}</Badge>
            {selectedSource.enabled && (
              <Badge variant='outline' className='text-green-600'>
                Active
              </Badge>
            )}
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Data Source Configuration</CardTitle>
          <CardDescription>Configure how your chatbot accesses this data source</CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-2'>
            <Label>Name</Label>
            <Input value={selectedSource.name} readOnly />
          </div>

          {selectedSource.url && (
            <div className='space-y-2'>
              <Label>URL</Label>
              <Input value={selectedSource.url} readOnly />
            </div>
          )}

          {selectedSource.description && (
            <div className='space-y-2'>
              <Label>Description</Label>
              <Textarea value={selectedSource.description} readOnly />
            </div>
          )}

          <div className='flex items-center justify-between'>
            <Label>Enabled</Label>
            <Switch checked={selectedSource.enabled} disabled />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
