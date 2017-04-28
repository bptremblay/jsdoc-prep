let counter = 0;
/**
 * @param listener
 */
function addDelegatedListener(listener) {
  counter++;
  console.log('addDelegatedListener', listener);
  return counter;
}
export default {
  addDelegatedListener: addDelegatedListener
};
