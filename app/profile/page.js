"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import style from "./style.module.css";
import Link from "next/link";
import OtherPosts from "./slices/OtherPosts";
import EditProfileModal from "./slices/EditProfileModal/EditProfileModal";

export default function ProfilePosts() {
  const [user, setUser] = useState([]);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null); // لحفظ رابط معاينة الصورة
  const [successMessage, setSuccessMessage] = useState(""); // لرسالة النجاح
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile)); // إنشاء رابط معاينة
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    const token = Cookies.get("token");
    const formData = new FormData();
    formData.append("image", file); // إضافة الصورة باسم "image" كما هو في الباك إند

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAN}/Porfile-photo-upload`, {
        method: "POST",
        headers: {
          Authorization: `${token}`, // إرسال التوكن في الهيدر
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        // تحديث صورة المستخدم في الواجهة
        setUser((prevUser) => ({
          ...prevUser,
          userImage: data.userImage,
        }));
        setSuccessMessage("The photo was uploaded successfully!"); // رسالة نجاح
        setTimeout(() => setSuccessMessage(""), 3000); // إخفاء الرسالة بعد 3 ثوانٍ
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("An error occurred while uploading the photo.");
    }
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get("token");

      if (!token) {
        router.push("/"); // إعادة التوجيه لصفحة تسجيل الدخول لو مفيش توكن
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAN}/profile`, {
          method: "GET",
          headers: {
            Authorization: `${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        setError("An error occurred while fetching User.");
      }
    };

    fetchUser();
  }, [router]);

  return (
    <div className={style.container}>
      <div className={style.profile}>
        <div className={style.img}>
          <div className={style.divImg}>
            <img
              src={preview || user?.userImage?.url || "https://cdn-icons-png.flaticon.com/256/149/149071.png"}
              alt="Profile"
            />
          </div>
          <form onSubmit={handleSubmit} className={style.formUpload}>
            <input
              type="file"
              name="file"
              id="file"
              className={style.inputFile}
              onChange={handleFileChange}
              placeholder="Upload Image"
              accept="image/*"
            />
            <button className={style.btnUpload} type="submit">
              Upload
            </button>
          </form>
          {successMessage && <p className={style.success}>{successMessage}</p>} {/* عرض رسالة النجاح */}
        </div>
        <div className={style.info}>
          <h2 className={style.name}>
            {user.firstName} {user.lastName}
            {user.verified && (
              <div className={style.verified}>
                <img src={user.verificationBadge} alt="Verified Badge" />
              </div>
            )}
          </h2>
          <h3 className={style.username}>@{user.username}</h3>
          <p className={style.email}>{user.email}</p>
          <div className={style.follow}>
            <p className={style.followers}>
              Followers <span>{user.followers ? user.followers.length : 0}</span>
            </p>
            <p className={style.followers}>
              Following <span>{user.following ? user.following.length : 0}</span>
            </p>
          </div>
          <div className={style.bio}>
            <p>{user.bio}</p>
          </div>
        </div>
        <div>
          <button className={style.edit} onClick={() => setShowEditModal(true)}>Edit Profile</button>
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
      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateUser}
          className={style.editModal}
        />
      )}
      <OtherPosts />
    </div>
  );
}
