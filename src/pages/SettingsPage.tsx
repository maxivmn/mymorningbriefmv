import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { loadSettings, saveSettings, checkHealth } from '@/services/api';
import { toast } from 'sonner';
import { Settings, Database, Newspaper, LogOut, Save, Activity } from 'lucide-react';
import type { AppSettings } from '@/services/types';

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [settings, setSettings] = useState<AppSettings>(loadSettings());
  const [healthStatus, setHealthStatus] = useState<string | null>(null);

  const handleSave = () => {
    saveSettings(settings);
    toast.success('Settings saved');
  };

  const handleHealthCheck = async () => {
    try {
      const res = await checkHealth();
      setHealthStatus(`${res.status} — DB: ${res.database}`);
      toast.success('API is reachable');
    } catch (e: any) {
      setHealthStatus(`Error: ${e.message}`);
      toast.error('API unreachable');
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your application preferences</p>
      </div>

      {/* Profile */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Settings className="h-4 w-4" /> Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{user?.email}</p>
              <p className="text-xs text-muted-foreground">Signed in</p>
            </div>
            <Badge variant="outline" className="text-[10px] text-gain border-gain/30">Active</Badge>
          </div>
          <Button variant="outline" size="sm" onClick={signOut} className="gap-2">
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </Button>
        </CardContent>
      </Card>

      {/* Backend API */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Database className="h-4 w-4" /> Backend API
          </CardTitle>
          <CardDescription>Configure the connection to your portfolio analytics backend</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-url">API Base URL</Label>
            <Input
              id="api-url"
              placeholder="http://localhost:8000"
              value={settings.apiBaseUrl}
              onChange={e => setSettings(s => ({ ...s, apiBaseUrl: e.target.value }))}
            />
            <p className="text-[11px] text-muted-foreground">The FastAPI backend base URL</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Mock Data Mode</Label>
              <p className="text-[11px] text-muted-foreground">Use sample data instead of live API</p>
            </div>
            <Switch
              checked={settings.useMockData}
              onCheckedChange={v => setSettings(s => ({ ...s, useMockData: v }))}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleHealthCheck} className="gap-2">
              <Activity className="h-3.5 w-3.5" />
              Test Connection
            </Button>
            {healthStatus && (
              <Badge variant="outline" className="text-[10px]">{healthStatus}</Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* News Preferences */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Newspaper className="h-4 w-4" /> News & Digest
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="refresh">Refresh Interval (min)</Label>
              <Input
                id="refresh"
                type="number"
                min={5}
                max={120}
                value={settings.newsRefreshInterval}
                onChange={e => setSettings(s => ({ ...s, newsRefreshInterval: parseInt(e.target.value) || 30 }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="digest-time">Morning Digest Time</Label>
              <Input
                id="digest-time"
                type="time"
                value={settings.morningDigestTime}
                onChange={e => setSettings(s => ({ ...s, morningDigestTime: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="gap-2">
        <Save className="h-4 w-4" />
        Save Settings
      </Button>
    </div>
  );
}
