const Logout = ({ user, handleLogout }) => {
  return (
    <div>
      You are logged in as {user.name}
      <button type="button" onClick={handleLogout}>
        logout
      </button>
    </div>
  );
};

export default Logout;
