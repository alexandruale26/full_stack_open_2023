import { addVoteTo } from "../reducers/anecdoteReducer";
import { useDispatch, useSelector } from "react-redux";

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
  const anecdotes = useSelector((state) => state.sort((a, b) => (a.votes < b.votes ? 1 : -1)));
  const dispatch = useDispatch();

  return (
    <div>
      {anecdotes.map((anecdote) => (
        <Anecdote key={anecdote.id} anecdote={anecdote} handleClick={() => dispatch(addVoteTo(anecdote.id))} />
      ))}
    </div>
  );
};

export default AnecdotesList;
