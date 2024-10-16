import React, { useState, useEffect } from "react";
import NavLogo from "../components/navLogo";
import { Link, useNavigate } from "react-router-dom";
import DashNav from "../components/dashNav";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faWarning } from "@fortawesome/free-solid-svg-icons";
import google from '../assets/google.png';
import meta from '../assets/meta.png';

function UserProfile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Confirm Log Out.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Log Out",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(
            "https://epash-ai-jaroslavsbolsak.replit.app/api/logout",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include", // Ensures cookies are included with the request
            }
          );

          const data = await response.json();
          if (response.ok) {
            console.log("Logout successful:", data.message);
            navigate("/login");
          } else {
            console.error("Logout failed:", data.error);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Logout failed! Please try again.",
            });
          }
        } catch (error) {
          console.error("Network error:", error);
          Swal.fire({
            icon: "error",
            title: "Network Error",
            text: "Please check your connection and try again.",
          });
        }
      }
    });
  };

  useEffect(() => {
    fetch("https://epash-ai-jaroslavsbolsak.replit.app/api/user_info", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error("There was a problem with your fetch operation:", error);
        setError("Failed to fetch data");
      });
  }, []);

  // const handleGoogleConnect = () => {
  //   const clientId = '1033664191407-ai61p9okci4t9acdf1vhhn2jik7t68u1.apps.googleusercontent.com'; // Replace with your client ID
  //   const redirectUri = 'https://epash-frontend.vercel.app/auth/google/callback'; // Replace with your redirect URI
  //   const scope = 'https://www.googleapis.com/auth/adwords';
  //   const responseType = 'code';
  //   const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&access_type=offline&prompt=consent`;

  //   window.location.href = authUrl;
  // };

  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const code = params.get('code');
  //   if (code) {
  //     console.log('Authorization Code:', code);
  //     // You can now exchange the authorization code for tokens
  //   }
  // }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return (
      <div className="w-full h-screen bg-white flex justify-center items-center">
        <div className="flex gap-3 items-center animate-pulse">
          <img src="https://res.cloudinary.com/drcze5fsl/image/upload/v1718707751/o6uk4vdhzumrmjztnp4a.png" alt="Logo Epash" className="w-24" />
          <h1 className="font-bold text-4xl">Epash AI</h1>
        </div>
      </div>
    ); // Or any other loading indicator
  }

  return (
    <>
      <div className="flex w-full justify-between items-center py-5 px-48">
        <NavLogo />

        <div className="flex gap-3">
          <Link
            to="/new/campaign"
            className="flex justify-center items-center bg-epash-green text-white rounded-md px-8 h-12 font-bold hover:scale-110 duration-100"
          >
            New Campaign
          </Link>
        </div>
      </div>
      <DashNav handleLogout={handleLogout} />
      <div className="flex justify-center items-center mt-20">
        <div className="w-2/4 shadow-xl h-96 rounded-xl gap-10 border-gray-200 outline-1 border grid grid-rows-4">
          <div>
            <Link to="/account/settings/profile-info">
              <div className="my-5 mx-5 rounded-md flex items-center gap-3 px-2 py-2 hover:bg-gray-100 duration-200 ">
                <FontAwesomeIcon
                  icon={faUser}
                  className="text-epash-green text-xl py-3 px-3 bg-green-50 border border-green-100 rounded-md"
                />
                <div>
                  <h2 className="font-black font-custom">
                    Account Information
                  </h2>
                  <p className="text-xs">
                    See and manage your account information.
                  </p>
                </div>
              </div>
            </Link>
          </div>
          <div>
            <Link to="/account/settings/profilelinkage">
              <div className="my-5 mx-5 rounded-md flex items-center text-left gap-3 px-2 py-2 hover:bg-gray-100 duration-200 ">
                <img src={google} className="w-[36px]"/>
                <div>
                  <h2 className="font-black font-custom">
                    Google Connect
                  </h2>
                  <p className="text-xs">
                    Connect Google Ads platform.
                  </p>
                </div>
              </div>
            </Link>
          </div>
          <div>
            <Link to="/account/settings/profilelinkage-facebook">
              <div className="my-5 mx-5 rounded-md flex items-center text-left gap-3 px-2 py-2 hover:bg-gray-100 duration-200 ">
                <img src={meta} className="w-[36px]"/>
                <div>
                  <h2 className="font-black font-custom">
                    Facebook Connect
                  </h2>
                  <p className="text-xs">
                    Connect Facebook Ad Platform.
                  </p>
                </div>
              </div>
            </Link>
          </div>
          <div className="flex gap-5 items-center text-red-500 my-5 mx-8">
            <FontAwesomeIcon
              icon={faWarning}
              className="text-2xl"
            />
            <p>Currently account linking is not available. We apologize for the inconvenience.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default UserProfile;
