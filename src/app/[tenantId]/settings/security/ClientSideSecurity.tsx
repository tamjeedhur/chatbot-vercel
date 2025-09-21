"use client";
import React, { useState, useEffect } from "react";
import AdminLayout from "@/components/adminlayout/AdminLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Key, Copy, EyeOff, Eye, Plus} from "lucide-react";
import { useTenantMachineState } from "@/providers/tenantMachineProvider";
import { useSelector as useReduxSelector } from "react-redux";
import { selectTenant } from "@/redux/slices/tenantSlice";
import { selectTenantAPIKeys } from "@/redux/slices/tenantSlice";
import GenerateAPIKeyDialog from "./GenerateAPIKeyDialog";
import { setTenantAPIKeys } from "@/redux/slices/tenantSlice";
import { store } from "@/redux/store";

// Security page component
const page = ({ apiKeysFromServer }: { apiKeysFromServer: any }) => {
  const [state, send] = useTenantMachineState();
 
  const apiKeys = useReduxSelector(selectTenantAPIKeys);
  const tenant = useReduxSelector(selectTenant);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  // Generic handler for all security toggle switches
  const handleSecurityToggle = (path: string, value: boolean) => {
    if (state.context.tenant) {
      send({
        type: "UPDATE_FIELD_AND_SAVE",
        path,
        value,
      });
    }
  };

  const handleCopyAPIKey = (apiKey: string) => {
    navigator.clipboard.writeText(apiKey);
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };
useEffect(() => {
    store.dispatch(setTenantAPIKeys(apiKeysFromServer));
}, [apiKeysFromServer]);


  return (
    <AdminLayout>
      <div className="space-y-6 p-6">
        <div>
          <h1 className="text-3xl font-bold">Security</h1>
          <p className="text-muted-foreground mt-2">
            Manage workspace security and access controls
          </p>
        </div>
        {/* API Keys */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">API Keys</CardTitle>
            <CardDescription>Manage API keys for integrations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {apiKeys?.map((apiKey: any) => {
              const isVisible = visibleKeys.has(apiKey.id);
              return (
                <div
                  className="flex items-center justify-between p-4 border rounded-lg"
                  key={apiKey.id}
                >
                  <div className="flex items-center gap-3">
                    <Key className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{apiKey.name}</p>
                      <p className="text-sm break-words break-all text-muted-foreground">
                        {isVisible 
                          ? apiKey.key || apiKey.keyPrefix || "••••••••••••••••••••••••••••••••"
                          : (apiKey.key || apiKey.keyPrefix)
                            ? `${(apiKey.key || apiKey.keyPrefix).substring(0, 3)}${"•".repeat(29)}` 
                            : "••••••••••••••••••••••••••••••••"
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyAPIKey(apiKey.key || apiKey.keyPrefix || '')}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                    >
                      {isVisible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
              );
            })}

            <GenerateAPIKeyDialog>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Generate New Key
              </Button>
            </GenerateAPIKeyDialog>
          </CardContent>
        </Card>

        {/* Access Control */}
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Access Control</CardTitle>
            <CardDescription>
              Configure workspace security settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Require 2FA for all workspace members
                </p>
              </div>
              <Switch
                checked={tenant?.security?.require2FA}
                onCheckedChange={(checked) => handleSecurityToggle("security.require2FA", checked)}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>IP Whitelist</Label>
                <p className="text-sm text-muted-foreground">
                  Restrict access to specific IP addresses
                </p>
              </div>
              <Switch 
                checked={tenant?.ipWhitelist} 
                onCheckedChange={(checked) => handleSecurityToggle("ipWhitelist", checked)} 
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <Label>Session Timeout</Label>
                <p className="text-sm text-muted-foreground">
                  Automatic logout after inactivity
                </p>
              </div>
              <Switch 
                checked={tenant?.sessionTimeout} 
                onCheckedChange={(checked) => handleSecurityToggle("sessionTimeout", checked)} 
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default page;
