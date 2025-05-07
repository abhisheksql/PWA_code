'use client';
import '../../../../public/style/teacher.css';
import React, { useState, useMemo, useEffect } from "react";
import Select from 'react-select';
import { FiChevronDown } from 'react-icons/fi';
import Image from "next/image";
import Book from "../../../../public/images/teacher/book-alt.svg";
import Calendar from "../../../../public/images/teacher/Calendar.svg";
import Up from "../../../../public/images/teacher/up.svg";
import Down from "../../../../public/images/teacher/Down.svg";
import FAQ from "../../../../public/images/teacher/FAQ.svg";
import Ticket from "../../../../public/images/teacher/Ticket.svg";
import TeacherFeadback from '../../../../public/images/teacher/TeacherFeadback.svg';
import SuccesPopup from '../../../../public/images/teacher/SuccesPopup.svg';
import CRMTick from '../../../../public/images/teacher/CRMcheck.svg';
import FeedbackBrowse from '../../../../public/images/teacher/feedbackBrowse.svg';
import { useChaptersList } from '../../hooks/teacher/useChaptersList';
import ClassDropdown from "./ClassDropdown";
import { useChapterData } from "../../hooks/teacher/useChapterData";
import { addTicket } from "../../api/teacherAPI";
import { useTeacher } from '../../context/TeacherContext';
import Loader from "../../components/teacher/Loader";
import { getTicketsList } from "../../api/teacherAPI";

import { useRouter } from "next/navigation";

