"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import "../../../../../public/style/login.css";
import sliderimage from "../../../../../public/images/student-sliderimg1.svg";
import sliderimage2 from "../../../../../public/images/student-sliderimg2.svg";
import sliderimage3 from "../../../../../public/images/student-sliderimg3.svg";
import ios from "../../../../../public/images/ios-black.svg";
import android from "../../../../../public/images/android-black.svg";
import logo from "../../../../../public/images/orange-logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";

import { useSearchParams } from "next/navigation";
import axios from "axios";
import { useRouter } from "next/navigation";
import Loader from "../../../components/Loader";
// Import the necessary CSS files
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";

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

function Createnewusername() {
  const leapApiUrl = process.env.NEXT_PUBLIC_LEAP_API_URL;
  const [username, setUserName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);
  const [submit, setSubmit] = useState(false);
  const [error, setError] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [isString, setIsString] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const userparam = searchParams.get("data");

  useEffect(() => {
    if (userparam) {
      setUserName(userparam);
    }
  }, [userparam]);

  const handleUsernameChange = (e) => {
    setNewUsername(e.target.value);
    if (e.target.value === "") {
      setError(false);
    }
    setIsDisabled(e.target.value.trim() === "");
  };

  const loginhandler = (e) => {
    e.preventDefault();
    setSubmit(true);
  };

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
    if (submit) {
      setIsLoader(true);
      const isNumeric = (str) => /^\d+$/.test(str);

      let apiUrl;
      let userdata;
      apiUrl = `${leapApiUrl}onboarding/reset-username/`;
      if (isNumeric(username)) {
        userdata = { new_username: newUsername, user_id: username };
        setIsString(true);
      } else {
        userdata = { new_username: newUsername, user_id: username };
        setIsString(false);
      }

      const apiCall = async () => {
        try {
          const response = await axios.post(apiUrl, userdata, {
            headers: {
              "Content-Type": "application/json",
            },
          });
          if (response.status == 200) {
            setError(false);
            router.push(`/login/student/createdusername`);
          } else {
            setError(true);
            setIsLoader(false);
          }
        } catch (error) {
          setError(true);
          setIsLoader(false);
          console.error("Error:", error);
        } finally {
          setSubmit(false);
        }
      };

      apiCall();
    }
  }, [submit]);

  return (
    <div className="container-fluid p-0">
      <div className="wrapper  custom-height student-login">
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
                      style={{ width: "100%", height: "auto" }}
                      priority
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
                      style={{ width: "100%", height: "auto" }}
                      priority
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
                      style={{ width: "100%", height: "auto" }}
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-5">
            <div className="right-side">
              <div className="login-box mobileotp-box">
                <div className="logo">
                  <Image
                    src={logo}
                    alt=""
                    style={{ width: "100%", height: "auto" }}
                  />
                  <p>The Ultimate Learning Companion</p>
                </div>
                <form onSubmit={loginhandler}>
                  <div className="form-title mb-4">
                    <h2>Create New Username</h2>
                  </div>
                  <div className="label2 label-anime">
                    <input
                      type="text"
                      id="createnewusername"
                      className="formselect"
                      name="createnewusername"
                      onChange={handleUsernameChange}
                      required
                    />
                    <label>Create new Username</label>
                  </div>
                  <div className="space-150"></div>
                  <button type="submit">Submit</button>
                </form>
              </div>
              <div className="download-app">
                <p>For Best Experience Download AcadAlly Student App</p>
                <Image
                  src={ios}
                  alt="QR Code"
                  style={{ width: "100%", height: "auto" }}
                />
                <Image
                  src={android}
                  alt="QR Code"
                  style={{ width: "100%", height: "auto" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {isLoader ? <Loader /> : ""}
    </div>
  );
}

export default Createnewusername;
