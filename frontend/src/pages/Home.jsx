import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get("http://localhost:5030/api/questions");
        setQuestions(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Error fetching questions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  if (loading) return <p className="text-center py-8">Loading questions...</p>;

  console.log(questions);
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-6">
        📋 Recent Questions
      </h1>

      {questions.map((q) => (
        <div
          key={q.id}
          className="card bg-base-100 shadow-md hover:shadow-lg transition duration-300 border border-base-300"
        >
          <div className="card-body space-y-2">
            <div className="flex justify-between items-center">
              <Link
                to={`/question/${q.id}`}
                className="text-xl font-semibold text-primary hover:underline"
              >
                {q.title}
              </Link>

              <div className="text-sm text-gray-500">
                ⬆️ {q.upvotes} | 💬 {q.answer_count}
              </div>
            </div>

            <p className="text-gray-600 text-sm">
              {q.description.slice(0, 120)}...
            </p>

            <div className="flex gap-2 flex-wrap pt-2">
              {q.tags.map((tag, index) => (
                <div
                  key={index}
                  className="badge badge-outline badge-sm font-mono"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
