export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;

  return function (...args: Parameters<T>) {
    clearTimeout(timeout);

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

export function debouncePromise<T extends (...args: any[]) => Promise<any>>(
  func: T,
  wait: number
) {
  let timeout: ReturnType<typeof setTimeout>;
  let resolver: ((value: ReturnType<T>) => void) | null = null;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);

    return new Promise<ReturnType<T>>((resolve) => {
      resolver = resolve;
      timeout = setTimeout(async () => {
        const result = await func(...args);
        if (resolver) {
          resolver(result);
        }
      }, wait);
    });
  };
}
