import { useState, useEffect } from "react";
import { useLoading } from "./useLoading";

/**
 * Custom hook to retrieve and manage the user's ID from localStorage.
 * Returns the userId (string or null) and loading/error states for robust handling.
 *
 * @returns {Object} An object containing:
 *   - userId: string | null - The user's ID (e.g., from user.sub) or null if not found/loaded.
 *   - isLoading: boolean - Indicates if the user ID is being loaded.
 *   - error: Error | null - Any error encountered while fetching the user ID.
 */
const useUserId = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const { loading, turnOnLoading, turnOffLoading } = useLoading();
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchUserId = () => {
      try {
        turnOnLoading();
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        console.warn("FOUND USER", user);
        if (user?.sub) {
          setUserId(user.sub);
          console.warn("SETTED USER ID", user.sub);
        } else {
          console.warn(
            "No user.sub found in localStorage or user data is invalid"
          );
          setUserId(null);
        }
        setError(null);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
        setError(
          error instanceof Error
            ? error
            : new Error("Failed to parse user data")
        );
        setUserId(null);
      } finally {
        turnOffLoading();
      }
    };

    fetchUserId();
  }, []);

  return { userId, loading, error };
};

export default useUserId;
