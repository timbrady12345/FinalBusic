import { useState } from "react";

export default function Login() {
  // LOGIN STATE
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // SIGNUP STATE
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      } else {
        setSuccess(data.error || "Woo!");
      }

      // localStorage.setItem("token", data.token);

      setSuccess("User created successfully! You can now log in.");
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signupEmail,
          password: signupPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      } else {
        setError(data.error || "Woo!");
      }

      //window.location.href = "/Login";
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div>
      {/* LOGIN */}
      <div className="login-container">
        <form onSubmit={handleLogin}>
          <h2>Login</h2>

          {error && <p className="error">{}</p>}

          <input
            type="email"
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
            required
          />

          <button disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>

      {/* SIGNUP */}
      <div className="signup-container">
        <form onSubmit={handleSignup}>
          <h2>Sign Up</h2>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <input
            type="email"
            placeholder="Email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={signupPassword}
            onChange={(e) => setSignupPassword(e.target.value)}
            required
          />

          <button disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
