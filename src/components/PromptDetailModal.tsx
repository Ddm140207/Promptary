import { useState } from "react";
import { Prompt } from "../types";
import { 
  X, Copy, Check, Bookmark, GitFork, 
  Linkedin, Github, Terminal,
  ThumbsUp, ThumbsDown
} from "lucide-react";
import { motion } from "motion/react";

interface PromptDetailModalProps {
  prompt: Prompt;
  onClose: () => void;
  onToggleSave: (promptId: string) => void;
  isSaved: boolean;
  onForkClick: (prompt: Prompt) => void;
  isLiked: boolean;
  isDisliked: boolean;
  onLike: (promptId: string) => void;
  onDislike: (promptId: string) => void;
}

export default function PromptDetailModal({ 
  prompt, 
  onClose, 
  onToggleSave, 
  isSaved,
  onForkClick,
  isLiked,
  isDisliked,
  onLike,
  onDislike
}: PromptDetailModalProps) {
  const [copied, setCopied] = useState(false);

  const likesCount = Math.floor((prompt.usageCount || 0) * 0.12) + (isLiked ? 1 : 0);
  const dislikesCount = Math.floor((prompt.usageCount || 0) * 0.005) + (isDisliked ? 1 : 0);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleForkClick = () => {
    onForkClick(prompt);
    onClose();
  };

  return (
    <div id="prompt_detail_modal" className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#15181D] border border-[#262B33] rounded-2xl flex flex-col shadow-2xl overflow-hidden glow-purple"
      >
        {/* Header toolbar */}
        <div className="flex items-center justify-between p-5 border-b border-[#262B33] bg-[#1a1e24]/50">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono px-2.5 py-1 bg-violet-500/10 border border-violet-500/20 rounded text-[#8B5CF6]">
              {prompt.category}
            </span>
            <span className="text-xs font-mono text-slate-500">
              ID: {prompt.id}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Section: Title, Description, and Author card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3">
              <h2 className="text-2xl font-display font-bold text-white tracking-tight">
                {prompt.title}
              </h2>
              <p className="text-sm text-slate-400 font-sans font-light leading-relaxed">
                {prompt.description}
              </p>
              {prompt.forkedFromAuthor && (
                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mt-3 bg-sky-500/5 border border-sky-500/10 px-3 py-2 rounded-lg w-fit">
                  <span className="w-1.5 h-1.5 bg-sky-400 rounded-full animate-pulse" />
                  <span>Based on prompt of <span className="text-sky-400 font-semibold">{prompt.forkedFromAuthor}</span></span>
                </div>
              )}
            </div>

            {/* Author card card */}
            <div className="bg-[#0D0F12] border border-[#262B33] rounded-xl p-4 flex flex-col justify-between space-y-3">
              <div>
                <h4 className="text-xs uppercase tracking-wider text-slate-500 font-mono mb-2">Author Profile</h4>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-gradient-to-tr from-[#8B5CF6] to-[#3B82F6] rounded-full flex items-center justify-center font-bold text-white text-sm uppercase">
                    {prompt.author.name ? prompt.author.name.charAt(0) : "DS"}
                  </div>
                  <div>
                    <h5 className="text-sm text-slate-100 font-medium font-sans">
                      {prompt.author.name}
                    </h5>
                    <p className="text-xs text-slate-500 font-sans">
                      {prompt.author.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Author Links */}
              <div className="flex items-center gap-2">
                {prompt.author.linkedin && (
                  <a
                    href={prompt.author.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded bg-[#15181D] hover:bg-[#8B5CF6]/10 text-slate-400 hover:text-[#8B5CF6] border border-[#20252D] transition-colors"
                  >
                    <Linkedin className="w-3.5 h-3.5" />
                  </a>
                )}
                {prompt.author.github && (
                  <a
                    href={prompt.author.github}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded bg-[#15181D] hover:bg-slate-700 text-slate-400 hover:text-white border border-[#20252D] transition-colors"
                  >
                    <Github className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Prompt text viewer */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-purple-400" />
                <span>Blueprint Prompt Content</span>
              </label>
            </div>

            {/* Prompt box */}
            <div className="relative border border-[#262B33] bg-[#0D0F12] rounded-xl overflow-hidden">
              <pre className="p-5 font-mono text-xs text-emerald-400 leading-relaxed overflow-x-auto whitespace-pre-wrap max-h-[350px]">
                {prompt.prompt}
              </pre>

              {/* Floating quick copy */}
              <button
                onClick={handleCopy}
                className="absolute bottom-4 right-4 p-2 bg-[#15181D]/80 border border-[#262B33] hover:border-slate-500 rounded-lg text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-sm"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[10px] font-mono text-emerald-500">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-mono">Copy Blueprint</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-5 border-t border-[#262B33] bg-[#1a1e24]/50">
          <div className="flex items-center gap-2">
            {/* Toggle save action */}
            <button
              onClick={() => onToggleSave(prompt.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 border rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                isSaved
                  ? "bg-[#8B5CF6]/10 border-[#8B5CF6] text-[#8B5CF6] hover:bg-transparent hover:border-[#262B33] hover:text-slate-400"
                  : "bg-transparent border-[#262B33] text-slate-300 hover:border-slate-500 hover:text-white"
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? "fill-current" : ""}`} />
              <span>{isSaved ? "Saved in Library" : "Save to Library"}</span>
            </button>

            {/* Like button */}
            <button
              onClick={() => onLike(prompt.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 border rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                isLiked
                  ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
                  : "bg-transparent border-[#262B33] text-slate-300 hover:border-emerald-500/50 hover:text-emerald-400"
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${isLiked ? "fill-current text-emerald-400" : ""}`} />
              <span>Like ({likesCount})</span>
            </button>

            {/* Dislike button */}
            <button
              onClick={() => onDislike(prompt.id)}
              className={`inline-flex items-center gap-2 px-4 py-2 border rounded-xl text-sm transition-all duration-200 cursor-pointer ${
                isDisliked
                  ? "bg-rose-500/10 border-rose-500 text-rose-400"
                  : "bg-transparent border-[#262B33] text-slate-300 hover:border-rose-500/50 hover:text-rose-400"
              }`}
            >
              <ThumbsDown className={`w-4 h-4 ${isDisliked ? "fill-current text-rose-400" : ""}`} />
              <span>Dislike ({dislikesCount})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleForkClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1E293B] hover:bg-slate-800 border border-[#262B33] text-white rounded-xl text-sm transition-all cursor-pointer"
            >
              <GitFork className="w-4 h-4 text-sky-400" />
              <span>Fork Blueprint</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
