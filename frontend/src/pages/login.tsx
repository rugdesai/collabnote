import { isAxiosError } from "axios";
import { useState } from "react";
import Button from "../components/common/button";
import api from "../services/api";
import { Link } from "react-router-dom";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
  try {

    setLoading(true);


    const response = await api.post("/auth/login", {
      email,
      password,
    });


    localStorage.setItem(
      "token",
      response.data.token
    );

    localStorage.setItem(
  "email",
  email
);

    const pendingInvite =
      localStorage.getItem("pendingInvite");


    if (pendingInvite) {

      localStorage.removeItem("pendingInvite");

      window.location.href =
        `/join/${encodeURIComponent(pendingInvite)}`;

    } 
    
    else {

      window.location.href =
        "/dashboard";

    }


  } catch (error: unknown) {

    console.error(error);

    alert(
      (isAxiosError(error) && error.response?.data?.message) ||
      "Login Failed"
    );


  } finally {

    setLoading(false);

  }
};
    
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">

    <div className="w-full max-w-[1000px] min-h-[450px] bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-2">
        

    {/* Left */}
<div className="bg-zinc-900 flex flex-col justify-center px-6 py-8 md:px-14">

    <h1 className="text-3xl font-light text-white leading-tight">
        Welcome to{" "}
        <span
        className="font-serif italic font-semisemibold"
        style={{ color: "#f4d953" }}
        >
            CollabNote
        </span>
    </h1>
    <p className="mt-3 text-sm text-zinc-400">
        Sign in to continue collaborating with your team.
    </p>

    <form className="mt-10 flex flex-col gap-5">

    <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="Email"
    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition-all focus:border-blue-500"
    />
    <input
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Password"
    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition-all focus:border-blue-500"
    />

    <Button
    disabled={loading}
    type="button"
    onClick={handleLogin}
>

    {loading ? "Logging in..." : "Login"}

</Button>

    <p className="mt-6 text-center text-sm text-zinc-400">
    Don't have an account?{" "}
    <Link
  to="/register"
  className="cursor-pointer text-[#F4D953] hover:underline"
>
  Register
</Link>
    </p>

    {/* Floating Dust */}
<div className="absolute inset-0 overflow-hidden pointer-events-none">
  {[...Array(50)].map((_, i) => {
    const size = ((i * 37 + 11) % 101) / 101 * 6 + 2;

    return (
      <div
        key={i}
        className="absolute rounded-full bg-[#F6E27A]"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          top: `${((i * 37 + 11) % 101) / 101 * 100}%`,
          left: `${((i * 37 + 11) % 101) / 101 * 100}%`,
          opacity: ((i * 37 + 11) % 101) / 101 * 0.2 + 0.05,
          animation: `float ${6 + ((i * 37 + 11) % 101) / 101 * 8}s ease-in-out infinite`,
          animationDelay: `${((i * 37 + 11) % 101) / 101 * 8}s`,
        }}
      />
    );
  })}
</div>


</form>

    </div>

    <div
  className="relative overflow-hidden"
  style={{
    backgroundImage: "repeating-linear-gradient(135deg, #302b17 0px, #302b17 28px, #171717 28px, #171717 56px)",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-black/35"></div>

  {/* Text */}
  <div className="relative z-10 flex h-full flex-col justify-end p-10">

    <h1 className="text-4xl font-bold leading-tight text-white">
      Every great idea
      <br />
      starts with
      <br />
      <span className="italic text-[#F4D953]">
        a note.
      </span>
    </h1>

    <p className="mt-5 max-w-xs text-sm leading-6 text-zinc-200">
      Collaborate with your team in real-time, organize your thoughts,
      and turn ideas into reality.
    </p>

  </div>
</div>

  </div>

</div>
  );
};

export default Login;