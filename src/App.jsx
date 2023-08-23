// We use Route in order to define the different routes of our application
import { Route, Routes } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import ContestList from "./components/Contests";
import CreateContest from "./components/CreateContest";
import Payment from "./components/Payment";
import ViewContest from "./components/ViewContest";
import PendingImagesComponent from "./components/PendingImages";
import PermittedImagesComponent from "./components/PermittedImage";
import Navbar from "./components/Navbar";
import LogoutButton from "./components/Logout";
import { useState,useEffect } from "react";
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // When the component mounts, try to load isLoggedIn from local storage
  useEffect(() => {
    const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
    if (storedIsLoggedIn) {
      setIsLoggedIn(JSON.parse(storedIsLoggedIn));
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem("isLoggedIn", JSON.stringify(true));
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem("isLoggedIn");
  };

 return (
   <div>
    <Navbar isLoggedIn={isLoggedIn}/>
     <Routes>
       <Route exact path="/register" element={<Register />} />
       <Route exact path="/login" element={<Login onLogin={handleLogin} />} />
       <Route exact path="/logout" element={<LogoutButton onLogout={handleLogout} />} />
       <Route exact path="/" element={<ContestList isLoggedIn={isLoggedIn}/>} />
       <Route exact path="/create" element={<CreateContest/>} />
       <Route exact path="/payment/:contestid" element={<Payment/>} />
       <Route exact path="/contest/:contestId" element={<ViewContest/>} />
       <Route exact path="/pendingimages/:contestId" element={<PendingImagesComponent/>} />
       <Route exact path="/permitted/:contestId" element={<PermittedImagesComponent/>} />
     </Routes>
   </div>
 );
};
 
export default App;