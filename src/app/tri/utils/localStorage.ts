export function loadState<T = any>(): T | undefined {
  try {
    const serializedState = localStorage.getItem("reduxState");
    if (!serializedState) return undefined;
    return JSON.parse(serializedState) as T;
  } catch (err) {
    return undefined;
  }
}

export function saveState(state: any) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("reduxState", serializedState);
  } catch {
    // ignore write errors
  }
} 