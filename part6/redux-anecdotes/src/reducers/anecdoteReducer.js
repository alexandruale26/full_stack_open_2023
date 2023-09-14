import { createSlice } from "@reduxjs/toolkit";

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    createAnecdote(state, action) {
      state.push(action.payload);
    },
    addVoteTo(state, action) {
      const id = action.payload;
      const anecdoteToUpdate = state.find((a) => a.id === id);
      const updatedAnecdote = { ...anecdoteToUpdate, votes: anecdoteToUpdate.votes + 1 };

      return state.map((anecdote) => (anecdote.id !== id ? anecdote : updatedAnecdote));
    },
    setAnecdotes(state, action) {
      return action.payload;
    },
  },
});

export const { createAnecdote, addVoteTo, setAnecdotes } = anecdoteSlice.actions;
export default anecdoteSlice.reducer;
