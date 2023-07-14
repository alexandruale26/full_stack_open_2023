import { useState } from "react";

const Display = ({ text }) => <h1>{text}</h1>;
const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>;
const Anecdote = ({ anecdote, votes }) => (
  <div>
    <div>{anecdote}</div>
    <div>has {votes} votes</div>
  </div>
);

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.",
    "The only way to go fast, is to go well.",
  ];
  const arrLength = anecdotes.length;

  const randomNumber = () => Math.floor(Math.random() * arrLength);

  const [selected, setSelected] = useState(randomNumber());
  const [votes, setVotes] = useState(Array(arrLength).fill(0));

  const { _, maxVotedIndex } = votes.reduce(
    (result, val, i) => {
      return val >= result.max ? { max: val, maxVotedIndex: i } : result;
    },
    {
      max: votes[0],
      maxVotedIndex: 0,
    }
  );

  const handleNext = () => {
    let newRandomNum = randomNumber();

    while (selected === newRandomNum) {
      newRandomNum = randomNumber();
    }

    setSelected(newRandomNum);
  };

  const handleVote = () => {
    const votesCopy = [...votes];

    votesCopy[selected] += 1;
    setVotes(votesCopy);
  };

  return (
    <div>
      <Display text="Anecdote of the day" />
      <Anecdote anecdote={anecdotes[selected]} votes={votes[selected]} />
      <Button handleClick={handleVote} text="vote" />
      <Button handleClick={handleNext} text="next anecdote" />

      <Display text="Anecdote with most votes" />
      <Anecdote anecdote={anecdotes[maxVotedIndex]} votes={votes[maxVotedIndex]} />
    </div>
  );
};
export default App;
