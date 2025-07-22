import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function Profile() {
  const { user } = useUser();

  const questions = [
    { id: 1, title: "How to use useEffect in React?", tags: ["React", "Hooks"] },
    { id: 2, title: "What is JWT and how does it work?", tags: ["JWT", "Auth"] },
  ];

  const answers = [
    { id: 1, content: "You can use useEffect to run side effects like data fetching." },
    { id: 2, content: "JWT is a token format used for stateless authentication." },
  ];

  return (
    <div className="min-h-screen bg-base-200 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* User Info */}
        <div className="bg-base-100 shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-1">{user.username}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>

        {/* Asked Questions */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Your Questions</h3>
          {questions.length === 0 ? (
            <p className="text-gray-500">You haven’t asked any questions yet.</p>
          ) : (
            <ul className="space-y-4">
              {questions.map((q) => (
                <li key={q.id} className="bg-base-100 p-4 rounded-lg shadow">
                  <Link to={`/questions/${q.id}`} className="text-lg font-semibold hover:underline">
                    {q.title}
                  </Link>
                  <p className="text-sm text-gray-400 mt-1">
                    {q.tags.map((tag) => (
                      <span
                        key={tag}
                        className="badge badge-outline badge-sm mr-2"
                      >
                        {tag}
                      </span>
                    ))}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Answered Questions */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Your Answers</h3>
          {answers.length === 0 ? (
            <p className="text-gray-500">You haven’t answered any questions yet.</p>
          ) : (
            <ul className="space-y-4">
              {answers.map((a) => (
                <li key={a.id} className="bg-base-100 p-4 rounded-lg shadow">
                  <p className="text-sm text-gray-700 line-clamp-2">{a.content}</p>
                  <Link
                    to={`/questions/${a.id}`}
                    className="text-primary text-sm mt-1 inline-block hover:underline"
                  >
                    View Question
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
