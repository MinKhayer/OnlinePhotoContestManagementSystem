import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";

export default function CreateContest() {
  const [form, setForm] = useState({
    title: "",
    category: "",
    duration: "",
    fee: "",
  });
  const navigate = useNavigate();

  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }
  async function onSubmit(e) {
    e.preventDefault();
    const contestData = { ...form };
    if(form.title === "" || form.category === "" || form.duration === "" || form.fee === "") return
    await fetch("http://localhost:5000/contest/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(contestData),
    }).catch((error) => {
      window.alert(error);
      return;
    });
    setForm({ title: "", category: "", duration: "", fee: "" });
    navigate("/");
  }
  
  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div>
        <h3 className="text-center">Create Contest</h3>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              className="form-control"
              id="title"
              value={form.title}
              onChange={(e) => updateForm({ title: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              className="form-control"
              id="category"
              value={form.category}
              onChange={(e) => updateForm({ category: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="duration">Duration</label>
            <input
              type="date"
              className="form-control"
              id="duration"
              value={form.duration}
              onChange={(e) => updateForm({ duration: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="fee">Fee</label>
            <input
              type="number"
              className="form-control"
              id="fee"
              value={form.fee}
              onChange={(e) => updateForm({ fee: e.target.value })}
            />
          </div>
          <div className="form-group text-center">
            <input type="submit" value="Create Contest" className="btn btn-primary" />
          </div>
        </form>
      </div>
    </div>
  );
}
