import { useState } from "react";
import Button from "../components/common/button";
import stripes from "../assets/stripes.jpg";
import api from "../services/api";
import { Link } from "react-router-dom";


const Register = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleRegister = async () => {
  console.log("Register button clicked");

  if (password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }

  try {
    setLoading(true);

    const response = await api.post("/auth/register", {
      email,
      password,
    });

    alert("Registration Successful!");

    console.log(response.data);

    window.location.href = "/";
  } catch (error: any) {
    console.error(error);

    alert(error.response?.data?.message || "Registration Failed");
  } finally {
    setLoading(false);
  }
};

    
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">

    <div className="w-full max-w-[1000px] h-[450px] bg-zinc-900 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-2">
        

    {/* Left */}
<div className="bg-zinc-900 flex flex-col justify-center px-14 pt-5">

    <h1 className="text-3xl font-light text-white leading-tight">
        Create your{" "}
        <span
        className="font-serif italic font-semisemibold"
        style={{ color: "#F4D953" }}
        >
            Collab!
</span>
    </h1>

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
  placeholder="Password"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  
    className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition-all focus:border-blue-500"
    />
    <input
  type="password"
  placeholder="Confirm Password"
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
  className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none transition-all focus:border-[#F4D953]"
/>

    <Button
  type="button"
  onClick={handleRegister}
>
  {loading ? "Registering..." : "Register"}
</Button>

    <p className="mt-6 text-center text-sm text-zinc-400">
    Already have an account?{" "}
    <Link
  to="/"
  className="cursor-pointer text-[#F4D953] hover:underline"
>
  Login
</Link>
    </p>

    {/* Floating Dust */}
<div className="absolute inset-0 overflow-hidden pointer-events-none">
  {[...Array(50)].map((_, i) => {
    const size = Math.random() * 6 + 2;

    return (
      <div
        key={i}
        className="absolute rounded-full bg-[#F6E27A]"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          opacity: Math.random() * 0.2 + 0.05,
          animation: `float ${6 + Math.random() * 8}s ease-in-out infinite`,
          animationDelay: `${Math.random() * 8}s`,
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
    backgroundImage: `url(${stripes})`,
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

export default Register;