import React from "react";
import { cookies } from "next/headers";
import style from "./style.module.css";
import Link from "next/link";

const ProfilePage = async (props) => {
  const cookieStore = cookies(); // الوصول إلى الكوكيز في بيئة السيرفر
  const token = cookieStore.get("token")?.value; // استخراج التوكن من الكوكيز
  const id = props.params.id;

  // طباعة التوكن والمعرف للتأكد من وجودهم

  if (!token) {
    return (
      <div>
        <p>Unauthorized. Please login first.</p>
      </div>
    );
  }

  // جلب البيانات من API مع التوكن
  const res = await fetch(`http://localhost:5000/user/${id}`, {
    headers: {
      Authorization: token, // لو محتاج تبعت التوكن
    },
  });
  if (!res.ok) {
    return (
      <div>
        <p>Error fetching user data. Please try again later.</p>
      </div>
    );
  }
  const user = await res.json();

  const res1 = await fetch(`http://localhost:5000/postsid/${id}`, {
    headers: {
      Authorization: token, // لو محتاج تبعت التوكن
    },
  });
  if (!res1.ok) {
    return (
      <div>
        <p>Error fetching user data. Please try again later.</p>
      </div>
    );
  }
  const posts = await res1.json();
  console.log(posts);

  return (
    <div>
      <div className={style.profile}>
        <div className={style.divImg}>
          <img src={user.userImage} alt="" />
        </div>
        <div className={style.info}>
          <h2 className={style.name}>
            {user.fullname}
            {user.verified && (
              <div className={style.verified}>
                <img src={user.verificationBadge} />
              </div>
            )}
          </h2>
          <h3 className={style.username}>@{user.username}</h3>
        </div>
      </div>

      <div>
        <div>
          <h1>Posts {user.fullname}</h1>
          {posts.length > 0 ? (
            <div className={style.posts}>
              {posts.map((post) => (
                <Link
                  href={`/profile/posts/${post._id}`}
                  className={style.post}
                  key={post._id}
                >
                  <div className={style.infoUser}>
                    <img className={style.userImg} src={post.userImage} />
                    <p className={style.username}>{post.username}</p>
                  </div>
                  <p>{post.body}</p>
                  {post.postImg && (
                    <div className={style.postImg}>
                      <img className={style.img} src={post.postImg} />
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <p>No posts found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
