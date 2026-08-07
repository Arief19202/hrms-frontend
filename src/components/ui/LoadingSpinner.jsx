function LoadingSpinner() {
  return (
    <div className="flex flex-col justify-center items-center h-64 gap-3">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
        <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
      </div>
      <p className="text-xs font-medium text-slate-400 animate-pulse tracking-wide uppercase">
        Loading...
      </p>
    </div>
  );
}

export default LoadingSpinner;