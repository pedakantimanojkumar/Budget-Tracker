import { useEffect, useState } from "react";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // TEMP: get email from localStorage (we’ll improve later)
    const email = localStorage.getItem("email");

    setUser({ email });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");

    window.location.href = "/login";
  };

  return (
    <div>
      <h2>Profile Page</h2>

      {user && (
        <div>
          <p>Email: {user.email}</p>
        </div>
      )}

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Profile;