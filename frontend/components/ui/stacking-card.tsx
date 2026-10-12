'use client';

import React, { useRef, useState, forwardRef } from 'react';
import { ReactLenis } from 'lenis/react';
import { useTransform, motion, useScroll, type MotionValue } from 'motion/react';
import { cn } from '@/lib/utils';
import { ExternalLink, ShieldCheck, AlertTriangle, CheckCircle2, Lock, ZoomIn } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export interface ProjectData {
  title: string;
  description: string;
  link: string;
  color: string;
  // Rich incident extensions
  id?: string;
  target?: string;
  date?: string;
  sourceUrl?: string;
  sourceLabel?: string;
  sourceDomain?: string;
  lossFigure?: string;
  lossColor?: string;
  whatHappened?: string;
  withReprieve?: string;
  rules?: string[];
  articleImage?: string;
  borderClass?: string;
  glowGradient?: string;
}

export interface CardProps {
  i: number;
  title: string;
  description: string;
  url: string;
  color: string;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
  project?: ProjectData;
  onInspect?: (project: ProjectData) => void;
  children?: React.ReactNode;
}

export const Card = ({
  i,
  title,
  description,
  url,
  color,
  progress,
  range,
  targetScale,
  project,
  onInspect,
  children,
}: CardProps) => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start'],
  });

  const imageScale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);
  const scale = useTransform(progress, range, [1, targetScale]);

  const hasRichData = Boolean(project?.lossFigure || project?.rules || project?.whatHappened);
  const activeUrl = project?.sourceUrl || url || '#';
  const displayImage = project?.articleImage || url;
  const projectItem = project || {
    title,
    description,
    link: url,
    color,
    sourceUrl: activeUrl,
  };

  return (
    <div
      ref={container}
      className="h-screen flex items-start justify-center sticky top-16 sm:top-20 lg:top-24 px-3 sm:px-6 pb-12"
    >
      <motion.div
        style={{
          backgroundColor: color,
          scale,
          top: `${i * 22}px`,
        }}
        className={cn(
          "flex flex-col relative w-full max-w-[1140px] rounded-2xl p-4 sm:p-6 lg:p-8 origin-top",
          "border shadow-2xl backdrop-blur-2xl transition-colors duration-300",
          project?.borderClass || "border-white/10"
        )}
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          aria-hidden="true"
          className={cn(
            "pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-gradient-to-br opacity-50",
            project?.glowGradient || "from-white/5 via-transparent to-transparent"
          )}
        />

        {children ? (
          children
        ) : (
          <>
            {/* Top Header of Card */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-3 sm:pb-4">
              <div className="flex items-center gap-3">
                <span className="flex size-7 items-center justify-center rounded-md bg-white/10 font-mono text-xs font-bold text-zinc-300">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="text-base sm:text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2">
                    {project?.target || title}
                    {project?.date && (
                      <span className="font-mono text-xs font-normal text-zinc-400">
                        ({project.date})
                      </span>
                    )}
                  </h3>
                  <span className="font-mono text-[10.5px] sm:text-[11px] text-zinc-400">
                    Verified Incident Post-Mortem · Root Cause Analysis
                  </span>
                </div>
              </div>

              {project?.lossFigure && (
                <div
                  className={cn(
                    "flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-xs sm:text-sm font-bold tracking-tight",
                    project?.lossColor || "text-red-400 bg-red-500/10 border-red-500/25"
                  )}
                >
                  <AlertTriangle className="size-3.5 sm:size-4 shrink-0" aria-hidden="true" />
                  <span>{project.lossFigure}</span>
                </div>
              )}
            </div>

            {/* Card Body: Split Grid */}
            <div className="flex flex-col lg:flex-row h-full mt-3.5 sm:mt-5 gap-3.5 lg:gap-8 items-stretch">
              {/* Left Textual Column */}
              <div className="w-full lg:w-[46%] flex flex-col justify-between space-y-3">
                <div className="space-y-3">
                  {hasRichData ? (
                    <>
                      {/* The Root Failure */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <AlertTriangle className="size-3 text-red-400" aria-hidden="true" />
                          <span className="font-mono text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-red-400">
                            The Root Failure
                          </span>
                        </div>
                        <p className="text-[12px] sm:text-[13.5px] text-zinc-300 leading-snug sm:leading-relaxed">
                          {project?.whatHappened || description}
                        </p>
                      </div>

                      {/* With Reprieve */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="size-3 text-brand" aria-hidden="true" />
                          <span className="font-mono text-[10px] sm:text-[10.5px] font-bold uppercase tracking-wider text-brand">
                            How Reprieve Prevents This
                          </span>
                        </div>
                        <p className="text-[12px] sm:text-[13.5px] text-zinc-300 leading-snug sm:leading-relaxed">
                          {project?.withReprieve}
                        </p>
                      </div>

                      {/* Governing Rules */}
                      {project?.rules && project.rules.length > 0 && (
                        <div className="space-y-1 pt-0.5">
                          <span className="block font-mono text-[9px] sm:text-[9.5px] uppercase text-zinc-400 font-semibold tracking-wider">
                            Governing Graph Rules
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {project.rules.map((rule) => (
                              <span
                                key={rule}
                                className="rounded-md border border-brand/30 bg-brand/10 px-2 py-0.5 font-mono text-[10px] sm:text-[10.5px] font-medium text-brand"
                              >
                                {rule}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">{description}</p>
                  )}
                </div>

                {/* Source Link Bar */}
                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                  <a
                    href={activeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-[11px] sm:text-xs font-semibold text-zinc-300 hover:text-white transition-colors group/link"
                  >
                    <span>{project?.sourceLabel || 'See official record'}</span>
                    <ExternalLink className="size-3 sm:size-3.5 text-zinc-400 group-hover/link:text-white transition-colors" />
                  </a>
                  <span className="font-mono text-[9.5px] sm:text-[10px] text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="size-3" />
                    100% Grounded
                  </span>
                </div>
              </div>

              {/* Right Image Column: Interactive Article Screenshot */}
              <div className="w-full lg:w-[54%] h-40 sm:h-52 lg:h-auto lg:min-h-[260px] relative rounded-xl overflow-hidden border border-white/10 bg-[#07080c] group/img shrink-0">
                <motion.div
                  className="w-full h-full relative"
                  style={{ scale: imageScale }}
                >
                  <img
                    src={displayImage}
                    alt={project?.target || title}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover/img:scale-[1.03]"
                  />
                </motion.div>

                {/* Default Indicator (fades out slightly on hover) */}
                <div className="absolute top-2.5 right-2.5 transition-opacity duration-300 pointer-events-none">
                  <div className="flex items-center gap-1.5 rounded-md border border-white/15 bg-black/75 px-2 py-0.5 backdrop-blur-md font-mono text-[10px] text-zinc-300 shadow-md">
                    <Lock className="size-2.5 text-emerald-400" />
                    <span>{project?.sourceDomain || 'Verified Record'}</span>
                  </div>
                </div>

                {/* Hover Lens: Non-destructive overlay revealing verified action links */}
                <div
                  className={cn(
                    "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent",
                    "opacity-0 group-hover/img:opacity-100 transition-opacity duration-300",
                    "p-3.5 sm:p-4 flex flex-col justify-end"
                  )}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Verified Public Record
                      </span>
                      <span className="font-mono text-[10px] text-zinc-400">
                        {project?.sourceDomain}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <a
                        href={activeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-brand-solid px-3 py-1.5 font-mono text-xs font-semibold text-white hover:bg-brand-solid/90 transition-colors shadow-md"
                      >
                        <span>Open Live Document</span>
                        <ExternalLink className="size-3.5" />
                      </a>

                      {onInspect && (
                        <button
                          type="button"
                          onClick={() => onInspect(projectItem)}
                          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-white/20 bg-zinc-900/90 hover:bg-zinc-800 px-3 py-1.5 font-mono text-xs font-semibold text-zinc-200 hover:text-white transition-colors"
                        >
                          <ZoomIn className="size-3.5" />
                          <span>Expand</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export interface StackingCardProps {
  projects: ProjectData[];
  className?: string;
  useLenis?: boolean;
}

export const StackingCard = forwardRef<HTMLDivElement, StackingCardProps>(
  ({ projects, className, useLenis = false }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [inspectProject, setInspectProject] = useState<ProjectData | null>(null);

    const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ['start start', 'end end'],
    });

    const content = (
      <div ref={containerRef} className={cn("relative w-full", className)}>
        {projects.map((project, i) => {
          const targetScale = 1 - (projects.length - i) * 0.04;
          return (
            <Card
              key={project.id || `p_${i}`}
              i={i}
              url={project.link}
              title={project.title}
              color={project.color}
              description={project.description}
              progress={scrollYProgress}
              range={[i * 0.25, 1]}
              targetScale={targetScale}
              project={project}
              onInspect={(p) => setInspectProject(p)}
            />
          );
        })}

        {/* Full Article Lightbox Dialog */}
        <Dialog open={Boolean(inspectProject)} onOpenChange={(open) => !open && setInspectProject(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden border border-white/15 bg-zinc-950 text-white shadow-2xl">
            <DialogHeader className="p-5 border-b border-white/10 bg-zinc-900/60">
              <div className="flex items-center justify-between gap-4 pr-6">
                <div>
                  <DialogTitle className="text-xl font-bold font-display text-white flex items-center gap-2">
                    {inspectProject?.target || inspectProject?.title}
                    {inspectProject?.date && (
                      <span className="font-mono text-xs font-normal text-zinc-400">
                        ({inspectProject.date})
                      </span>
                    )}
                  </DialogTitle>
                  <DialogDescription className="font-mono text-xs text-zinc-400 mt-1">
                    Authentic Public Post-Incident Review · Source: {inspectProject?.sourceDomain}
                  </DialogDescription>
                </div>
                {inspectProject?.lossFigure && (
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-red-500/15 border border-red-500/25 text-red-400">
                    {inspectProject.lossFigure}
                  </span>
                )}
              </div>
            </DialogHeader>

            <div className="p-4 bg-zinc-950 max-h-[70vh] overflow-y-auto">
              <div className="rounded-lg overflow-hidden border border-white/10 bg-black">
                <img
                  src={inspectProject?.articleImage || inspectProject?.link}
                  alt={inspectProject?.target || inspectProject?.title || 'Article Screenshot'}
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>

            <div className="p-4 border-t border-white/10 bg-zinc-900/60 flex items-center justify-between">
              <span className="font-mono text-xs text-zinc-400">
                100% Non-Fictional Event · Verified Public Record
              </span>
              <Button
                asChild
                size="sm"
                className="bg-brand-solid hover:bg-brand-solid/90 text-white font-mono text-xs"
              >
                <a
                  href={inspectProject?.sourceUrl || inspectProject?.link || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open External Source Document
                  <ExternalLink className="ml-1.5 size-3.5" />
                </a>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );

    if (useLenis) {
      return <ReactLenis root>{content}</ReactLenis>;
    }

    return content;
  }
);

StackingCard.displayName = 'StackingCard';

export const Component = StackingCard;
export default StackingCard;

// Demo support matching template
export const DemoOne = () => {
  const sampleProjects: ProjectData[] = [
    {
      title: 'Matthias Leidinger',
      description: 'Originally hailing from Austria, Berlin-based photographer Matthias Leindinger.',
      link: 'https://cdn.21st.dev/assets/mirror/68/688e3a84bc3a2949290945455c7927eae33b1bcf702e14ff82f32620918b7f44.jpg',
      color: '#0c0e15',
    },
    {
      title: 'Clément Chapillon',
      description: 'This is a story on the border between reality and imaginary.',
      link: 'https://cdn.21st.dev/assets/mirror/a1/a161a794d3ce6a559a66480d2efb6381f5014557e7fd54c40d305efb07dc9b0a.jpg',
      color: '#0d0f19',
    },
  ];

  return <StackingCard projects={sampleProjects} />;
};
