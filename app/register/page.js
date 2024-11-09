"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import style from "./style.module.css";
import Cookies from "js-cookie";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [userImage, setUserImage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const imageToUse =
      userImage || "https://cdn-icons-png.flaticon.com/256/149/149071.png";

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
          fullname,
          userImage: imageToUse, // استخدام الصورة الافتراضية عند الحاجة
        }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/"); // إعادة توجيه بعد النجاح
      } else {
        setError(
          data.message || "Registration failed. Please check your inputs."
        );
      }
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <h1 className={style.title}>Register</h1>
      <form className={style.container} onSubmit={handleSubmit}>
        <div className={style.inputs}>
          <input
            type="text"
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
          />
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
        <div className={style.inputs}>
          <input
            type="text"
            placeholder="URL UserImg"
            value={userImage}
            onChange={(e) => setUserImage(e.target.value)}
          />
        </div>

        <button type="submit">Register</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}
