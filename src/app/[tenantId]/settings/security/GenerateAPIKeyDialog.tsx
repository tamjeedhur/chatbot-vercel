'use client'
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Key } from "lucide-react";
import { useTenantMachineState } from '@/providers/tenantMachineProvider';

interface GenerateAPIKeyDialogProps {
  children?: React.ReactNode;
}

export default function GenerateAPIKeyDialog({ children }: GenerateAPIKeyDialogProps) {
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [state, send] = useTenantMachineState();

  const handleGenerate = () => {
    send({ 
      type: 'CREATE_API_KEY', 
      name: name,
      permissions: [
        "READ_CHAT_SESSIONS",
        "CREATE_CHAT_SESSIONS",
        "READ_ANALYTICS"
      ] 
    });
    setName("");
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Generate API Key
          </DialogTitle>
          <DialogDescription>
            Create a new API key for integrations
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">API Key Name</Label>
            <Input
              id="name"
              placeholder="e.g., Production Integration"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleGenerate} disabled={!name}>
              Generate Key
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
