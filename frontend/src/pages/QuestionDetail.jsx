import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

export default function QuestionDetail() {
  const { id } = useParams();
  const { user, token } = useAuth();

  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState("");

  // Fetch question and answers on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5030/api/questions/${id}`
        );
        setQuestion(res.data.question);
        setAnswers(res.data.answers);
      } catch (err) {
        console.error("Error fetching question:", err);
      }
    };

    fetchData();
  }, [id]);

  const handlePostAnswer = async () => {
    if (!user || !token) {
      alert("Please log in to post an answer.");
      return;
    }

    if (!newAnswer || newAnswer === "<p><br></p>") {
      alert("Answer cannot be empty.");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5030/api/answers/${id}`,
        { content: newAnswer },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnswers((prev) => [res.data, ...prev]);
      setNewAnswer("");
    } catch (err) {
      console.error("Failed to post answer:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-4 space-y-6">
      {question ? (
        <>
          <h1 className="text-2xl font-bold text-primary">{question.title}</h1>

          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: question.description }}
          />

          <div className="flex gap-2 flex-wrap">
            {question.tags.map((tag) => (
              <span key={tag} className="badge badge-outline">
                {tag}
              </span>
            ))}
          </div>

          <div className="divider">Answers</div>

          {answers.length === 0 ? (
            <p className="text-gray-500">
              No answers yet. Be the first to answer!
            </p>
          ) : (
            answers.map((ans) => (
              <div key={ans.id} className="flex gap-4 mb-6 items-start">
                <div className="bg-base-100 border rounded p-4 shadow w-full">
                  <div dangerouslySetInnerHTML={{ __html: ans.content }} />
                  <div className="text-sm mt-2 text-gray-500">
                    — {ans.author}
                    {ans.is_accepted && (
                      <span className="ml-2 text-success font-bold">
                        (Accepted)
                      </span>
                    )}
                  </div>
                  <div className="text-sm mt-1 font-semibold">
                    ⬆ {ans.votes}
                  </div>
                </div>
              </div>
            ))
          )}

          <div className="divider">Your Answer</div>

          {user ? (
            <>
              <ReactQuill
                theme="snow"
                value={newAnswer}
                onChange={setNewAnswer}
                className="quill-editor"
              />
              <button
                className="btn btn-primary mt-4"
                onClick={handlePostAnswer}
              >
                Post Answer
              </button>
            </>
          ) : (
            <p className="text-sm text-error mt-2">
              You must be logged in to answer.
            </p>
          )}
        </>
      ) : (
        <p className="text-center text-gray-500">Loading question...</p>
      )}
    </div>
  );
}
