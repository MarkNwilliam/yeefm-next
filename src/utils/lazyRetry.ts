// src/app/utils/lazyRetry.ts

/**
 * Type for dynamic component imports
 */
type ComponentImport<T = any> = () => Promise<T>;

/**
 * Lazy retry utility for handling dynamic component import failures
 * with automatic page refresh fallback
 * 
 * @param componentImport - Function that returns a Promise of the component import
 * @param componentName - Name of the component for tracking refresh attempts
 * @returns Promise that resolves to the imported component
 */
export const lazyRetry = function<T = any>(
  componentImport: ComponentImport<T>, 
  componentName: string
): Promise<T> {
  return new Promise((resolve, reject) => {
    // Check if we already tried refreshing the page
    let hasRefreshed = false;
    
    try {
      const refreshFlag = window.sessionStorage.getItem(`retry-${componentName}-refreshed`);
      hasRefreshed = JSON.parse(refreshFlag || 'false');
    } catch (error) {
      // If JSON.parse fails, assume we haven't refreshed
      hasRefreshed = false;
    }

    componentImport()
      .then((component) => {
        // Success! Reset the refresh flag
        try {
          window.sessionStorage.setItem(`retry-${componentName}-refreshed`, 'false');
        } catch (error) {
          console.warn('Failed to update sessionStorage:', error);
        }
        resolve(component);
      })
      .catch((error) => {
        if (!hasRefreshed) {
          // Set refresh flag and reload the page
          try {
            window.sessionStorage.setItem(`retry-${componentName}-refreshed`, 'true');
            window.location.reload();
          } catch (storageError) {
            // If sessionStorage fails, still try to reload
            console.warn('Failed to set sessionStorage, attempting reload anyway:', storageError);
            window.location.reload();
          }
          return;
        }
        
        // If we already tried refreshing, reject with the error
        reject(error);
      });
  });
};

/**
 * Alternative version that uses a callback approach instead of Promise constructor
 * This can be more performant and avoids Promise constructor anti-pattern
 */
export const lazyRetryAsync = async function<T = any>(
  componentImport: ComponentImport<T>, 
  componentName: string
): Promise<T> {
  // Check if we already tried refreshing the page
  let hasRefreshed = false;
  
  try {
    const refreshFlag = window.sessionStorage.getItem(`retry-${componentName}-refreshed`);
    hasRefreshed = JSON.parse(refreshFlag || 'false');
  } catch (error) {
    hasRefreshed = false;
  }

  try {
    const component = await componentImport();
    
    // Success! Reset the refresh flag
    try {
      window.sessionStorage.setItem(`retry-${componentName}-refreshed`, 'false');
    } catch (error) {
      console.warn('Failed to update sessionStorage:', error);
    }
    
    return component;
  } catch (error) {
    if (!hasRefreshed) {
      // Set refresh flag and reload the page
      try {
        window.sessionStorage.setItem(`retry-${componentName}-refreshed`, 'true');
      } catch (storageError) {
        console.warn('Failed to set sessionStorage:', storageError);
      }
      window.location.reload();
      // This will never resolve as the page reloads
      return new Promise(() => {});
    }
    
    // If we already tried refreshing, throw the error
    throw error;
  }
};

/**
 * Usage example with React.lazy:
 * 
 * const LazyComponent = React.lazy(() => 
 *   lazyRetry(
 *     () => import('./components/MyComponent'),
 *     'MyComponent'
 *   )
 * );
 */