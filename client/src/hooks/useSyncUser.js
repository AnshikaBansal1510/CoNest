import { useEffect } from "react";
import { useUser, useAuth } from "@clerk/react";

export function useSyncUser() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    if (!isLoaded || !user) return;

    async function sync() {
      try {
        const token = await getToken();

        await fetch(`${import.meta.env.VITE_API_URL}/api/users/sync`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: user.fullName || user.firstName || "User",
            email: user.primaryEmailAddress?.emailAddress || "",
          }),
        });
      } catch (err) {
        console.error("User sync failed:", err);
      }
    }

    sync();
  }, [isLoaded, user, getToken]);
}