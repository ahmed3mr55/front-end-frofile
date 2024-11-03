'use client';

import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import style from './style.module.css';
import Link from 'next/link';

export default function ProfilePosts() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      const token = Cookies.get('token');
      
      if (!token) {
        router.push('/'); // إذا مفيش توكن، يتم التوجيه لصفحة تسجيل الدخول
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/posts', {
          method: 'GET',
          headers: {
            'Authorization': token, // إرسال التوكن في الـ headers
          },
        });

        const data = await res.json();

        if (res.ok) {
          setPosts(data); // تخزين البوستات في state
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError('An error occurred while fetching posts.');
      }
    };

    fetchPosts();
  }, [router]);

  const handleDelete = async (postId) => {
    const token = Cookies.get('token');

    if (!token) {
      router.push('/'); // إذا مفيش توكن، يتم التوجيه لصفحة تسجيل الدخول
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/posts/delete/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token, // إرسال التوكن في الـ headers
        },
      });

      const data = await res.json();

      if (res.ok) {
        // إذا تم الحذف بنجاح، نقوم بإزالة البوست من الحالة
        setPosts(posts.filter(post => post._id !== postId));
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred while deleting the post.');
    }
  };

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <h1>Your Posts</h1>
      <Link className={style.back} back href={"/profile"}>Go to Profile</Link>
      {posts.length > 0 ? (
        <div className={style.posts}>
          {posts.map((post) => (
            <div className={style.post} key={post._id}>
              <Link href={`/profile/posts/${post._id}`}>
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
              {/* زر الحذف */}
              <button onClick={() => handleDelete(post._id)} className={style.deleteButton}>
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No posts found.</p>
      )}
    </>
  );
}
