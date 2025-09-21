import { useState } from 'react';
import { Database, Globe, FileText, Code, Brain, Plus, Settings, Bot } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChatbotConfig, DataSource } from './MultiStepForm';

interface AppSidebarProps {
  config: ChatbotConfig;
  selectedDataSource: string | null;
  onSelectDataSource: (id: string | null) => void;
}

const dataSourceIcons = {
  website: Globe,
  document: FileText,
  api: Code,
  database: Database,
  'knowledge-base': Brain,
};

export function AppSidebar({ config, selectedDataSource, onSelectDataSource }: AppSidebarProps) {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <Sidebar className='w-64 border-r border-border/50'>
      <SidebarHeader className='p-4 border-b border-border/50'>
        <div className='flex items-center gap-3'>
          <div className='w-8 h-8 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center'>
            <Bot className='h-4 w-4 text-white' />
          </div>
          <div>
            <h3 className='font-medium text-foreground'>Dashboard</h3>
            <p className='text-xs text-muted-foreground'>Manage your chatbot</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <div className='flex items-center justify-between px-2 mb-2'>
            <SidebarGroupLabel>Data Sources</SidebarGroupLabel>
            <Button variant='ghost' size='sm' onClick={() => setShowAddForm(!showAddForm)} className='h-6 w-6 p-0'>
              <Plus className='h-3 w-3' />
            </Button>
          </div>

          <SidebarGroupContent>
            <SidebarMenu>
              {(config as any).dataSources?.length === 0 ? (
                <div className='px-2 py-4 text-center text-sm text-muted-foreground'>No data sources configured</div>
              ) : (
                (config as any).dataSources?.map((source: any) => {
                  const Icon = dataSourceIcons[source.type as keyof typeof dataSourceIcons] || Globe;
                  const isSelected = selectedDataSource === source.id;

                  return (
                    <SidebarMenuItem key={source.id}>
                      <SidebarMenuButton
                        onClick={() => onSelectDataSource(source.id)}
                        className={`w-full justify-start ${isSelected ? 'bg-accent text-accent-foreground' : ''}`}>
                        <Icon className='h-4 w-4 mr-3' />
                        <div className='flex-1 min-w-0'>
                          <div className='font-medium text-sm truncate'>{source.name}</div>
                          <div className='flex items-center gap-2 mt-1'>
                            <Badge variant='secondary' className='text-xs px-1.5 py-0.5 h-auto'>
                              {source.type}
                            </Badge>
                            {source.enabled && <div className='w-1.5 h-1.5 rounded-full bg-green-500' />}
                          </div>
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => onSelectDataSource('settings')}>
                  <Settings className='h-4 w-4 mr-3' />
                  Chatbot Settings
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className='p-4 border-t border-border/50'>
        <div className='text-xs text-muted-foreground'>
          <div className='font-medium'>{(config as any).displayName || 'Chatbot'}</div>
          <div>{(config as any).userEmail || 'user@example.com'}</div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
