import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto flex justify-between">
        <h1 className="font-bold text-xl">CollabNote</h1>

        <div className="flex gap-4">
          <Link to="/">Home</Link>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/editor">Editor</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;