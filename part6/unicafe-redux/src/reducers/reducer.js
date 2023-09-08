const initialState = {
  good: 0,
  ok: 0,
  bad: 0,
};

const createState = (state, action) => {
  return {
    good: action.type === "GOOD" ? state.good + 1 : state.good,
    ok: action.type === "OK" ? state.ok + 1 : state.ok,
    bad: action.type === "BAD" ? state.bad + 1 : state.bad,
  };
};

const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case "GOOD":
      return createState(state, action);
    case "OK":
      return createState(state, action);
    case "BAD":
      return createState(state, action);
    case "ZERO":
      return initialState;
    default:
      return state;
  }
};

export default counterReducer;
