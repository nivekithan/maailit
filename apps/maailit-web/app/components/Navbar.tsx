import { Link } from "react-router";
import { motion } from "motion/react";

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="max-w-7xl bg-neutral-900/60 backdrop-blur border border-neutral-800 rounded-xl mx-auto flex items-center justify-between w-full py-2 px-2 gap-4 text-neutral-200"
    >
      <Link to="/" className="flex items-center gap-2 justify-between group">
        <motion.div
          whileHover={{ rotate: -6, scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="rounded-md bg-black/80 border border-neutral-800 p-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-5 fill-white"
          >
            <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
            <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
          </svg>
        </motion.div>
        <p className="text-lg text-slate-50 font-bold">Maailit</p>
      </Link>
      <div className="flex items-center gap-2">
        <motion.div className="flex items-center gap-1" initial={false}>
          <Link
            to="/"
            className="px-3 py-1 rounded-md text-sm text-neutral-300 hover:text-neutral-100 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/inbox/example"
            className="px-3 py-1 rounded-md text-sm text-neutral-300 hover:text-neutral-100 transition-colors"
          >
            Inbox
          </Link>
        </motion.div>
        <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
          <Link
            to="/"
            className="px-3 py-1.5 rounded-md bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-sm font-medium text-neutral-100 transition-colors"
          >
            New Email
          </Link>
        </motion.div>
      </div>
    </motion.nav>
  );
}
