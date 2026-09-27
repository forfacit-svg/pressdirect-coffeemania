/** One restartable timer; returning to the tab always gives a full reading interval. */
export function startShowcaseAutoplay(advance: () => void) {
  let timer = 0;
  let disposed = false;
  function schedule() {
    window.clearTimeout(timer);
    timer = 0;
    if (disposed || document.hidden) return;
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
    document.removeEventListener("visibilitychange", schedule);
    window.removeEventListener("pageshow", schedule);
  };
}
