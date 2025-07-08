import Image from "next/image";

export default function Home() {
<<<<<<<<< Temporary merge branch 1
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for form submission logic
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#f5f6fa"
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fff",
          padding: "2rem",
          borderRadius: "8px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          minWidth: "320px"
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Login</h1>
        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="email" style={{ display: "block", marginBottom: ".5rem" }}>Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: ".5rem",
              borderRadius: "4px",
              border: "1px solid #ccc"
            }}
          />
        </div>
        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="password" style={{ display: "block", marginBottom: ".5rem" }}>Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: ".5rem",
              borderRadius: "4px",
              border: "1px solid #ccc"
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: ".75rem",
            borderRadius: "4px",
            border: "none",
            background: "#0070f3",
            color: "#fff",
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer"
          }}
        >
          Login
        </button>
      </form>
=========
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
  {/* Left side: Image + logo */}
  <div className="hidden md:block relative">
    <img
      src="/LoginBG.png"
      alt="Login background"
      className="absolute inset-0 object-cover w-full h-full"
    />
    <div className="absolute inset-0 bg-black/40" />
    <div className="relative z-10 flex h-full items-center justify-center">
      <img src="/logo.svg" alt="Logo" className="w-24 h-24" />
    </div>
  </div>

  {/* Right side: Login form */}
  <div className="flex flex-col justify-center items-center px-6 sm:px-12 py-12">
    <div className="w-full max-w-md">
      <h1 className="text-2xl font-bold">Login</h1>
      <p className="text-gray-500 mt-2">
        Enter your email below to login to your account
      </p>

      {/* Email */}
      <div className="mt-6">
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          placeholder="m@example"
          className="mt-1 w-full border rounded px-3 py-2 outline-orange-500"
        />
      </div>

      {/* Password */}
      <div className="mt-4">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium">Password</label>
          <a href="#" className="text-orange-500 text-sm font-medium">
            Forgot?
          </a>
        </div>
        <input
          type="password"
          placeholder="••••••••"
          className="mt-1 w-full border rounded px-3 py-2 outline-orange-500"
        />
      </div>

      {/* Error message */}
      <p className="text-sm text-red-500 mt-3">
        ❌ Incorrect username or password.
      </p>

      {/* Login button */}
      <button className="mt-4 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600">
        Login
      </button>

      {/* Google login */}
      <button className="mt-3 w-full border py-2 rounded flex items-center justify-center gap-2 hover:bg-gray-100">
        <img src="/Google.svg" alt="Google" className="w-5 h-5" />
        Login with Google
      </button>

      {/* Sign up link */}
      <p className="mt-6 text-center text-sm">
        Don’t have an account?{" "}
        <a href="#" className="text-orange-500 font-medium">
          Sign up
        </a>
      </p>

      {/* Footer */}
      <p className="mt-10 text-center text-xs text-gray-400">
        Crafted with ❤️ by OneXAPIs team
      </p>
>>>>>>>>> Temporary merge branch 2
    </div>
  );
}
