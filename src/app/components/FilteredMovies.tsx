import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };
  
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10, filter: "blur(3px)" },
    visible: { 
      opacity: 1, 
      y: 0, 
      filter: "blur(0px)",
      transition: { type: "spring", stiffness: 100, damping: 15 }
    },
  };

export default function FilterMenu({
  onFilterChange,
  counts,
  activeFilter,
}: any) {
  const CATEGORIES = [
    { label: "5.0", value: "★★★★★" },
    { label: "4.5", value: "★★★★☆" },
    { label: "4.0", value: "★★★★" },
    { label: "3.5", value: "★★★☆" },
    { label: "~3.0", value: "★★★" },
  ];

  return (
    <motion.div
      className="z-[100] px-4"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-wrap justify-center gap-2 flex-wrap">
        <motion.button
          variants={itemVariants}
          whileTap={{ scale: 0.95 }}
          onClick={() => onFilterChange(null)}
          className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer sans min-w-[100px] justify-center ${
            activeFilter === null
              ? "bg-black text-white hover:bg-black/80"
              : "bg-black/10 text-black/80 hover:bg-black/20"
          }`}
        >
          <span>All</span>
          <span
            className={`opacity-60 ${
              activeFilter === null ? "text-white/50" : "text-black/50"
            }`}
          >
            ({counts.all || 0})
          </span>
        </motion.button>

        {CATEGORIES.map((cat) => (
          <motion.button
            variants={itemVariants}
            whileTap={{ scale: 0.95 }}
            layout
            key={cat.value}
            onClick={() => onFilterChange(cat.value)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all duration-300 cursor-pointer sans min-w-[100px] justify-center ${
              activeFilter === cat.value
                ? "bg-black text-white hover:bg-black/80"
                : "bg-black/10 text-black/80 hover:bg-black/20"
            }`}
          >
            <span>{cat.label}</span>
            <span
              className={`opacity-60 ${
                activeFilter === cat.value ? "text-white/50" : "text-black/50"
              }`}
            >
              ({counts[cat.value] || 0})
            </span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
