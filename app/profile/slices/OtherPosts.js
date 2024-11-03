import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import style from "./style.module.css";
import Link from "next/link";

export default function OtherPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  const limit = 10;
  const [skip, setSkip] = useState(0); // عدد البوستات اللي تم تحميلها

  const fetchPosts = async () => {
    if (loading || !hasMore) return;

    const token = Cookies.get("token");
    if (!token) {
      router.push("/");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAN}/posts/all?limit=${limit}&skip=${skip}`, {
        method: "GET",
        headers: {
          "Authorization": token,
        },
      });

      const data = await res.json();
      if (res.ok) {
        if (data.posts.length === 0) {
          setHasMore(false); // وقف التحميل إذا مفيش بوستات جديدة
        } else {
          setPosts((prevPosts) => [...prevPosts, ...data.posts]); // إضافة البوستات الجديدة
          setSkip(skip + data.posts.length); // تحديث عدد البوستات اللي تم تحميلها
          setHasMore(data.hasMore); // تحديث الحالة بناءً على القيمة من السيرفر
        }
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts(); // جلب أول دفعة من البوستات عند التحميل
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop + 50 >= document.documentElement.scrollHeight && !loading) {
        fetchPosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // تنظيف الحدث
  }, [loading]);

  return (
    <>
      {posts.length > 0 ? (
        <div className={style.posts}>
          {posts.map((post) => (
            <Link href={`/profile/posts/${post._id}`} className={style.post} key={post._id}>
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
      {loading && <p>Loading more posts...</p>}
      {!hasMore && <p>No more posts available.</p>}
    </>
  );
}
