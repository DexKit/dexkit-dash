
const allSettled = function(promises: Promise<any>[]) {
  return Promise.all(
    promises.map((promise, i) =>
      promise
        .then(value => ({
          loaded: true,
          value,
        }))
        .catch(value => ({
          loaded: false,
          value,
        }))
    )
  );
};

// Export the function
export default allSettled;