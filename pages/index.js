import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";
import { useTasks } from "../hooks/useTasks";
import Layout from "../components/Layout";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import FilterBar from "../components/FilterBar";
import toast from "react-hot-toast";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const { tasks, loading, error, addTask, updateTask, deleteTask } = useTasks();
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    priority: "all",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.push("/login");
    }
  }, [currentUser, router]);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filters.status === "all" || task.status === filters.status;
    const matchesCategory =
      filters.category === "all" || task.category === filters.category;
    const matchesPriority =
      filters.priority === "all" || task.priority === filters.priority;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  // Debug logging
  console.log("Current user:", currentUser?.uid);
  console.log("Tasks from hook:", tasks);
  console.log("Filtered tasks:", filteredTasks);
  console.log("Loading state:", loading);
  console.log("Error state:", error);

  const handleTaskSubmit = async (taskData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask.id, taskData);
        toast.success("Task updated successfully!");
      } else {
        await addTask({
          ...taskData,
          status: "pending",
        });
        toast.success("Task created successfully!");
      }
      setShowTaskForm(false);
      setEditingTask(null);
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error("Error saving task");
    }
  };

  if (!currentUser) return null;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Task Manager</h1>
          <button
            onClick={() => setShowTaskForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Task
          </button>
        </div>

        <FilterBar
          filters={filters}
          setFilters={setFilters}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            Loading tasks...
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="text-red-600 mb-4">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error loading tasks
            </h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : (
          <TaskList
            tasks={filteredTasks}
            onEdit={(task) => {
              setEditingTask(task);
              setShowTaskForm(true);
            }}
            onDelete={async (taskId) => {
              try {
                await deleteTask(taskId);
                toast.success("Task deleted successfully!");
              } catch (error) {
                toast.error("Error deleting task");
              }
            }}
            onStatusChange={async (taskId, status) => {
              try {
                await updateTask(taskId, { status });
                toast.success("Task status updated!");
              } catch (error) {
                toast.error("Error updating task status");
              }
            }}
          />
        )}

        {showTaskForm && (
          <TaskForm
            task={editingTask}
            onSubmit={handleTaskSubmit}
            onClose={() => {
              setShowTaskForm(false);
              setEditingTask(null);
            }}
          />
        )}
      </div>
    </Layout>
  );
}
