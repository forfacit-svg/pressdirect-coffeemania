/** One restartable timer; returning to the tab always gives a full reading interval. */
export function startShowcaseAutoplay(
  advance: () => void,
  onCycle?: (duration: number | null) => void,
) {
  let timer = 0;
  let disposed = false;
  function schedule() {
    window.clearTimeout(timer);
    timer = 0;
    if (disposed || document.hidden) {
      onCycle?.(null);
      return;
    }
    // The progress indicator uses the timer's exact restart points, including tab restoration.
    onCycle?.(5000);
    timer = window.setTimeout(() => {
      timer = 0;
      if (disposed || document.hidden) return;
      advance();
      schedule();
    }, 5000);
  }
  document.addEventListener("visibilitychange", schedule);
  window.addEventListener("pageshow", schedule);
  schedule();
  return () => {
    disposed = true;
    window.clearTimeout(timer);
    onCycle?.(null);
    document.removeEventListener("visibilitychange", schedule);
    window.removeEventListener("pageshow", schedule);
  };
}
