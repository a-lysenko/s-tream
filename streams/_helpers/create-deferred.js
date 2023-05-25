export function createDeferred() {
  const deferred = {};
  const promise = new Promise(
    (resolve, reject) => {
      deferred.resolve = resolve;
      deferred.reject = reject;
    }
  );
  deferred.promise = promise;

  Object.freeze(deferred);
  return deferred;
}
