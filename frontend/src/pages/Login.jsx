import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        username,
        password
      });

      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        alert(res.data.error);
      }

    } catch (err) {
      console.log(err);
    }
  };

  const handleRegister = async () => {
    await axios.post("http://localhost:5000/auth/register", {
      username,
      password
    });

    alert("User Registered");
  };

  return (
    <div style={styles.container}>

      <h2>🌿 BIAGRO LOGIN</h2>

      <input
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
        style={styles.input}
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        style={styles.input}
      />

      <button onClick={handleLogin} style={styles.btn}>
        Login
      </button>

      <button onClick={handleRegister} style={styles.btn2}>
        Register
      </button>

    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    marginTop: "100px",
    color: "white"
  },
  input: {
    display: "block",
    margin: "10px auto",
    padding: "10px",
    width: "200px"
  },
  btn: {
    padding: "10px",
    margin: "5px",
    background: "#2e7d32",
    color: "white",
    border: "none"
  },
  btn2: {
    padding: "10px",
    margin: "5px",
    background: "#145a2a",
    color: "white",
    border: "none"
  }
};