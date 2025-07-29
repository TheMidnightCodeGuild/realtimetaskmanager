import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../contexts/AuthContext";

export function useTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) {
      setTasks([]);
      setLoading(false);
      return;
    }

    console.log("Setting up tasks listener for user:", currentUser.uid);

    try {
      // Simple query without orderBy to avoid index requirements
      const q = query(
        collection(db, "tasks"),
        where("userId", "==", currentUser.uid)
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          console.log(
            "Tasks snapshot received:",
            snapshot.docs.length,
            "tasks"
          );
          const tasksData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          // Sort manually by createdAt (newest first)
          const sortedTasks = tasksData.sort((a, b) => {
            if (!a.createdAt || !b.createdAt) return 0;
            const aTime = a.createdAt.seconds
              ? a.createdAt.seconds
              : a.createdAt;
            const bTime = b.createdAt.seconds
              ? b.createdAt.seconds
              : b.createdAt;
            return bTime - aTime;
          });

          console.log("Sorted tasks:", sortedTasks);
          setTasks(sortedTasks);
          setLoading(false);
          setError(null);
        },
        (error) => {
          console.error("Error fetching tasks:", error);
          setError(error.message);
          setLoading(false);
        }
      );

      return unsubscribe;
    } catch (error) {
      console.error("Error setting up tasks listener:", error);
      setError(error.message);
      setLoading(false);
    }
  }, [currentUser]);

  const addTask = async (taskData) => {
    try {
      console.log("Adding task:", taskData);
      const docRef = await addDoc(collection(db, "tasks"), {
        ...taskData,
        userId: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log("Task added with ID:", docRef.id);
    } catch (error) {
      console.error("Error adding task:", error);
      throw error;
    }
  };

  const updateTask = async (taskId, updates) => {
    try {
      console.log("Updating task:", taskId, updates);
      await updateDoc(doc(db, "tasks", taskId), {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  };

  const deleteTask = async (taskId) => {
    try {
      console.log("Deleting task:", taskId);
      await deleteDoc(doc(db, "tasks", taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  };

  return {
    tasks,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
  };
}
