'use client';

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import style from './style.module.css';

export default function Createpost() {
  const router = useRouter(); // تأكد من تعريف useRouter
  const token = Cookies.get('token');

  useEffect(() => {
    if (!token) {
      router.push('/'); // إذا مفيش توكن، يتم التوجيه لصفحة تسجيل الدخول
    }
  }, [router, token]);

  const [form, setForm] = useState({
    body: '',
    postImg: '',
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAN}/posts/create`, {
        method: 'POST',
        headers: {
          'Authorization': token, // إرسال التوكن في الـ headers
          'Content-Type': 'application/json', // إضافة Content-Type
        },
        body: JSON.stringify({ postImg: form.postImg, body: form.body }),
      });

      const data = await res.json();

      if (res.ok) {
        // التوجيه بعد النجاح أو التعامل مع النجاح
        router.push('/profile/posts');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className={style.container}>
      <h1>Create Post</h1>
      <form className={style.form} onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter URL of image"
          value={form.postImg}
          onChange={(e) => {
            setForm({...form, postImg: e.target.value});
          }}
        />

        <input
          type="text"
          placeholder="Enter body content"
          value={form.body}
          onChange={(e) => setForm({...form, body: e.target.value})}
          required
        />
        <button type="submit">Create Post</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}
