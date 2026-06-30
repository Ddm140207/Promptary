import React, { useState } from "react";
import { Prompt } from "../types";
import { Copy, Check, Eye, Bookmark, Share2, Award, Zap } from "lucide-react";
import { motion } from "motion/react";

interface PromptCardProps {
  prompt: Prompt;
  onView: (prompt: Prompt) => void;
  onToggleSave: (promptId: string) => void;
  isSaved: boolean;
  key?: React.Key;
}

export default function PromptCard({ prompt, onView, onToggleSave, isSaved }: PromptCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering card view modal
    navigator.clipboard.writeText(prompt.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, borderColor: "#8B5CF6" }}
      className="relative flex flex-col h-full bg-[#15181D] hover:bg-[#1a1e24] border border-[#262B33] rounded-xl p-5 transition-all duration-300 group overflow-hidden"
    >
      {/* Absolute background accent glow on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/5 to-transparent rounded-bl-full pointer-events-none transition-opacity duration-300 group-hover:opacity-100 opacity-50" />

      {/* Ribbon / Badge if trending */}
      {prompt.isTrending && (
        <div className="absolute top-0 left-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-[10px] text-white font-mono uppercase font-bold px-3 py-1 rounded-br-lg flex items-center gap-1 shadow-md">
          <Zap className="w-3 h-3 fill-current" />
          <span>Trending</span>
        </div>
      )}

      {/* Top row: Category and Save action */}
      <div className="flex items-center justify-between gap-2 mb-3 mt-3">
        <span className="text-[10px] uppercase tracking-wider font-mono px-2.5 py-1 bg-[#1E293B] border border-[#334155] rounded text-[#38BDF8] font-bold">
          {prompt.category}
        </span>
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(prompt.id);
          }}
          className={`p-1.5 rounded-lg border transition-all duration-200 cursor-pointer ${
            isSaved
              ? "bg-[#8B5CF6]/20 border-[#8B5CF6] text-[#8B5CF6]"
              : "bg-transparent border-[#262B33] text-slate-400 hover:text-white hover:border-slate-500"
          }`}
          title={isSaved ? "Remove from Library" : "Save to My Library"}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 cursor-pointer" onClick={() => onView(prompt)}>
        <h3 className="text-lg font-display font-semibold text-white tracking-tight group-hover:text-[#8B5CF6] transition-colors duration-200 line-clamp-1 mb-2">
          {prompt.title}
        </h3>
        
        <p className="text-sm text-slate-400 font-sans font-light leading-relaxed mb-4 line-clamp-3">
          {prompt.description}
        </p>

        {prompt.forkedFromAuthor && (
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mt-1 mb-3 bg-sky-500/5 border border-sky-500/10 px-2.5 py-1.5 rounded-lg w-fit">
            <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse" />
            <span>Based on prompt of <span className="text-sky-400 font-semibold">{prompt.forkedFromAuthor}</span></span>
          </div>
        )}
      </div>

      {/* Tags cluster */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {prompt.tags.map((tag) => (
          <span
            key={tag}
            className="text-[11px] font-mono font-medium text-slate-500 bg-[#0D0F12] border border-[#20252D] px-2 py-0.5 rounded-md hover:border-slate-600 hover:text-slate-300 transition-colors duration-150"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* Bottom separator */}
      <div className="w-full h-px bg-[#262B33]/80 my-3" />

      {/* Footer row: Creator Profile & Action stats */}
      <div className="flex items-center justify-between gap-3 text-xs mt-1">
        {/* Creator Identity */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-gradient-to-tr from-[#8B5CF6] to-[#3B82F6] rounded-full flex items-center justify-center font-bold text-white text-[11px] uppercase shadow-sm">
            {prompt.author.name ? prompt.author.name.charAt(0) : "DS"}
          </div>
          <div className="flex flex-col">
            <span className="text-slate-200 font-medium font-sans truncate max-w-[100px]" title={prompt.author.name}>
              {prompt.author.name}
            </span>
            <span className="text-[10px] text-slate-500 font-sans truncate max-w-[100px]" title={prompt.author.role}>
              {prompt.author.role}
            </span>
          </div>
        </div>

        {/* Metrics & Main Cta Actions */}
        <div className="flex items-center gap-1.5">
          {/* Usage counter */}
          <span className="text-[11px] font-mono font-medium text-emerald-500 mr-2 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
            <Award className="w-3 h-3" />
            <span>{(prompt.usageCount / 1000).toFixed(1)}k</span>
          </span>

          {/* Quick Copy button */}
          <button
            onClick={handleCopy}
            className={`p-2 rounded-lg border flex items-center justify-center transition-all duration-200 cursor-pointer ${
              copied
                ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                : "bg-[#15181D] border-[#262B33] text-slate-400 hover:text-white hover:border-[#3B82F6] hover:bg-[#3B82F6]/10"
            }`}
            title="Copy Prompt Content"
          >
            {copied ? <Check className="w-3.5 h-3.5 animate-bounce" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Detailed View button */}
          <button
            onClick={() => onView(prompt)}
            className="p-2 rounded-lg border bg-[#15181D] border-[#262B33] text-[#8B5CF6] hover:text-white hover:border-[#8B5CF6] hover:bg-[#8B5CF6]/10 transition-all duration-200 cursor-pointer"
            title="Expand Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
