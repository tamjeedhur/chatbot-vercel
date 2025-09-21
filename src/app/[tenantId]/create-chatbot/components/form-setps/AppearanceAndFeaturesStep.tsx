import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Bot, MessageSquare, Send, Sparkles } from 'lucide-react';
import { ChatbotConfig } from '../MultiStepForm';

interface AppearanceAndFeaturesStepProps {
  config: ChatbotConfig;
  onInputChange: (field: string, value: any) => void;
}

export const AppearanceAndFeaturesStep = ({ config, onInputChange }: AppearanceAndFeaturesStepProps) => {
  return (
    <div className='grid lg:grid-cols-2 gap-12'>
      {/* Left Side - Configuration */}
      <div className='space-y-8'>
        {/* Appearance Settings */}
        <Card className='border-0 shadow-sm bg-background/50 backdrop-blur-sm'>
          <CardHeader className='pb-6'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center'>
                <Palette className='h-6 w-6 text-purple-500' />
              </div>
              <div>
                <CardTitle className='text-xl font-semibold text-foreground'>Appearance</CardTitle>
                <CardDescription className='text-muted-foreground'>Customize the visual appearance</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-6'>
            <div className='grid gap-6'>
              <div className='space-y-3'>
                <Label className='text-sm font-medium text-foreground'>Chat Bubble Alignment</Label>
                <Select value={config.ui.position} onValueChange={(value) => onInputChange('ui.position', value)}>
                  <SelectTrigger className='border-border/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className='border-border/50'>
                    <SelectItem value='bottom-left'>Left</SelectItem>
                    <SelectItem value='bottom-right'>Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-3'>
                <Label htmlFor='autoShowDelay' className='text-sm font-medium text-foreground'>
                  Auto Show Delay (seconds)
                </Label>
                <Input
                  id='autoShowDelay'
                  type='number'
                  value={config.widget.autoShowDelay}
                  onChange={(e) => onInputChange('widget.autoShowDelay', parseInt(e.target.value))}
                  className='border-border/50 focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200'
                  min='0'
                  max='60'
                />
              </div>

              <div className='grid grid-cols-2 gap-4'>
                <div className='space-y-3'>
                  <Label htmlFor='primaryColor' className='text-sm font-medium text-foreground'>
                    Primary Color
                  </Label>
                  <div className='flex gap-2 items-center'>
                    <input
                      type='color'
                      id='primaryColor'
                      value={config.ui.primaryColor}
                      onChange={(e) => onInputChange('ui.primaryColor', e.target.value)}
                      className='w-12 h-12 rounded-lg border-2 border-border/50 cursor-pointer'
                    />
                    <Input
                      value={config.ui.primaryColor}
                      onChange={(e) => onInputChange('ui.primaryColor', e.target.value)}
                      className='border-border/50 focus:border-purple-500/50 text-sm'
                    />
                  </div>
                </div>

                <div className='space-y-3'>
                  <Label htmlFor='userMessageColor' className='text-sm font-medium text-foreground'>
                    User Message Text Color
                  </Label>
                  <div className='flex gap-2 items-center'>
                    <input
                      type='color'
                      id='userMessageColor'
                      value={config.ui.userMessageColor}
                      onChange={(e) => onInputChange('ui.userMessageColor', e.target.value)}
                      className='w-12 h-12 rounded-lg border-2 border-border/50 cursor-pointer'
                    />
                    <Input
                      value={config.ui.userMessageColor}
                      onChange={(e) => onInputChange('ui.userMessageColor', e.target.value)}
                      className='border-border/50 focus:border-purple-500/50 text-sm'
                    />
                  </div>
                </div>

                <div className='space-y-3'>
                  <Label htmlFor='botColor' className='text-sm font-medium text-foreground'>
                    Bot Color
                  </Label>
                  <div className='flex gap-2 items-center'>
                    <input
                      type='color'
                      id='botColor'
                      value={config.ui.botColor}
                      onChange={(e) => onInputChange('ui.botColor', e.target.value)}
                      className='w-12 h-12 rounded-lg border-2 border-border/50 cursor-pointer'
                    />
                    <Input
                      value={config.ui.botColor}
                      onChange={(e) => onInputChange('ui.botColor', e.target.value)}
                      className='border-border/50 focus:border-purple-500/50 text-sm'
                    />
                  </div>
                </div>

                <div className='space-y-3'>
                  <Label htmlFor='botMessageColor' className='text-sm font-medium text-foreground'>
                    Bot Message Text Color
                  </Label>
                  <div className='flex gap-2 items-center'>
                    <input
                      type='color'
                      id='botMessageColor'
                      value={config.ui.botMessageColor}
                      onChange={(e) => onInputChange('ui.botMessageColor', e.target.value)}
                      className='w-12 h-12 rounded-lg border-2 border-border/50 cursor-pointer'
                    />
                    <Input
                      value={config.ui.botMessageColor}
                      onChange={(e) => onInputChange('ui.botMessageColor', e.target.value)}
                      className='border-border/50 focus:border-purple-500/50 text-sm'
                    />
                  </div>
                </div>

                
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className='border-0 shadow-sm bg-background/50 backdrop-blur-sm'>
          <CardHeader className='pb-6'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center'>
                <Sparkles className='h-6 w-6 text-blue-500' />
              </div>
              <div>
                <CardTitle className='text-xl font-semibold text-foreground'>Features</CardTitle>
                <CardDescription className='text-muted-foreground'>Configure advanced capabilities</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='space-y-4'>
              <div className='flex items-center justify-between p-4 bg-muted/30 border border-border/30 rounded-xl hover:bg-muted/50 transition-all duration-200'>
                <div className='space-y-1'>
                  <Label className='text-sm font-medium text-foreground'>AI Chat</Label>
                  <p className='text-xs text-muted-foreground'>Enable AI-powered responses</p>
                </div>
                <Switch checked={config.settings.aiChat} onCheckedChange={(checked) => onInputChange('settings.aiChat', checked)} />
              </div>

              <div className='flex items-center justify-between p-4 bg-muted/30 border border-border/30 rounded-xl hover:bg-muted/50 transition-all duration-200'>
                <div className='space-y-1'>
                  <Label className='text-sm font-medium text-foreground'>Collect Feedback</Label>
                  <p className='text-xs text-muted-foreground'>Allow users to rate conversations</p>
                </div>
                <Switch checked={config.settings.collectFeedback} onCheckedChange={(checked) => onInputChange('settings.collectFeedback', checked)} />
              </div>

              <div className='flex items-center justify-between p-4 bg-muted/30 border border-border/30 rounded-xl hover:bg-muted/50 transition-all duration-200'>
                <div className='space-y-1'>
                  <Label className='text-sm font-medium text-foreground'>Regenerate Messages</Label>
                  <p className='text-xs text-muted-foreground'>Allow users to regenerate responses</p>
                </div>
                <Switch checked={config.settings.allowRegenerate} onCheckedChange={(checked) => onInputChange('settings.allowRegenerate', checked)} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Side - Live Preview */}
      <div className='space-y-6'>
        <Card className='border-0 shadow-sm bg-background/50 backdrop-blur-sm'>
          <CardHeader className='pb-4'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center'>
                <MessageSquare className='h-6 w-6 text-green-500' />
              </div>
              <div>
                <CardTitle className='text-xl font-semibold text-foreground'>Live Preview</CardTitle>
                <CardDescription className='text-muted-foreground'>See your chatbot in action</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className='bg-gradient-to-br from-muted/20 to-muted/40 rounded-2xl p-6 space-y-4 min-h-[500px] border border-border/30'>
              {/* Chatbot Header */}
              <div className='flex items-center gap-3 p-4 bg-background/80 backdrop-blur-sm border border-border/30 rounded-xl shadow-sm'>
                <div className='w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center'>
                  <Bot className='h-5 w-5 text-white' />
                </div>
                <div>
                  <div className='font-medium text-foreground'>{config.ui.displayName}</div>
                  <div className='text-xs text-muted-foreground flex items-center gap-1'>
                    <div className='w-2 h-2 bg-green-500 rounded-full' />
                    Online
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className='space-y-4'>
                {/* Bot Initial Message */}
                <div
                  className={`flex ${
                    config.ui.position === 'right'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}>
                  <div className='max-w-[85%] p-4 rounded-2xl  text-sm shadow-sm' style={{ backgroundColor: config.ui.botColor, color: config.ui.botMessageColor }}>
                    {config.ui.welcomeMessage}
                  </div>
                </div>

                {/* Sample User Message */}
                <div className='flex justify-end'>
                  <div className='max-w-[85%] p-4 rounded-2xl  text-sm shadow-sm' style={{ backgroundColor: config.ui.primaryColor, color: config.ui.userMessageColor }}>
                    Hello! I need help with something.
                  </div>
                </div>

                {/* Sample Bot Response */}
                <div
                  className={`flex ${
                    config.ui.position === 'right'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}>
                  <div className='max-w-[85%] p-4 rounded-2xl text-sm shadow-sm' style={{ backgroundColor: config.ui.botColor, color: config.ui.botMessageColor }}>
                    I'd be happy to help! What can I assist you with today?
                  </div>
                </div>
              </div>

              {/* Suggested Messages */}
              {config.ui.suggestedMessages.length > 0 && (
                <div className='space-y-3'>
                  <div className='text-xs text-muted-foreground px-1'>Suggested messages:</div>
                  <div className='flex flex-wrap gap-2'>
                    {config.ui.suggestedMessages.slice(0, 3).map((message, index) => (
                      <button
                        key={index}
                        className='px-3 py-2 bg-background/80 backdrop-blur-sm border border-border/30 rounded-full text-xs text-foreground hover:bg-background transition-all duration-200 shadow-sm'>
                        {message}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Message Input */}
              <div className='flex gap-3 p-4 bg-background/80 backdrop-blur-sm border border-border/30 rounded-xl shadow-sm'>
                <input
                  type='text'
                  placeholder={config.ui.messagePlaceholder}
                  className='flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none'
                  disabled
                />
                <button className='p-2 text-muted-foreground hover:text-foreground transition-colors'>
                  <Send className='h-4 w-4' />
                </button>
              </div>

              {/* Feature Indicators */}
              <div className='flex flex-wrap gap-2 pt-2'>
                {config.settings.aiChat && <span className='px-2 py-1 bg-blue-500/20 text-blue-600 text-xs rounded-full'>AI Powered</span>}
                {config.settings.collectFeedback && (
                  <span className='px-2 py-1 bg-green-500/20 text-green-600 text-xs rounded-full'>Feedback Enabled</span>
                )}
                {config.settings.allowRegenerate && <span className='px-2 py-1 bg-purple-500/20 text-purple-600 text-xs rounded-full'>Regenerate</span>}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
