"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * A piece of UI state that lives in the query string, so a filtered or paged
 * grid can be shared, bookmarked and walked back through with the browser's
 * own back button.
 *
 * Writes are `replace` with `scroll: false` — paging a grid is not a new
 * place in the site's history, and the page keeps its scroll position so the
 * grid does not jump out from under the pager.
 *
 * A value equal to its fallback drops out of the URL entirely, which keeps
 * /products clean until something is actually filtered.
 *
 * Reading search params opts the component out of prerendering, so anything
 * calling this must sit under a <Suspense> boundary.
 *
 * @param {string} key
 * @param {string} [fallback]
 * @param {{resetKeys?: string[]}} [options]
 *        keys cleared alongside this one — a changed filter has to send the
 *        pager back to page one, or the grid lands on a page that no longer
 *        exists
 */
export function useQueryState(key, fallback = "", { resetKeys = [] } = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const value = searchParams.get(key) ?? fallback;

  // Flattened to a string so the callback below depends on the contents of
  // the list rather than on the fresh array literal every render hands it.
  const resets = resetKeys.join(",");

  const setValue = useCallback(
    (next) => {
      const query = new URLSearchParams(searchParams.toString());

      if (next == null || next === "" || String(next) === String(fallback)) {
        query.delete(key);
      } else {
        query.set(key, String(next));
      }

      for (const resetKey of resets ? resets.split(",") : []) {
        query.delete(resetKey);
      }

      const queryString = query.toString();

      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [fallback, key, pathname, resets, router, searchParams]
  );

  return [value, setValue];
}

/**
 * The `?page=` cursor every paginated grid shares. Anything that is not a
 * positive integer reads as page 1 rather than breaking the request.
 */
export function usePageParam(key = "page") {
  const [raw, setRaw] = useQueryState(key, "1");

  const parsed = Number.parseInt(raw, 10);
  const page = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;

  const setPage = useCallback(
    (next) => {
      setRaw(next);

      // Paging keeps the scroll position by default; bring the top of the
      // grid back into view so the next page starts where the last one did.
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
    [setRaw]
  );

  return [page, setPage];
}
