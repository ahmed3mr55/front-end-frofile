'use client';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import "./style.css";
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // التوجيه بعد التحقق من التوكن في الكوكيز
    if (Cookies.get('token')) {
      router.push('/profile');
    }
  }, []); // يتم التحقق من التوكن مرة واحدة بعد التهيئة الأولية

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAN}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // تخزين التوكن في الكوكيز
        Cookies.set('token', data.token, { expires: 7 });
        // التوجيه إلى صفحة البروفايل بعد تسجيل الدخول
        router.push('/profile');
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className='loginPage'>
      <h1>Login</h1>
      <form className='loginForm' onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className='createAccount'>
          <Link className='link' href="/register">Create account</Link>
        </div>
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}
