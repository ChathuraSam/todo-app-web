const TopMenu = ({ isLoggedIn, username, onLogin, onLogout }) => (
  <nav
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "1rem",
      background: "#f5f5f5",
    }}
  >
    <div>
      <strong>Hi {username}</strong>
    </div>
    <div>
      {isLoggedIn ? (
        <>
          <button onClick={onLogout}>Logout</button>
        </>
      ) : (
        <button onClick={onLogin}>Login</button>
      )}
    </div>
  </nav>
);

export default TopMenu;
