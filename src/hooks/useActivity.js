
import { useState, useEffect } from "react";
import { getActivity } from "../lib/api";

// Fetch details for a single activity by slug
export function useActivity(slug) {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    getActivity(slug)
      .then((activity) => {
        setActivity(activity.activity || null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  return { activity, loading, error };
}
