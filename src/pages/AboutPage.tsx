import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Info, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const platforms = [
  { name: 'Claude', color: '#d97706', desc: 'Anthropic\'s flagship AI — Cowork projects, Fable 5 model, skills, and connectors.' },
  { name: 'ChatGPT', color: '#10a37f', desc: 'OpenAI\'s ChatGPT Work — skills, scheduled tasks, and team collaboration.' },
  { name: 'Gemini Spark', color: '#4285f4', desc: 'Google\'s AI agent — Gmail, Docs, Drive integration, scheduled runs.' },
  { name: 'Open WebUI', color: '#8b5cf6', desc: 'Open-source self-hosted AI interface for local and cloud models.' },
  { name: 'LobeHub', color: '#6366f1', desc: 'LobeChat — extensible open-source AI chat with plugins and agents.' },
];

const values = [
  { icon: Zap, title: 'All in one place', desc: 'No more bookmarking a dozen sites. Every AI skill, guide, and tool in a single library.' },
  { icon: BookOpen, title: 'Beginner friendly', desc: 'Written for people who are new to AI skills — plain language, no jargon, practical examples.' },
  { icon: Sparkles, title: 'Always free', desc: 'Every skill, guide, and tool on Open Connect is free to access, copy, and use.' },
  { icon: Info, title: 'Platform agnostic', desc: 'Resources for Claude, ChatGPT, Gemini Spark, Open WebUI, and LobeHub — all in one place.' },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10 w-full">
      {/* Hero */}
      <div className="mb-12 text-center">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-sm font-bold text-primary-foreground">OC</span>
          </div>
        </div>
        <h1 className="text-3xl font-semibold text-foreground mb-3">
          About <span className="gradient-text">Open Connect</span>
        </h1>
        <p className="text-muted-foreground leading-relaxed max-w-xl mx-auto text-pretty">
          Open Connect is a free, unified resource hub for everyone using AI agents — from complete beginners to daily power users.
        </p>
      </div>

      {/* Mission */}
      <Card className="bg-card border-border mb-10">
        <CardContent className="p-6 md:p-8">
          <h2 className="text-lg font-semibold text-foreground mb-3">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            AI skills, prompts, and guides are scattered across dozens of blog posts, YouTube tutorials, and private communities. Most people never find the best resources because they don't know where to look.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            OpenXStack fixes that. We aggregate, organize, and present the best AI agent resources in one clean library — skills you can copy directly into Claude, ChatGPT, or Gemini Spark, guides that explain the how and why, and setup instructions for every platform.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Everything is free. No sign-up required. Just browse, copy, and use.
          </p>
        </CardContent>
      </Card>

      {/* Values */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 mb-10">
        {values.map(({ icon: Icon, title, desc }) => (
          <Card key={title} className="bg-card border-border card-hover">
            <CardContent className="p-5 flex gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <div className="min-w-0">
                <h3 className="font-semibold text-sm text-foreground mb-1">{title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Platforms supported */}
      <div className="mb-10">
        <h2 className="text-base font-semibold text-foreground mb-4">Platforms We Cover</h2>
        <div className="space-y-3">
          {platforms.map(p => (
            <div key={p.name} className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
              <div className="h-2 w-2 rounded-full shrink-0 mt-2" style={{ backgroundColor: p.color }} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{p.name}</p>
                <p className="text-xs text-muted-foreground">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center rounded-xl border border-primary/20 bg-primary/5 p-8">
        <h2 className="font-semibold text-foreground mb-2">Ready to explore?</h2>
        <p className="text-sm text-muted-foreground mb-6 text-pretty">Browse 45+ AI skills, 51+ guides, and free tools — all organized and free.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/skills">
            <Button className="gap-2">Browse Skills <ArrowRight className="h-4 w-4" /></Button>
          </Link>
          <Link to="/guides">
            <Button variant="ghost" className="gap-2 border border-border hover:border-primary/40">Read Guides <ArrowRight className="h-4 w-4" /></Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
