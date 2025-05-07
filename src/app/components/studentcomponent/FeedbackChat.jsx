"use client";

import Image from "next/image";
import left from "../../../../public/images/studentimg/left.svg";
import feedbackCalendar from "../../../../public/images/studentimg/feedbackCalendar.svg";
import studentTicket from "../../../../public/images/studentimg/studentTicket.svg";
import React, { useState, useEffect, useRef } from "react";
import AcadallyChatLogo from "../../../../public/images/studentimg/AcadallyChatLogo.svg";
import RaiseMath from "../../../../public/images/studentimg/RaiseMath.svg";
import RaiseBook from "../../../../public/images/studentimg/RaiseBook.svg";
import ticketGreenButton from "../../../../public/images/studentimg/ticketGreenButton.svg";
import axiosInstance from "../../auth";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "../../components/studentcomponent/Loader";
const FeedbackChat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null);
  const searchParams = useSearchParams();
  const ticketId = searchParams.get("ticketId");
  const [ticketDetails, setTicketDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attachments, setAttachments] = useState(null);
  const chatRef = useRef(null);
  const router = useRouter();
  const [isLoader, setIsLoader] = useState(false);

  useEffect(() => {
    if (ticketId) {
      fetchTicketDetails(ticketId);
    }
  }, [ticketId]);

  const fetchTicketDetails = async (id) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/onboarding/get_ticket/${id}/`);
      if (response.data?.status === "success") {
        const ticketData = response.data.data.docs[0]; // Extract ticket details
        const comments = response.data.data.docinfo.comments || []; // Extract comments
        const attachments = response.data.data.docinfo.attachments || []; // Extract comments
        const attachmentsData = attachments.map((attachment) => ({
          file_url: "https://crm.acadally.com" + attachment.file_url,
        }));
        setAttachments(attachmentsData);
        setTicketDetails(ticketData);
        // Convert comments to chat messages
        // const formattedMessages = comments.map((comment) => ({
        //   text: comment.content.replace(/<\/?[^>]+(>|$)/g, ""), // Strip HTML tags
        //   time: comment.creation.split(" ")[1], // Extract time
        //   sender: comment.owner === "Administrator" ? "me" : "other",
        //   image: comment.owner === "Administrator" ? "" : AcadallyChatLogo,
        // }));





        // Convert comments to chat messages
        const formattedMessages = comments.map((comment) => {
          const time = new Date(comment.creation);
          return {
            text: comment.content.replace(/<\/?[^>]+(>|$)/g, ""), // Strip HTML tags
            time: time.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true, // 12-hour format (AM/PM)
            }),
            sender: comment.owner === "Administrator" ? "me" : "other",
            image: comment.owner === "Administrator" ? "" : AcadallyChatLogo,
          };
        });





        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Error fetching ticket details:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
  }, [messages]);

  const sendMessage = () => {
    if (input.trim() !== "") {
      setMessages([
        ...messages,
        {
          text: input,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          sender: "me",
        },
      ]);
      setInput("");
    }
  };

  const handleFileChange = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      const isPDF = uploadedFile.type === "application/pdf";
      setMessages([
        ...messages,
        {
          text: isPDF ? "Attachment" : uploadedFile.name,
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          }),
          sender: "me",
          file: URL.createObjectURL(uploadedFile),
          fileType: isPDF ? "pdf" : "image",
        },
      ]);
    }
  };

  const handleFeeddBack = () => {
    // setIsLoader(true);
    setIsLoader(true); ``
    router.push(`/student/raiseticket`);
  };

  return (
    <div className="raiseAticket">
      <div className="profile-back-arrow">
        <span style={{ cursor: "pointer" }}>
          <Image
            src={left}
            alt="Back Icon"
            onClick={() => router.push(`/student/raiseticket`)}
          />
        </span>
        <h4>Feedback</h4>
      </div>
      <div className="Feedback-Card-Boxes">
        <div className="FeedChat-chapter-card">
          <div
            className="ticket-header"
            style={{ display: "flex", gap: "5px", width: "100%" }}
          >
            <div className="icon-container">
              <Image
                src={studentTicket}
                alt={"Ticket"}
                width={20}
                height={20}
              />
            </div>
            <div style={{ width: "90%" }}>
              <div className="dfjs">
                <h4 className="chapter-name" style={{ fontSize: "16px" }}>
                  Ticket No.{ticketDetails?.name}
                </h4>
                <button
                  className="ticket-button"
                  style={{ fontSize: "13px", padding: "5px 10px" }}
                >
                  {ticketDetails?.class}
                </button>
              </div>
              <div className="class-chapters">
                <p
                  style={{ margin: "0px", fontSize: "13px", fontWeight: "600" }}
                >
                  {" "}
                  Issue Type :{" "}
                  <span style={{ color: "#FF8A00" }}>
                    {ticketDetails?.issue_type}
                  </span>
                </p>
              </div>
            </div>
          </div>
          {/* || ticketDetails?.issue_type == "Others" */}
          {(ticketDetails?.issue_type == "Content") && (
            <div className="chapter-details">
              <div className="class-chapters">
                <Image src={RaiseMath} alt="Issue" width={20} height={20} />
                <p
                  style={{ margin: "0px", fontSize: "13px", fontWeight: "600" }}
                >
                  {" "}
                  Chapter :
                  <span style={{ color: "#FF8A00" }}>
                    {" "}
                    {ticketDetails?.chapter}
                  </span>
                </p>
              </div>
              <div className="class-chapters" style={{ marginTop: "5px" }}>
                <Image src={RaiseBook} alt="Issue" width={20} height={20} />
                <p
                  style={{ margin: "0px", fontSize: "13px", fontWeight: "600" }}
                >
                  Topic :{" "}
                  <span style={{ color: "#FF8A00" }}>
                    {ticketDetails?.topic}
                  </span>
                </p>
              </div>
            </div>
          )}
          <div className="feedbackDescription">
            <h4>Description</h4>
            <p>{ticketDetails?.description}</p>
          </div>
          {attachments?.length > 0 && (
            <div className="feedbackAttachment">
              <h4>Attachments</h4>
              <div className="uploaded-files">
                {attachments.map((attachment, index) => (
                  <div key={index} className="uploaded-file">
                    <a
                      href={attachment?.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Image
                        src={attachment?.file_url}
                        width={20}
                        height={20}
                        alt="Attachment"
                      />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="class-chapters" style={{ marginTop: "15px" }}>
            <Image
              src={feedbackCalendar}
              alt="Calander"
              width={20}
              height={20}
            />
            <p style={{ margin: "0px", fontSize: "13px", fontWeight: "600" }}>
              {" "}
              Created on :{" "}
              <span style={{ color: "#FF8A00" }}>
                {new Date(ticketDetails?.date_of_issue).toLocaleDateString(
                  "en-GB"
                )}{" "}
              </span>
            </p>
          </div>
        </div>


        {messages.length > 0 && (

          <div className="chat-container">
            <div className="chat-header">
              <span>Response from Support</span>
            </div>
            <div ref={chatRef} className="chat-messages">
              {[...messages].reverse().map((msg, index) => (
                // {messages.map((msg, index) => (
                <div key={index} className={`message-wrapper ${msg.sender === "me" ? "sent" : "received"}`}>
                  {msg.sender === "other" && (
                    <Image src={msg.image} alt="Profile" className="profile-pic" width={30} height={30} />
                  )}
                  <div className="message-box">
                    {msg.fileType === "pdf" ? (
                      <div className="attachment-message">
                        📄 <a href={msg.file} target="_blank" rel="noopener noreferrer">Attachment</a>
                      </div>
                    ) : msg.fileType === "image" ? (
                      <Image src={msg.file} alt="Attachment" className="attached-file" />
                    ) : (
                      <p className="message-text">{msg.text}</p>
                    )}
                    <span className="message-time">{msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {ticketDetails?.ticket_status == 'Resolved' && (
              <div class="ticket-container">
                <div className="dfa" style={{ gap: '10px' }}>
                  <Image src={ticketGreenButton} alt='Calander' width={40} height={40} />
                  <div class="ticket-info">
                    <p class="status">Ticket Closed</p>
                    <p class="resolved-date"><span style={{ fontWeight: '700' }}>Resolved Date:</span>{new Date(ticketDetails?.modified).toLocaleDateString(
                      "en-GB"
                    )}{" "}</p>
                  </div>
                </div>
                <button class="raise-ticket-btn" onClick={() => handleFeeddBack()}>Raise a new ticket</button>
              </div>
            )}
          </div>
        )}
        
      </div>
      {isLoader ? <Loader /> : ""}

    </div>
  );
};

export default FeedbackChat;
