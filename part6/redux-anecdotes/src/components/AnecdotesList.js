import { useDispatch, useSelector } from "react-redux";
import { addVoteTo } from "../reducers/anecdoteReducer";
import { notificationChange } from "../reducers/notificationReducer";

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div>
      <div>{anecdote.content}</div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  );
};

const AnecdotesList = () => {
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    if (filter === "") return anecdotes.toSorted((a, b) => (a.votes < b.votes ? 1 : -1));

    return anecdotes.filter((a) => a.content.toLowerCase().includes(filter.toLowerCase()));
  });

  const dispatch = useDispatch();

  const handleClick = (anecdote) => {
    dispatch(addVoteTo(anecdote.id));
    dispatch(notificationChange(`you voted '${anecdote.content}'`));
  };

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <Anecdote key={anecdote.id} anecdote={anecdote} handleClick={() => handleClick(anecdote)} />
      ))}
    </div>
  );
};

export default AnecdotesList;
