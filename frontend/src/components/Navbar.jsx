import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="bg-base-100 shadow-md h-16 flex items-center px-4">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl text-primary font-bold">
          Code Overflow
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Link to="/" className="btn btn-sm btn-ghost">
          Home
        </Link>
        <Link to="/ask" className="btn btn-sm btn-ghost">
          Ask
        </Link>

        {user ? (
          <>
            <div className="hidden sm:block text-sm">👤 {user.username}</div>
            <Link to="/profile" className="btn btn-sm btn-ghost">
              Profile
            </Link>
            <button onClick={logout} className="btn btn-sm btn-error">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-sm btn-primary">
              Login
            </Link>
            <Link to="/register" className="btn btn-sm btn-secondary">
              Register
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
