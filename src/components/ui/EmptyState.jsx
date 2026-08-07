import { FolderOpenIcon } from "@heroicons/react/24/outline";

function EmptyState({
  title = "No Data Found",
  description = "There is nothing to display.",
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-500 border border-indigo-100 flex items-center justify-center mb-3.5 shadow-sm">
        <FolderOpenIcon className="w-7 h-7" />
      </div>

      <h3 className="text-base font-semibold text-slate-800">
        {title}
      </h3>

      <p className="mt-1 text-sm text-slate-500 max-w-sm">
        {description}
      </p>
    </div>
  );
}

export default EmptyState;