'use client';

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Zap,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  GitBranch,
  Terminal,
  Cpu,
  Layers,
  Lock,
  BarChart3,
  Network,
} from "lucide-react";

export const Component = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedMetric, setSelectedMetric] = useState(0);

  const features = [
    {
      id: 0,
      title: "Graph Traversal",
      desc: "Deterministic Cypher queries across 8 rules",
      icon: GitBranch,
      stat: "<12ms",
    },
    {
      id: 1,
      title: "Avalanche Risk",
      desc: "Predicts multi-hop cascading centrality P=p0^h",
      icon: TrendingUp,
      stat: "99.9%",
    },
    {
      id: 2,
      title: "Temporal Scrubber",
      desc: "Sliding window collision detection across teams",
      icon: Cpu,
      stat: "30-90d",
    },
    {
      id: 3,
      title: "Steward Grounding",
      desc: "Zero-hallucination agent with strict citations",
      icon: Lock,
      stat: "100%",
    },
  ];

  const metrics = [
    { label: "Graph Query Latency", value: "12ms", trend: "-34%" },
    { label: "Collision Window Scan", value: "15ms", trend: "-18%" },
    { label: "False Positive Rate", value: "0.00%", trend: "-100%" },
    { label: "Memory Grounding Accuracy", value: "100%", trend: "+0.00%" },
  ];

  const integrations = [
    { name: "FalkorDB", abbr: "⚡" },
    { name: "Redis", abbr: "📦" },
    { name: "GitHub Actions", abbr: "🐙" },
    { name: "FastAPI", abbr: "⚡" },
    { name: "Next.js", abbr: "▲" },
    { name: "Clerk", abbr: "🔐" },
  ];

  const codeExample = `// Pre-approval CI risk scan
import { ReprieveClient } from "@reprieve/sdk";
const reprieve = new ReprieveClient({ apiKey: process.env.REPRIEVE_API_KEY });

const audit = await reprieve.simulate({
  serviceId: "svc_payments_gateway",
  horizonDays: 30
});
// ✓ 0 cascading collisions detected (exit 0)`;

  const stats = [
    { label: "Deterministic Rules", value: "8 Rules", icon: ShieldCheck },
    { label: "Graph Database", value: "FalkorDB", icon: Cpu },
    { label: "Evaluation Engine", value: "<15ms", icon: Zap },
    { label: "Agent Safety", value: "Zero Hallucination", icon: Lock },
  ];

  const activeFeature = features[activeTab];

  return (
    <section className="w-full bg-black py-24 px-4 md:px-8 text-white font-sans antialiased overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        
        {/* Hero Header */}
        <div className="flex flex-col gap-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 border border-zinc-700 w-fit">
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-xs font-semibold tracking-wider text-zinc-300">
              Operational Graph Intelligence
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
            Eliminate Cascading Silent Failures
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed">
            Turn fragmented Jira tickets, security waivers, and feature flags into a deterministic graph brain that catches systemic outages before production.
          </p>
        </div>

        {/* Main Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[280px]">
          
          {/* Large Hero Card - Interactive Features */}
          <div className="md:col-span-2 md:row-span-2 group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-8 flex flex-col justify-between transition-all duration-300 hover:border-zinc-700">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs font-semibold">
                <Network className="w-3.5 h-3.5 text-brand" />
                Deterministic Graph Core
              </div>
              <h3 className="text-3xl font-bold tracking-tight mb-2 text-white">Core Features</h3>
              <p className="text-sm text-zinc-400">
                Click to explore what powers our platform
              </p>
            </div>

            {/* Feature Selector Grid */}
            <div className="grid grid-cols-2 gap-3 relative z-10">
              {features.map((feature) => {
                const Icon = feature.icon;
                const isActive = activeTab === feature.id;
                return (
                  <button
                    key={feature.id}
                    type="button"
                    onClick={() => setActiveTab(feature.id)}
                    className={cn(
                      "group/card relative overflow-hidden rounded-xl p-4 border transition-all duration-300 flex flex-col text-left",
                      isActive
                        ? "bg-zinc-800 border-zinc-600"
                        : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                    )}
                  >
                    <Icon
                      className={cn(
                        "w-5 h-5 mb-2 transition-colors",
                        isActive ? "text-white" : "text-zinc-500"
                      )}
                    />
                    <span className="text-xs font-bold text-white text-left">{feature.title}</span>
                    <span className="text-[10px] text-zinc-400 text-left mt-1 line-clamp-1">
                      {feature.stat}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Dynamic Content Area */}
            <div className="relative z-10 mt-6 p-4 rounded-xl bg-zinc-900 border border-zinc-800">
              <div className="flex-1">
                <p className="text-xs font-mono text-zinc-500 mb-1">Selected:</p>
                <p className="text-lg font-bold text-white">{activeFeature.title}</p>
                <p className="text-xs text-zinc-400 mt-1">{activeFeature.desc}</p>
              </div>
              <div className="text-3xl font-bold font-mono text-white mt-3">
                {activeFeature.stat}
              </div>
            </div>
          </div>

          {/* Metrics Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between transition-all duration-300 hover:border-zinc-700">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs px-2 py-1 rounded-lg bg-zinc-800 text-zinc-300 font-semibold">
                  Live
                </span>
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Performance</h3>
              <p className="text-xs text-zinc-400 mb-4">Real-time metrics</p>

              <div className="space-y-2">
                {metrics.map((metric, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedMetric(idx)}
                    className={cn(
                      "w-full text-left p-2 rounded-lg transition-all duration-200 border",
                      selectedMetric === idx
                        ? "bg-zinc-800 border-zinc-600"
                        : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                    )}
                  >
                    <p className="text-[10px] text-zinc-400">{metric.label}</p>
                    <div className="flex items-baseline justify-between mt-0.5">
                      <span className="text-sm font-bold text-white">{metric.value}</span>
                      <span className="text-[10px] text-zinc-300 font-semibold">
                        {metric.trend}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Integrations Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between transition-all duration-300 hover:border-zinc-700">
            <div className="relative z-10">
              <div className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg w-fit mb-4">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Integrations</h3>
              <p className="text-xs text-zinc-400 mb-4">Popular stack support</p>

              <div className="grid grid-cols-3 gap-2">
                {integrations.map((int, idx) => (
                  <div
                    key={idx}
                    className="group/int p-3 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition-all duration-200 flex flex-col items-center gap-1 cursor-pointer"
                  >
                    <span className="text-xl group-hover/int:scale-125 transition-transform duration-200">
                      {int.abbr}
                    </span>
                    <p className="text-[9px] text-zinc-500 text-center truncate max-w-full">{int.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Terminal Demo Card */}
          <div className="md:col-span-2 group relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 p-6 flex flex-col justify-between transition-all duration-300 hover:border-zinc-700">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg">
                  <Terminal className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-sm font-bold text-white">Pre-Approval CI Scan</h3>
              </div>

              <div className="bg-black border border-zinc-800 rounded-lg p-4 font-mono text-[12px] leading-relaxed overflow-auto max-h-36 scrollbar-hide">
                {codeExample.split("\n").map((line, idx) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-zinc-600 select-none w-6 text-right shrink-0">{idx + 1}</span>
                    <span
                      className={cn(
                        line.includes("//")
                          ? "text-zinc-600"
                          : line.includes("✓")
                          ? "text-emerald-400 font-medium"
                          : line.includes("const") || line.includes("await") || line.includes("import")
                          ? "text-zinc-200 font-medium"
                          : "text-zinc-300"
                      )}
                    >
                      {line}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 p-4 transition-all duration-300 hover:border-zinc-700"
              >
                <Icon className="w-4 h-4 text-white mb-3 relative z-10" />
                <p className="text-xs text-zinc-400 relative z-10">{stat.label}</p>
                <p className="text-xl font-bold text-white mt-1 relative z-10">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const FeaturesCard = Component;
export default FeaturesCard;
