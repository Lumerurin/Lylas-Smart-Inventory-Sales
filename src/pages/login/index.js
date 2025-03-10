import React, { useState } from "react";
import logo from "./logo.svg";

export const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Login successful");
        localStorage.setItem('username', data.username);
        localStorage.setItem('fullName', data.fullName);
        window.location.href = "/admin/dashboard";
      } else {
        const errorMessage = await response.text();
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className="w-screen h-screen flex justify-center mt-[8.938rem]">
      <section className="">
        <img src={logo} alt="logo" />
        <form onSubmit={handleLogin} className="flex flex-col gap-2 items-center">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="hover:bg-black hover:text-white shadow-md hover:cursor-pointer transition-all duration-100"
          >
            Login
          </button>
        </form>
      </section>
    </div>
  );
};