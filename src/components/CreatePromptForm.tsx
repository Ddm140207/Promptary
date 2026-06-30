import React, { useState } from "react";
import { Prompt } from "../types";
import { Plus, User, FileText, Sparkles, PlusCircle, ArrowLeft, Send } from "lucide-react";
import { motion } from "motion/react";

interface CreatePromptFormProps {
  onPublish: (newPrompt: Prompt) => void;
  onCancel: () => void;
  categories: string[];
  forkSource?: Prompt | null;
  key?: React.Key;
}

export default function CreatePromptForm({ onPublish, onCancel, categories, forkSource }: CreatePromptFormProps) {
  // Author State
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [authorLinkedin, setAuthorLinkedin] = useState("");
  const [authorGithub, setAuthorGithub] = useState("");

  // Prompt State
  const [title, setTitle] = useState(
    forkSource 
      ? (forkSource.title.includes("(Fork)") ? forkSource.title : `${forkSource.title} (Fork)`)
      : ""
  );
  const [category, setCategory] = useState(
    forkSource ? forkSource.category : (categories[0] || "Exploratory Data Analysis (EDA)")
  );
  const [description, setDescription] = useState(forkSource ? forkSource.description : "");
  const [promptText, setPromptText] = useState(forkSource ? forkSource.prompt : "");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(forkSource ? forkSource.tags : []);

  // Errors state
  const [errors, setErrors] = useState<Record<string, string>>({});

  const quickTags = [
    "Python", "Pandas", "SQL", "Machine Learning", 
    "Visualization", "EDA", "Deep Learning", "Pre-processing", 
    "Big Data", "Spark", "RAG", "Prompting", "Postgres"
  ];

  const handleAddQuickTag = (tag: string) => {
    const formattedTag = tag.toLowerCase().replace(/\s+/g, "-");
    if (!tags.includes(formattedTag)) {
      setTags([...tags, formattedTag]);
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(tags.filter((_, idx) => idx !== indexToRemove));
  };

  const validateForm = () => {
    const tempErrors: Record<string, string> = {};
    if (!authorName.trim()) tempErrors.authorName = "Your name is required.";
    if (!authorRole.trim()) tempErrors.authorRole = "Your profession or role is required.";
    if (!title.trim()) tempErrors.title = "Prompt title is required.";
    if (!description.trim()) tempErrors.description = "A short description is required.";
    if (!promptText.trim()) tempErrors.promptText = "Prompt content cannot be empty.";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Combine manual tag inputs if any
    let finalTags = [...tags];
    if (tagInput.trim()) {
      const parsedTags = tagInput
        .split(",")
        .map(t => t.trim().toLowerCase().replace(/\s+/g, "-"))
        .filter(t => t.length > 0 && !finalTags.includes(t));
      finalTags = [...finalTags, ...parsedTags];
    }

    const newPrompt: Prompt = {
      id: "p_user_" + Date.now(),
      title,
      category,
      description,
      prompt: promptText,
      tags: finalTags.length > 0 ? finalTags : ["data-science"],
      author: {
        name: authorName,
        role: authorRole,
        linkedin: authorLinkedin.trim() || undefined,
        github: authorGithub.trim() || undefined
      },
      usageCount: 1,
      isCustom: true,
      forkedFrom: forkSource ? forkSource.id : undefined,
      forkedFromAuthor: forkSource ? forkSource.author.name : undefined
    };

    onPublish(newPrompt);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto bg-[#15181D] border border-[#262B33] rounded-2xl overflow-hidden glow-purple p-6 md:p-8 space-y-8"
    >
      {/* Form header */}
      <div className="flex items-center justify-between border-b border-[#262B33] pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-lg border border-[#262B33] text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-2xl font-display font-bold text-white tracking-tight">Create AI Prompt</h2>
            <p className="text-xs text-slate-400 font-sans font-light mt-0.5">Share your expert prompt blueprints with the community.</p>
          </div>
        </div>
        <Sparkles className="w-6 h-6 text-[#8B5CF6] animate-pulse-slow" />
      </div>

      {forkSource && (
        <div className="p-4 bg-sky-500/10 border border-sky-500/25 rounded-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-sky-400 rounded-full animate-pulse" />
            <span className="text-xs text-sky-300 font-mono">
              Forking blueprint based on <span className="text-white font-bold">{forkSource.author.name}</span>'s prompt: <span className="italic text-sky-400">"{forkSource.title}"</span>.
            </span>
          </div>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-sky-500/20 text-sky-300 rounded border border-sky-500/30">
            Fork Mode
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Step 1: Creator Bio */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
            <User className="w-4 h-4 text-[#8B5CF6]" />
            <span>1. Creator Professional Bio</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-400 font-mono mb-1.5">Full Name *</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="e.g. David Diaz"
                className={`w-full bg-[#0D0F12] border rounded-lg p-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors ${
                  errors.authorName ? "border-rose-500 focus:border-rose-500" : "border-[#262B33] focus:border-[#8B5CF6]"
                }`}
              />
              {errors.authorName && <span className="text-[11px] text-rose-500 mt-1 block">{errors.authorName}</span>}
            </div>

            <div>
              <label className="block text-xs text-slate-400 font-mono mb-1.5">Professional Role / Focus *</label>
              <input
                type="text"
                value={authorRole}
                onChange={(e) => setAuthorRole(e.target.value)}
                placeholder="e.g. Data Scientist / ML Engineer"
                className={`w-full bg-[#0D0F12] border rounded-lg p-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors ${
                  errors.authorRole ? "border-rose-500 focus:border-rose-500" : "border-[#262B33] focus:border-[#8B5CF6]"
                }`}
              />
              {errors.authorRole && <span className="text-[11px] text-rose-500 mt-1 block">{errors.authorRole}</span>}
            </div>

            <div>
              <label className="block text-xs text-slate-400 font-mono mb-1.5">LinkedIn URL (optional)</label>
              <input
                type="url"
                value={authorLinkedin}
                onChange={(e) => setAuthorLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/..."
                className="w-full bg-[#0D0F12] border border-[#262B33] rounded-lg p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#8B5CF6] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 font-mono mb-1.5">GitHub URL (optional)</label>
              <input
                type="url"
                value={authorGithub}
                onChange={(e) => setAuthorGithub(e.target.value)}
                placeholder="https://github.com/..."
                className="w-full bg-[#0D0F12] border border-[#262B33] rounded-lg p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#8B5CF6] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Prompt Details */}
        <div className="space-y-4">
          <h3 className="text-xs uppercase tracking-wider text-slate-400 font-mono flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#3B82F6]" />
            <span>2. Prompt Blueprint Metadata</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs text-slate-400 font-mono mb-1.5">Prompt Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Advanced Customer Segmentation"
                className={`w-full bg-[#0D0F12] border rounded-lg p-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors ${
                  errors.title ? "border-rose-500 focus:border-rose-500" : "border-[#262B33] focus:border-[#8B5CF6]"
                }`}
              />
              {errors.title && <span className="text-[11px] text-rose-500 mt-1 block">{errors.title}</span>}
            </div>

            <div>
              <label className="block text-xs text-slate-400 font-mono mb-1.5">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-[#0D0F12] border border-[#262B33] rounded-lg p-3 text-sm text-white focus:outline-none focus:border-[#8B5CF6] transition-colors appearance-none cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 font-mono mb-1.5">Short Case Study Description *</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain the specific objective, dataset context, or target framework."
              className={`w-full bg-[#0D0F12] border rounded-lg p-3 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors ${
                errors.description ? "border-rose-500 focus:border-rose-500" : "border-[#262B33] focus:border-[#8B5CF6]"
              }`}
            />
            {errors.description && <span className="text-[11px] text-rose-500 mt-1 block">{errors.description}</span>}
          </div>

          <div>
            <label className="block text-xs text-slate-400 font-mono mb-1.5">Full Prompt Template Content *</label>
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              rows={8}
              placeholder="Act as an expert data scientist specializing in... Write a clean, well-documented python code block..."
              className={`w-full bg-[#0D0F12] border rounded-lg p-4 font-mono text-xs text-emerald-400 placeholder-slate-600 leading-relaxed focus:outline-none transition-colors ${
                errors.promptText ? "border-rose-500 focus:border-rose-500" : "border-[#262B33] focus:border-[#8B5CF6]"
              }`}
            />
            {errors.promptText && <span className="text-[11px] text-rose-500 mt-1 block">{errors.promptText}</span>}
          </div>
        </div>

        {/* Step 3: Tags */}
        <div className="space-y-3">
          <label className="block text-xs text-slate-400 font-mono">3. Taxonomy Tags</label>
          
          {/* Tag input */}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add manual tags (comma-separated, e.g. pandas, optuna)"
            className="w-full bg-[#0D0F12] border border-[#262B33] rounded-lg p-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-[#8B5CF6] transition-colors"
          />

          {/* Render active tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-[#38BDF8] bg-[#0D0F12] border border-sky-500/20 px-2.5 py-1 rounded-lg"
                >
                  <span>#{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(idx)}
                    className="text-slate-500 hover:text-rose-400 font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Quick tags suggestions */}
          <div className="space-y-2">
            <span className="block text-[10px] uppercase font-mono text-slate-500 tracking-wider">Quick Pick Tags</span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 bg-[#0D0F12] border border-[#20252D] rounded-xl">
              {quickTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleAddQuickTag(tag)}
                  className="text-xs font-mono px-2.5 py-1 bg-[#15181D] hover:bg-[#8B5CF6]/10 text-slate-400 hover:text-white border border-[#262B33] hover:border-[#8B5CF6] rounded-lg transition-all duration-150 flex items-center gap-1 cursor-pointer"
                >
                  <PlusCircle className="w-3 h-3" />
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action row buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#262B33]">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 bg-[#1E293B] hover:bg-slate-800 border border-[#262B33] text-slate-300 hover:text-white rounded-xl text-sm transition-all cursor-pointer"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:from-[#7c4fe3] hover:to-[#2d73e5] text-white font-medium rounded-xl text-sm transition-all shadow-lg hover:shadow-purple-500/10 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Publish Blueprint</span>
          </button>
        </div>
      </form>
    </motion.div>
  );
}
