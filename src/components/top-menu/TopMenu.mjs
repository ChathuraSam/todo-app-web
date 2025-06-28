const TopMenu = ({ isLoggedIn, profileName, onLogin, onLogout }) => (
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
      <strong>Hi Chathura</strong>
    </div>
    <div>
      {isLoggedIn ? (
        <>
          <span style={{ marginRight: "1rem" }}>Hello, {profileName}</span>
          <button onClick={onLogout}>Logout</button>
        </>
      ) : (
        <button onClick={onLogin}>Login</button>
      )}
    </div>
  </nav>
);

export default TopMenu;
