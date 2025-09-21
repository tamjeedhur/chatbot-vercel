'use client'
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";
import { ModelConfig } from "@/types/interfaces";

interface ModelSettingsDropdownProps {
  model: ModelConfig;
  modelIndex: number;
  updateModelConfig: (index: number, field: keyof ModelConfig, value: any) => void;
}

export function ModelSettingsDropdown({
  model,
  modelIndex,
  updateModelConfig,
}: ModelSettingsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-4" side="bottom" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Model</Label>
            <Select 
              value={model.name.toLowerCase().replace(/[^a-z0-9]/g, '-')} 
              onValueChange={(value) => {
                const modelNames = {
                  'gpt-4o-mini': 'GPT-4o Mini',
                  'gpt-4': 'GPT-4',
                  'claude': 'Claude',
                  'gpt-3-5-turbo': 'GPT-3.5 Turbo',
                  'gemini-pro': 'Gemini Pro'
                };
                updateModelConfig(modelIndex, 'name', modelNames[value as keyof typeof modelNames] || value);
              }}
            >
              <SelectTrigger className="h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="gpt-4o-mini">GPT-4o Mini</SelectItem>
                <SelectItem value="gpt-4">GPT-4</SelectItem>
                <SelectItem value="claude">Claude</SelectItem>
                <SelectItem value="gpt-3-5-turbo">GPT-3.5 Turbo</SelectItem>
                <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Temperature: {model.temperature}</Label>
            <Slider 
              value={[model.temperature]} 
              onValueChange={(value) => updateModelConfig(modelIndex, 'temperature', value[0])}
              min={0}
              max={7} 
              step={0.1} 
              className="w-full" 
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Reserved</span>
              <span>Creative</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Max Tokens: {model.maxTokens}</Label>
            <Slider 
              value={[model.maxTokens]} 
              onValueChange={(value) => updateModelConfig(modelIndex, 'maxTokens', value[0])}
              min={100}
              max={4000} 
              step={100} 
              className="w-full" 
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>100</span>
              <span>4000</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Top P: {model.topP}</Label>
            <Slider 
              value={[model.topP]} 
              onValueChange={(value) => updateModelConfig(modelIndex, 'topP', value[0])}
              min={0}
              max={1} 
              step={0.1} 
              className="w-full" 
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>1</span>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}