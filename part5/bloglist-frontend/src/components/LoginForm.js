const LoginForm = ({ login }) => {
  return (
    <form onSubmit={login.handleLogin}>
      <h2>Log in to application</h2>
      <div>
        username
        <input
          type="text"
          name="Username"
          value={login.username}
          onChange={({ target }) => login.setUsername(target.value)}
        />
      </div>

      <div>
        password
        <input
          type="text"
          name="Password"
          value={login.password}
          onChange={({ target }) => login.setPassword(target.value)}
        />
      </div>

      <button type="submit">login</button>
    </form>
  );
};

export default LoginForm;
