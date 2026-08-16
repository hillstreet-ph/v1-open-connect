import { useState, useEffect } from 'react';
import { Copy, Eye, EyeOff, Key, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from '@/components/ui/card';
import {
  Dialog, DialogContent, DialogDescription, DialogHeader,
  DialogTitle, DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { supabase } from '@/db/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface ApiKey {
  id: number;
  name: string;
  key_prefix: string;
  scopes: string[];
  is_active: boolean;
  last_used_at: string | null;
  created_at: string;
}

async function generateApiKey(): Promise<{ raw: string; hash: string; prefix: string }> {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const raw = 'oc_' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  const prefix = raw.slice(0, 12);
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
  const hash = Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  return { raw, hash, prefix };
}

export default function ApiKeysPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createdKey, setCreatedKey] = useState<string | null>(null);
  const [showCreated, setShowCreated] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate('/login');
  }, [authLoading, user, navigate]);

  const fetchKeys = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, name, key_prefix, scopes, is_active, last_used_at, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    if (error) toast.error('Failed to load keys: ' + error.message);
    else setKeys(data ?? []);
    setLoading(false);
  };

  useEffect(() => { if (user) fetchKeys(); }, [user]);

  const handleCreate = async () => {
    if (!newKeyName.trim()) { toast.error('Please enter a name for this key.'); return; }
    if (!user) return;
    setCreating(true);
    const { raw, hash, prefix } = await generateApiKey();
    const { error } = await supabase.from('api_keys').insert({
      user_id: user.id,
      name: newKeyName.trim(),
      key_hash: hash,
      key_prefix: prefix,
      scopes: ['read'],
    });
    setCreating(false);
    if (error) { toast.error('Failed to create key: ' + error.message); return; }
    setCreatedKey(raw);
    setNewKeyName('');
    setCreateOpen(false);
    await fetchKeys();
  };

  const handleRevoke = async (id: number) => {
    const { error } = await supabase.from('api_keys').update({ is_active: false }).eq('id', id);
    if (error) toast.error('Failed to revoke key.');
    else { toast.success('Key revoked.'); fetchKeys(); }
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from('api_keys').delete().eq('id', id);
    if (error) toast.error('Failed to delete key.');
    else { toast.success('Key deleted.'); fetchKeys(); }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (authLoading || !user) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <Key className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">API Keys</h1>
            <p className="text-sm text-muted-foreground">Manage your Open Connect gateway credentials</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="icon" onClick={fetchKeys} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="h-4 w-4 mr-2" /> New Key</Button>
            </DialogTrigger>
            <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-md">
              <DialogHeader>
                <DialogTitle>Create API Key</DialogTitle>
                <DialogDescription>Name this key so you know where it is used.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label>Key name</Label>
                  <Input
                    placeholder="e.g. My ChatGPT Plugin"
                    value={newKeyName}
                    onChange={e => setNewKeyName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleCreate()}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Scope: <code className="text-primary">read</code> — search and retrieve resources.</p>
                <Button className="w-full" onClick={handleCreate} disabled={creating}>
                  {creating ? 'Creating…' : 'Create Key'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Created key reveal dialog */}
      {createdKey && (
        <Card className="mb-6 border-primary/40 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-primary flex items-center gap-2">
              <Key className="h-4 w-4" /> Your new API key — copy it now, it won't be shown again
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <code className="flex-1 min-w-0 truncate text-xs bg-muted rounded px-3 py-2 font-mono">
                {showCreated ? createdKey : createdKey.replace(/./g, '•').slice(0, 40)}
              </code>
              <Button variant="ghost" size="icon" onClick={() => setShowCreated(v => !v)} className="shrink-0">
                {showCreated ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => copyToClipboard(createdKey)} className="shrink-0">
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="mt-2 text-xs text-muted-foreground" onClick={() => setCreatedKey(null)}>
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your Keys</CardTitle>
          <CardDescription>Use the API key as a Bearer token or <code>?apikey=</code> parameter.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="whitespace-nowrap">Name</TableHead>
                  <TableHead className="whitespace-nowrap">Prefix</TableHead>
                  <TableHead className="whitespace-nowrap">Status</TableHead>
                  <TableHead className="whitespace-nowrap">Last Used</TableHead>
                  <TableHead className="whitespace-nowrap">Created</TableHead>
                  <TableHead className="whitespace-nowrap text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">Loading…</TableCell></TableRow>
                ) : keys.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-10 text-muted-foreground">No API keys yet. Create one above.</TableCell></TableRow>
                ) : keys.map(k => (
                  <TableRow key={k.id}>
                    <TableCell className="whitespace-nowrap font-medium">{k.name}</TableCell>
                    <TableCell className="whitespace-nowrap font-mono text-xs text-muted-foreground">{k.key_prefix}…</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge variant={k.is_active ? 'default' : 'secondary'}>
                        {k.is_active ? 'Active' : 'Revoked'}
                      </Badge>
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {k.last_used_at ? new Date(k.last_used_at).toLocaleDateString() : 'Never'}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                      {new Date(k.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-1">
                        {k.is_active && (
                          <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => handleRevoke(k.id)}>
                            Revoke
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive">
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="max-w-[calc(100%-2rem)] md:max-w-md">
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete "{k.name}"?</AlertDialogTitle>
                              <AlertDialogDescription>This action cannot be undone. Any apps using this key will stop working.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(k.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
