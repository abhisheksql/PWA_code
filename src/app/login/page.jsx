import Link from "next/link";
import Image from "next/image";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../../public/style/login.css";
import studentImage from "../../../public/images/student.svg";
import teacherImage from "../../../public/images/teacher.svg";

function Login() {
  return (
    <div className="main-container">
      <div className="main">
        <div className="box">
          <h1>
            Welcome to AcadAlly! <br />
            <span>How would you like to continue?</span>
          </h1>
        </div>
        <div className="box2">
          <Link href="/login/student" style={{ textDecoration: "none" }}>
            <div className="image activeimage">
              <Image
                src={studentImage}
                alt="Student"
                style={{ width: "100%", height: "auto" }}
              />
              <h2>Student</h2>
            </div>
          </Link>
          <Link href="/login/teacher" style={{ textDecoration: "none" }}>
            <div className="image activeimage">
              <Image
                src={teacherImage}
                alt="Teacher"
                style={{ width: "100%", height: "auto" }}
              />
              <h2>Teacher</h2>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
