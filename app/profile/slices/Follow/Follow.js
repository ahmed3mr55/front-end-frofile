"use client";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import style from "./style.module.css";

const FollowButton = ({ userId }) => {
  const [follow, setFollow] = useState(false);

  useEffect(() => {
    const checkFollowStatus = async () => {
      const token = Cookies.get("token");
      if (!token) return;

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAN}/profile/follow-status/${userId}`, {
          headers: {
            Authorization: token,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setFollow(data.isFollowing); // توقع أن السيرفر يرجع `isFollowing` إذا المستخدم بيتابع
        }
      } catch (err) {
        console.error("Error fetching follow status:", err);
      }
    };

    checkFollowStatus();
  }, [userId]);

  const handleFollow = async () => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAN}/profile/follow/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: token,
        },
      });

      if (res.ok) {
        setFollow(!follow); // تبديل حالة المتابعة
      }
    } catch (err) {
      console.error("Error updating follow:", err);
    }
  };

  return (
    <button className={style.btnFollow} onClick={handleFollow}>
      {follow ? "Unfollow" : "Follow"}
    </button>
  );
};

export default FollowButton;
