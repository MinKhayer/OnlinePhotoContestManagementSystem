import  { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import UploadImageComponent from "./UploadImage";

function ViewContest() {
  const { contestId } = useParams();
  const [contest, setContest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContest() {
      try {
        const response = await fetch(`http://localhost:5000/contest/${contestId}`, {
          credentials: "include", // Include cookies if needed
        });

        if (!response.ok) {
          throw new Error("Failed to fetch contest details");
        }

        const data = await response.json();
        setContest(data);
        setLoading(false);
        console.log(data)
      } catch (error) {
        console.error(error);
      }
    }

    fetchContest();
  }, [contestId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!contest) {
    return <div>Contest not found.</div>;
  }

  return (
    <div>
      <h3>Contest Details</h3>
      <div>
        <h5>{contest.title}</h5>
        <p>Category: {contest.category}</p>
        {/* Display other contest details */}
        <UploadImageComponent contestId={contestId}/>
      </div>
    </div>
  );
}

export default ViewContest;