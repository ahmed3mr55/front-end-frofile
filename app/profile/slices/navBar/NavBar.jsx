"use client";
import Link from 'next/link';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import "./style.css";

const Navbar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const token = Cookies.get("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAN}/logout`, {
        method: "POST",
        headers: {
          Authorization: token,
        },
      });

      if (res.ok) {
        Cookies.remove("token"); // حذف التوكن من الكوكيز
        router.push("/"); // توجيه المستخدم لصفحة الدخول
      } else {
        console.error("Failed to log out");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <nav>
      <Link className='logo' href="#">Cycle</Link>
      <ul>
        <li><Link className='itam' href="/profile">Profile</Link></li>
        <li><Link className='itam' href="/profile/posts/create">Create</Link></li>
        <li>
          <button  className='itam logout' onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
