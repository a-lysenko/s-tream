export function createWritableListeners(
  {
    includeOnly = [],
    logger = console,
    extendCallbacks = {}
  } = {}
) {
  const buildEventMessage = (eventName) => `[Listener] event fired: ${eventName}`;
  const allListeners = {
    close: () => {
      logger.log(buildEventMessage('close'));
      extendCallbacks?.close?.();
    },
    finish: () => {
      logger.log(buildEventMessage('finish'));
      extendCallbacks?.finish?.();
    },
    drain: async () => {
      logger.log(buildEventMessage('drain'));
      await extendCallbacks?.drain?.();
    },
    error: (err) => {
      logger.error(buildEventMessage('error'), err);
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
    return allListeners;
  }

  return Object.fromEntries(
    Object.entries(allListeners)
      .filter(
        ([key]) => allListeners.includes(key)
      )
  );
}
