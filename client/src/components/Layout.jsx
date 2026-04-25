import { Link } from "react-router-dom";

const Layout = ({ children }) => {
  return (
    <div style={styles.container}>
      {/* Sidebar / Navbar */}
      <nav style={styles.nav}>
        <h2>💰 Budget App</h2>

        <div style={styles.links}>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/transactions">Transactions</Link>
          <Link to="/categories">Categories</Link>
        </div>
      </nav>

      {/* Main Content */}
      <main style={styles.main}>{children}</main>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
  },

  nav: {
    width: "220px",
    padding: "20px",
    borderRight: "1px solid #ddd",
  },

  links: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "20px",
  },

  main: {
    flex: 1,
    padding: "20px",
  },
};

export default Layout;