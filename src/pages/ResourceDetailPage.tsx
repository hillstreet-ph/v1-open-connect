import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Bot, Puzzle, Server, MessageSquare, Wrench, Zap,
  Copy, Check, ExternalLink, Tag, Globe, Terminal,
  ChevronDown, Download, BookOpen,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PlatformBadge, PlatformBadgeList } from '@/components/ui/platform-badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import InstallPanel, { buildResourceInstallCommands } from '@/components/ui/install-panel';
import { cn } from '@/lib/utils';
import { getResourceBySlug, getResources } from '@/services/api';
import { downloadSingle, downloadZip } from '@/lib/download';
import type { Resource } from '@/types';

const typeConfig: Record<string, {
  icon: React.ComponentType<{ className?: string }>;
  label: string; color: string; bg: string; path: string;
}> = {
  agent:  { icon: Bot,           label: 'Agent',  color: 'text-violet-400',  bg: 'bg-violet-500/10 border-violet-500/20',   path: '/agents'  },
  plugin: { icon: Puzzle,        label: 'Plugin', color: 'text-blue-400',    bg: 'bg-blue-500/10 border-blue-500/20',        path: '/plugins' },
  mcp:    { icon: Server,        label: 'MCP',    color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20',  path: '/mcp'     },
  prompt: { icon: MessageSquare, label: 'Prompt', color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20',      path: '/prompts' },
  tool:   { icon: Wrench,        label: 'Tool',   color: 'text-teal-400',    bg: 'bg-teal-500/10 border-teal-500/20',        path: '/tools'   },
  skill:  { icon: Zap,           label: 'Skill',  color: 'text-primary',     bg: 'bg-primary/10 border-primary/20',          path: '/skills'  },
};

function CopyBtn({ text, label = 'Copy', fullWidth = false }: { text: string; label?: string; fullWidth?: boolean }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button variant="ghost" size="sm" onClick={handle}
      className={cn('h-8 text-xs border border-border hover:border-primary/40 hover:bg-primary/5 gap-1.5', fullWidth && 'w-full')}>
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied!' : label}
    </Button>
  );
}

export default function ResourceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [resource, setResource]   = useState<Resource | null>(null);
  const [related, setRelated]     = useState<Resource[]>([]);
  const [loading, setLoading]     = useState(true);
  const [dlLoading, setDlLoading] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getResourceBySlug(slug)
      .then(async data => {
        if (!data) { navigate('/search', { replace: true }); return; }
        setResource(data);
        const rel = await getResources({ resource_type: data.resource_type, limit: 6 });
        setRelated(rel.filter(r => r.slug !== data.slug).slice(0, 3));
      })
      .catch(() => navigate('/search', { replace: true }))
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 w-full">
        <Skeleton className="h-5 w-28 bg-muted mb-6" />
        <Skeleton className="h-10 w-3/4 bg-muted mb-3" />
        <Skeleton className="h-4 w-2/3 bg-muted mb-8" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-36 w-full bg-muted rounded-lg" />
            <Skeleton className="h-52 w-full bg-muted rounded-lg" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-28 w-full bg-muted rounded-lg" />
            <Skeleton className="h-44 w-full bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!resource) return null;

  const info    = typeConfig[resource.resource_type] ?? typeConfig.skill;
  const TypeIcon = info.icon;

  const installCmds = buildResourceInstallCommands(
    resource.slug,
    resource.resource_type,
    resource.compatible_platforms
  );

  const handleDownload = async (fmt: 'md' | 'txt' | 'json') => {
    setDlLoading(true);
    try { downloadSingle(resource, fmt); toast.success(`Downloaded as .${fmt}`); }
    catch { toast.error('Download failed'); }
    finally { setDlLoading(false); }
  };
  const handleBundle = async () => {
    setDlLoading(true);
    try {
      await downloadZip([resource], `${resource.slug}-bundle`, 'md');
      toast.success('Bundle ZIP downloaded');
    } catch { toast.error('Bundle download failed'); }
    finally { setDlLoading(false); }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 w-full">
      {/* Back */}
      <Link to={info.path}
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to {info.label}s
      </Link>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-start md:gap-5">
        <div className={cn('flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border shadow-sm', info.bg)}>
          <TypeIcon className={cn('h-7 w-7', info.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={cn('inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold', info.bg, info.color)}>
              {info.label}
            </span>
            {resource.is_featured && (
              <Badge variant="outline" className="text-[11px] text-primary border-primary/30 bg-primary/5">Featured</Badge>
            )}
            {resource.is_free
              ? <Badge variant="outline" className="text-[11px] text-emerald-400 border-emerald-500/30 bg-emerald-500/5">Free</Badge>
              : <Badge variant="outline" className="text-[11px] text-amber-400 border-amber-500/30 bg-amber-500/5">Premium</Badge>
            }
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-1 text-balance">
            {resource.title}
          </h1>
          {resource.author && (
            <p className="text-xs text-muted-foreground">by {resource.author}</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          {resource.prompt_content && (
            <CopyBtn text={resource.prompt_content} label="Copy Prompt" />
          )}
          {resource.source_url && (
            <a href={resource.source_url} target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="sm"
                className="h-8 text-xs border border-border hover:border-primary/40 hover:bg-primary/5 gap-1.5">
                <Globe className="h-3.5 w-3.5" /> Source <ExternalLink className="h-3 w-3 opacity-60" />
              </Button>
            </a>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" disabled={dlLoading} className="gap-1.5 h-8 text-xs">
                <Download className="h-3.5 w-3.5" /> Download
                <ChevronDown className="h-3 w-3 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">Single File</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleDownload('md')}  className="text-xs gap-2">Markdown (.md)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload('txt')} className="text-xs gap-2">Plain Text (.txt)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload('json')} className="text-xs gap-2">JSON (.json)</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">Bundle</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleBundle} className="text-xs gap-2">Bundle ZIP (.zip)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Short description callout */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-8 border-l-2 border-primary/30 pl-4">
        {resource.description}
      </p>

      {/* ── Main grid ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

        {/* Left col: About + Prompt + Install */}
        <div className="md:col-span-2 space-y-5">

          {resource.long_description && (
            <Card className="bg-card border-border">
              <CardHeader className="pb-2 pt-4 px-5">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-primary" /> About
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {resource.long_description}
                </p>
              </CardContent>
            </Card>
          )}

          {resource.prompt_content && (
            <Card className="bg-card border-border">
              <CardHeader className="pb-2 pt-4 px-5">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold flex items-center gap-2">
                    <Terminal className="h-3.5 w-3.5 text-primary" /> Prompt Content
                  </CardTitle>
                  <CopyBtn text={resource.prompt_content} label="Copy" />
                </div>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <pre className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed font-mono bg-secondary/40 rounded-lg p-4 overflow-x-auto max-h-80 overflow-y-auto border border-border/50">
                  {resource.prompt_content}
                </pre>
              </CardContent>
            </Card>
          )}

          {installCmds.length > 0 && (
            <Card className="bg-card border-border">
              <CardHeader className="pb-2 pt-4 px-5">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-primary" /> Install via CLI
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <InstallPanel commands={installCmds} />
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {resource.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              <Tag className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
              {resource.tags.map(tag => (
                <span key={tag}
                  className="text-xs bg-secondary text-secondary-foreground border border-border rounded-full px-2.5 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right col: Platforms + Details + Download shortcuts */}
        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardContent className="p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Compatible Platforms
              </h3>
              <div className="flex flex-wrap gap-2">
                {resource.compatible_platforms.map(p => (
                  <PlatformBadge key={p} platform={p} size="md" />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-5 space-y-3">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Category</p>
                <p className="text-sm text-foreground capitalize">{resource.category.replace(/-/g, ' ')}</p>
              </div>
              {resource.author && (
                <div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Author</p>
                  <p className="text-sm text-foreground">{resource.author}</p>
                </div>
              )}
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Type</p>
                <p className={cn('text-sm font-medium', info.color)}>{info.label}</p>
              </div>
            </CardContent>
          </Card>

          {/* How to Use */}
          <Card className="bg-card border-border">
            <CardContent className="p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">How to Use</h3>
              <ol className="space-y-3">
                {[
                  resource.resource_type === 'mcp'
                    ? 'Add the MCP server config to your MCP host (Claude Desktop, Hermes, etc.)'
                    : resource.resource_type === 'prompt'
                      ? 'Copy the prompt content above'
                      : 'Install via CLI command above or copy content',
                  'Open your AI platform (Open WebUI, SwarmClaw, Hermes, etc.)',
                  resource.resource_type === 'mcp'
                    ? 'Restart your MCP host to load the server'
                    : 'Paste as system prompt, tool config, or skill file',
                  'Start a session and use the resource',
                ].map((step, i) => (
                  <li key={i} className="flex gap-2.5 text-xs text-muted-foreground">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-[10px] mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>

          {/* Quick download buttons */}
          <div className="grid grid-cols-3 gap-1.5">
            {(['md', 'txt', 'json'] as const).map(fmt => (
              <Button key={fmt} variant="ghost" size="sm"
                onClick={() => handleDownload(fmt)} disabled={dlLoading}
                className="h-8 text-[11px] border border-border hover:border-primary/40 hover:bg-primary/5 font-mono">
                .{fmt}
              </Button>
            ))}
          </div>
          <Button variant="outline" size="sm" className="w-full h-8 text-xs gap-1.5"
            onClick={handleBundle} disabled={dlLoading}>
            <Download className="h-3.5 w-3.5" /> Bundle ZIP
          </Button>
        </div>
      </div>

      {/* ── Related ────────────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Related {info.label}s
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {related.map(r => {
              const RelIcon = (typeConfig[r.resource_type] ?? typeConfig.skill).icon;
              const relInfo = typeConfig[r.resource_type] ?? typeConfig.skill;
              return (
                <Link key={r.id} to={`${relInfo.path}/${r.slug}`}
                  className="group block rounded-lg border border-border bg-card p-4 hover:border-primary/40 hover:bg-primary/3 transition-all">
                  <div className="flex items-start gap-3">
                    <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border', relInfo.bg)}>
                      <RelIcon className={cn('h-4 w-4', relInfo.color)} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {r.title}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{r.description}</p>
                    </div>
                  </div>
                  <PlatformBadgeList platforms={r.compatible_platforms} max={3} className="mt-3" />
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
