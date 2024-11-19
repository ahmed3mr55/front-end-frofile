"use client";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import style from "./style.module.css";
import Link from "next/link";
import OtherPosts from "./slices/OtherPosts";
import EditProfileModal from "./slices/EditProfileModal/EditProfileModal";
import DeleteProfileButton from "./slices/DeleteProfileButton/DeleteProfileButton";



export default function ProfilePosts() {
  const [user, setUser] = useState([]);
  const [error, setError] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [showEditModal, setShowEditModal] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) {
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setIsLoading(true);

    const token = Cookies.get("token");
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAN}/profile-photo-upload`, {
        method: "POST",
        headers: {
          Authorization: token,
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setUser((prevUser) => ({
          ...prevUser,
          userImage: data.userImage,
        }));
        setSuccessMessage("The photo was uploaded successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("An error occurred while uploading the photo.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const token = Cookies.get("token");

      if (!token) {
        router.push("/");
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAN}/profile`, {
          method: "GET",
          headers: {
            Authorization: token,
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
              accept="image/*"
            />
            <button className={style.btnUpload} type="submit" disabled={!file || isLoading}>
              {isLoading ? "Uploading..." : "Upload"}
            </button>
          </form>
          {successMessage && <p className={style.success}>{successMessage}</p>}
          {error && <p className={style.error}>{error}</p>}
        </div>
        
        <div className={style.info}>
          <h2 className={style.name}>
            {user?.firstName || "First Name"} {user?.lastName || "Last Name"}
            {user.verified && (
              <img src={user.verificationBadge} className={style.verified} />
            )}
          </h2>
          <h3 className={style.username}>@{user?.username || "Username"}</h3>
          <p className={style.email}>{user?.email || "Email not provided"}</p>
          <div className={style.follow}>
            <p className={style.followers}>
              Followers <span>{user?.followers?.length || 0}</span>
            </p>
            <p className={style.followers}>
              Following <span>{user?.following?.length || 0}</span>
            </p>
          </div>
          <div className={style.bio}>
            <p>{user?.bio || "No bio available"}</p>
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
          onUpdate={(updatedUser) => setUser(updatedUser)}
          className={style.editModal}
        />
      )}
      <OtherPosts />
      <DeleteProfileButton token={Cookies.get("token")} />
    </div>
  );
}
