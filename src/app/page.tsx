"use client";
import { useState } from "react";

export default function Home() {

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
    </div>
  );
}
