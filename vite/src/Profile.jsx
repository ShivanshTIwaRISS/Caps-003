import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./services/api";

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  const logoutNow = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const initial = name.charAt(0).toUpperCase();
  const saveChanges = async () => {
  try {
    const res = await api.put("/update-profile", {
      name,
      email,
    });

    localStorage.setItem("user", JSON.stringify(res.data.user));

    alert("Profile updated successfully!");
  } catch (err) {
    console.log(err);
    alert("Failed to update profile");
  }
};


  return (
    <div className="profile-wrapper">

      {/* SIDEBAR ========================================================= */}
      <aside className="profile-sidebar">

        <div className="profile-sidebar-user">
          <div className="profile-sidebar-avatar">{initial}</div>
          <h3>{name}</h3>
          <p>{email}</p>
        </div>

        <div className="profile-sidebar-links">
          <button onClick={() => navigate("/profile")}>👤 My Profile</button>
          {/* <button onClick={() => navigate("/orders")}>📦 My Orders</button> */}
        </div>

        <button className="sidebar-logout-btn" onClick={logoutNow}>
          🚪 Logout
        </button>
      </aside>



      {/* MAIN CONTENT ===================================================== */}
      <main className="profile-main">

        <h1 className="profile-title">Your Profile</h1>

        <div className="profile-card-big">

          <div className="profile-avatar-big">{initial}</div>

          <div className="profile-big-info">
            <h2>{name}</h2>
            <p>{email}</p>
          </div>

        </div>


        {/* EDIT SECTION =================================================== */}
        <div className="profile-edit-box">

          <h2 className="profile-section-head">Edit Account Info</h2>

          <div className="profile-field">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e)=>setName(e.target.value)}
            />
          </div>

          <div className="profile-field">
            <label>Email</label>
            <input
              type="text"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
            />
          </div>

          <button className="profile-save-btn" onClick={saveChanges}>
  Save Changes
</button>

        </div>


        

      </main>

    </div>
  );
}
