import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import style from "./style.module.css";
import Link from "next/link";
import LikeButton from "./Like/LikeButton";

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
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_DOMAN}/posts/all?limit=${limit}&skip=${skip}`,
        {
          method: "GET",
          headers: {
            Authorization: token,
          },
        }
      );

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
      if (
        window.innerHeight + document.documentElement.scrollTop + 50 >=
          document.documentElement.scrollHeight &&
        !loading
      ) {
        fetchPosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll); // تنظيف الحدث
  }, [loading]);

  // Function to copy post link to clipboard
  const handleShare = (postId) => {
    const postLink = `${window.location.origin}/profile/posts/${postId}`;
    navigator.clipboard
      .writeText(postLink)
      .then(() => {
        console.log("Link copied to clipboard");
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
      });
  };
  return (
    <>
      {posts.length > 0 ? (
        <div className={style.posts}>
          {posts.map((post) => (
            <div className={style.postBody} key={post._id}>
              <Link href={`/profile/posts/${post._id}`} className={style.post}>
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
              <div className={style.postFooter}>
                <div className={style.postLike}>
                  <LikeButton
                    postId={post._id}
                    initialLikes={post.likes ? post.likes.length : 0}
                    onLikeChange={(newLikes) => {
                      setPosts((prevPosts) =>
                        prevPosts.map((p) =>
                          p._id === post._id ? { ...p, likes: newLikes } : p
                        )
                      );
                    }}
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
                  <button 
                    onClick={() => handleShare(post._id)}
                    className={style.shareButton}
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
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
