import React, { useState, useEffect } from "react";
import { initialPrompts } from "./initialPrompts";
import { Prompt } from "./types";
import WelcomeScreen from "./components/WelcomeScreen";
import Sidebar from "./components/Sidebar";
import PromptCard from "./components/PromptCard";
import PromptDetailModal from "./components/PromptDetailModal";
import CreatePromptForm from "./components/CreatePromptForm";
import { 
  Search, Sparkles, AlertCircle, Library, Info, 
  ChevronRight, Award, Flame, BookmarkCheck, GitBranch, Plus 
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { collection, query, orderBy, onSnapshot, doc, setDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "./lib/firebase";
import { useAuth } from "./lib/AuthContext";

export default function App() {
  const { user } = useAuth();

  // 1. Core States
  const [welcomed, setWelcomed] = useState<boolean>(() => {
    return localStorage.getItem("promptary_welcomed") === "true";
  });

  const [customDbPrompts, setCustomDbPrompts] = useState<Prompt[]>([]);
  const [dbSyncError, setDbSyncError] = useState<string | null>(null);

  // 1b. Real-time Firebase Sync for Contributed Prompts
  useEffect(() => {
    const q = query(collection(db, "prompts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Prompt[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          list.push({
            id: doc.id,
            title: data.title,
            category: data.category,
            description: data.description,
            prompt: data.prompt,
            tags: data.tags || [],
            author: {
              name: data.author?.name || "Contributor",
              role: data.author?.role || "Developer",
              github: data.author?.github || undefined,
              linkedin: data.author?.linkedin || undefined
            },
            usageCount: data.usageCount || 1,
            isCustom: true,
            isTrending: data.isTrending || false,
            forkedFrom: data.forkedFrom || undefined,
            forkedFromAuthor: data.forkedFromAuthor || undefined,
            userId: data.userId || undefined
          });
        });
        setCustomDbPrompts(list);
        setDbSyncError(null);
      },
      (error) => {
        console.error("Firestore onSnapshot Sync Error: ", error);
        setDbSyncError(error.message || String(error));
      }
    );
    return () => unsubscribe();
  }, []);

  const prompts = [...customDbPrompts, ...initialPrompts];

  const [savedIds, setSavedIds] = useState<string[]>(() => {
    const local = localStorage.getItem("promptary_saved_ids");
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [likedIds, setLikedIds] = useState<string[]>(() => {
    const local = localStorage.getItem("promptary_liked_ids");
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [dislikedIds, setDislikedIds] = useState<string[]>(() => {
    const local = localStorage.getItem("promptary_disliked_ids");
    if (local) {
      try {
        return JSON.parse(local);
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  const [activeView, setActiveView] = useState<"all" | "trending" | "saved" | "contributed" | "create">("all");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [forkSource, setForkSource] = useState<Prompt | null>(null);

  // Pagination count multiplier state (for showing 6 initially, then "Load more")
  const [visibleCount, setVisibleCount] = useState<Record<string, number>>({});

  // 2. Synchronize to LocalStorage
  useEffect(() => {
    localStorage.setItem("promptary_saved_ids", JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    localStorage.setItem("promptary_liked_ids", JSON.stringify(likedIds));
  }, [likedIds]);

  useEffect(() => {
    localStorage.setItem("promptary_disliked_ids", JSON.stringify(dislikedIds));
  }, [dislikedIds]);

  // 3. Category definitions
  const categories = [
    "Exploratory Data Analysis (EDA)",
    "Data Cleaning",
    "Machine Learning",
    "Data Visualization",
    "SQL & Databases",
    "Python Utilities",
    "AI Workflows",
    "Debugging"
  ];

  // 4. Handle core events
  const handleEnterPlatform = () => {
    localStorage.setItem("promptary_welcomed", "true");
    setWelcomed(true);
  };

  const handleToggleSave = (promptId: string) => {
    setSavedIds((prev) => {
      if (prev.includes(promptId)) {
        return prev.filter((id) => id !== promptId);
      } else {
        return [...prev, promptId];
      }
    });
  };

  const handleLikePrompt = (promptId: string) => {
    setLikedIds((prev) => {
      if (prev.includes(promptId)) {
        return prev.filter((id) => id !== promptId);
      } else {
        setDislikedIds((dPrev) => dPrev.filter((id) => id !== promptId));
        return [...prev, promptId];
      }
    });
  };

  const handleDislikePrompt = (promptId: string) => {
    setDislikedIds((prev) => {
      if (prev.includes(promptId)) {
        return prev.filter((id) => id !== promptId);
      } else {
        setLikedIds((lPrev) => lPrev.filter((id) => id !== promptId));
        return [...prev, promptId];
      }
    });
  };

  const handlePublishNewPrompt = async (newPrompt: Prompt) => {
    if (!user) {
      console.error("Must be logged in to publish a blueprint.");
      return;
    }

    const docId = "p_user_" + Date.now();
    const docRef = doc(db, "prompts", docId);

    try {
      await setDoc(docRef, {
        id: docId,
        title: newPrompt.title,
        category: newPrompt.category,
        description: newPrompt.description,
        prompt: newPrompt.prompt,
        tags: newPrompt.tags,
        author: {
          name: newPrompt.author.name,
          role: newPrompt.author.role,
          github: newPrompt.author.github || null,
          linkedin: newPrompt.author.linkedin || null
        },
        usageCount: 1,
        isCustom: true,
        isTrending: false,
        forkedFrom: newPrompt.forkedFrom || null,
        forkedFromAuthor: newPrompt.forkedFromAuthor || null,
        userId: user.uid,
        createdAt: serverTimestamp()
      });

      if (newPrompt.forkedFrom) {
        setSavedIds((prev) => {
          if (!prev.includes(docId)) {
            return [...prev, docId];
          }
          return prev;
        });
      }
      setActiveView("all");
      setActiveCategory(null);
      setForkSource(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, `prompts/${docId}`);
    }
  };

  const handleForkPrompt = (prompt: Prompt) => {
    setForkSource(prompt);
    setActiveView("create");
    setSelectedPrompt(null);
  };

  const handleDeletePrompt = async (promptId: string) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "prompts", promptId));
      setSelectedPrompt(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `prompts/${promptId}`);
    }
  };

  // 5. Query processing and calculations
  const filteredPrompts = prompts.filter((p) => {
    // 5a. Search filter
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // 5b. View filter
    if (activeView === "trending" && !p.isTrending) return false;
    if (activeView === "saved" && !savedIds.includes(p.id)) return false;
    
    if (activeView === "contributed") {
      if (!p.isCustom) return false;
      if (!user || p.userId !== user.uid) return false;
    }

    // 5c. Category filter
    if (activeCategory && p.category !== activeCategory) return false;

    return true;
  });

  const trendingPrompts = filteredPrompts.filter((p) => p.isTrending);

  // Group prompts by category for structured dashboard view
  const getPromptsByCategory = (categoryName: string) => {
    return filteredPrompts.filter((p) => p.category === categoryName);
  };

  const handleLoadMoreForCategory = (categoryName: string) => {
    setVisibleCount((prev) => ({
      ...prev,
      [categoryName]: (prev[categoryName] || 6) + 6,
    }));
  };

  // Saved / Contributed stats counters
  const savedCount = savedIds.length;
  const contributedCount = user ? prompts.filter((p) => p.isCustom && p.userId === user.uid).length : 0;

  // 6. Reset welcome state if user wants to play again (optional SRE hook)
  const handleResetWelcome = () => {
    localStorage.removeItem("promptary_welcomed");
    setWelcomed(false);
  };

  // Render entry screen if not yet entered
  if (!welcomed) {
    return <WelcomeScreen onEnter={handleEnterPlatform} />;
  }

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-[#0D0F12] text-slate-200 font-sans grid-bg">
      
      {/* 1. Side Left navigation */}
      <Sidebar
        activeView={activeView}
        onSetView={(view) => {
          setForkSource(null);
          setActiveView(view);
        }}
        categories={categories}
        activeCategory={activeCategory}
        onSetCategory={setActiveCategory}
        savedCount={savedCount}
        contributedCount={contributedCount}
      />

      {/* 2. Main content content area */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {dbSyncError && (
          <div className="bg-amber-500/10 border-b border-amber-500/20 px-6 py-2.5 flex items-center gap-2.5 text-xs text-amber-300">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 animate-pulse" />
            <span>Cloud sync warning: {dbSyncError}. Displaying local and cached templates.</span>
          </div>
        )}

        {/* Top bar search & utilities */}
        <header className="sticky top-0 z-30 h-16 border-b border-[#262B33] bg-[#0D0F12]/80 backdrop-blur-md px-6 flex items-center justify-between gap-4">
          
          {/* Real-time fuzzy query input */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
            <input
              id="search_prompts"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search prompts, technologies, authors..."
              className="w-full bg-[#15181D] border border-[#262B33] focus:border-[#8B5CF6] rounded-xl pl-9 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]/50 transition-all duration-150"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-xs text-slate-500 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Stats/Reset buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetWelcome}
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-mono text-slate-500 hover:text-slate-300 transition-colors"
              title="Show entry animation"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Intro</span>
            </button>

            <button
              onClick={() => {
                setForkSource(null);
                setActiveView("create");
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 hover:border-[#8B5CF6]/50 rounded-xl text-xs font-semibold text-[#C084FC] hover:text-white transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Prompt</span>
            </button>
          </div>
        </header>

        {/* Dynamic Inner Body */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          
          <AnimatePresence mode="wait">
            {activeView === "create" ? (
              // Create view
              <CreatePromptForm
                key="create_view"
                onPublish={handlePublishNewPrompt}
                onCancel={() => {
                  setForkSource(null);
                  setActiveView("all");
                }}
                categories={categories}
                forkSource={forkSource}
              />
            ) : (
              // Dashboard/Stream View
              <motion.div
                key="explore_view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-10"
              >
                
                {/* Hero section (only if not searching/filtering significantly) */}
                {!searchQuery && !activeCategory && activeView === "all" && (
                  <div className="relative bg-[#15181D] border border-[#262B33] rounded-2xl p-6 md:p-8 overflow-hidden glow-purple">
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 to-blue-500/5 pointer-events-none" />
                    
                    <div className="relative z-10 max-w-xl space-y-3">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-full">
                        <Sparkles className="w-3.5 h-3.5 text-[#C084FC] animate-pulse" />
                        <span className="text-[10px] font-mono font-bold text-[#C084FC] uppercase tracking-wider">
                          The Prompt Library for Data Scientists
                        </span>
                      </div>
                      
                      <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight leading-none">
                        Your AI Workflow Blueprint Hub
                      </h2>
                      
                      <p className="text-sm text-slate-400 font-sans font-light leading-relaxed">
                        Never start prompt-engineering from scratch. Deploy expert prompts optimized for EDA, machine learning parameters, pipeline cleaning, and database schemas.
                      </p>
                      
                      <div className="pt-2 flex items-center gap-3">
                        <button
                          onClick={() => {
                            setForkSource(null);
                            setActiveView("create");
                          }}
                          className="px-4 py-2 bg-[#8B5CF6] hover:bg-[#7c4fe3] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow"
                        >
                          Contribute a Prompt
                        </button>
                        <a
                          href="#all-prompts"
                          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium hover:underline"
                        >
                          Browse Categories
                          <ChevronRight className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Filter State Heading */}
                {(activeCategory || searchQuery || activeView !== "all") && (
                  <div className="flex items-center justify-between border-b border-[#262B33] pb-4">
                    <div>
                      <span className="text-xs font-mono text-slate-500 uppercase font-semibold">
                        Filtering active repository
                      </span>
                      <h2 className="text-xl font-display font-bold text-white capitalize mt-0.5 flex items-center gap-2">
                        {activeView === "saved" && <BookmarkCheck className="w-5 h-5 text-emerald-500" />}
                        {activeView === "contributed" && <GitBranch className="w-5 h-5 text-[#8B5CF6]" />}
                        {activeView === "trending" && <Flame className="w-5 h-5 text-rose-500" />}
                        <span>
                          {activeCategory ? activeCategory : `${activeView} Prompts`}
                        </span>
                        {searchQuery && (
                          <span className="text-sm text-slate-500 lowercase font-sans font-normal">
                            matching "{searchQuery}"
                          </span>
                        )}
                      </h2>
                    </div>

                    <button
                      onClick={() => {
                        setActiveCategory(null);
                        setActiveView("all");
                        setSearchQuery("");
                      }}
                      className="text-xs text-slate-400 hover:text-white border border-[#262B33] px-3 py-1.5 rounded-lg hover:bg-[#1a1e24] transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                )}

                {/* 1. Trending Prompts Grid section (only visible when in Explore View and not filtering by category specifically) */}
                {activeView === "all" && !activeCategory && trendingPrompts.length > 0 && (
                  <section className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Flame className="w-5 h-5 text-rose-500 fill-current" />
                      <h3 className="text-lg font-display font-bold text-white tracking-tight">Trending Prompts</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {trendingPrompts.map((prompt) => (
                        <PromptCard
                          key={prompt.id}
                          prompt={prompt}
                          onView={setSelectedPrompt}
                          onToggleSave={handleToggleSave}
                          isSaved={savedIds.includes(prompt.id)}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* 2. Structured Catalog: Categorized Grid lists */}
                {activeView === "all" && !activeCategory ? (
                  // General explorer: show categorized cards, each category listing up to 6 prompts with a "View more"
                  <section id="all-prompts" className="space-y-12">
                    <div className="flex items-center gap-2 border-b border-[#262B33]/60 pb-3">
                      <Library className="w-5 h-5 text-[#3B82F6]" />
                      <h3 className="text-lg font-display font-bold text-white tracking-tight">Knowledge Catalog</h3>
                    </div>

                    {categories.map((cat) => {
                      const catPrompts = getPromptsByCategory(cat);
                      if (catPrompts.length === 0) return null;

                      const maxVisible = visibleCount[cat] || 6;
                      const hasMore = catPrompts.length > maxVisible;
                      const visiblePrompts = catPrompts.slice(0, maxVisible);

                      return (
                        <div key={cat} className="space-y-4">
                          <div className="flex items-center justify-between border-b border-[#20252D] pb-2">
                            <h4 className="text-sm font-display font-bold text-slate-300 tracking-tight flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-[#8B5CF6] rounded-full" />
                              <span>{cat}</span>
                              <span className="text-xs text-slate-500 font-mono font-normal">
                                ({catPrompts.length})
                              </span>
                            </h4>
                            {hasMore && (
                              <button
                                onClick={() => handleLoadMoreForCategory(cat)}
                                className="text-xs text-[#8B5CF6] hover:text-white flex items-center gap-1 font-medium hover:underline"
                              >
                                View all
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {visiblePrompts.map((prompt) => (
                              <PromptCard
                                key={prompt.id}
                                prompt={prompt}
                                onView={setSelectedPrompt}
                                onToggleSave={handleToggleSave}
                                isSaved={savedIds.includes(prompt.id)}
                              />
                            ))}
                          </div>

                          {/* Category view more button at bottom if needed */}
                          {hasMore && (
                            <div className="pt-2 flex justify-center">
                              <button
                                onClick={() => handleLoadMoreForCategory(cat)}
                                className="px-4 py-2 border border-[#262B33] hover:border-slate-500 rounded-xl text-xs text-slate-400 hover:text-white transition-all cursor-pointer"
                              >
                                Load more {cat} prompts ({catPrompts.length - maxVisible} left)
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </section>
                ) : (
                  // Flat listing view: when filtered by category, or in "Saved", "Contributed", or "Trending" tab
                  <div className="space-y-6">
                    {filteredPrompts.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredPrompts.map((prompt) => (
                          <PromptCard
                            key={prompt.id}
                            prompt={prompt}
                            onView={setSelectedPrompt}
                            onToggleSave={handleToggleSave}
                            isSaved={savedIds.includes(prompt.id)}
                          />
                        ))}
                      </div>
                    ) : (
                      // Empty state feedback
                      <div className="border border-[#262B33] rounded-2xl p-12 text-center max-w-md mx-auto space-y-4">
                        <AlertCircle className="w-10 h-10 text-slate-500 mx-auto" />
                        <div>
                          <h4 className="text-base font-semibold text-white">No Prompts Found</h4>
                          <p className="text-xs text-slate-400 leading-relaxed mt-1">
                            No prompts matched your active view, filters, or search terms. Try clearing search text or editing categories.
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            setActiveCategory(null);
                            setActiveView("all");
                            setSearchQuery("");
                          }}
                          className="px-4 py-2 bg-[#8B5CF6]/20 hover:bg-[#8B5CF6]/30 text-purple-300 rounded-xl text-xs font-semibold border border-[#8B5CF6]/30 transition-all cursor-pointer"
                        >
                          Reset Filters
                        </button>
                      </div>
                    )}
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </main>

      {/* 3. Detailed Modal Overlay */}
      <AnimatePresence>
        {selectedPrompt && (
          <PromptDetailModal
            prompt={selectedPrompt}
            onClose={() => setSelectedPrompt(null)}
            onToggleSave={handleToggleSave}
            isSaved={savedIds.includes(selectedPrompt.id)}
            onForkClick={handleForkPrompt}
            isLiked={likedIds.includes(selectedPrompt.id)}
            isDisliked={dislikedIds.includes(selectedPrompt.id)}
            onLike={handleLikePrompt}
            onDislike={handleDislikePrompt}
            onDelete={handleDeletePrompt}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
