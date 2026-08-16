/**
 * InstallPanel — CLI install command blocks for Open WebUI, SwarmClaw, Hermes Agent
 * Shows copy-able shell commands for each platform that supports the resource.
 */
import { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface InstallCommand {
  platform: string;
  color: string;         // tailwind text color token
  bgColor: string;       // tailwind bg color token
  borderColor: string;   // tailwind border color token
  command: string;
  note?: string;
}

interface InstallPanelProps {
  commands: InstallCommand[];
  className?: string;
}

function CommandBlock({ cmd }: { cmd: InstallCommand }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cmd.command);
    setCopied(true);
    toast.success(`Copied ${cmd.platform} install command`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn('rounded-lg border overflow-hidden', cmd.borderColor)}>
      {/* Platform label bar */}
      <div className={cn('flex items-center justify-between px-3 py-2', cmd.bgColor)}>
        <div className="flex items-center gap-2">
          <Terminal className={cn('h-3.5 w-3.5', cmd.color)} />
          <span className={cn('text-xs font-semibold', cmd.color)}>{cmd.platform}</span>
        </div>
        <button
          onClick={handleCopy}
          className={cn(
            'flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded transition-all',
            copied
              ? 'text-emerald-400 bg-emerald-500/10'
              : cn('hover:bg-black/20', cmd.color)
          )}
          aria-label="Copy command"
        >
          {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      {/* Command */}
      <div className="bg-[hsl(var(--card))] px-4 py-3">
        <code className="text-xs font-mono text-foreground/90 break-all leading-relaxed select-all">
          {cmd.command}
        </code>
      </div>
      {/* Optional note */}
      {cmd.note && (
        <div className="bg-secondary/30 px-4 py-2 border-t border-border">
          <p className="text-[11px] text-muted-foreground">{cmd.note}</p>
        </div>
      )}
    </div>
  );
}

export default function InstallPanel({ commands, className }: InstallPanelProps) {
  if (!commands.length) return null;
  return (
    <div className={cn('space-y-3', className)}>
      {commands.map(cmd => (
        <CommandBlock key={cmd.platform} cmd={cmd} />
      ))}
    </div>
  );
}

// ── Helpers to build standard install commands ─────────────────────────────

export function buildSkillInstallCommands(slug: string, platforms: string[]): InstallCommand[] {
  const cmds: InstallCommand[] = [];
  const lower = platforms.map(p => p.toLowerCase());

  if (lower.some(p => p.includes('open webui'))) {
    cmds.push({
      platform: 'Open WebUI',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      command: `open-webui skill install ${slug}`,
      note: 'Requires Open WebUI ≥ 0.4 with Skills support enabled.',
    });
  }
  if (lower.some(p => p.includes('swarmclaw'))) {
    cmds.push({
      platform: 'SwarmClaw',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      command: `swarmclaw skill add ${slug}`,
      note: 'Install into your SwarmClaw agent workspace.',
    });
  }
  if (lower.some(p => p.includes('hermes'))) {
    cmds.push({
      platform: 'Hermes Agent',
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/10',
      borderColor: 'border-violet-500/20',
      command: `hermes skills install ${slug}`,
      note: 'Adds the skill to your Hermes procedural memory store.',
    });
  }
  if (lower.some(p => p.includes('claude'))) {
    cmds.push({
      platform: 'Claude (Projects)',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      command: `# Paste the skill prompt into a Claude Project\n# System Prompt → paste content → Save`,
      note: 'No CLI available — use Claude Projects or API system_prompt.',
    });
  }
  return cmds;
}

export function buildResourceInstallCommands(
  slug: string,
  resourceType: string,
  platforms: string[]
): InstallCommand[] {
  const cmds: InstallCommand[] = [];
  const lower = platforms.map(p => p.toLowerCase());

  if (lower.some(p => p.includes('open webui'))) {
    const typeFlag = resourceType === 'tool' ? 'tool' : resourceType === 'plugin' ? 'plugin' : 'function';
    cmds.push({
      platform: 'Open WebUI',
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      command: `open-webui ${typeFlag} install ${slug}`,
      note: `Install as an Open WebUI ${typeFlag}. Requires Open WebUI ≥ 0.4.`,
    });
  }
  if (lower.some(p => p.includes('swarmclaw'))) {
    cmds.push({
      platform: 'SwarmClaw',
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      borderColor: 'border-orange-500/20',
      command: `swarmclaw ${resourceType} add ${slug}`,
      note: 'Add to your SwarmClaw agent environment.',
    });
  }
  if (lower.some(p => p.includes('hermes'))) {
    cmds.push({
      platform: 'Hermes Agent',
      color: 'text-violet-400',
      bgColor: 'bg-violet-500/10',
      borderColor: 'border-violet-500/20',
      command: `hermes tools add ${slug}`,
      note: 'Register with Hermes MCP/tool integration layer.',
    });
  }
  if (resourceType === 'mcp') {
    cmds.push({
      platform: 'MCP Host (npx)',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      command: `npx @modelcontextprotocol/inspector ${slug}`,
      note: 'Inspect and connect any MCP server from the CLI.',
    });
    cmds.push({
      platform: 'Claude Desktop',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      command: `# Add to claude_desktop_config.json:\n# "mcpServers": { "${slug}": { "command": "npx", "args": ["-y", "@mcp/${slug}"] } }`,
      note: 'Edit ~/Library/Application Support/Claude/claude_desktop_config.json',
    });
  }
  return cmds;
}
