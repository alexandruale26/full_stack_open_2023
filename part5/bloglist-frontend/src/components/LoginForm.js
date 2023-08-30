import { useState } from "react";

const LoginForm = ({ login }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    await login({ username, password });
    setUsername("");
    setPassword("");
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Log in to application</h2>
      <div>
        username
        <input value={username} onChange={({ target }) => setUsername(target.value)} />
      </div>
      <div>
        password
        <input value={password} onChange={({ target }) => setPassword(target.value)} />
      </div>

      <button type="submit">login</button>
    </form>
  );
};

export default LoginForm;
