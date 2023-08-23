/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

export default function Login({onLogin}) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }
  async function onSubmit(e) {
    e.preventDefault();
    const authData = { ...form };
    if (form.email === "" || form.password === "") return;
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(authData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      setErrorMessage(errorData.error);
    }
    else{
      onLogin();
      const successData = await response.json();
      setSuccessMessage(successData.message);
    }

    setForm({ email: "", password: "" });
    navigate("/");
  }
  return (
<div className="d-flex justify-content-center align-items-center vh-100">
  <div>
    <h3 className="text-center">Log In</h3>
    <form onSubmit={onSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          className="form-control"
          id="email"
          value={form.email}
          onChange={(e) => updateForm({ ...form, email: e.target.value })}
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className="form-control"
          id="password"
          value={form.password}
          onChange={(e) => updateForm({ ...form, password: e.target.value })}
        />
      </div>

      <div className="form-group text-center">
        <input type="submit" value="Log In" className="btn btn-primary" />
      </div>
    </form>
  </div>
</div>
  );
}
