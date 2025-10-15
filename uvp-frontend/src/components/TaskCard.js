// TaskCard component: displays a single volunteer task summary
import Link from "next/link";

export default function TaskCard({ task }) {
  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition bg-white">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
        </div>
        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">{task.category}</span>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-700">
        <div><span className="font-medium">Location:</span> {task.location}</div>
        <div><span className="font-medium">Date:</span> {task.date}</div>
        <div><span className="font-medium">NGO:</span> {task.ngo}</div>
        <div><span className="font-medium">Slots:</span> {task.slots}</div>
      </div>
      <div className="mt-4 flex gap-3">
        <Link href={`/tasks/${task.id}`} className="px-3 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700">
          View Details
        </Link>
        <Link href={`/tasks/${task.id}/apply`} className="px-3 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200">
          Apply
        </Link>
      </div>
    </div>
  );
}

