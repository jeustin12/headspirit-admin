import React, { Reducer, Dispatch, useContext, createContext } from 'react';

export function createCtx<S, A>(defaultValue: S, reducer: Reducer<S, A>) {
  const defaultDispatch: Dispatch<A> = () => defaultValue;
  const stateCtx = createContext(defaultValue);
  const dispatchCtx = createContext(defaultDispatch);

  function useStateCtx<K extends keyof S>(property: K) {
    const state = useContext(stateCtx);
    return state[property]; // only one depth selector for comparison
  }

  function useDispatchCtx() {
    return useContext(dispatchCtx);
  }

  function Provider({ children }: React.PropsWithChildren<{}>) {
    const [state, dispatch] = React.useReducer(reducer, defaultValue);
    return (
      <dispatchCtx.Provider value={dispatch}>
        <stateCtx.Provider value={state}>{children}</stateCtx.Provider>
      </dispatchCtx.Provider>
    );
  }
  return [useStateCtx, useDispatchCtx, Provider] as const;
}


