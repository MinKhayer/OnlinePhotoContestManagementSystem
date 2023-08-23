import { useState } from "react";

// eslint-disable-next-line react/prop-types
const UploadImageComponent = ({ contestId }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      setErrorMessage("Please select an image to upload.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await fetch(`http://localhost:5000/contest/${contestId}/uploadimage`, {
        method: "POST",
        body: formData,
        credentials:"include"
      });

      if (response.ok) {
        setSuccessMessage("Image uploaded successfully!");
      } else {
        setErrorMessage("Failed to upload image.");
      }
    } catch (error) {
      setErrorMessage("Error uploading image: " + error.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Upload Image</h2>
      <div className="mb-3">
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>
      <button className="btn btn-primary" onClick={handleUpload}>
        Upload Image
      </button>
      {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
      {successMessage && <p className="text-success mt-2">{successMessage}</p>}
    </div>
  );
};

export default UploadImageComponent;
