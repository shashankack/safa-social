
import { useState, useEffect } from "react";
import api from "../lib/api";

// Fetch details for a single activity by slug
export function useActivity(slug) {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    api
      .get(`/activities/${slug}`)
      .then((res) => {
        setActivity(res.data.activity || null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  return { activity, loading, error };
}
