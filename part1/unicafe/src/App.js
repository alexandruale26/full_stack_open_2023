import { useState } from "react";

const Display = ({ text }) => <h1>{text}</h1>;
const Button = ({ handleClick, text }) => <button onClick={handleClick}>{text}</button>;
const StatisticLine = ({ text, value }) => (
  <tr>
    <td>{text}</td>
    <td>{value}</td>
  </tr>
);

const Statistics = ({ statistics }) => {
  const { good, neutral, bad, all, average, positive } = statistics;

  if (all <= 0) return <div>No feedback given</div>;

  return (
    <table>
      <tbody>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={all} />
        <StatisticLine text="average" value={average} />
        <StatisticLine text="positive" value={positive} />
      </tbody>
    </table>
  );
};

function App() {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGood = () => setGood(good + 1);
  const handleNeutral = () => setNeutral(neutral + 1);
  const handleBad = () => setBad(bad + 1);
  const convertToDecimals = (num, decimals = 1) => num.toFixed(decimals + 1).slice(0, -1);

  const all = good + bad + neutral;
  const average = convertToDecimals((good - bad) / all);
  const positive = `${convertToDecimals((good / all) * 100)} %`;

  return (
    <div>
      <Display text="Give Feedback" />
      <Button handleClick={handleGood} text="good" />
      <Button handleClick={handleNeutral} text="neutral" />
      <Button handleClick={handleBad} text="bad" />
      <Display text="Statistics" />
      <Statistics statistics={{ good, neutral, bad, all, average, positive }} />
    </div>
  );
}

export default App;
