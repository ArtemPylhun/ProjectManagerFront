import { UserService } from "../features/users/services/user.service";
import { UserInterface } from "../features/users/interfaces/UserInterface";
import { useState, useEffect } from "react";
import { useLoading } from "./useLoading";

const useUserId = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [loggedInUser, setLoggedInUser] = useState<UserInterface | null>(null);
  const { loading, turnOnLoading, turnOffLoading } = useLoading();

  useEffect(() => {
    const fetchUserId = async () => {
      var abortController = new AbortController();
      try {
        turnOnLoading();
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        if (user?.sub) {
          setUserId(user.sub);
          let response = await UserService.getUserWithRolesById(
            user.sub,
            abortController.signal
          );
          if (!response) throw new Error("User not found");
          setLoggedInUser(response);
        } else {
          console.warn(
            "No user.sub found in localStorage or user data is invalid"
          );
          setUserId(null);
        }
        if (Array.isArray(user?.roles)) {
          setIsAdmin(user.roles.includes("Admin"));
        } else if (user?.roles === "Admin") {
          setIsAdmin(true);
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

  return { userId, loading, error, isAdmin, loggedInUser };
};

export default useUserId;
