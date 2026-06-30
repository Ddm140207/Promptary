import { 
  Home, Flame, Bookmark, GitBranch, PlusCircle, 
  BrainCircuit, LogIn, LogOut
} from "lucide-react";
import { motion } from "motion/react";
import { useAuth } from "../lib/AuthContext";

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
  const { user, signInWithGoogle, logOut } = useAuth();
  
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
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="relative">
            {/* Glowing backdrop circle */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#8B5CF6] to-[#3B82F6] rounded-xl blur-md opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
            
            {/* Actual Icon Container */}
            <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
              <img src="/favicon.svg" alt="Promptary Logo" className="w-10 h-10 rounded-xl shadow-xl border border-white/20" />
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="font-sans font-black text-xl text-white tracking-tight leading-none bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent group-hover:text-purple-300 transition-colors duration-300">
              Promptary
            </h1>
            <span className="text-[9px] font-mono text-[#A78BFA] tracking-widest uppercase font-black mt-1">
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

      {/* Footer / User Profile Area */}
      <div className="p-4 border-t border-[#262B33] bg-[#111418]">
        {user ? (
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "User"}
                  referrerPolicy="no-referrer"
                  className="w-8 h-8 rounded-full border border-[#8B5CF6]/30 shadow"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#8B5CF6] to-[#3B82F6] flex items-center justify-center font-bold text-white text-xs">
                  {user.displayName?.charAt(0) || "U"}
                </div>
              )}
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-white truncate leading-none">
                  {user.displayName || "Data Scientist"}
                </span>
                <span className="text-[10px] text-slate-500 truncate mt-1">
                  {user.email}
                </span>
              </div>
            </div>
            <button
              onClick={logOut}
              className="p-1.5 rounded-lg border border-[#262B33] hover:border-rose-500/30 text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all text-xs cursor-pointer shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#1C1F24] hover:bg-[#23282F] border border-[#262B33] hover:border-[#8B5CF6]/30 text-slate-200 hover:text-white text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer shadow-sm"
          >
            <LogIn className="w-3.5 h-3.5 text-[#C084FC]" />
            <span>Sign In with Google</span>
          </button>
        )}
      </div>

    </aside>
  );
}
