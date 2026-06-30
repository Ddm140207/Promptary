import { 
  Home, Flame, Bookmark, GitBranch, PlusCircle, 
  BrainCircuit 
} from "lucide-react";
import { motion } from "motion/react";

interface SidebarProps {
  activeView: "all" | "trending" | "saved" | "contributed" | "create";
  onSetView: (view: "all" | "trending" | "saved" | "contributed" | "create") => void;
  categories: string[];
  activeCategory: string | null;
  onSetCategory: (category: string | null) => void;
  savedCount: number;
  contributedCount: number;
}

export default function Sidebar({
  activeView,
  onSetView,
  categories,
  activeCategory,
  onSetCategory,
  savedCount,
  contributedCount
}: SidebarProps) {
  
  const navItems = [
    { id: "all", label: "Home Explorer", icon: Home, badge: null },
    { id: "trending", label: "Trending Prompts", icon: Flame, badge: "HOT" },
    { id: "saved", label: "My Saved Library", icon: Bookmark, badge: savedCount > 0 ? savedCount : null },
    { id: "contributed", label: "My Contributions", icon: GitBranch, badge: contributedCount > 0 ? contributedCount : null },
  ] as const;

  return (
    <aside id="promptary_sidebar" className="w-full md:w-64 bg-[#15181D] border-b md:border-b-0 md:border-r border-[#262B33] flex flex-col justify-between shrink-0 select-none">
      
      {/* Upper Area */}
      <div className="p-5 space-y-7">
        
        {/* Brand Header */}
        <div 
          onClick={() => { onSetView("all"); onSetCategory(null); }}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 bg-gradient-to-tr from-[#8B5CF6] to-[#3B82F6] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display font-extrabold text-lg text-white leading-none tracking-tight">
              Promptary
            </h1>
            <span className="text-[10px] font-mono text-[#8B5CF6] tracking-wider uppercase font-bold">
              Data Science Hub
            </span>
          </div>
        </div>

        {/* CTA: Create New Prompt */}
        <button
          onClick={() => onSetView("create")}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:from-[#7c4fe3] hover:to-[#2d73e5] text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publish Blueprint</span>
        </button>

        {/* Main Navigation */}
        <div className="space-y-1">
          <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold px-2 mb-2">
            Workspace
          </span>

          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isSelected = activeView === item.id && activeCategory === null;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSetView(item.id);
                  onSetCategory(null); // Clear category filter when changing view
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium font-sans transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-[#8B5CF6]/15 text-[#C084FC]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-[#1a1e24]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <IconComponent className={`w-4 h-4 ${isSelected ? "text-[#8B5CF6]" : "text-slate-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && (
                  <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                    item.badge === "HOT" 
                      ? "bg-rose-500/20 text-rose-400" 
                      : "bg-[#262B33] text-slate-400"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Category Filters */}
        <div className="space-y-1 pt-2">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="block text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold">
              Filter Categories
            </span>
            {activeCategory && (
              <button
                onClick={() => onSetCategory(null)}
                className="text-[9px] font-mono text-[#8B5CF6] hover:underline cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <div className="space-y-0.5 max-h-[190px] overflow-y-auto pr-1">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => {
                    onSetCategory(cat);
                    // Ensure we are in a prompt explorer view
                    if (activeView === "create") {
                      onSetView("all");
                    }
                  }}
                  className={`w-full text-left truncate px-3 py-2 rounded-lg text-xs transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? "bg-sky-500/10 border-l-2 border-sky-500 text-sky-400 font-semibold pl-2"
                      : "text-slate-400 hover:text-slate-200 hover:bg-[#1a1e24] pl-3"
                  }`}
                  title={cat}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Footer Area removed */}

    </aside>
  );
}
