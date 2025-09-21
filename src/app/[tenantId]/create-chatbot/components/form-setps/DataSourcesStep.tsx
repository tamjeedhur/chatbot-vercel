import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Globe, FileText, Database, Zap, BookOpen, Plus, Trash2, Eye, EyeOff, Link, Upload } from 'lucide-react';
import { ChatbotConfig, DataSource } from '../MultiStepForm';

interface DataSourcesStepProps {
  config: ChatbotConfig;
  onInputChange: (field: string, value: any) => void;
}

const dataSourceTypes = [
  { value: 'website', label: 'Website', icon: Globe, description: 'Crawl and index web pages' },
  { value: 'document', label: 'Document', icon: FileText, description: 'Upload PDFs, docs, and text files' },
  { value: 'api', label: 'API', icon: Zap, description: 'Connect to external APIs' },
  { value: 'database', label: 'Database', icon: Database, description: 'Query your databases' },
  { value: 'knowledge-base', label: 'Knowledge Base', icon: BookOpen, description: 'Import existing knowledge bases' },
];

export const DataSourcesStep = ({ config, onInputChange }: DataSourcesStepProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDataSource, setNewDataSource] = useState<Partial<DataSource>>({
    type: 'website',
    name: '',
    url: '',
    apiKey: '',
    description: '',
    enabled: true,
  });
  const [showApiKey, setShowApiKey] = useState<string | null>(null);

  const addDataSource = () => {
    if (!newDataSource.name) return;

    const dataSource: DataSource = {
      id: Date.now().toString(),
      type: newDataSource.type as DataSource['type'],
      name: newDataSource.name,
      url: newDataSource.url,
      apiKey: newDataSource.apiKey,
      description: newDataSource.description,
      enabled: newDataSource.enabled || true,
    };

    const updatedDataSources = [...((config as any).dataSources || []), dataSource];
    onInputChange('dataSources', updatedDataSources);

    setNewDataSource({
      type: 'website',
      name: '',
      url: '',
      apiKey: '',
      description: '',
      enabled: true,
    });
    setShowAddForm(false);
  };

  const removeDataSource = (id: string) => {
    const updatedDataSources = (config as any).dataSources?.filter((ds: any) => ds.id !== id) || [];
    onInputChange('dataSources', updatedDataSources);
  };

  const toggleDataSource = (id: string) => {
    const updatedDataSources = (config as any).dataSources?.map((ds: any) => (ds.id === id ? { ...ds, enabled: !ds.enabled } : ds)) || [];
    onInputChange('dataSources', updatedDataSources);
  };

  const getTypeIcon = (type: DataSource['type']) => {
    const typeConfig = dataSourceTypes.find((t) => t.value === type);
    return typeConfig?.icon || Globe;
  };

  return (
    <div className='space-y-8'>
      {/* Header */}
      <div className='text-center space-y-3'>
        <h2 className='text-3xl font-bold text-foreground'>Data Sources</h2>
        <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
          Connect your chatbot to various data sources to provide accurate and up-to-date information
        </p>
      </div>

      {/* Current Data Sources */}
      <Card className='border-0 shadow-sm bg-background/50 backdrop-blur-sm'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <div>
              <CardTitle className='text-xl'>Connected Sources</CardTitle>
              <CardDescription>Manage your chatbot's data sources</CardDescription>
            </div>
            <Button
              onClick={() => setShowAddForm(true)}
              className='bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white'>
              <Plus className='h-4 w-4 mr-2' />
              Add Source
            </Button>
          </div>
        </CardHeader>
        <CardContent className='space-y-4'>
          {(config as any).dataSources && (config as any).dataSources.length > 0 ? (
            (config as any).dataSources.map((source: any) => {
              const IconComponent = getTypeIcon(source.type);
              return (
                <div key={source.id} className='flex items-center justify-between p-4 rounded-lg border bg-card'>
                  <div className='flex items-center gap-4'>
                    <div className='w-10 h-10 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 flex items-center justify-center'>
                      <IconComponent className='h-5 w-5 text-purple-600' />
                    </div>
                    <div className='space-y-1'>
                      <div className='flex items-center gap-2'>
                        <h4 className='font-medium text-foreground'>{source.name}</h4>
                        <Badge variant={source.enabled ? 'default' : 'secondary'}>{source.type}</Badge>
                      </div>
                      <p className='text-sm text-muted-foreground'>{source.description || source.url}</p>
                    </div>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Switch checked={source.enabled} onCheckedChange={() => toggleDataSource(source.id)} />
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={() => removeDataSource(source.id)}
                      className='text-destructive hover:text-destructive hover:bg-destructive/10'>
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className='text-center py-12 text-muted-foreground'>
              <Database className='h-12 w-12 mx-auto mb-4 opacity-50' />
              <p>No data sources connected yet</p>
              <p className='text-sm'>Add your first data source to get started</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add New Data Source Form */}
      {showAddForm && (
        <Card className='border-0 shadow-lg bg-background/80 backdrop-blur-sm'>
          <CardHeader>
            <CardTitle className='text-xl'>Add Data Source</CardTitle>
            <CardDescription>Configure a new data source for your chatbot</CardDescription>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='space-y-4'>
                <div>
                  <Label>Source Type</Label>
                  <Select
                    value={newDataSource.type}
                    onValueChange={(value) => setNewDataSource({ ...newDataSource, type: value as DataSource['type'] })}>
                    <SelectTrigger className='mt-1'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dataSourceTypes.map((type) => {
                        const IconComponent = type.icon;
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <div className='flex items-center gap-2'>
                              <IconComponent className='h-4 w-4' />
                              <div>
                                <div>{type.label}</div>
                                <div className='text-xs text-muted-foreground'>{type.description}</div>
                              </div>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Name</Label>
                  <Input
                    className='mt-1'
                    placeholder='Enter source name'
                    value={newDataSource.name}
                    onChange={(e) => setNewDataSource({ ...newDataSource, name: e.target.value })}
                  />
                </div>

                {(newDataSource.type === 'website' || newDataSource.type === 'api') && (
                  <div>
                    <Label>URL</Label>
                    <div className='relative mt-1'>
                      <Link className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
                      <Input
                        className='pl-10'
                        placeholder='https://example.com'
                        value={newDataSource.url}
                        onChange={(e) => setNewDataSource({ ...newDataSource, url: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                {newDataSource.type === 'document' && (
                  <div>
                    <Label>Upload Documents</Label>
                    <div className='mt-1 border-2 border-dashed border-border rounded-lg p-6 text-center'>
                      <Upload className='h-8 w-8 mx-auto mb-2 text-muted-foreground' />
                      <p className='text-sm text-muted-foreground'>Drag and drop files here, or click to browse</p>
                      <Button variant='outline' className='mt-2'>
                        Select Files
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className='space-y-4'>
                {(newDataSource.type === 'api' || newDataSource.type === 'database') && (
                  <div>
                    <Label>API Key / Credentials</Label>
                    <div className='relative mt-1'>
                      <Input
                        type={showApiKey === 'new' ? 'text' : 'password'}
                        placeholder='Enter API key or credentials'
                        value={newDataSource.apiKey}
                        onChange={(e) => setNewDataSource({ ...newDataSource, apiKey: e.target.value })}
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-2 top-1/2 transform -translate-y-1/2'
                        onClick={() => setShowApiKey(showApiKey === 'new' ? null : 'new')}>
                        {showApiKey === 'new' ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                      </Button>
                    </div>
                  </div>
                )}

                <div>
                  <Label>Description</Label>
                  <Textarea
                    className='mt-1'
                    placeholder='Describe what this data source contains...'
                    value={newDataSource.description}
                    onChange={(e) => setNewDataSource({ ...newDataSource, description: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className='flex items-center space-x-2'>
                  <Switch checked={newDataSource.enabled} onCheckedChange={(checked) => setNewDataSource({ ...newDataSource, enabled: checked })} />
                  <Label>Enable this data source</Label>
                </div>
              </div>
            </div>

            <div className='flex justify-end gap-3 pt-4 border-t border-border'>
              <Button variant='outline' onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button
                onClick={addDataSource}
                disabled={!newDataSource.name}
                className='bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white'>
                Add Data Source
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
