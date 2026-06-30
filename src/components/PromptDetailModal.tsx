import { useState } from "react";
import { Prompt } from "../types";
import { 
  X, Copy, Check, Bookmark, GitFork, 
  Linkedin, Github, Terminal, Code, Cpu,
  ThumbsUp, ThumbsDown, Sparkles, Trash2, AlertTriangle
} from "lucide-react";
import { motion } from "motion/react";
import { getAvatarGradient } from "../utils/avatar";
import { useAuth } from "../lib/AuthContext";

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
  onDelete?: (promptId: string) => void;
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
  onDislike,
  onDelete
}: PromptDetailModalProps) {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"text" | "cli">("text");
  const [activeLang, setActiveLang] = useState<"pip" | "python" | "curl">("pip");
  const [codeCopied, setCodeCopied] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const likesCount = Math.floor((prompt.usageCount || 0) * 0.12) + (isLiked ? 1 : 0);
  const dislikesCount = Math.floor((prompt.usageCount || 0) * 0.005) + (isDisliked ? 1 : 0);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyCode = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
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
                  <div className={`w-10 h-10 bg-gradient-to-tr ${getAvatarGradient(prompt.author.name)} rounded-full flex items-center justify-center font-bold text-white text-sm uppercase shadow`}>
                    {prompt.author.name === "Promptary CLI" ? (
                      <Sparkles className="w-5 h-5 text-amber-200 fill-amber-200/20" />
                    ) : prompt.author.name ? (
                      prompt.author.name.charAt(0)
                    ) : (
                      "DS"
                    )}
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

          {/* Tab Selector & Content Area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#262B33]/80 pb-2">
              <div className="flex items-center gap-1 bg-[#101317] p-1 rounded-xl border border-[#20252D]">
                <button
                  type="button"
                  onClick={() => setActiveTab("text")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "text"
                      ? "bg-[#8B5CF6]/10 text-[#C084FC] border border-[#8B5CF6]/30 font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Prompt Text</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("cli")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-1.5 cursor-pointer ${
                    activeTab === "cli"
                      ? "bg-[#3B82F6]/10 text-[#60A5FA] border border-[#3B82F6]/30 font-bold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>API & CLI Integration</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Working API endpoint active" />
                </button>
              </div>

              {/* Status Label */}
              <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-[#8B5CF6]" />
                <span>ID: <span className="text-slate-300 font-bold">{prompt.id}</span></span>
              </div>
            </div>

            {/* TAB 1: Raw Prompt Text Viewer */}
            {activeTab === "text" && (
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
            )}

            {/* TAB 2: Developer API & CLI Integration */}
            {activeTab === "cli" && (
              <div className="bg-[#090C10] border border-[#262B33] rounded-xl p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-semibold text-slate-200">Integrate Blueprint Dynamically</h4>
                    <p className="text-[10px] text-slate-400">Fetch this expert prompt in real-time within your production environments.</p>
                  </div>

                  {/* Sub-tab switcher */}
                  <div className="flex items-center gap-1 bg-[#15181D] p-0.5 border border-[#20252D] rounded-lg">
                    {(["pip", "python", "curl"] as const).map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => setActiveLang(lang)}
                        className={`px-2 py-1 text-[10px] font-mono rounded-md transition-all cursor-pointer ${
                          activeLang === lang
                            ? "bg-slate-700 text-white font-bold"
                            : "text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {lang === "pip" ? "pip CLI" : lang === "python" ? "Python" : "cURL"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Integration Details / Code Content */}
                <div className="relative">
                  {activeLang === "pip" && (
                    <div className="space-y-3">
                      <div className="bg-[#15181D] border border-[#20252D] rounded-lg p-3 font-mono text-[11px] text-slate-300 space-y-2">
                        <div className="text-slate-500"># 1. Install the official Promptary python CLI tool</div>
                        <div className="flex items-center justify-between bg-black/40 p-2 rounded border border-white/5">
                          <span className="text-purple-400">pip install <span className="text-white">promptary-cli</span></span>
                          <button
                            onClick={() => handleCopyCode("pip install promptary-cli")}
                            className="text-slate-500 hover:text-white"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-slate-500 mt-2"># 2. Retrieve this blueprint by ID dynamically</div>
                        <div className="flex items-center justify-between bg-black/40 p-2 rounded border border-white/5">
                          <span className="text-sky-400">promptary pull <span className="text-emerald-400">{prompt.id}</span></span>
                          <button
                            onClick={() => handleCopyCode(`promptary pull ${prompt.id}`)}
                            className="text-slate-500 hover:text-white"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="text-[10px] font-sans text-slate-400 flex items-center gap-2 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/40">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                        <span>The CLI pulls, formats, and outputs variables directly into your active python workspace environments.</span>
                      </div>
                    </div>
                  )}

                  {activeLang === "python" && (
                    <div className="space-y-3">
                      <div className="bg-[#15181D] border border-[#20252D] rounded-lg p-3 font-mono text-[11px] text-slate-300 overflow-x-auto">
                        <span className="text-pink-400">import</span> requests<br />
                        <br />
                        <span className="text-slate-500"># Fetch the live blueprint from Promptary repository</span><br />
                        url = <span className="text-emerald-400">f"{window.location.origin}/api/prompts/{prompt.id}/raw"</span><br />
                        prompt_template = requests.get(url).text<br />
                        <br />
                        print(<span className="text-emerald-400">f"Loaded blueprint prompt successfully!"</span>)<br />
                        print(prompt_template[:<span className="text-amber-400">120</span>] + <span className="text-emerald-400">"..."</span>)
                      </div>
                      <button
                        onClick={() => handleCopyCode(`import requests\n\nurl = f"${window.location.origin}/api/prompts/${prompt.id}/raw"\nprompt_template = requests.get(url).text\nprint(f"Loaded blueprint prompt successfully!")\nprint(prompt_template[:120] + "...")`)}
                        className="absolute top-2 right-2 p-1.5 bg-[#1C2026] hover:bg-slate-700 border border-[#2D343F] rounded-md text-slate-400 hover:text-white transition-colors"
                        title="Copy Python Script"
                      >
                        {codeCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <div className="text-[10px] font-sans text-slate-400 flex items-center gap-2 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/40">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>This python integration fetches prompt contents dynamically in production, allowing instant OTA prompt updates.</span>
                      </div>
                    </div>
                  )}

                  {activeLang === "curl" && (
                    <div className="space-y-3">
                      <div className="bg-[#15181D] border border-[#20252D] rounded-lg p-3 font-mono text-[11px] text-slate-300 relative">
                        <div className="text-slate-500"># Direct cURL download (Returns raw prompt plain-text)</div>
                        <div className="text-sky-400 select-all whitespace-pre-wrap break-all pr-8 mt-1">
                          curl -s "{window.location.origin}/api/prompts/{prompt.id}/raw"
                        </div>
                        <button
                          onClick={() => handleCopyCode(`curl -s "${window.location.origin}/api/prompts/${prompt.id}/raw"`)}
                          className="absolute top-2 right-2 p-1.5 bg-[#1C2026] hover:bg-slate-700 border border-[#2D343F] rounded-md text-slate-400 hover:text-white transition-colors"
                          title="Copy curl command"
                        >
                          {codeCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                      <div className="text-[10px] font-sans text-slate-400 flex items-center gap-2 bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/40">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span>You can pipe this directly into LLM chain files, automated agents, or serverless functions. Try pasting it into your terminal!</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
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
            {prompt.isCustom && user && prompt.userId === user.uid && (
              <>
                {showConfirmDelete ? (
                  <div className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/35 rounded-xl px-3 py-1.5 text-xs">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                    <span className="text-rose-200 font-mono font-medium">Permanently delete?</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (onDelete) onDelete(prompt.id);
                        setShowConfirmDelete(false);
                      }}
                      className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold transition-all cursor-pointer text-xs"
                    >
                      Yes, Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowConfirmDelete(false)}
                      className="px-2.5 py-1 bg-[#1E293B] hover:bg-slate-800 text-slate-300 rounded-lg transition-all cursor-pointer border border-[#262B33] text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowConfirmDelete(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 rounded-xl text-sm transition-all cursor-pointer"
                    title="Permanently delete your custom blueprint"
                  >
                    <Trash2 className="w-4 h-4 text-rose-400" />
                    <span>Delete</span>
                  </button>
                )}
              </>
            )}

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
