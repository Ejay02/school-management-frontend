export const setupInfiniteScroll = (loadMoreFn, triggerRef, options = {}) => {
  const threshold = options.threshold || 0.1;
  let observer = null;

  const setupObserver = () => {
    if (observer) {
      cleanup();
    }
    
    if (!triggerRef.value) return;
    
    observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          loadMoreFn();
        }
      }, 
      { threshold }
    );
    
    observer.observe(triggerRef.value);
  };

  const cleanup = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };

  return {
    setupObserver,
    cleanup
  };
};