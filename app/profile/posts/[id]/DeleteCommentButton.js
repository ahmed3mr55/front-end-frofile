"use client";
import React from "react";

const DeleteCommentButton = async ({ commentId, token, onDeleteSuccess }) => {
  const handleDelete = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAN}/comment/${commentId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
          },
        }
      );

      if (res.ok) {
        console.log("Comment deleted successfully");
        if (onDeleteSuccess) {
          onDeleteSuccess(commentId);
        }
      } else {
        console.error("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <button onClick={handleDelete}>
      Delete
    </button>
  );
};

export default DeleteCommentButton;
ق