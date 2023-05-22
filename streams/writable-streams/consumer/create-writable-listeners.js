export function createWritableListeners(
  {
    name = `Listener ${Date.now()}`,
    includeOnly = [],
    logger = console,
    extendCallbacks = {}
  } = {}
) {
  const allListeners = {
    close: () => {
      logger.log(`[${name}]`, 'event fired: close');
      extendCallbacks?.close?.();
    },
    finish: () => {
      logger.log(`[${name}]`, 'event fired: finish');
      extendCallbacks?.finish?.();
    },
    drain: () => {
      logger.log(`[${name}]`, 'event fired: drain');
      extendCallbacks?.drain?.();
    },
    error: (err) => {
      logger.error(`[${name}]`, 'event fired: error', err);
      extendCallbacks?.error?.(err);
    }
  }
  /*
    addListener(event: 'close', listener: () => void): this;
    addListener(event: 'drain', listener: () => void): this;
    addListener(event: 'error', listener: (err: Error) => void): this;
    addListener(event: 'finish', listener: () => void): this;
    addListener(event: 'pipe', listener: (src: Readable) => void): this;
    addListener(event: 'unpipe', listener: (src: Readable) => void): this;
   */
  if (!includeOnly.length) {
    return {
      ...allListeners
    }
  }

  return Object.fromEntries(
    Object.entries(allListeners)
      .filter(
        ([key]) => allListeners.includes(key)
      )
  );
}
