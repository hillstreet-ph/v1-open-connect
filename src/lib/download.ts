import JSZip from 'jszip';

export type DownloadFormat = 'txt' | 'md' | 'json';

export interface Downloadable {
  slug: string;
  title: string;
  description: string;
  category?: string;
  compatible_platforms?: string[];
  prompt_content?: string | null;
  resource_type?: string;
  tags?: string[];
  author?: string | null;
  source_url?: string | null;
}

// ─── Format a single resource as file content ─────────────────────────────────

function toTxt(item: Downloadable): string {
  const lines: string[] = [
    `TITLE: ${item.title}`,
    `TYPE: ${item.resource_type ?? 'skill'}`,
    `CATEGORY: ${item.category ?? ''}`,
    `PLATFORMS: ${(item.compatible_platforms ?? []).join(', ')}`,
    `TAGS: ${(item.tags ?? []).join(', ')}`,
    '',
    'DESCRIPTION:',
    item.description,
    '',
  ];
  if (item.prompt_content) {
    lines.push('PROMPT / CONTENT:', item.prompt_content, '');
  }
  if (item.source_url) lines.push(`SOURCE: ${item.source_url}`);
  return lines.join('\n');
}

function toMd(item: Downloadable): string {
  const lines: string[] = [
    `# ${item.title}`,
    '',
    `> **Type**: ${item.resource_type ?? 'skill'}  `,
    `> **Category**: ${item.category ?? ''}  `,
    `> **Platforms**: ${(item.compatible_platforms ?? []).join(', ')}  `,
    `> **Tags**: ${(item.tags ?? []).join(', ')}`,
    '',
    '## Description',
    '',
    item.description,
    '',
  ];
  if (item.prompt_content) {
    lines.push('## Prompt / Content', '', '```', item.prompt_content, '```', '');
  }
  if (item.source_url) lines.push(`---`, `*Source: ${item.source_url}*`);
  return lines.join('\n');
}

function toJson(item: Downloadable): string {
  return JSON.stringify(
    {
      title: item.title,
      slug: item.slug,
      resource_type: item.resource_type ?? 'skill',
      category: item.category ?? '',
      compatible_platforms: item.compatible_platforms ?? [],
      tags: item.tags ?? [],
      description: item.description,
      prompt_content: item.prompt_content ?? null,
      author: item.author ?? null,
      source_url: item.source_url ?? null,
    },
    null,
    2
  );
}

function getContent(item: Downloadable, fmt: DownloadFormat): string {
  if (fmt === 'json') return toJson(item);
  if (fmt === 'md') return toMd(item);
  return toTxt(item);
}

function getMime(fmt: DownloadFormat): string {
  if (fmt === 'json') return 'application/json';
  if (fmt === 'md') return 'text/markdown';
  return 'text/plain';
}

// ─── Download single file ──────────────────────────────────────────────────────

export function downloadSingle(item: Downloadable, fmt: DownloadFormat = 'md'): void {
  const content = getContent(item, fmt);
  const blob = new Blob([content], { type: getMime(fmt) });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${item.slug}.${fmt}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ─── Download ZIP of multiple items ───────────────────────────────────────────

export async function downloadZip(
  items: Downloadable[],
  zipName: string,
  fmt: DownloadFormat = 'md'
): Promise<void> {
  if (items.length === 0) return;
  const zip = new JSZip();
  const folder = zip.folder(zipName) ?? zip;

  for (const item of items) {
    folder.file(`${item.slug}.${fmt}`, getContent(item, fmt));
  }

  const blob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${zipName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
