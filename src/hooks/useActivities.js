import { useEffect, useMemo, useState } from "react";
import { listActivities } from "../lib/api";

export function useActivities({ status, type, clubId } = {}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await listActivities({
          status, // upcoming, live, completed, canceled
          type, // one-time, recurring
          clubId,
          page: 1,
          limit: 50,
          sortBy: "createdAt",
          order: "desc",
        });
        if (!cancelled) {
          // Backend returns { activities: [...] }
          setItems(data?.activities ?? []);
        }
      } catch (e) {
        if (!cancelled) {
          setError(e.message || "Failed to load activities");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status, type, clubId]);

  const sorted = useMemo(
    () =>
      [...items].sort((a, b) => {
        // For one-time activities, sort by startDateTime
        if (a.startDateTime && b.startDateTime) {
          return new Date(a.startDateTime) - new Date(b.startDateTime);
        }
        // For recurring or mixed, sort by createdAt
        return new Date(b.createdAt) - new Date(a.createdAt);
      }),
    [items]
  );

  return { items: sorted, loading, error };
}
