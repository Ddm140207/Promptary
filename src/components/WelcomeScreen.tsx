import { motion } from "motion/react";
import { BrainCircuit, Database, Sparkles, Terminal, ArrowRight } from "lucide-react";

interface WelcomeScreenProps {
  onEnter: () => void;
}

export default function WelcomeScreen({ onEnter }: WelcomeScreenProps) {
  // Array of nodes to render for a simulated neuron grid
  const nodes = [
    { x: "15%", y: "20%", delay: 0.2, size: 8 },
    { x: "25%", y: "45%", delay: 0.5, size: 12 },
    { x: "35%", y: "15%", delay: 0.8, size: 6 },
    { x: "45%", y: "65%", delay: 0.3, size: 16 },
    { x: "65%", y: "25%", delay: 1.1, size: 10 },
    { x: "75%", y: "55%", delay: 0.6, size: 14 },
    { x: "85%", y: "15%", delay: 0.9, size: 8 },
    { x: "55%", y: "40%", delay: 1.4, size: 20 },
  ];

  return (
    <div id="welcome_screen" className="relative w-full h-screen flex flex-col items-center justify-center bg-[#0D0F12] overflow-hidden grid-bg">
      {/* Dynamic Background Network Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {nodes.map((node, idx) => (
          <motion.div
            key={idx}
            className="absolute rounded-full bg-indigo-500/30"
            style={{
              left: node.x,
              top: node.y,
              width: node.size,
              height: node.size,
            }}
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.8, 0.3],
              boxShadow: [
                "0 0 0px rgba(139, 92, 246, 0)",
                `0 0 ${node.size * 1.5}px rgba(139, 92, 246, 0.6)`,
                "0 0 0px rgba(139, 92, 246, 0)",
              ],
            }}
            transition={{
              duration: 3 + node.delay * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: node.delay,
            }}
          />
        ))}

        {/* Neural connection vectors (SVG background lines) */}
        <svg className="absolute inset-0 w-full h-full opacity-10">
          <motion.path
            d="M 15 20 Q 25 45 35 15 T 55 40 T 75 55 T 85 15"
            fill="none"
            stroke="url(#grad)"
            strokeWidth="2"
            strokeDasharray="1000"
            animate={{ strokeDashoffset: [1000, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#3B82F6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Decorative center orb glow */}
      <div className="absolute w-[400px] h-[400px] bg-gradient-to-tr from-purple-600/10 to-blue-600/10 rounded-full blur-[100px] pointer-events-none glow-purple" />

      {/* Brand & Animation content */}
      <div className="relative z-10 max-w-2xl text-center px-6">
        {/* Animated Icon Cluster */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <motion.div
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, type: "spring", stiffness: 100 }}
            className="p-4 bg-[#15181D]/80 border border-[#262B33] rounded-2xl flex items-center justify-center glow-purple"
          >
            <BrainCircuit className="w-8 h-8 text-[#8B5CF6]" />
          </motion.div>

          <motion.div
            initial={{ scale: 0, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
            className="p-5 bg-gradient-to-tr from-[#8B5CF6] to-[#3B82F6] rounded-3xl flex items-center justify-center text-white shadow-xl glow-blue"
          >
            <Sparkles className="w-10 h-10 animate-pulse-slow" />
          </motion.div>

          <motion.div
            initial={{ scale: 0, rotate: 45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.4, type: "spring", stiffness: 100 }}
            className="p-4 bg-[#15181D]/80 border border-[#262B33] rounded-2xl flex items-center justify-center"
          >
            <Database className="w-8 h-8 text-[#3B82F6]" />
          </motion.div>
        </div>

        {/* Animated Headers */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-5xl md:text-6xl font-display font-extrabold tracking-tight mb-4"
        >
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
            Welcome to{" "}
          </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] glow-purple">
            Promptary
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-lg text-slate-400 font-sans font-light leading-relaxed mb-10 max-w-lg mx-auto"
        >
          The open-source AI prompt repository engineered specifically for{" "}
          <span className="text-white font-medium">Data Scientists</span> and{" "}
          <span className="text-white font-medium">AI Researchers</span>. Discover, optimize, and reuse expert blueprints.
        </motion.p>

        {/* Dynamic Loading Shell Command */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="w-full max-w-md mx-auto bg-[#15181D] border border-[#262B33]/80 rounded-xl p-3 mb-10 text-left font-mono text-xs flex items-center gap-3 text-slate-400"
        >
          <Terminal className="w-4 h-4 text-emerald-500 animate-pulse" />
          <div className="flex-1 flex gap-1 items-center">
            <span className="text-purple-400">pip install</span>
            <span className="text-[#3B82F6]">promptary-cli</span>
            <span className="text-emerald-500 font-bold animate-pulse">_</span>
          </div>
          <span className="text-slate-600">v1.2.0</span>
        </motion.div>

        {/* Launch Button */}
        <motion.button
          id="btn_enter_promptary"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          onClick={onEnter}
          className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#8B5CF6] to-[#3B82F6] hover:from-[#7c4fe3] hover:to-[#2d73e5] text-white font-semibold rounded-xl shadow-lg transition-all duration-300 cursor-pointer text-base hover:shadow-[#8B5CF6]/30 hover:shadow-2xl"
        >
          <span>Explore Knowledge Base</span>
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Decorative footer label */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1, delay: 2 }}
        className="absolute bottom-6 font-mono text-[10px] text-slate-500 tracking-widest uppercase flex items-center gap-2"
      >
        <span>Open Source Knowledge Hub</span>
        <span>•</span>
        <span>Made for Data Teams</span>
      </motion.div>
    </div>
  );
}
