import { useState, useEffect, useRef } from 'react';
import {
  Plus, Copy, Eye, EyeOff, RefreshCw, Trash2, ExternalLink,
  Globe, Lock, Key, Pencil, Shield, CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/db/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const OAUTH_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/oc-oauth`;
const SCOPES = ['openid','profile','email','resources:read','resources:write'];

interface OAuthApp {
  id: number;
  name: string;
  description: string;
  logo_url: string | null;
  client_id: string;
  client_secret: string;
  redirect_uris: string[];
  allowed_scopes: string[];
  grant_types: string[];
  is_active: boolean;
  is_public: boolean;
  website_url: string | null;
  created_at: string;
}

function CopyField({ label, value, secret }: { label: string; value: string; secret?: boolean }) {
  const [show, setShow] = useState(false);
  const copy = () => { navigator.clipboard.writeText(value); toast.success(`${label} copied!`); };
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex items-center gap-2">
        <code className="flex-1 min-w-0 text-xs font-mono bg-muted border border-border rounded px-3 py-2 truncate">
          {secret && !show ? value.replace(/./g, '•').slice(0, 32) : value}
        </code>
        {secret && (
          <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={() => setShow(v => !v)}>
            {show ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          </Button>
        )}
        <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8" onClick={copy}>
          <Copy className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

interface AppFormState {
  name: string;
  description: string;
  website_url: string;
  logo_url: string;
  redirect_uris: string;
  allowed_scopes: string[];
  is_public: boolean;
}

const defaultForm = (): AppFormState => ({
  name: '', description: '', website_url: '', logo_url: '',
  redirect_uris: '', allowed_scopes: ['openid','profile','resources:read'],
  is_public: false,
});

function AppFormDialog({
  open, onOpenChange, onSave, initial,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (data: AppFormState) => Promise<void>;
  initial?: AppFormState;
}) {
  const [form, setForm] = useState<AppFormState>(initial ?? defaultForm());
  const [saving, setSaving] = useState(false);

  useEffect(() => { setForm(initial ?? defaultForm()); }, [open, initial]);

  const toggleScope = (s: string) => setForm(f => ({
    ...f,
    allowed_scopes: f.allowed_scopes.includes(s)
      ? f.allowed_scopes.filter(x => x !== s)
      : [...f.allowed_scopes, s],
  }));

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error('App name is required.'); return; }
    const uris = form.redirect_uris.split('\n').map(s => s.trim()).filter(Boolean);
    if (!uris.length) { toast.error('At least one redirect URI is required.'); return; }
    setSaving(true);
    await onSave({ ...form, redirect_uris: form.redirect_uris });
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-lg max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? 'Edit OAuth App' : 'Register OAuth App'}</DialogTitle>
          <DialogDescription>External apps use this to authenticate users via Open Connect.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-1">
          <div className="space-y-1.5">
            <Label>App Name <span className="text-destructive">*</span></Label>
            <Input placeholder="My AI Assistant" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <Textarea placeholder="What does this app do?" rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Website URL</Label>
              <Input placeholder="https://myapp.com" value={form.website_url} onChange={e => setForm(f => ({ ...f, website_url: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Logo URL</Label>
              <Input placeholder="https://myapp.com/logo.png" value={form.logo_url} onChange={e => setForm(f => ({ ...f, logo_url: e.target.value }))} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Redirect URIs <span className="text-destructive">*</span></Label>
            <Textarea
              placeholder={"https://myapp.com/callback\nhttp://localhost:3000/callback"}
              rows={3}
              value={form.redirect_uris}
              onChange={e => setForm(f => ({ ...f, redirect_uris: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground">One URI per line. Must match exactly during the auth flow.</p>
          </div>
          <div className="space-y-2">
            <Label>Allowed Scopes</Label>
            <div className="flex flex-wrap gap-2">
              {SCOPES.map(s => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleScope(s)}
                  className={`text-xs px-3 py-1 rounded-full border transition-colors ${
                    form.allowed_scopes.includes(s)
                      ? 'bg-primary/10 border-primary/40 text-primary'
                      : 'bg-muted border-border text-muted-foreground'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between py-2 border border-border rounded-lg px-4">
            <div>
              <p className="text-sm font-medium">Public client</p>
              <p className="text-xs text-muted-foreground">No client secret (SPAs, mobile apps, PKCE only)</p>
            </div>
            <Switch checked={form.is_public} onCheckedChange={v => setForm(f => ({ ...f, is_public: v }))} />
          </div>
          <Button className="w-full" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : initial ? 'Save Changes' : 'Register App'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function OAuthAppsPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [apps, setApps] = useState<OAuthApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editApp, setEditApp] = useState<OAuthApp | null>(null);
  const [detailApp, setDetailApp] = useState<OAuthApp | null>(null);

  useEffect(() => { if (!authLoading && !user) navigate('/login'); }, [authLoading, user, navigate]);

  const fetchApps = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('oauth_clients')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false });
    if (error) toast.error('Failed to load apps: ' + error.message);
    else setApps(data ?? []);
    setLoading(false);
  };

  useEffect(() => { if (user) fetchApps(); }, [user]);

  const parseForm = (form: AppFormState) => ({
    name: form.name.trim(),
    description: form.description.trim(),
    logo_url: form.logo_url.trim() || null,
    website_url: form.website_url.trim() || null,
    redirect_uris: form.redirect_uris.split('\n').map(s => s.trim()).filter(Boolean),
    allowed_scopes: form.allowed_scopes,
    is_public: form.is_public,
  });

  const handleCreate = async (form: AppFormState) => {
    const { error } = await supabase.from('oauth_clients').insert(parseForm(form));
    if (error) { toast.error('Failed to create app: ' + error.message); return; }
    toast.success('OAuth app registered!');
    setCreateOpen(false);
    fetchApps();
  };

  const handleEdit = async (form: AppFormState) => {
    if (!editApp) return;
    const { error } = await supabase.from('oauth_clients').update(parseForm(form)).eq('id', editApp.id);
    if (error) { toast.error('Failed to update app: ' + error.message); return; }
    toast.success('App updated!');
    setEditApp(null);
    fetchApps();
  };

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from('oauth_clients').delete().eq('id', id);
    if (error) toast.error('Failed to delete app.');
    else { toast.success('App deleted.'); fetchApps(); }
  };

  const handleToggleActive = async (app: OAuthApp) => {
    const { error } = await supabase.from('oauth_clients').update({ is_active: !app.is_active }).eq('id', app.id);
    if (error) toast.error('Failed to update status.');
    else { toast.success(`App ${app.is_active ? 'disabled' : 'enabled'}.`); fetchApps(); }
  };

  const handleRegenerateSecret = async (app: OAuthApp) => {
    const newSecret = 'ocs_' + crypto.randomUUID().replace(/-/g,'') + crypto.randomUUID().replace(/-/g,'');
    const { error } = await supabase.from('oauth_clients').update({ client_secret: newSecret }).eq('id', app.id);
    if (error) toast.error('Failed to regenerate secret.');
    else { toast.success('Client secret regenerated!'); fetchApps(); if (detailApp?.id === app.id) { setDetailApp({ ...app, client_secret: newSecret }); } }
  };

  if (authLoading || !user) return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 w-full">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 shrink-0">
            <Shield className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">OAuth Apps</h1>
            <p className="text-sm text-muted-foreground">Register apps that connect to Open Connect via OAuth 2.0</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="icon" onClick={fetchApps} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4 mr-2" /> Register App</Button>
        </div>
      </div>

      {/* OAuth server info */}
      <Card className="mb-8 bg-primary/5 border-primary/20">
        <CardContent className="pt-4">
          <div className="flex items-start gap-3">
            <Key className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium mb-1">OAuth 2.0 Authorization Server</p>
              <p className="text-xs text-muted-foreground mb-3">Your authorization endpoint — share this with developers integrating with Open Connect.</p>
              <div className="flex items-center gap-2">
                <code className="text-xs text-primary font-mono truncate flex-1 min-w-0">{OAUTH_BASE}/authorize</code>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={() => { navigator.clipboard.writeText(`${OAUTH_BASE}/authorize`); toast.success('Copied!'); }}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
                <a href={`${OAUTH_BASE}/.well-known/openid-configuration`} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0"><ExternalLink className="h-3.5 w-3.5" /></Button>
                </a>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* App grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2].map(i => <Card key={i} className="h-48 animate-pulse bg-muted" />)}
        </div>
      ) : apps.length === 0 ? (
        <Card className="text-center py-16">
          <CardContent>
            <Shield className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">No OAuth apps yet.</p>
            <Button onClick={() => setCreateOpen(true)}><Plus className="h-4 w-4 mr-2" /> Register your first app</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {apps.map(app => (
            <Card key={app.id} className={`h-full flex flex-col ${!app.is_active ? 'opacity-60' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                    {app.logo_url ? <img src={app.logo_url} alt={app.name} className="w-full h-full object-cover" /> : <Globe className="h-5 w-5 text-muted-foreground" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-sm truncate">{app.name}</CardTitle>
                      <div className="flex gap-1 shrink-0">
                        {app.is_public && <Badge variant="outline" className="text-xs h-4 px-1.5">Public</Badge>}
                        <Badge variant={app.is_active ? 'default' : 'secondary'} className="text-xs h-4 px-1.5">
                          {app.is_active ? 'Active' : 'Disabled'}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="text-xs line-clamp-1 mt-0.5">{app.description || 'No description'}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between pt-0">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3 shrink-0" />
                    <code className="truncate">{app.client_id}</code>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {app.allowed_scopes.map(s => (
                      <span key={s} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setDetailApp(app)}>
                    <Key className="h-3 w-3 mr-1" /> Credentials
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => setEditApp(app)}>
                    <Pencil className="h-3 w-3 mr-1" /> Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => handleToggleActive(app)}>
                    {app.is_active ? 'Disable' : 'Enable'}
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive ml-auto">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="max-w-[calc(100%-2rem)] md:max-w-md">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete "{app.name}"?</AlertDialogTitle>
                        <AlertDialogDescription>All tokens issued to this app will be revoked. This cannot be undone.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(app.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create dialog */}
      <AppFormDialog open={createOpen} onOpenChange={setCreateOpen} onSave={handleCreate} />

      {/* Edit dialog */}
      {editApp && (
        <AppFormDialog
          open={!!editApp}
          onOpenChange={v => !v && setEditApp(null)}
          onSave={handleEdit}
          initial={{
            name: editApp.name, description: editApp.description,
            website_url: editApp.website_url ?? '', logo_url: editApp.logo_url ?? '',
            redirect_uris: editApp.redirect_uris.join('\n'),
            allowed_scopes: editApp.allowed_scopes, is_public: editApp.is_public,
          }}
        />
      )}

      {/* Credentials detail dialog */}
      {detailApp && (
        <Dialog open={!!detailApp} onOpenChange={v => !v && setDetailApp(null)}>
          <DialogContent className="max-w-[calc(100%-2rem)] md:max-w-lg max-h-[90dvh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Credentials — {detailApp.name}</DialogTitle>
              <DialogDescription>Use these to integrate your app with the Open Connect OAuth 2.0 server.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 pt-1">
              <CopyField label="Client ID"     value={detailApp.client_id} />
              {!detailApp.is_public && <CopyField label="Client Secret" value={detailApp.client_secret} secret />}
              <CopyField label="Authorization Endpoint" value={`${OAUTH_BASE}/authorize`} />
              <CopyField label="Token Endpoint"          value={`${OAUTH_BASE}/token`} />
              <CopyField label="UserInfo Endpoint"       value={`${OAUTH_BASE}/userinfo`} />

              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Redirect URIs</Label>
                <div className="space-y-1">
                  {detailApp.redirect_uris.map(uri => (
                    <div key={uri} className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-primary shrink-0" />
                      <code className="text-xs font-mono text-muted-foreground truncate">{uri}</code>
                    </div>
                  ))}
                </div>
              </div>

              {!detailApp.is_public && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="w-full">
                      <RefreshCw className="h-3.5 w-3.5 mr-2" /> Regenerate Client Secret
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-[calc(100%-2rem)] md:max-w-md">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Regenerate secret?</AlertDialogTitle>
                      <AlertDialogDescription>The old secret will stop working immediately. Update all deployments before proceeding.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleRegenerateSecret(detailApp)}>Regenerate</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}

              <div className="pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Quick start (authorization_code + PKCE)</p>
                <code className="block text-xs font-mono bg-muted rounded px-3 py-2 text-muted-foreground whitespace-pre-wrap break-all">{`${OAUTH_BASE}/authorize?
  client_id=${detailApp.client_id}&
  redirect_uri=${detailApp.redirect_uris[0] ?? 'https://yourapp.com/callback'}&
  response_type=code&
  scope=openid profile resources:read&
  state=random_state&
  code_challenge=<S256_hash>&
  code_challenge_method=S256`}</code>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
