import { useEffect } from "react";
import { useDispatch } from "react-redux";
import anecdoteServices from "./services/anecdotes";
import { setAnecdotes } from "./reducers/anecdoteReducer";

import AnecdoteForm from "./components/AnecdoteForm";
import AnecdotesList from "./components/AnecdotesList";
import Filter from "./components/Filter";
import Notification from "./components/Notification";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    anecdoteServices.getAll().then((anecdotes) => dispatch(setAnecdotes(anecdotes)));
  }, []);

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification />
      <Filter />
      <AnecdotesList />
      <AnecdoteForm />
    </div>
  );
};

export default App;
