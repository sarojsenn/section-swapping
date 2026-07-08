export default function Footer() {
  return (
    <footer className="py-8 border-t border-gray-200 dark:border-white/8 bg-white dark:bg-[#111111]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-emerald-500 flex items-center justify-center text-white shadow-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
            KMate
          </span>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-600 text-center font-medium">
          Made with{' '}
          <span className="text-emerald-500 inline-block animate-pulse">❤️</span>
          {' '}for KIIT students — swap smarter, plan better.
        </p>
      </div>
    </footer>
  );
}
