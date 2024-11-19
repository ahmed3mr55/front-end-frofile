"use client";
import React from "react";
import { useRouter } from 'next/navigation';
import Cookies from "js-cookie";
import { Router } from "next/router";

const DeleteProfileButton = ({ token }) => {
  const handleDelete = async () => {
    const confirmDelete = confirm(
      "Are you sure you want to delete your profile? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAN}/profile/delete`, {
        method: "DELETE",
        headers: {
          Authorization: token,
        },
      });

      if (res.ok) {
        alert("Profile deleted successfully.");
        // يمكنك إعادة توجيه المستخدم إلى صفحة تسجيل الدخول
        Cookies.remove("token");
        router.push('/');
      } else {
        const errorData = await res.json();
        alert(`Failed to delete profile: ${errorData.message}`);
      }
    } catch (error) {
      alert("An error occurred while deleting your profile.");
      console.error("Error:", error);
    }
  };

  return (
    <button onClick={handleDelete} style={buttonStyle}>
      Delete Profile
    </button>
  );
};

const buttonStyle = {
  backgroundColor: "#FF4D4D",
  color: "white",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
};

export default DeleteProfileButton;
