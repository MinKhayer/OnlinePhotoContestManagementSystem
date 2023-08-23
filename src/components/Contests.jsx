/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Link } from "react-router-dom";
import { Modal, Button } from "react-bootstrap"; // Import Bootstrap modal components

function ContestList({ isLoggedIn }) {
  const [contests, setContests] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  useEffect(() => {
    async function fetchContests() {
      try {
        const response = await fetch("http://localhost:5000/contest", {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch contests");
        }

        const data = await response.json();
        setContests(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchContests();
  }, []);

  async function handleParticipate(contestId) {
    try {
      const response = await fetch(
        `http://localhost:5000/contest/${contestId}/participate`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
        setShowErrorModal(true); // Show error modal
        setShowSuccessModal(false); // Hide success modal
      } else {
        const successData = await response.json();
        setSuccessMessage(successData.message);
        setShowErrorModal(false); // Hide error modal
        setShowSuccessModal(true); // Show success modal
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      {isLoggedIn && (
        <>
          <h3 style={{ margin: "5px" }}>Contests that are going on</h3>
          <div className="card-container d-flex flex-wrap">
            {contests.map((contest) => (
              <div key={contest._id} className="card col-md-4 mb-3">
                <div className="card-body">
                  <h5 className="card-title">{contest.title}</h5>
                  <p className="card-text">{contest.category}</p>
                  <p className="card-text">
                    <b>Fee :</b>
                    {contest.fee}
                  </p>
                  <p className="card-text">
                    <b>Open upto :</b>
                    {contest.duration}
                  </p>
                  <div className="button-container">
                    <button
                      className="btn btn-primary mr-2 mb-2"
                      onClick={() => {
                        handleParticipate(contest._id);
                        setErrorMessage(""); // Clear error message
                      }}
                      style={{ margin: "5px" }}
                    >
                      Participate
                    </button>
                    <Link
                      to={`/payment/${contest._id}`}
                      className="btn btn-primary mr-2 mb-2"
                      style={{ margin: "5px" }}
                    >
                      Payment
                    </Link>
                    <Link
                      to={`/contest/${contest._id}`}
                      className="btn btn-primary mr-2 mb-2"
                      style={{ margin: "5px" }}
                    >
                      Upload Photo
                    </Link>
                    <Link
                      to={`/pendingimages/${contest._id}`}
                      className="btn btn-primary"
                      style={{ margin: "5px" }}
                    >
                      Pending Images
                    </Link>
                    <Link
                      to={`/permitted/${contest._id}`}
                      className="btn btn-primary"
                      style={{ margin: "5px" }}
                    >
                      Contest Images
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {!isLoggedIn && (
        <>
          <Link to={`/login`}>You must Log in first! or...</Link>
          <br></br>
          <Link to={`/register`}>Don&apos;t have an account? Register..</Link>
        </>
      )}

      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowErrorModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>{successMessage}</Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => setShowSuccessModal(false)}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ContestList;
