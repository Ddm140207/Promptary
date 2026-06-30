/**
 * Generates a beautiful, deterministic gradient background based on a string (e.g., author's name).
 */
export function getAvatarGradient(name: string): string {
  const gradients = [
    "from-purple-500 to-indigo-500",
    "from-pink-500 to-rose-500",
    "from-amber-500 to-orange-500",
    "from-emerald-500 to-teal-500",
    "from-sky-500 to-blue-500",
    "from-violet-500 to-fuchsia-500",
    "from-cyan-500 to-blue-500",
    "from-yellow-500 to-red-500",
  ];
  if (!name) return gradients[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
}
