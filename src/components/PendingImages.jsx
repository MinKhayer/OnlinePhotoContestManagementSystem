import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function PendingImagesComponent() {
  const { contestId } = useParams();
  const [pendingImages, setPendingImages] = useState([]);
  const [loading, setLoading] = useState(true);

  async function handleAllowImage(imagePath) {
    try {
      console.log(imagePath)
      const response = await fetch(
        `http://localhost:5000/contest/${contestId}/allowimage`, // Update the URL according to your API
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filename: imagePath }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to allow image:", errorData.error);
      } else {
        const successData = await response.json();
        console.log("Image allowed:", successData.message);
        // You can update the list of pending images here if needed
      }
    } catch (error) {
      console.error("Error allowing image:", error);
    }
  }

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
          throw new Error("Failed to fetch contest data");
        }

        const data = await response.json();
        setPendingImages(data.pendingImages || []);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }

    fetchContest();
  }, [contestId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h3>Pending Images</h3>
      {pendingImages.length === 0 ? (
        <p>No pending images for this contest.</p>
      ) : (
        <div>
          {pendingImages.map((image, index) => (
            <div key={index}>
              {/* Replace backslashes with forward slashes, and encode spaces */}
              <img
                src={`http://localhost:5000/${image.filename}`}
                alt={`Pending Image ${index}`}
                style={{ width: "300px", height: "300px" }}
              />
              <button className="btn btn-success mt-2" onClick={() => handleAllowImage(image.filename)}>Allow Image</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PendingImagesComponent;
