import { useDispatch, useSelector } from "react-redux";
import { voteAnecdote } from "../reducers/anecdoteReducer";
import { setNotification } from "../reducers/notificationReducer";

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

  const handleUpdate = async (anecdote) => {
    const anecdoteToUpdate = {
      content: anecdote.content,
      votes: anecdote.votes + 1,
    };

    dispatch(voteAnecdote(anecdote.id, anecdoteToUpdate));
    dispatch(setNotification(`you voted '${anecdote.content}'`, 5));
  };

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <Anecdote key={anecdote.id} anecdote={anecdote} handleClick={() => handleUpdate(anecdote)} />
      ))}
    </div>
  );
};

export default AnecdotesList;
