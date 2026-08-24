
import { useState, useEffect } from "react";
import { listActivities, getActivity } from "../lib/api";

// Fetch activities with optional currentStatus and count (limit)
export function useActivities({ currentStatus, count } = {}) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const statusKey = Array.isArray(currentStatus)
    ? currentStatus.join(",")
    : currentStatus || "";

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = { limit: count || 100 };
    const statuses = statusKey ? statusKey.split(",") : null;
    listActivities(params)
      .then((res) => {
        let fetchedActivities = res.activities || [];
        if (statuses) {
          fetchedActivities = fetchedActivities.filter((activity) =>
            statuses.includes(activity.currentStatus)
          );
        }
        setActivities(fetchedActivities);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [statusKey, count]);

  return { activities, setActivities, loading, error };
}

// Fetch details for a single activity by slug
export function useActivityDetails(slug) {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError(null);
    getActivity(slug)
      .then((activity) => {
        setActivity(activity || null);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [slug]);

  return { activity, loading, error };
}
