const Logout = ({ logout, name }) => {
  const handleLogout = (event) => {
    event.preventDefault();
    logout();
  };

  return (
    <div>
      You are logged in as {name}
      <button type="button" onClick={handleLogout} style={{ marginLeft: "10px" }}>
        logout
      </button>
    </div>
  );
};

export default Logout;
