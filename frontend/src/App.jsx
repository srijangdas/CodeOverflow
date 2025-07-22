import { BrowserRouter, Routes, Route } from "react-router-dom";
import AskQuestion from "./pages/AskQuestion";
import Home from "./pages/Home";
import QuestionDetail from "./pages/QuestionDetail";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <div data-theme="abyss" className="min-h-screen bg-base-200 flex flex-col">
        <Navbar />
        <div className="flex-grow px-4 py-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/ask" element={<AskQuestion />} />
            <Route path="/question/:id" element={<QuestionDetail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
