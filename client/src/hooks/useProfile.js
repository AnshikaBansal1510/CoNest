import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@clerk/react";

const API = import.meta.env.VITE_API_URL;

export function useProfile(userId) {
  const { getToken } = useAuth();

  const [profile, setProfile]   = useState(null);
  const [loading, setLoading]   = useState(true);
  const [saving,  setSaving]    = useState(false);
  const [error,   setError]     = useState(null);

  // ── Fetch profile ────────────────────────────────────────
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await getToken();
      const endpoint = userId ? `${API}/api/users/${userId}` : `${API}/api/profile`;
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error((await res.json()).error || "Fetch failed");
      setProfile(await res.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [getToken, userId]);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  // ── Save basic info ──────────────────────────────────────
  const saveInfo = useCallback(async (data) => {
    try {
      setSaving(true);
      const token = await getToken();
      const res = await fetch(`${API}/api/profile/info`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Save failed");
      const { completionPercent } = await res.json();
      // Update local state so badge updates immediately
      setProfile((prev) => ({ ...prev, ...data, completionPercent }));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setSaving(false);
    }
  }, [getToken]);

  // ── Save preferences ─────────────────────────────────────
  const savePreferences = useCallback(async (data) => {
    try {
      setSaving(true);
      const token = await getToken();
      const res = await fetch(`${API}/api/profile/preferences`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Save failed");
      const { completionPercent } = await res.json();
      setProfile((prev) => ({ ...prev, ...data, completionPercent }));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setSaving(false);
    }
  }, [getToken]);

  // ── Trigger verification ─────────────────────────────────
  const triggerVerify = useCallback(async (type) => {
    try {
      const token = await getToken();
      const res = await fetch(`${API}/api/profile/verify/${type}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error((await res.json()).error || "Verify failed");
      const { completionPercent } = await res.json();
      // Reflect the verification locally
      setProfile((prev) => ({
        ...prev,
        completionPercent,
        verification: { ...prev.verification, [type]: true },
      }));
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [getToken]);

  return { profile, loading, saving, error, saveInfo, savePreferences, triggerVerify };
}