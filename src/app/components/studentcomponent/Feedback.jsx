"use client";
import React, { use, useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Select from "react-select";
import { FiChevronDown } from "react-icons/fi";
import Image from "next/image";
import feedbackBook from "../../../../public/images/studentimg/feedbackBook.svg";
import feedbackCalendar from "../../../../public/images/studentimg/feedbackCalendar.svg";
import feedbackBrowse from "../../../../public/images/studentimg/feedbackBrowse.svg";
import Down from "../../../../public/images/studentimg/down.svg";
import FAQ from "../../../../public/images/studentimg/FeedbackFAQ.svg";
import studentTicket from "../../../../public/images/studentimg/studentTicket.svg";
import StudentFeadback from "../../../../public/images/studentimg/StudentFeadback.svg";
import CRMTick from '../../../../public/images/teacher/CRMcheck.svg';
import axiosInstance from "../../auth";
import { useRouter } from "next/navigation";
import Loader from "../../components/studentcomponent/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const customStyles = {
  control: (base) => ({
    ...base,
    border: "1px solid #FF8A00",
    borderRadius: "8px",
    padding: "5px",
    cursor: "pointer",
    boxShadow: "none",
    backgroundColor: "white",
    "&:hover": {
      borderColor: "#FF8A00",
    },
    "&:focus": {
      borderColor: "#FF8A00",
    },
  }),
  valueContainer: (base) => ({ ...base, padding: "5px 15px" }),
  placeholder: (base) => ({
    ...base,
    color: "#949494",
    fontSize: "16px",
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  }),
  singleValue: (base) => ({ ...base, color: "#3B3B3B", fontSize: "16px" }),
  dropdownIndicator: (base) => ({ ...base, color: "#FF8A00" }),
  indicatorSeparator: () => ({ display: "none" }),
  option: (styles, { isSelected, isFocused }) => ({
    ...styles,
    backgroundColor: isSelected
      ? "#FFF9F2"
      : isFocused
      ? "rgba(246, 246, 246, 1)"
      : "white",
    color: isSelected ? "#FF8A00" : "#000",
    cursor: "pointer",
    ":hover": { backgroundColor: "#FFF9F2", color: "#FF8A00" },
  }),
  menu: (base) => ({
    ...base,
    boxShadow: "none",
    border: "1px solid #FF8A00",
  }),
};

const issueTypeOptions = [
  { value: "Content", label: "Content issue" },
  { value: "Tech", label: "Tech" },
  { value: "Others", label: "Others" },
];

const quizTypeOptions = [
  { value: "CRQ", label: "CRQ" },
  { value: "PE", label: "PE" },
  { value: "CLT", label: "CLT" },
  { value: "PAA", label: "PAA" },
];

const faqList = [
  {
    question: "What types of quizzes are available?",
    answer: `
        The available quizzes are:
        <ul>
          <li><strong>Readiness:</strong> To assess your knowledge before starting a new chapter.</li>
          <li><strong>Quest:</strong> To assess your understanding of a topic.</li>
          <li><strong>Milestone:</strong> To assess your knowledge of a chapter.</li>
        </ul>
      `,
  },
  {
    question: "How many discovery coins can I earn?",
    answer: `
        <ul>
          <li><strong>For ongoing chapters:</strong> Earn 100 coins each for readiness and quests, 200 for milestones, and 25 for review.</li>
          <li><strong>For previously assigned chapters:</strong> Earn 75 coins for readiness and quests, 150 for milestones, and 25 for review.</li>
        </ul>
      `,
  },
  {
    question: "How many gems does it cost to attempt a quiz?",
    answer: `
        <ul>
          <li>Each readiness, quest, or milestone attempt costs 1 gem.</li>
          <li>You can buy gems using discovery coins, and each gem costs 50 discovery coins.</li>
        </ul>
      `,
  },
  {
    question: "What are the different badges I can collect?",
    answer: `
        <ul>
          <li><strong>Rockstar:</strong> For completing all the quizzes of a chapter.</li>
          <li><strong>Review Ninja:</strong> For reviewing all your quiz attempts of a chapter.</li>
          <li><strong>Master Marvel:</strong> For achieving proficiency in a chapter.</li>
          <li><strong>Go Getter:</strong> For earning 1500 coins per month.</li>
          <li><strong>Quizard:</strong> For completing 50 quizzes.</li>
        </ul>
      `,
  },
];

