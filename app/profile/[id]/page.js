import React from "react";
import { cookies } from "next/headers";
import style from "./style.module.css";
import Link from "next/link";
import LikeButton from "../slices/Like/LikeButton";
import FollowButton from "../slices/Follow/Follow";

const ProfilePage = async (props) => {
  const cookieStore = cookies();
  const token = cookieStore.get("token").value;

  // استخدام await مع params للتأكد من جاهزيتها
  const { id } = await props.params;

  if (!token) {
    return <p>Unauthorized. Please login first.</p>;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAN}/user/${id}`, {
    headers: { Authorization: token },
  });
  if (!res.ok) return <p>Error fetching user data.</p>;
  const user = await res.json();

  const res1 = await fetch(`${process.env.NEXT_PUBLIC_DOMAN}/postsid/${id}`, {
    headers: { Authorization: token },
  });
  if (!res1.ok) return <p>Error fetching posts data.</p>;
  const posts = await res1.json();

  return (
    <div className={style.container}>
      <div className={style.profile}>
        <div className={style.divImg}>
          <img
            src={
              user?.userImage?.url ||
              "https://cdn-icons-png.flaticon.com/256/149/149071.png"
            }
          />
        </div>
        <div className={style.info}>
          <h2 className={style.name}>
            {user.firstName} {user.lastName}
            {user.verified && (
              <img src={user.verificationBadge} className={style.verified} />
            )}
          </h2>
          <h3 className={style.username}>@{user.username}</h3>
          <div className={style.follow}>
            <p className={style.followers}>
              Followers{" "}
              <span>{user.followers ? user.followers.length : 0}</span>
            </p>
            <FollowButton userId={user._id} />
          </div>
          <div className={style.bio}>
              <p>{user.bio}</p>
            </div>
        </div>
      </div>

      <div>
        <h1>Posts {user.fullname}</h1>
        {posts.length > 0 ? (
          <div className={style.posts}>
            {posts.map((post) => (
              <div className={style.postBody} key={post._id}>
                <Link
                  href={`/profile/posts/${post._id}`}
                  className={style.post}
                >
                  <div className={style.infoUser}>
                    <img className={style.userImg} src={post.userImage} />
                    <p className={style.username}>
                    {post.username}{" "}
                    {post.verificationBadge && (
                        <img
                          src={post.verificationBadge}
                          alt="Verified Badge"
                          className={style.verifiedBadge}
                        />
                    )}
                    </p>
                  </div>
                  <p>{post.body}</p>
                  {post.postImg && (
                    <div className={style.postImg}>
                      <img className={style.img} src={post.postImg} />
                    </div>
                  )}
                </Link>
                <div className={style.postFooter}>
                  <div className={style.postLike}>
                    <LikeButton
                      postId={post._id}
                      initialLikes={post.likes ? post.likes.length : 0}
                    />
                  </div>
                  <div className={style.postComment}>
                    <Link
                      className={style.comment}
                      href={`/profile/posts/${post._id}`}
                    >
                      {post.comments ? post.comments.length : 0} comments
                    </Link>
                  </div>
                  <div className={style.postShare}>
                    <button className={style.shareButton}>Share</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No posts found.</p>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
