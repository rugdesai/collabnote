import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import NotePage from "./pages/notes";
import JoinNote from "./pages/JoinNote";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/notes/:id" element={<NotePage />} />
        <Route path="/join/:token" element={<JoinNote />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;