import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Rating from "react-rating-stars-component";
import { Modal, Button } from "react-bootstrap";

function PermittedImagesComponent() {
  const { contestId } = useParams();
  const [permittedImages, setPermittedImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState({}); // Store user ratings for images
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [contest, setContest] = useState("");
  useEffect(() => {
    async function fetchContest() {
      try {
        const response = await fetch(
          `http://localhost:5000/contest/${contestId}`, // Update the URL according to your API
          {
            credentials: "include", // Include cookies if needed
          }
        );

        if (!response.ok) {
          throw new Error("Contest not found!");
        } else {
          const data = await response.json();
          setContest(data.title);
          setPermittedImages(data.permittedImages || []);
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      }
    }

    fetchContest();
  }, [contestId]);

  async function handleRateImage(imagePath, rating) {
    try {
      const response = await fetch(
        `http://localhost:5000/contest/${contestId}/rate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ path: imagePath, rating }),
        }
      );

      if (!response.ok) {
        //throw new Error("Failed to rate the image");
        const err = await response.json();
        setErrorMessage(err.error)
      }
      else{
        const success= await response.json();
        setErrorMessage(success.message)
      }

      // Update local state with the new rating
      setRatings((prevRatings) => ({
        ...prevRatings,
        [imagePath]: rating,
      }));
    } catch (error) {
      console.error(error);
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="row">
      <h1>{contest}</h1>
      {permittedImages.map((image, index) => (
        <div key={index} className="col-md-4 mb-3">
          <img
            src={`http://localhost:5000/${image.filename}`}
            alt={`Permitted Image ${index}`}
            style={{ width: "100%", height: "auto" }}
            onClick={() => setSelectedImage(image.filename)}
          />
          <p>Uploaded by: {image.username}</p>
          <div className="mt-2">
            <div className="d-flex align-items-center">
              <i>Rate Photo: </i>
              <Rating
                count={5}
                value={ratings[image.filename] || 0}
                onChange={(newRating) =>
                  handleRateImage(image.filename, newRating)
                }
                size={24} // Adjust the size as needed
                activeColor="#ffd700" // Star color when filled
              />
              {ratings[image.filename] !== undefined && (
                <span className="ml-2">
                  Rated: {ratings[image.filename]} stars
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
       {/* Error Message Modal */}
       <Modal show={errorMessage !== ""} onHide={() => setErrorMessage("")}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setErrorMessage("")}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Success Message Modal */}
      <Modal show={successMessage !== ""} onHide={() => setSuccessMessage("")}>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body>{successMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSuccessMessage("")}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        id="imageModal"
        show={selectedImage !== null}
        onHide={() => setSelectedImage(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedImage && (
            <img
              src={`http://localhost:5000/${selectedImage}`}
              alt="Selected Permitted Image"
              style={{ width: "100%", height: "auto" }}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default PermittedImagesComponent;
