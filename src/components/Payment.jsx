import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
function Payment() {
  const { contestid } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    async function initPayment() {
      const response = await fetch(
        `http://localhost:5000/payment/${contestid}`,
        {
          credentials: "include",
          mode: "cors",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error);
        setShowModal(true); // Show modal on error
      } else {
        const successData = await response.json();
        const gatewayPageURL = successData.GatewayPageURL;
        window.open(gatewayPageURL, "_blank");
      }
    }

    initPayment();
  }, [contestid]);

  const handleClose = () => {
    setShowModal(false);
  };

  return (
    <div>
      <Link
        to={"/"}
        style={{ margin: "5px" }}
      >
        Return to Contests
      </Link>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Payment;
