import { useDispatch, useSelector } from "react-redux";
import { addVoteTo } from "../reducers/anecdoteReducer";
import { notificationChange } from "../reducers/notificationReducer";
import anecdoteServices from "../services/anecdotes";

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

    const updatedAnecdote = await anecdoteServices.update(anecdote.id, anecdoteToUpdate);

    dispatch(addVoteTo(updatedAnecdote.id));
    dispatch(notificationChange(`you voted '${updatedAnecdote.content}'`));
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