const Feedback = ({ studentId }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedIssueType, setSelectedIssueType] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [courses, setCourses] = useState([]);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [chapterOptions, setChapterOptions] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [topicOptions, setTopicOptions] = useState([]);
  const [description, setDescription] = useState("");
  const [recallTicket, setRecallTicket] = useState(0);
  const [isLoader, setIsLoader] = useState(false);
  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  const [showAll, setShowAll] = useState(false);
  const handleViewAllClick = () => {
    setShowAll(!showAll);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0]; // Get the first file (single upload)
    if (file) {
      setUploadedFiles(file); // Replace the existing file instead of appending
    }
  };

  const removeFile = () => {
    setUploadedFiles("");
  };

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoader(true);
      try {
        const response = await axiosInstance.get(
          `/onboarding/get_user_tickets/?userid=${studentId.student_id}&start=0&page_length=100`
        );
        if (response.status == 200) {
          const tickets =
            response.data.data.message.values?.map((ticket) => ({
              ticketNo: ticket[0] || "N/A", // "name"
              owner: ticket[1] || "Unknown", // "owner"
              date: ticket[2] || "N/A", // "creation"
              subject: ticket[3] || "N/A", // "subject"
              status: ticket[4] || "N/A", // "status"
              ticketStatus: ticket[5] || "N/A", // "ticket_status"
              userId: ticket[6] || "N/A", // "custom_userid"
              priority: ticket[7] || "N/A", // "priority"
              issueType: ticket[8] || "N/A", // "issue_type"
              description: ticket[9] || "No description provided", // "description"
            })) || [];
          setTickets(tickets); // Adjust based on API response structure
          setIsLoader(false);
        }
      } catch (err) {
        setIsLoader(false);
      } finally {
      }
    };
    if (studentId.student_id > 0) {
      fetchTickets();
    }
  }, [studentId.student_id, recallTicket]);

  const handleFeeddBackChat = (ticketNo) => {
    setIsLoader(true);
    if (!ticketNo) {
      setIsLoader(false);
      console.error("Invalid ticket number");
      return;
    }
    router.push(`/student/feedbackchat?ticketId=${ticketNo}`);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axiosInstance.get(
          "/studentapis/get_student_course"
        );
        if (response.data.status == "Success") {
          const subjectOptionsData = response.data.data.map((item) => ({
            value: item.subject_name,
            label: item.subject_name,
          }));
          setSubjectOptions(subjectOptionsData);
          setCourses(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching student courses:", error);
      } finally {
      }
    };

    fetchCourses();
  }, []);

  const getTopicOptions = (selectedSubject, selectedChapter, data) => {
    const subject = data.find((sub) => sub.subject_name == selectedSubject);

    if (!subject) return [];
    const chapter = subject.chapter_data.find(
      (chap) => chap.chapter_name == selectedChapter
    );

    return chapter
      ? chapter.topic_names.map((topic) => ({
          value: topic,
          label: topic,
        }))
      : [];
  };

  const handleSelectedChapter = (chapterValue) => {
    const topics = getTopicOptions(
      selectedSubject.label,
      chapterValue,
      courses
    );
    setTopicOptions(topics);
  };
  const getChapterOptions = (selectedSubject, data) => {
    const subject = data.find((sub) => sub.subject_name == selectedSubject);
    return subject
      ? subject.chapter_data.map((chapter) => ({
          value: chapter.chapter_name,
          label: chapter.chapter_name,
        }))
      : [];
  };

  const handleSelectedSubject = (subjectValue) => {
    const chapters = getChapterOptions(subjectValue, courses);
    setChapterOptions(chapters);
  };

  const handleSubmit = async () => {
    setIsLoader(true);

    const formData = new FormData();
    formData.append("userid", studentId?.student_id || "");
    formData.append("class", studentId?.section_name || "");
    formData.append("is_parent", "No");
    formData.append("email", studentId?.email || "");
    formData.append("school", studentId?.school_name || "");
    formData.append("subject", `S - ${selectedIssueType?.value}`);
    formData.append("status", "Open");
    formData.append("priority", "");
    formData.append("issue_type", selectedIssueType?.value || "");
    formData.append("name", studentId?.first_name + studentId?.last_name);
    formData.append("description", description || "");
    formData.append("subjects", selectedSubject?.label || "");
    formData.append("interface", "Student Application");

    if (selectedIssueType?.value == "Content") {
      formData.append("chapter", selectedChapter?.label || "");
      formData.append("topic", selectedTopic?.label || "");
      formData.append("activities", selectedQuiz?.label || "");
    } else if (selectedIssueType?.value == "Others") {
      formData.append("chapter", selectedChapter?.label || "");
      formData.append("topic", selectedTopic?.label || "");
      formData.append("activities", "");
    } else {
      formData.append("chapter", "");
      formData.append("topic", "");
      formData.append("activities", "");
    }

    if (uploadedFiles) {
      formData.append("content", uploadedFiles);
    }
    // formData.forEach((value, key) => {
    //     console.log(`${key}:`, value);
    // });

    try {
      if (selectedIssueType?.value == "Tech") {
        if (!selectedSubject?.label) {
          setIsLoader(false);
          toast.error("Please Select Subject", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          return;
        } else if (!description.trim()) {
          setIsLoader(false);
          toast.error("Description Can Not Be Empty", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          return;
        }
      } else if (selectedIssueType?.value == "Content") {
        if (!selectedSubject?.label) {
          setIsLoader(false);
          toast.error("Please Select Subject", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          return;
        } else if (!selectedChapter?.label) {
          setIsLoader(false);
          toast.error("Please Select Chapter", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          return;
        } else if (!selectedTopic?.label) {
          setIsLoader(false);
          toast.error("Please Select Topic", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          return;
        } else if (!selectedQuiz?.label) {
          setIsLoader(false);
          toast.error("Please Select Quiz Type", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          return;
        } else if (!description.trim()) {
          setIsLoader(false);
          toast.error("Description Can Not Be Empty", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          return;
        }
      } else if (selectedIssueType?.value == "Others") {
        if (!selectedSubject?.label) {
          setIsLoader(false);
          toast.error("Please Select Subject", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          return;
        } else if (!selectedChapter?.label) {
          setIsLoader(false);
          toast.error("Please Select Chapter", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          return;
        } else if (!selectedTopic?.label) {
          setIsLoader(false);
          toast.error("Please Select Topic", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          return;
        } else if (!description.trim()) {
          setIsLoader(false);
          toast.error("Description Can Not Be Empty", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          return;
        }
      } else {
        setIsLoader(false);
        toast.error("Please Select Issue Type", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        return;
      }

      const response = await axiosInstance.post(
        "/onboarding/add_ticket/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // ✅ Ensures correct format for file uploads
          },
        }
      );

      setRecallTicket((prev) => (prev === 0 ? 1 : 0));
      setIsModalOpen(false);
      setIsLoader(false);
      toast.success("Ticket Created Successfully!", {
        position: "bottom-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    } catch (error) {
      setIsLoader(false);
      console.error(
        "Error adding ticket:",
        error.response?.data || error.message
      );
    }
  };
  return (
    <div className="raiseAticket">
      <div className="profile-back-arrow">
        <h4>Feedback</h4>
      </div>

      <div className="my-classes-section" style={{ marginBottom: "20px" }}>
        <div className="RaiseTicket-top-card">
          <div className="feedback-content">
            <Image
              src={StudentFeadback}
              alt="Teacher Feedback"
              width={90}
              height={90}
            />
            <div className="feedback-text">
              <h3>Send Feedback</h3>
              <p>Found an issue? Report it here!</p>
            </div>
          </div>
          <div>
            <button
              className="report-btn"
              onClick={() => {
                setSelectedIssueType([]);
                setSelectedSubject([]);
                setSelectedChapter([]);
                setSelectedTopic([]);
                setSelectedQuiz([]);
                setDescription("");
                setUploadedFiles([]);
                setIsModalOpen(true);
              }}
            >
              Raise a Ticket
            </button>
          </div>
        </div>

        <div className="feedbackHeading">
          <h3 className="feadbackinnerhead">Active and Previous Ticket</h3>
          <button className="viewAll" onClick={handleViewAllClick}>
            {showAll ? "View Less" : "View All"}
          </button>
        </div>

        <div className="feedback-cards">
          {tickets
            .slice(0, showAll ? tickets.length : 3)
            .map((ticket, index) => {
              let activeStep = 1;
              if (ticket.ticketStatus === "In progress") {
                activeStep = 2;
              } else if (ticket.ticketStatus === "Resolved") {
                activeStep = 3;
              }
              return (
                <div key={index} className="feedback-card">
                  <div
                    className="ticket-header"
                    style={{ display: "flex", gap: "5px", width: "100%" }}
                  >
                    <div className="icon-container">
                      <Image
                        src={studentTicket}
                        alt={"ffff"}
                        width={25}
                        height={25}
                      />
                    </div>
                    <div style={{ width: "85%" }}>
                      <div className="dfjs">
                        <h4 className="chapter-name">Feedback</h4>
                        <button className="ticket-button">
                          Ticket No. {ticket.ticketNo}
                        </button>
                      </div>
                      <div>
                        <p
                          className="class-students"
                          style={{ display: "flex", flexDirection: "row" }}
                        >
                          Description
                          <OverlayTrigger
                            placement="auto"
                            delay={{ show: 250, hide: 400 }}
                            overlay={
                              <Tooltip id={`tooltip-${ticket.ticketNo}`}>
                                {ticket.description}
                              </Tooltip>
                            }
                          >
                            <span
                              className="truncate-text"
                              style={{ fontWeight: "700", cursor: "pointer" }}
                            >
                              - {ticket.description}
                            </span>
                          </OverlayTrigger>
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="chapter-details">
                    <div
                      className="dfa"
                      style={{ gap: "20px", justifyContent: "flex-start" }}
                    >
                      <div className="class-chapters">
                        <Image
                          src={feedbackBook}
                          alt="Book"
                          width={20}
                          height={20}
                        />
                        <p style={{ margin: "0px" }}>
                          {" "}
                          Issue Type :{" "}
                          <span style={{ color: "#FF8A00" }}>
                            {" "}
                            {ticket.issueType}
                          </span>
                        </p>
                      </div>
                      <div className="class-chapters">
                        <Image
                          src={feedbackCalendar}
                          alt="Calender"
                          width={20}
                          height={20}
                        />
                        {new Date(ticket.date).toLocaleDateString("en-GB")}
                      </div>
                    </div>

                    <div className="progress-wrapper">
                      <div
                        className={`step  ${
                          activeStep >= 1 ? "active step-1" : " inactive"
                        }`}
                      >
                        1
                      </div>
                      <div
                        className={`connector connector-1 ${
                          activeStep >= 2 ? "active" : "inactive dashed"
                        }`}
                      ></div>
                      <div
                        className={`step  ${
                          activeStep >= 2 ? "active step-2" : "inactive "
                        }`}
                      >
                        2
                      </div>
                      <div
                        className={`connector connector-2 ${
                          activeStep >= 3 ? "active" : "inactive dashed"
                        } `}
                      ></div>
                      <div
                        className={`step  ${
                          activeStep >= 3 ? "active step-3" : "inactive"
                        }`}
                      >
                         {ticket.ticketStatus === "Resolved" ? <Image src={CRMTick} alt={"Ticket Icon"} width={20} height={20} /> : 3} 
                      </div>
                    </div>
                    <div className="labels">
                      <span
                        className="status-label"
                        style={{ color: activeStep === 1 ? "gray" : "gray" }}
                      >
                        Open
                      </span>
                      <span
                        className="status-label"
                        style={{
                          marginLeft: "10px",
                          color: activeStep === 2 ? "gray" : "gray",
                        }}
                      >
                        Under Resolution
                      </span>
                      <span
                        className="status-label"
                        style={{ color: activeStep === 3 ? "gray" : "gray" }}
                      >
                        Resolved
                      </span>
                    </div>
                    <div>
                      <button
                        className="view-report-button"
                        onClick={() => handleFeeddBackChat(ticket.ticketNo)}
                      >
                        View Report
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="feedbackHeading ">
          <h3 className="feadbackinnerhead">Quick solution</h3>
        </div>

        <div className="faq-container">
          {faqList.map((faq, index) => (
            <div key={index} className="faq-item">
              <div className="faq-header dfjs" onClick={() => toggleFAQ(index)}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Image src={FAQ} alt="FAQ Icon" width={60}/>
                  <span className="faq-title">{faq.question}</span>
                </div>
                <Image
                  src={Down}
                  alt="Toggle"
                  width={20}
                  height={20}
                  style={{
                    transform:
                      activeIndex === index ? "rotate(180deg)" : "rotate(0deg)",
                    transition: "transform 0.3s ease",
                  }}
                />
              </div>
              {activeIndex === index && (
                <div className="faq-content">
                  <p dangerouslySetInnerHTML={{ __html: faq.answer }} />
                </div>
              )}
            </div>
          ))}
        </div>
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="Feedback-modal-content">
              <h3 className="Feedback-modal-head">Feedback</h3>
              <div
                className="dropdown-container"
                style={{ width: "100%", textAlign: "left", marginTop: "10px" }}
              >
                <label>Issue Type</label>
                <Select
                  instanceId="issue-select"
                  value={selectedIssueType}
                  onChange={setSelectedIssueType}
                  options={issueTypeOptions}
                  placeholder="Select Issue Type"
                  styles={customStyles}
                  isSearchable={false}
                  components={{ DropdownIndicator: () => <FiChevronDown /> }}
                />
              </div>
              <div
                className="dropdown-container"
                style={{ width: "100%", textAlign: "left", marginTop: "10px" }}
              >
                <label>Subject</label>
                <Select
                  instanceId="subject-select"
                  value={selectedSubject}
                  options={subjectOptions}
                  onChange={(selectedOption) => {
                    setSelectedSubject(selectedOption);
                    handleSelectedSubject(selectedOption?.label);
                  }}
                  placeholder="Select Subject"
                  styles={customStyles}
                  isSearchable={false}
                  components={{ DropdownIndicator: () => <FiChevronDown /> }}
                />
              </div>
              {(selectedIssueType?.value == "Content" ||
                selectedIssueType?.value == "Others") && (
                <>
                  {selectedSubject?.value && (
                    <div
                      className="dropdown-container"
                      style={{
                        width: "100%",
                        textAlign: "left",
                        marginTop: "10px",
                      }}
                    >
                      <label>Chapter</label>
                      <Select
                        instanceId="chapter-select"
                        value={selectedChapter}
                        onChange={(selectedOption) => {
                          setSelectedChapter(selectedOption);
                          handleSelectedChapter(selectedOption?.label);
                        }}
                        options={chapterOptions}
                        placeholder="Select Chapter"
                        styles={customStyles}
                        isSearchable={false}
                        components={{
                          DropdownIndicator: () => <FiChevronDown />,
                        }}
                      />
                    </div>
                  )}

                  {selectedChapter?.value && (
                    <div
                      className="dropdown-container"
                      style={{
                        width: "100%",
                        textAlign: "left",
                        marginTop: "10px",
                      }}
                    >
                      <label>Topic</label>
                      <Select
                        instanceId="topic-select"
                        value={selectedTopic}
                        onChange={setSelectedTopic}
                        options={topicOptions}
                        placeholder="Select Topic"
                        styles={customStyles}
                        isSearchable={false}
                        components={{
                          DropdownIndicator: () => <FiChevronDown />,
                        }}
                      />
                    </div>
                  )}

                  {selectedIssueType?.value === "Content" &&
                    selectedTopic?.value && (
                      <div
                        className="dropdown-container"
                        style={{
                          width: "100%",
                          textAlign: "left",
                          marginTop: "10px",
                        }}
                      >
                        <label>Select Quiz Type</label>
                        <Select
                          instanceId="quiz-select"
                          value={selectedQuiz}
                          onChange={setSelectedQuiz}
                          options={quizTypeOptions}
                          placeholder="Select Quiz"
                          styles={customStyles}
                          isSearchable={false}
                          components={{
                            DropdownIndicator: () => <FiChevronDown />,
                          }}
                        />
                      </div>
                    )}
                </>
              )}

              <div
                className="dropdown-container"
                style={{ width: "100%", textAlign: "left", marginTop: "10px" }}
              >
                <label>Describe the issue</label>
                <textarea
                  className="issue-description"
                  placeholder="Enter the issue details..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="file-upload-container">
                <label>Attachments</label>
                <div className="dfjs" style={{ gap: "5px" }}>
                  <div className="file-upload-container">
                    <label
                      className="file-upload-box"
                      style={{ minWidth: "35%" }}
                    >
                      <input
                        type="file"
                        className="file-upload-input"
                        accept="image/*, .pdf"
                        onChange={handleFileUpload}
                      />
                      <span className="file-upload-text">
                        <Image
                          src={feedbackBrowse}
                          alt="book"
                          width={25}
                          height={25}
                        />
                        Browse Images
                      </span>
                    </label>
                  </div>
                  <div className="uploaded-files">
                    {uploadedFiles.name && (
                      <div className="uploaded-file">
                        <span>{uploadedFiles.name}</span>
                        <button onClick={() => removeFile()}>X</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="feedbackDisclaimer">
                <p>
                  Disclaimer : Derogatory comments will be reported to your
                  teacher
                </p>
              </div>

              <div className="quiz-popup-btn">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button className="yes-btn" onClick={handleSubmit}>
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
        <ToastContainer
          position="bottom-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        {isLoader ? <Loader /> : ""}
      </div>
    </div>
  );
};

export default Feedback;
