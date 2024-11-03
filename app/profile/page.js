"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import style from "./style.module.css";
import Link from "next/link";
import OtherPosts from "./slices/OtherPosts";

export default function ProfilePosts() {
  const [user, setUser] = useState([]);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get("token");
      const token1 = localStorage.setItem("token", token);

      const x = localStorage.getItem("token");
      console.log(x);

      if (!token) {
        router.push("/"); // إذا مفيش توكن، يتم التوجيه لصفحة تسجيل الدخول
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAN}/profile`, {
          method: "GET",
          headers: {
            Authorization: token, // إرسال التوكن في الـ headers
          },
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data); // تخزين البوستات في state
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("An error occurred while fetching User.");
      }
    };

    fetchUser();
  }, [router]);

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <div className={style.container}>
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
            <p className={style.email}>{user.email}</p>
          </div>
        </div>
        <div className={style.btns}>
          <Link className={style.btnCreate} href={"/profile/posts/create"}>
            Create Post
          </Link>
          <Link className={style.btnCreate} href={"/profile/posts"}>
            Your Posts
          </Link>
          <Link className={style.btnCreate} href={"/profile/foryou"}>
            For You
          </Link>
        </div>
      </div>

      <div className={style.posts}>
        <OtherPosts />
      </div>
    </>
  );
}
