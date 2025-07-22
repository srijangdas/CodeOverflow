import { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AskQuestion() {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState([]);
  const [description, setDescription] = useState("");
  const { user, token } = useAuth();
  const [userID, setUserID] = useState("");
  const navigate = useNavigate();

  const availableTags = ["React", "JWT", "Tailwind", "Node.js"];

  const handleTagToggle = (tag) => {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmit = async (e) => {
    setUserID(user.username);
    e.preventDefault();

    if (!token) {
      alert("Please login to ask a question.");
      return;
    }

    console.log({ title, tags, description });
    try {
      const res = await axios.post(
        "http://localhost:5030/api/questions",
        {
          title,
          tags,
          description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
      console.log(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-4 space-y-6">
      <h2 className="text-2xl font-bold">Ask a Question</h2>

      {/* Title input */}
      <input
        type="text"
        placeholder="Enter question title"
        className="input input-bordered w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Tag dropdown */}
      <div className="dropdown">
        <label tabIndex={0} className="btn btn-outline">
          Select Tags ({tags.length})
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
        >
          {availableTags.map((tag) => (
            <li key={tag}>
              <label className="cursor-pointer label">
                <input
                  type="checkbox"
                  className="checkbox checkbox-sm"
                  checked={tags.includes(tag)}
                  onChange={() => handleTagToggle(tag)}
                />
                <span className="label-text ml-2">{tag}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* Rich text editor */}
      <ReactQuill
        theme="snow"
        value={description}
        onChange={setDescription}
        placeholder="Write your question here..."
        className="quill-editor"
      />

      <button className="btn btn-primary" onClick={handleSubmit}>
        Submit Question
      </button>
    </div>
  );
}
