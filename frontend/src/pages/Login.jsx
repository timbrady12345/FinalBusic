import { useState, useContext } from "react";
import { UserContext } from "../conProv/UserContext";

export default function Login() {
  //User
  const { setUser } = useContext(UserContext);

  // LOGIN STATE
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // SIGNUP STATE
  const [signupEmail, setSignupEmail] = useState("");
  const [signupUsername, setUsername] = useState("");
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
          username: loginUsername,
          password: loginPassword,
        }),
      });

      const data = await res.json();
      console.log(data);

      if (!res.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      } else {
        setSuccess(data.error || "You Logged In!");
      }

      setUser(data.user);
      localStorage.setItem("token", data.token);

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
          username: signupUsername,
          password: signupPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Signup failed");
        setLoading(false);
        return;
      } else {
        setSuccess(data.error || "Woo!");
      }

      //window.location.href = "/Login";
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="p-2">
      <div className="flex h-32 text-3xl w-screen items-center justify-center">
        Are you Chinese?
      </div>
      {/* LOGIN */}
      <div className="login-container flex w-screen justify-center">
        <form onSubmit={handleLogin}>
          <h2>Login</h2>

          <input
            type="username"
            placeholder="Username"
            value={loginUsername}
            onChange={(e) => setLoginUsername(e.target.value)}
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
      <div className="signup-container flex w-screen justify-center">
        <form onSubmit={handleSignup}>
          <h2>Sign Up</h2>

          <input
            type="email"
            placeholder="Email"
            value={signupEmail}
            onChange={(e) => setSignupEmail(e.target.value)}
            required
          />

          <input
            type="username"
            placeholder="Username"
            value={signupUsername}
            onChange={(e) => setUsername(e.target.value)}
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
      {error && <p className="error flex w-screen justify-center">{error}</p>}
      {success && (
        <p className="success flex w-screen justify-center">{success}</p>
      )}
    </div>
  );
}
