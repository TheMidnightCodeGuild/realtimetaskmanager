import { format, isAfter } from "date-fns";
import { Calendar, Clock, AlertCircle } from "lucide-react";

const statusColors = {
  pending: "bg-gray-100 text-gray-800",
  "in-progress": "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
};

const priorityColors = {
  low: "border-l-gray-400",
  medium: "border-l-yellow-400",
  high: "border-l-red-400",
};

export default function TaskItem({ task, onEdit, onDelete, onStatusChange }) {
  const isOverdue =
    task.dueDate &&
    isAfter(
      new Date(),
      new Date(
        task.dueDate.seconds ? task.dueDate.seconds * 1000 : task.dueDate
      )
    );

  return (
    <div
      className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${
        priorityColors[task.priority]
      }`}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {task.title}
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="text-blue-600 hover:text-blue-800"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>

      <p className="text-gray-600 mb-4 line-clamp-3">{task.description}</p>

      <div className="flex items-center justify-between mb-4">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            statusColors[task.status]
          }`}
        >
          {task.status.replace("-", " ").toUpperCase()}
        </span>
        <span className="text-xs text-gray-500 capitalize">
          {task.category}
        </span>
      </div>

      {task.dueDate && (
        <div
          className={`flex items-center text-sm ${
            isOverdue ? "text-red-600" : "text-gray-500"
          }`}
        >
          {isOverdue ? <AlertCircle size={16} /> : <Calendar size={16} />}
          <span className="ml-1">
            Due:{" "}
            {format(
              new Date(
                task.dueDate.seconds
                  ? task.dueDate.seconds * 1000
                  : task.dueDate
              ),
              "MMM dd, yyyy"
            )}
          </span>
        </div>
      )}

      <div className="mt-4 flex space-x-2">
        {task.status !== "completed" && (
          <button
            onClick={() =>
              onStatusChange(
                task.id,
                task.status === "pending" ? "in-progress" : "completed"
              )
            }
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded text-sm hover:bg-blue-700 transition-colors"
          >
            {task.status === "pending" ? "Start" : "Complete"}
          </button>
        )}
      </div>
    </div>
  );
}
