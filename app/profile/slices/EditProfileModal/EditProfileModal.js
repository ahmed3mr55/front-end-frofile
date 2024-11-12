"use client";
import { useState } from "react";
import Cookies from "js-cookie";
import style from "./style.module.css";

export default function EditProfileModal({ user, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    username: user.username || "",
    email: user.email || "",
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    bio: user.bio || "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAN}/profile/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(formData),
      });
  
      const data = await res.json();
  
      if (res.ok) {
        Cookies.set("token", data.token); // Update token in cookies
        onUpdate(data.user); // تحديث بيانات المستخدم
        onClose(); // إغلاق النافذة
      } else {
        setError(data.message || "Failed to update profile. Please try again.");
      }
    } catch (err) {
      setError(`Error: ${err.message || "An unexpected error occurred while updating profile."}`);
    }
  };
  

  return (
    <div className={style.modalOverlay}>
      <div className={style.modalContent}>
        <button className={style.closeButton} onClick={onClose}>
          X
        </button>
        <h2>Edit Profile</h2>
        <form onSubmit={handleSubmit} className={style.form}>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <label>Full Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />

          <label>Bio</label>
          <textarea name="bio" value={formData.bio} onChange={handleChange} />
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {error && <p className={style.error}>{error}</p>}
          <button type="submit" className={style.saveButton}>
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
