import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Check, Copy, Zap, Tag, Download,
  BookOpen, Terminal, ChevronDown,
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
import InstallPanel, { buildSkillInstallCommands } from '@/components/ui/install-panel';
import { downloadSingle, downloadZip } from '@/lib/download';
import { getSkillBySlug, getSkills } from '@/services/api';
import SkillCard from '@/components/cards/SkillCard';
import type { Skill } from '@/types';

const categoryLabels: Record<string, string> = {
  'content-marketing':  'Content & Marketing',
  'email-communication':'Email & Communication',
  'research-analysis':  'Research & Analysis',
  'business-operations':'Business Operations',
  'productivity':       'Productivity',
  'documents-data':     'Documents & Data',
  'web-design':         'Web & Design',
  'sales-support':      'Sales & Support',
  'free-tools':         'Free Tools',
};

const buildPrompt = (skill: Skill): string =>
  `# ${skill.title}\n\n## Role\nYou are a specialized AI assistant for "${skill.title}".\n\n## Task\n${skill.description}\n\n## Use Case\n${skill.use_case ?? 'General productivity and efficiency.'}\n\n## Instructions\n1. Read the user's input carefully.\n2. Apply the skill instructions above.\n3. Produce a clear, structured output.\n4. Ask clarifying questions if needed.\n\n## Compatible Platforms\n${skill.compatible_platforms.join(', ')}\n\n---\n*Skill from Open Connect — openconnect.ai*`;

function CopyButton({ text, label = 'Copy', fullWidth = false }: { text: string; label?: string; fullWidth?: boolean }) {
  const [copied, setCopied] = useState(false);
  const handle = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button
      onClick={handle}
      variant="ghost"
      size="sm"
      className={`h-8 text-xs border border-border hover:border-primary/40 hover:bg-primary/5 gap-1.5 ${fullWidth ? 'w-full' : ''}`}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? 'Copied!' : label}
    </Button>
  );
}

