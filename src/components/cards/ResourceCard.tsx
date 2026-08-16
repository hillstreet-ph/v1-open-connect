import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Download, Check, CheckSquare, Square, Bot, Puzzle, Wrench,
  Server, MessageSquare, Zap, ExternalLink,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlatformBadgeList } from '@/components/ui/platform-badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { downloadSingle, type DownloadFormat, type Downloadable } from '@/lib/download';
import type { Resource as AppResource } from '@/types';

type ResourceTypeName = AppResource['resource_type'] | 'skill';

// Locally extend Downloadable with the fields ResourceCard needs
interface Resource extends Downloadable {
  id: number;
  resource_type: ResourceTypeName;
  is_featured?: boolean;
  compatible_platforms: string[];
}

interface ResourceCardProps {
  resource: Resource;
  selectMode?: boolean;
  isSelected?: boolean;
  onToggle?: (id: number) => void;
  detailPath?: string;
}

const typeConfig: Record<ResourceTypeName, { icon: React.ComponentType<{ className?: string }>; label: string; color: string }> = {
  agent:  { icon: Bot,          label: 'Agent',  color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
  plugin: { icon: Puzzle,       label: 'Plugin', color: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  mcp:    { icon: Server,       label: 'MCP',    color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  prompt: { icon: MessageSquare,label: 'Prompt', color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  tool:   { icon: Wrench,       label: 'Tool',   color: 'text-teal-400 bg-teal-500/10 border-teal-500/20' },
  skill:  { icon: Zap,          label: 'Skill',  color: 'text-primary bg-primary/10 border-primary/20' },
};

export default function ResourceCard({ resource, selectMode, isSelected, onToggle, detailPath }: ResourceCardProps) {
  const [downloading, setDownloading] = useState(false);
  const typeInfo = typeConfig[resource.resource_type] ?? typeConfig.skill;
  const TypeIcon = typeInfo.icon;

  const handleDownload = async (fmt: DownloadFormat) => {
    setDownloading(true);
    try {
      downloadSingle(resource, fmt);
      toast.success(`Downloaded ${resource.title} as .${fmt}`);
    } catch {
      toast.error('Download failed');
    } finally {
      setDownloading(false);
    }
  };

  const cardContent = (
    <CardContent className="p-4 flex flex-col gap-3 h-full">
      {/* Header row */}
      <div className="flex items-start gap-3">
        {/* Select checkbox or type icon */}
        {selectMode ? (
          <button
            onClick={e => { e.preventDefault(); onToggle?.(resource.id); }}
            className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary transition-colors"
            aria-label={isSelected ? 'Deselect' : 'Select'}
          >
            {isSelected
              ? <CheckSquare className="h-5 w-5 text-primary" />
              : <Square className="h-5 w-5" />}
          </button>
        ) : (
          <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border', typeInfo.color)}>
            <TypeIcon className="h-4 w-4" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <span className={cn('inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-semibold', typeInfo.color)}>
              {typeInfo.label}
            </span>
            {resource.is_featured && (
              <span className="inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-semibold bg-primary/10 text-primary border-primary/20">
                Featured
              </span>
            )}
          </div>
          <h3 className="text-sm font-semibold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
            {resource.title}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 flex-1">
        {resource.description}
      </p>

      {/* Category */}
      {resource.category && (
        <p className="text-[10px] text-muted-foreground/70 truncate">{resource.category}</p>
      )}

      {/* Platforms */}
      <PlatformBadgeList platforms={resource.compatible_platforms} max={3} />

      {/* Actions */}
      <div className="flex gap-1.5 mt-auto pt-1">
        {detailPath && (
          <Link to={detailPath} className="flex-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full h-7 text-xs border border-border hover:border-primary/40 hover:bg-primary/5 justify-between"
            >
              View <ExternalLink className="h-3 w-3" />
            </Button>
          </Link>
        )}

        {/* Download dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                'h-7 text-xs border border-border hover:border-primary/40 hover:bg-primary/5',
                detailPath ? 'px-2' : 'flex-1 justify-between'
              )}
              disabled={downloading}
              onClick={e => e.stopPropagation()}
            >
              <Download className="h-3 w-3" />
              {!detailPath && <span className="ml-1">Download</span>}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem onClick={() => handleDownload('md')}>
              <Check className="h-3 w-3 mr-2 opacity-0" /> Markdown (.md)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDownload('txt')}>
              <Check className="h-3 w-3 mr-2 opacity-0" /> Plain Text (.txt)
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDownload('json')}>
              <Check className="h-3 w-3 mr-2 opacity-0" /> JSON (.json)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </CardContent>
  );

  return (
    <Card
      className={cn(
        'bg-card border-border card-hover group h-full flex flex-col transition-all',
        isSelected && 'border-primary/60 bg-primary/5 shadow-sm shadow-primary/10'
      )}
    >
      {cardContent}
    </Card>
  );
}
