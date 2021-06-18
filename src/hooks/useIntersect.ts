import _ from "lodash";
import { useCallback, useRef } from "react";

export function useIntersect() {
  const callback = useRef<() => void>();

  const observer = useRef(
    new IntersectionObserver(
      _.throttle((entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          if (callback.current) {
            callback.current();
          }
        }
      }),
      {
        root: null,
        rootMargin: '25px',
        threshold: 0,
      },
    ),
  );

  const setCallback = useCallback((cb :() => void) => {
    callback.current = cb;
  }, [callback]);

  const observe = useCallback((el: Element) => {
    if (observer.current.root) {
      observer.current.unobserve(observer.current.root);
    }
    observer.current.observe(el);
  }, [observer.current]);

  return { observe, setCallback };
}