const customStyles = {
  control: (base) => ({
    ...base,
    border: '1px solid #6166AE',
    borderRadius: '8px',
    padding: '5px',
    cursor: 'pointer',
    '&:hover': {
      borderColor: '#6166AE',
    },
  }),
  valueContainer: (base) => ({ ...base, padding: '5px 15px' }),
  placeholder: (base) => ({
    ...base,
    color: '#949494',
    fontSize: '16px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  }),
  singleValue: (base) => ({ ...base, color: '#3B3B3B', fontSize: '16px' }),
  dropdownIndicator: (base) => ({ ...base, color: '#6166AE' }),
  indicatorSeparator: () => ({ display: 'none' }),
  option: (styles, { isSelected, isFocused }) => ({
    ...styles,
    backgroundColor: isSelected ? '#6166AE26' : isFocused ? 'rgba(246, 246, 246, 1)' : 'white',
    color: isSelected ? '#6166AE' : '#000',
    cursor: 'pointer',
    ':hover': { backgroundColor: '#6166AE26', color: '#6166AE' },
  }),
};

const issueTypeOptions = [
  { value: 'Content', label: 'Content' },
  { value: 'Tech', label: 'Technical' },
  // { value: 'Onboarding/Login', label: 'Onboarding/Login' },
  { value: 'Others', label: 'Other' },
];

const Feedback = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedIssueType, setSelectedIssueType] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [successPopup, setSuccessPopup] = useState(false);
  const [topicOptions, setTopicOptions] = useState([]);
  const [chapterOptions, setChapterOptions] = useState([]);
  
  const [isLoader, setIsLoader] = useState(false);
  const [activeIndex, setActiveIndex] = useState(null);
  const [errors, setErrors] = useState({});
  // const toggleFAQ = (index) => {
  //   setActiveIndex(activeIndex === index ? null : index);
  // };
  const [showAll, setShowAll] = useState(false);
  const handleViewAllClick = () => {
    setShowAll(!showAll);
  };

  const router = useRouter();

  // State for Class and Course IDs
  const [classId, setClassId] = useState(null);
  const [courseId, setCourseId] = useState(null);
  const [chapterId, setChapterId] = useState(null);

  const [description, setDescription] = useState("");
  // const [loading, setLoading] = useState(false);

  // Fetch chapters when class or course changes
  const { ChaptersList, loading: chaptersLoading, error: chaptersError } = useChaptersList(classId, courseId);

  // Fetch topics when chapter changes
  const { ChapterData, loading: topicsLoading, error: topicsError, fetchData } = useChapterData();


  const { teacherData } = useTeacher();

  const [ticketData, setTicketData] = useState([]);

  useEffect(() => {
    if (teacherData?.teacher_id) {
      fetchTickets(teacherData.teacher_id);
    }
  }, [teacherData?.teacher_id]);

  // Function to fetch ticket list
  const fetchTickets = async (userid) => {
    setIsLoader(true);
    try {
      const response = await getTicketsList(userid,0,100);
      console.log("TicketsList API Response:", response);

      if (response.data?.status === "success") {
        const tickets = response.data.data.message.values?.map((ticket) => ({
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
        setTicketData(tickets);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setIsLoader(false);
    }
  };

  // Reset chapter and topic when class changes
  useEffect(() => {
    setSelectedChapter(null);
    setChapterId(null);
    setSelectedTopic(null);
  }, [classId, courseId]);

  // Fetch topics when a chapter is selected
  useEffect(() => {
    if (classId && courseId && chapterId) {
      fetchData(classId, courseId, chapterId);
    }
  }, [classId, courseId, chapterId]);

  // // Map chapters to dropdown options
  // const chapterOptions = ChaptersList?.chapters?.map((chapter) => ({
  //   value: chapter.chapter_id,
  //   label: chapter.chapter_name,
  // })) || [];

  // setSelectedChapter(chapterOptions);
  // // Map topics to dropdown options
  // const topicOptions = ChapterData?.topics?.map((topic) => ({
  //   value: topic.topic_id,
  //   label: topic.topic_name,
  // })) || [];
  // setSelectedTopic(topicOptions);



// Inside your component
useEffect(() => {
  // Only map chapters to dropdown options if ChaptersList is available
  const chapterOptions = ChaptersList?.chapters?.map((chapter) => ({
    value: chapter.chapter_id,
    label: chapter.chapter_name,
  })) || [];
  
  setChapterOptions(chapterOptions);
}, [ChaptersList]); // Only run when ChaptersList changes

useEffect(() => {
  // Only map topics to dropdown options if ChapterData is available
  const topicOptions = ChapterData?.topics?.map((topic) => ({
    value: topic.topic_id,
    label: topic.topic_name,
  })) || [];
  
  setTopicOptions(topicOptions);
}, [ChapterData]); // Only run when ChapterData changes

  // Handle class selection
  const handleClassSelect = (newSectionId, newCourseId, selectedOption) => {
    setClassId(newSectionId);
    setCourseId(newCourseId);
    setSelectedClass(selectedOption);

    // Reset dependent dropdowns
    setSelectedChapter(null);
    setChapterId(null);
    setSelectedTopic(null);
    
  };

  // Handle chapter selection
  const handleChapterSelect = (selectedOption) => {
    setSelectedChapter(selectedOption);
    setChapterId(selectedOption.value);
    setSelectedTopic(null); // Reset topic selection
  };


  const handleIssueTypeSelect = (selectedOption) => {
    setSelectedIssueType(selectedOption);

    // Reset Chapter & Topic if issue type is NOT "Content"
    if (selectedOption.value !== "content") {
      setSelectedChapter(null);
      setSelectedTopic(null);
    }
  };

  const closePopup = () => {
    setIsModalOpen(false);
    setSelectedIssueType(null);
    setSelectedSubject(null);
    setSelectedChapter(null);
    setSelectedTopic(null);
    setDescription("");
    setUploadedFiles([]);
    setErrors({});
  };
  // Function to handle form submission
  const handleSubmit = async () => {
    setIsLoader(true);
    setErrors({});
    const newErrors = {};

    // Validate form fields
    if (!selectedClass?.label) {
      newErrors.class = 'Please select a class.';
    }
    if (!selectedIssueType?.value) {
      newErrors.issueType = 'Please select an issue type.';
    }
    if (selectedIssueType?.value === "Content" && (!selectedChapter?.label || !selectedTopic?.label)) {
      newErrors.content = 'Please select both chapter and topic for content-related issues.';
    }
    if (!description) {
      newErrors.description = 'Please describe the issue.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoader(false);
      return;
    }

    const formData = new FormData();
    formData.append("userid", teacherData?.teacher_id);
    formData.append("class", selectedClass?.label || "");
    formData.append("is_parent", "No");
    formData.append("email", teacherData?.teacher_email);
    // formData.append("email", "student@gmail.com");
    formData.append("school", teacherData?.school_name);
    formData.append("subject", 'T - '+selectedIssueType?.value);
    formData.append("status", "Open");
    formData.append("priority", "");
    formData.append("issue_type", selectedIssueType?.value || "");
    formData.append("name", teacherData?.teacher_name);
    formData.append("description", description);
    formData.append("subjects", selectedClass?.label || "");
    formData.append("interface", 'Teacher LMS');
    // If it's a "Content" issue type, append chapter and topic
    if (selectedIssueType?.value === "Content") {
      formData.append("chapter", selectedChapter?.label || "");
      formData.append("topic", selectedTopic?.label || "");
    }

    formData.append("activities", "");

    // Attach files to FormData (Iterating through uploadedFiles to append each file)
    if (uploadedFiles && uploadedFiles.length > 0) {
      uploadedFiles.forEach((file, index) => {
        formData.append("content", file);  // Appending each file to FormData
      });
    }

    try {
      const response = await addTicket(formData);
    
      // ✅ Check for Frappe-style internal errors even with 200 status
      const isError = response?.data?.exc_type || response?.data?._server_messages;
    
      if (!isError && (response.status === 200 || response.status === 201)) {
        // ✅ Success flow
        setIsModalOpen(false);
        setSuccessPopup(true);
    
        setTimeout(() => {
          setSuccessPopup(false);
        }, 3000);
    
        fetchTickets(teacherData?.teacher_id);
        resetForm();
      } else {
        // ✅ Extract Frappe error message
        let errorMsg = "Error submitting ticket.";
        if (response?.data?._server_messages) {
          try {
            const serverMessages = JSON.parse(response.data._server_messages);
            if (Array.isArray(serverMessages) && serverMessages.length > 0) {
              const parsed = JSON.parse(serverMessages[0]);
              errorMsg = parsed.message || parsed._server_messages || errorMsg;
            }
          } catch (parseErr) {
            console.warn("Error parsing _server_messages:", parseErr);
          }
        } else if (response?.data?.message) {
          errorMsg = response.data.message;
        }
    
        alert(errorMsg);
      }
    } catch (error) {
      console.error("API Submission Error:", error);
      alert("Failed to submit ticket. Please try again.");
    } finally {
      setIsLoader(false);
    }


  };

const handleFileUpload = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
        // Add files to the uploadedFiles array
        setUploadedFiles((prevFiles) => [...prevFiles, ...files]);
    }
};

const removeFile = (index) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
};

// Function to reset the form fields
const resetForm = () => {
    setSelectedClass(null);         // Reset class selection
    setSelectedIssueType(null);     // Reset issue type
    setSelectedChapter(null);       // Reset chapter selection
    setSelectedTopic(null);         // Reset topic selection
    setDescription("");             // Reset description field
    setUploadedFiles(null);         // Reset uploaded files
    setErrors({});                  // Reset errors
};



  const faqs = [
    {
      question: "How to reset your password?",
      answer: `
      
      Click on the "Forgot Password" button on the login page.
      <ul>
          <li>Enter your registered mobile number or username.</li>
          <li>Follow the on-screen instructions to verify your identity and create a new password.</li>
        </ul>
      `,
    },
    {
      question: "Can i assign topics after ending a chapter?",
      answer: "Yes, you can assign topics even after ending a chapter.",
    },
    {
      question: "What do proficiency and completion represent?",
      answer: `The Proficiency Bar represents the level of understanding of a chapter or topic at both the student and class levels.
      \nCompletion shows the percentage of assigned tasks attempted at the class, chapter, topic, and student levels.`,
    },
    {
      question: "Can i start two chapters?",
      answer: "No, only one chapter per subject can be assigned at a time. To start a new chapter, you must first end the ongoing one.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  const handleViewDetails = (ticketNo) => {
    setIsLoader(true); // Optionally show a loader while navigating
    router.push(`/teacher/feedbackchat?ticketId=${ticketNo}`);
  };
  return (

    <div className="main-content">

      {/* {loading ? <Loader /> : ''} */}
      <div className="class-overview-header">
        <div className="classheading">
          <h2>Feedback</h2>
        </div>
      </div>

      <div className="my-classes-section">

        <div className="feedback-teacher-top-card">
          <div className="feedback-content">
            <Image src={TeacherFeadback} alt="Teacher Feedback" width={90} height={90} />
            <div className="feedback-text">
              <h3>Send Feedback</h3>
              <p>Found an issue? Report it here!</p>
            </div>
          </div>
          <div>
            <button className="modal-yes-button"
            onClick={() => {
              setSelectedIssueType([]);
              setSelectedSubject([]); setSelectedChapter([]); setSelectedTopic([]);
              setDescription(''); setUploadedFiles([]); setTopicOptions([]);setChapterOptions([]);setIsModalOpen(true)
          }}

            style={{ position: 'relative', top: '25px' }}>
              Raise a Ticket
            </button>
          </div>
        </div>

        <div className="mt20 mb20 dfjs">
          <h3 className="feadbackinnerhead">Active and Previous Ticket</h3>
          <button className="viewAll" onClick={handleViewAllClick}>
            {showAll ? 'View Less' : 'View All'}
          </button>
        </div>

        <div className="feedback-cards">
          {ticketData.slice(0, showAll ? ticketData.length : 3).map((ticket, index) => {
            let activeStep = 1;
            if (ticket.ticketStatus === "In progress") {
              activeStep = 2;
            } else if (ticket.ticketStatus === "Resolved") {
              activeStep = 3;
            }

            return (
              <div key={index} className="feedback-card">
                <div className="ticket-header" style={{ display: 'flex', gap: '5px', width: '100%' }}>
                  <div className="icon-container">
                    <Image src={Ticket} alt={"Ticket Icon"} width={25} height={25} />
                  </div>

                  <div style={{ width: '85%' }}>
                    <div className="dfjs">
                      <h4 className="chapter-name" style={{ fontSize: '16px' }}>Feedback</h4>
                      <button className="ticket-button">Ticket No. {ticket.ticketNo}</button>
                    </div>
                    <div>
                      <p className="class-students" style={{ display: 'flex', flexDirection: 'row' }}>
                        Description <span className="truncate-text" style={{ fontWeight: '700' }}> - {ticket.description}</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="chapter-details" style={{ marginTop: '10px' }}>
                  <div className="dfjs" style={{ gap: '20px', justifyContent: 'flex-start' }}>
                    <div className="Feedback-class-chapters">
                      <Image src={Book} alt="Book Icon" width={20} height={20} />
                      <p style={{ margin: '0px' }}>
                        Issue Type : <span style={{ color: '#6166AE' }}> {ticket.issueType}</span>
                      </p>
                    </div>
                    <div className="Feedback-class-chapters">
                      <Image src={Calendar} alt="Calendar Icon" width={20} height={20} />
                      <p style={{ margin: '0px' }}>
                        {new Date(ticket.date).toLocaleDateString('en-GB')}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="progress-wrapper">
                    <div className={`step step-1 ${activeStep >= 1 ? 'active step-1' : 'inactive'}`}>1</div>
                    <div className={`connectorr connectorr-1 ${activeStep >= 2 ? 'active' : 'inactive dashed'}`}></div>
                    <div className={`step step-2 ${activeStep >= 2 ? 'active  step-2' : 'inactive'}`}>2</div>
                    <div className={`connectorr connectorr-2 ${activeStep >= 3 ? 'active' : 'inactive dashed'} `}></div>
                    <div className={`step step-3 ${activeStep >= 3 ? 'active  step-3' : 'inactive'}`}> {ticket.ticketStatus === "Resolved" ? <Image src={CRMTick} alt={"Ticket Icon"} width={20} height={20} /> : 3}  </div>
                  </div>

                  {/* Status Labels */}
                  <div className="labels">
                    <span className="status-label" style={{ color: activeStep === 1 ? 'gray' : 'gray' }}>Open</span>
                    <span className="status-label" style={{ marginLeft: '10px', color: activeStep === 2 ? 'gray' : 'gray' }}>Under Resolution</span>
                    <span className="status-label" style={{ color: activeStep === 3 ? 'gray' : 'gray' }}>Resolved</span>
                  </div>

                  <button
                    className="view-report-button"
                    onClick={() => handleViewDetails(ticket.ticketNo)}
                    style={{ float: 'right', marginTop: '10px' }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })}
        </div>


        <div className="mt20 mb20 dfjs">
          <h3 className="feadbackinnerhead">Quick solution</h3>
        </div>

        <div className="faq-container">
          {faqs.map((faq, index) => (
            <div key={index} className="faq-item">
              <div className="faq-header dfjs" onClick={() => toggleFAQ(index)} style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Image src={FAQ} alt="FAQ Icon" width={70} />
                  <span className="faq-title">{faq.question}</span>
                </div>
                <Image src={openIndex === index ? Up : Down} alt="Toggle Icon" width={20} height={20} />
              </div>

              {openIndex === index && (
                <div className="faq-content">
                  <p dangerouslySetInnerHTML={{ __html: faq.answer }} />
                </div>
              )}
            </div>
          ))}
        </div>

        {isModalOpen && (
        <div className='tch-modal-overlay'>
        <div className='Feedback-tch-modal-content'>
          <h3 className='Feedback-modal-head'>Feedback</h3>
  
          <div className='dropdown-container' style={{ width: '100%', textAlign: 'left', marginTop: '10px' }}>
            <label>Class</label>
            <ClassDropdown onClassChange={handleClassSelect} style={{ width: '100%' }} />
            {errors.class && <span className="error-text">{errors.class}</span>} {/* Display error under class field */}
          </div>
  
          <div className='dropdown-container' style={{ width: '100%', textAlign: 'left', marginTop: '10px' }}>
            <label>Issue Type</label>
            <Select
              instanceId='issue-select'
              value={selectedIssueType}
              onChange={setSelectedIssueType}
              options={issueTypeOptions}
              placeholder='Select Issue Type'
              styles={customStyles}
              isSearchable={false}
              components={{ DropdownIndicator: () => <FiChevronDown /> }}
            />
            {errors.issueType && <span className="error-text">{errors.issueType}</span>} {/* Display error under issue type */}
          </div>
  
          {selectedIssueType?.value === "Content" && (
            <>
              <div className='dropdown-container' style={{ width: '100%', textAlign: 'left', marginTop: '10px' }}>
                <label>Chapter</label>
                <Select
                  instanceId='chapter-select'
                  value={selectedChapter}
                  onChange={handleChapterSelect}
                  options={chapterOptions}
                  placeholder='Select Chapter'
                  styles={customStyles}
                  isSearchable={false}
                  components={{ DropdownIndicator: () => <FiChevronDown /> }}
                />
                {errors.content && <span className="error-text">{errors.content}</span>} {/* Display error under chapter/topic fields */}
              </div>
  
              <div className='dropdown-container' style={{ width: '100%', textAlign: 'left', marginTop: '10px' }}>
                <label>Topic</label>
                <Select
                  instanceId='topic-select'
                  value={selectedTopic}
                  onChange={setSelectedTopic}
                  options={topicOptions}
                  placeholder='Select Topic'
                  styles={customStyles}
                  isSearchable={false}
                  components={{ DropdownIndicator: () => <FiChevronDown /> }}
                />
              </div>
            </>
          )}
  
          <div className='dropdown-container' style={{ width: '100%', textAlign: 'left', marginTop: '10px' }}>
            <label>Describe the issue</label>
            <textarea
              className='issue-description'
              placeholder='Enter the issue details...'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            {errors.description && <span className="error-text">{errors.description}</span>} {/* Display error under description */}
          </div>
  
          <div className='file-upload-container'>
            <label>Attachments</label>
            <div className='dfjs' style={{ gap: '5px' }}>
              <div className='file-upload-box' style={{ minWidth: '35%' }}>
                <input type='file' className='file-upload-input' multiple accept='image/*, .pdf' onChange={handleFileUpload} />
                <span className='file-upload-text'>
                  <Image src={FeedbackBrowse} alt='book' width={25} height={25} />
                  Browse Images
                </span>
              </div>
  
              <div className='uploaded-files'>
                {uploadedFiles.map((file, index) => (
                  <div key={index} className='uploaded-file'>
                    <span>{file.name}</span>
                    <button onClick={() => removeFile(index)}>X</button>
                  </div>
                ))}
              </div>
              
            </div>
          </div>
  
          <div className="modal-buttons" style={{ padding: '0px', marginTop: '40px' }}>
            <button onClick={closePopup} className="modal-no-button" >
              Cancel
            </button>
            <button className="modal-yes-button" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>
        )}

        {successPopup && (
          <div className="success-popup-overlay">
            <div className="success-popup">
              <div className="success-popup-content">
                <Image src={SuccesPopup} alt="Success Icon" className="success-icon" width={80} height={80} />
                <h3>Woo hoo!</h3>
                <p>Your Ticket has been raised successfully.</p>
              </div>
            </div>
          </div>
        )}
        {isLoader ? <Loader /> : ""}
      </div>
    </div>
  );
};

export default Feedback;
