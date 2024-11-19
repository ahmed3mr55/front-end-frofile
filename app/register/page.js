"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import style from "./style.module.css";
import Cookies from "js-cookie";
import Link from "next/link";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [gender, setGender] = useState("");
  const [error, setError] = useState("");
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
      const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAN}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          username,
          firstName,
          lastName,
          gender,
        }),
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
      setError(err.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <form className={style.container} onSubmit={handleSubmit}>
      <h1 className={style.title}>Register Page</h1>
        <div className={style.inputs}>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div className={style.inputs}>
        <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className={style.inputs}>
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
        </div>

        <select value={gender} onChange={(e) => setGender(e.target.value)}> 
          <option disabled value=''>Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <Link className={style.link} href="/">Login here</Link>

        <button type="submit">Register</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}
