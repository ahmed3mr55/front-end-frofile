"use client";
import { useState } from "react";
import Cookies from "js-cookie";
import style from "./style.module.css";

const LikeButton = ({ postId, initialLikes }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAN}/posts/like/${postId}`, {
        method: "PUT",
        headers: {
          Authorization: token,
        },
      });

      if (res.ok) {
        const updatedPost = await res.json();
        setLikes(updatedPost.likes.length);
        setLiked(!liked);
      }
    } catch (err) {
      console.error("Error updating like:", err);
    }
  };

  return (
    <button
      className={style.btnLikes}
      onClick={handleLike}
    >
      {likes} likes
    </button>
  );
};

export default LikeButton;