export default function SkillDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [skill, setSkill] = useState<Skill | null>(null);
  const [related, setRelated] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [dlLoading, setDlLoading] = useState(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getSkillBySlug(slug).then(async s => {
      setSkill(s);
      if (s) {
        const rel = await getSkills({ category: s.category_slug, limit: 4 });
        setRelated(rel.filter(r => r.slug !== slug).slice(0, 3));
      }
    }).finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 w-full">
        <Skeleton className="h-6 w-28 bg-muted mb-6" />
        <Skeleton className="h-10 w-3/4 bg-muted mb-3" />
        <Skeleton className="h-4 w-full bg-muted mb-2" />
        <Skeleton className="h-4 w-5/6 bg-muted mb-8" />
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-48 w-full bg-muted rounded-lg" />
            <Skeleton className="h-32 w-full bg-muted rounded-lg" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-28 w-full bg-muted rounded-lg" />
            <Skeleton className="h-44 w-full bg-muted rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!skill) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-20 text-center">
        <p className="text-muted-foreground mb-4">Skill not found.</p>
        <Link to="/skills"><Button variant="ghost" size="sm">← Back to Skills</Button></Link>
      </div>
    );
  }

  const promptText = skill.prompt_content ?? buildPrompt(skill);
  const asDownloadable = {
    id: skill.id, slug: skill.slug, title: skill.title,
    description: skill.description, category: skill.category_slug,
    tags: skill.tags, author: undefined,
    prompt_content: skill.prompt_content,
    resource_type: 'skill' as const,
    compatible_platforms: skill.compatible_platforms,
  };
  const installCmds = buildSkillInstallCommands(skill.slug, skill.compatible_platforms);
  const catLabel = categoryLabels[skill.category_slug] ?? skill.category_slug;

  const handleDownload = async (fmt: 'md' | 'txt' | 'json') => {
    setDlLoading(true);
    try { downloadSingle(asDownloadable, fmt); toast.success(`Downloaded as .${fmt}`); }
    catch { toast.error('Download failed'); }
    finally { setDlLoading(false); }
  };
  const handleBundle = async () => {
    setDlLoading(true);
    try {
      await downloadZip([asDownloadable], `${skill.slug}-bundle`, 'md');
      toast.success('Bundle ZIP downloaded');
    } catch { toast.error('Bundle download failed'); }
    finally { setDlLoading(false); }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 w-full">
      {/* Back */}
      <Link to="/skills" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Skills
      </Link>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-start md:gap-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 shadow-sm shadow-primary/10">
          <Zap className="h-7 w-7 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="outline" className="text-[11px] text-primary border-primary/30 bg-primary/5">
              {catLabel}
            </Badge>
            {skill.is_free
              ? <Badge variant="outline" className="text-[11px] text-emerald-400 border-emerald-500/30 bg-emerald-500/5">Free</Badge>
              : <Badge variant="outline" className="text-[11px] text-amber-400 border-amber-500/30 bg-amber-500/5">Premium</Badge>
            }
            <Badge variant="outline" className="text-[11px] text-muted-foreground border-border">Skill</Badge>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-2 text-balance">
            {skill.title}
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">{skill.description}</p>
        </div>

        {/* Action buttons — top right on desktop */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <CopyButton text={promptText} label="Copy Prompt" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" disabled={dlLoading} className="gap-1.5 h-8 text-xs">
                <Download className="h-3.5 w-3.5" /> Download
                <ChevronDown className="h-3 w-3 opacity-70" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">Single File</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleDownload('md')} className="text-xs gap-2">Markdown (.md)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload('txt')} className="text-xs gap-2">Plain Text (.txt)</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload('json')} className="text-xs gap-2">JSON (.json)</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">Bundle</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleBundle} className="text-xs gap-2">Bundle ZIP (.zip)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ── Main grid ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

        {/* Left: Use Case + Skill Prompt */}
        <div className="md:col-span-2 space-y-5">
          {skill.use_case && (
            <Card className="bg-card border-border">
              <CardHeader className="pb-2 pt-4 px-5">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-primary" /> Use Case
                </CardTitle>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <p className="text-sm text-muted-foreground leading-relaxed">{skill.use_case}</p>
              </CardContent>
            </Card>
          )}

          {/* Skill Prompt block */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-2 pt-4 px-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <Terminal className="h-3.5 w-3.5 text-primary" /> Skill Prompt
                </CardTitle>
                <CopyButton text={promptText} label="Copy Prompt" />
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed font-mono bg-secondary/40 rounded-lg p-4 overflow-x-auto max-h-72 min-w-0 border border-border/50">
                {promptText}
              </pre>
            </CardContent>
          </Card>

          {/* Install panel */}
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
          {skill.tags?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              <Tag className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
              {skill.tags.map(tag => (
                <span key={tag} className="text-xs bg-secondary text-secondary-foreground border border-border rounded-full px-2.5 py-0.5">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Right: Platforms + How to Use + Big CTA */}
        <div className="space-y-4">
          <Card className="bg-card border-border">
            <CardContent className="p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Compatible Platforms</h3>
              <div className="flex flex-wrap gap-2">
                {skill.compatible_platforms.map(p => (
                  <PlatformBadge key={p} platform={p} size="md" />
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-5">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">How to Use</h3>
              <ol className="space-y-3">
                {[
                  'Copy the skill prompt above',
                  'Open your AI platform (Open WebUI, Claude, ChatGPT, etc.)',
                  'Paste as a system prompt or skill file',
                  'Start a new conversation and run the task',
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

          {/* Big copy CTA */}
          <CopyButton text={promptText} label="Copy Skill Prompt" fullWidth />

          {/* Quick download row */}
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

      {/* ── Related Skills ─────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
            Related Skills
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {related.map(s => <SkillCard key={s.id} skill={s} detailPath={`/skills/${s.slug}`} />)}
          </div>
        </div>
      )}
    </div>
  );
}
