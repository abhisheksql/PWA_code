"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import "../../../../../public/style/login.css";
import sliderimage from "../../../../../public/images/student-sliderimg1.svg";
import sliderimage2 from "../../../../../public/images/student-sliderimg2.svg";
import sliderimage3 from "../../../../../public/images/student-sliderimg3.svg";
import ios from "../../../../../public/images/ios-black.svg";
import android from "../../../../../public/images/android-black.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Loader from "../../../components/Loader";
// Import the necessary CSS files
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import axios from "axios";

// Dynamic import of jQuery
const loadJQueryAndOwlCarousel = async () => {
  const $ = (await import("jquery")).default;
  await import("owl.carousel");

  // Make sure jQuery is available globally
  if (typeof window !== "undefined") {
    window.$ = window.jQuery = $;
  }
  return $;
};

function StudentProfile() {
  const leapApiUrl = process.env.NEXT_PUBLIC_LEAP_API_URL;
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoader, setIsLoader] = useState(false);
  const [userId, setUserId] = useState(0);
  const [activeCard, setActiveCard] = useState(null);
  const [userNumber, setUserNumber] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userAction, setUserAction] = useState("");
  const searchParams = useSearchParams();
  const mobile = searchParams.get("data");
  const action = searchParams.get("action");

  const router = useRouter();

  useEffect(() => {
    if (mobile) {
      const isNumeric = (str) => /^\d+$/.test(str);

      if (isNumeric(mobile)) {
        setUserNumber(mobile);
      } else {
        setUserEmail(mobile);
      }
    }
  }, [mobile]);

  useEffect(() => {
    if (action) {
      setUserAction(action);
    }
  }, [action]);

  useEffect(() => {
    const initializeCarousel = async () => {
      const $ = await loadJQueryAndOwlCarousel();

      const slider1 = $("#slide-content");
      const slider2 = $("#slide-bg");

      let slider1FirstSlideIndex;
      let prevIndex = 0;

      slider1.owlCarousel({
        loop: true,
        autoplay: true,
        dots: true,
        smartSpeed: 800,
        items: 1,
        onInitialized: function (event) {
          slider1FirstSlideIndex = event.item.index;
        },
        onTranslate: function (event) {
          sliderSync(event);
        },
      });

      function sliderSync(event) {
        const index = event.item.index;
        const loop = event.relatedTarget.options.loop;
        const slider2CloneCount = slider2.find(".owl-item.cloned").length / 2;

        if (loop) {
          if (index < slider1FirstSlideIndex) {
            slider2.trigger("prev.owl.carousel");
          } else {
            if (
              event.item.count === 2 &&
              event.item.index === 2 &&
              prevIndex === 3
            ) {
              slider2.trigger("next.owl.carousel");
            } else {
              slider2.trigger("to.owl.carousel", index - slider2CloneCount);
            }
          }
          prevIndex = event.item.index;
        } else {
          slider2.trigger("to.owl.carousel", index);
        }
      }

      slider2.owlCarousel({
        loop: true,
        nav: false,
        dots: false,
        touchDrag: false,
        mouseDrag: false,
        pullDrag: false,
        items: 1,
      });
    };

    if (typeof window !== "undefined") {
      initializeCarousel();
    }
  }, []);

  useEffect(() => {
    // Define the API call function
    const fetchData = async () => {
      setIsLoader(true);
      let value;
      if (userEmail !== "") {
        value = { email: userEmail };
      } else if (userNumber !== "") {
        value = { phone_number: userNumber };
      }
      try {
        const response = await axios.get(
          `${leapApiUrl}onboarding/users/list/`,
          {
            params: value, // Query parameters
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status == 200) {
          setUserData(response.data); // Save the API response data
        }
      } catch (err) {
        setError(err); // Save error if API call fails
      } finally {
        setIsLoader(false); // Set loading to false after API call
      }
    };

    if (userEmail || userNumber) {
      fetchData();
    }
  }, [userEmail, userNumber]);

  const handlelogin = (userid, index) => {
    setUserId(userid);
    setActiveCard(index);
  };

  const handleSubmit = async () => {
    if (userAction == "loginuserlist") {
      let login_token = localStorage.getItem("access_token_login");
      try {
        const response = await axios.post(
          `${leapApiUrl}onboarding/change_profile/`,
          { user_id: userId },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${login_token}`,
            },
          }
        );
        if (response.status == 200) {
          localStorage.setItem("accessToken", response.data.access);
          localStorage.setItem("role", "student");
          localStorage.setItem("refreshToken", response.data.refresh);
          router.push("/student");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else if (userAction == "forgetusername") {
      let value;
      if (userEmail !== "") {
        value = userEmail;
      } else if (userNumber !== "") {
        value = userNumber;
      }

      try {
        const response = await axios.post(
          `${leapApiUrl}onboarding/request-reset-username/`,
          { user_id: userId },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status == 200) {
          router.push(
            `/login/student/mobileotp?data=${userId}&action=forgot&label=${value}`
          );
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };
const handleBack = () => {
   setIsLoader(false);
   router.back();
}
  return (
    <div className="container-fluid p-0">
      <div className="wrapper custom-height student-login">
        <div className="owl-carousel owl-theme" id="slide-bg">
          <div className="item slide" id="slide1"></div>
          <div className="item slide" id="slide2"></div>
          <div className="item slide" id="slide3"></div>
        </div>
        <div className="row">
          <div className="col-7">
            <div className="owl-carousel owl-theme" id="slide-content">
              <div className="item">
                <div className="left-side">
                  <div className="title">
                    <h1 className="green-text">Grow Smarter, Day by Day!</h1>
                    <p>
                      See your progress unfold and feel proud of each milestone.
                      Celebrate your journey to success!
                    </p>
                  </div>
                  <div className="img">
                    <Image
                      src={sliderimage}
                      alt="Teacher and students illustration"
                      className="img-slider1"
                    />
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="left-side">
                  <div className="title">
                    <h1 className="orange-text">
                      Find Your Academic Superpower!
                    </h1>
                    <p>
                      Uncover the best path for you and excel with personalized
                      guidance. Discover the hero within your studies!
                    </p>
                  </div>
                  <div className="img">
                    <Image
                      src={sliderimage2}
                      alt="Teacher and students illustration"
                      className="img-slider2"
                    />
                  </div>
                </div>
              </div>
              <div className="item">
                <div className="left-side">
                  <div className="title">
                    <h1 className="red-text">
                      Learn with Joy, Free from Judgement!
                    </h1>
                    <p>
                      Experience a fun and supportive environment where every
                      mistake is a chance to grow and every effort is
                      appreciated.
                    </p>
                  </div>
                  <div className="img">
                    <Image
                      src={sliderimage3}
                      alt="Teacher and students illustration"
                      className="img-slider3"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-5">
            <div className="right-side">
              <div className="login-box help-box">
                <div className="title mb-xxl-4 mb-2">
                  <h1>Select Your Profile</h1>
                </div>
                <div className="profile-box">
                  <div className="row gx-2 w-100 mb-xxl-4 mb-xl-3 mb-2">
                    {userData &&
                      userData.data &&
                      userData.data.map((item, index) => (
                        <div
                          className="col-sm-12"
                          key={index}
                          style={{ cursor: "pointer" }}
                          onClick={() => handlelogin(item.user_id, index)}
                        >
                          {/* active */}
                          <div
                            className={`profile-card ${
                              activeCard === index ? "active" : ""
                            }`}
                          >
                            <div className="profile-img">
                              <Image
                                src={item.image}
                                alt="Profile-img"
                                width={50}
                                height={50}
                              />
                            </div>
                            <div className="profile-details">
                              <h2>{item.name}</h2>
                              <p>
                                {item.class} - {item.admission_no}
                              </p>
                              <span>{item.school_name}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                <div className="row w-100">
                  <div className="col-sm-6">
                    <button type="button" className="cancel" onClick={handleBack}>
                      Cancel
                    </button>
                  </div>
                  <div className="col-sm-6">
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      disabled={userId < 1}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
              <div className="download-app">
                <p>For Best Experience Download AcadAlly Student App</p>
                <Image src={ios} alt="QR Code" />
                <Image src={android} alt="QR Code" />
              </div>
            </div>
          </div>
        </div>
      </div>
      {isLoader ? <Loader /> : ""}
    </div>
  );
}

export default StudentProfile;
