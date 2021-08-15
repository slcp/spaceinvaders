export const asyncFilter = async (arr, predicate) => {
  const results = await Promise.all(arr.map(predicate));
  return arr.filter((_v, index) => results[index]);
};

export const asyncForEach = async (arr, predicate) => {
  const results = await Promise.all(arr.map(predicate));
  return results;
};
