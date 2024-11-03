"use client"; // تعيين هذا المكون ليكون عميلًا

import React from "react";
import style from "./style.module.css";
import Cookies from "js-cookie";

const CommentForm = ({ postId }) => {
  const handleCommentSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const body = formData.get("commentBody");
    const token = Cookies.get("token");

    const commentRes = await fetch(`${process.env.NEXT_PUBLIC_DOMAN}/comment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        postId,
        body
      }),
    });

    if (commentRes.ok) {
      // يمكنك إعادة تحميل البيانات أو تحديث الواجهة كما تراه مناسبًا
      console.log("Comment added successfully");
      event.target.reset();
      window.location.reload();
    } else {
      console.error("Failed to add comment");
    }
  };

  return (
    <form className={style.formComment} onSubmit={handleCommentSubmit}>
      <textarea className={style.inputComment} name="commentBody" placeholder="Write a comment..." required></textarea>
      <button className={style.buttonComment} type="submit">Add Comment</button>
    </form>
  );
};

export default CommentForm;
