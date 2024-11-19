import { cookies } from "next/headers"; // استيراد cookies من next/headers
import React from "react";
import style from "./style.module.css";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import CommentForm from "./CommentForm"; // استيراد نموذج التعليق
import LikeButton from "../../slices/Like/LikeButton";

const PostPage = async ({params}) => {
  const cookieStore = await cookies(); // الوصول إلى الكوكيز في بيئة السيرفر
  const token = cookieStore.get("token")?.value; // استخراج التوكن من الكوكيز
  const {id} = await params;

  if (!token) {
    return (
      <div>
        <p>Unauthorized. Please login first.</p>
      </div>
    );
  }

  // جلب بيانات البوست من API مع التوكن
  const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAN}/post/${id}`, {
    headers: {
      Authorization: token, // إرسال التوكن في الـ headers
    },
  });
  
  if (!res.ok) {
    return (
      <div>
        <p>Error fetching post. Please try again later.</p>
      </div>
    );
  }


  const { posts } = await res.json();
  const post = posts;


  // جلب التعليقات الخاصة بالبوست
  const commentsRes = await fetch(
    `${process.env.NEXT_PUBLIC_DOMAN}/post/${id}/comments`,
    {
      headers: {
        Authorization: token, // إرسال التوكن في الـ headers
      },
    }
  );

  if (!commentsRes.ok) {
    return (
      <div>
        <p>Error fetching comments. Please try again later.</p>
      </div>
    );
  }

  const commentsData = await commentsRes.json();
  const comments = commentsData.comments; // الحصول على التعليقات

  const resUser = await fetch(`${process.env.NEXT_PUBLIC_DOMAN}/profile`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  });

  if (!resUser.ok) {
    console.error("Failed to fetch user data");
    return <p>Error fetching user data.</p>;
  }

  const userData = await resUser.json();
  const user = userData.user || {}; // تعيين user ككائن فارغ إذا لم توجد بيانات
  console.log(user);

  return (
    <div className={style.body}>
      <div className={style.postTop}>
        <div className={style.post} key={post._id}>
          <div>
            <div className={style.postHeader}>
              <img
                className={style.userImg}
                src={post.userImage}
                alt={post.username}
              />{" "}
              <Link href={`/profile/${post.userId}`} className={style.username}>
                {post.username}
              </Link>
            </div>
            <div className={style.postBody}>
              <div className={style.postText}>
                <p>{post.body}</p>
                <p className={style.postDate}>
                  {formatDistanceToNow(new Date(post.date), {
                    addSuffix: true,
                  })}
                </p>
              </div>
              {post.postImg && (
                <div className={style.Img}>
                  <img className={style.postImg} src={post.postImg} />
                </div>
              )}
            </div>
          </div>
          <div className={style.postFooter}>
            <LikeButton
              postId={post._id}
              initialLikes={post.likes ? post.likes.length : 0}
            />
          </div>
        </div>
      </div>

      <CommentForm
        postId={post._id}
        userId={user._id}
        username={user.username}
        token={token}
      />

      {/* عرض الكومنتات */}
      <div className={style.commentsSection}>
        <h3>Comments</h3>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div className={style.comment} key={comment._id}>
              <div className={style.commentHeader}>
                <img
                  className={style.userImg}
                  src={comment.userImage}
                  alt={comment.username}
                />
                <p>{comment.username}</p>
              </div>
              <div className={style.commentBody}>
                <p>{comment.body}</p>
                <p>
                  {formatDistanceToNow(new Date(comment.date), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default PostPage;
