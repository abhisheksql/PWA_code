"use client";
import '../../../../public/style/teacher.css';
import React, { useState, useEffect, useRef } from 'react';
import Image from "next/image";
import left from "../../../../public/images/teacher/left.svg";
import Calendar from "../../../../public/images/teacher/CalendarMinus.svg";
import Ticket from "../../../../public/images/teacher/Ticket.svg";
import Book from "../../../../public/images/teacher/book-alt.svg";
import Chapter from "../../../../public/images/teacher/Maths.svg";
import ticketGreenButton from "../../../../public/images/studentimg/ticketGreenButton.svg";
import AcadallyChatLogo from "../../../../public/images/teacher/AcadallyChatLogo.svg";
import { useSearchParams } from "next/navigation";
import { getTicketDetails } from "../../api/teacherAPI";
import Loader from "../../components/teacher/Loader";
import { useRouter } from "next/navigation";


const FeedbackChat = () => {
    const searchParams = useSearchParams();
    const ticketId = searchParams.get("ticketId"); 
    const [ticketDetails, setTicketDetails] = useState(null);
    const [isLoader, setIsLoader] = useState(false);
    const [messages, setMessages] = useState([]);
    const chatRef = useRef(null);
    const [attachments, setAttachments] = useState(null);
    const router = useRouter();

    useEffect(() => {
        if (ticketId) {
            fetchTicketDetails(ticketId);
        }
    }, [ticketId]);

    const fetchTicketDetails = async (id) => {
        try {
            setIsLoader(true);
            const response = await getTicketDetails(id);
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
                const formattedMessages = comments.map((comment) => ({
                    text: comment.content.replace(/<\/?[^>]+(>|$)/g, ""), // Strip HTML tags
                    time: comment.creation.split(" ")[1], // Extract time
                    sender: comment.owner === "Administrator" ? "me" : "other",
                    image: comment.owner === "Administrator" ? "" : AcadallyChatLogo,
                }));

                setMessages(formattedMessages);
            }
        } catch (error) {
            console.error("Error fetching ticket details:", error);
        } finally {
            setIsLoader(false);
        }
    };

    useEffect(() => {
        chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
    }, [messages]);

    const handleFeeddBack = () => {
        setIsLoader(true);
        router.push(`/teacher/feedback`);
      };

    return (
        <div className="main-content">
            <div className="class-overview-header">
                <div className="classheading">
                    <span style={{ cursor: 'pointer' }}>
                        <Image src={left} alt="Left Icon" width={20} height={20} 
                        onClick={() => handleFeeddBack()}/>
                    </span>
                    <h2>Feedback</h2>
                </div>
            </div>

            <div className="Feedback-Card-Boxes">
                {/* Ticket Details Card */}
                <div className="FeedChat-chapter-card">
                    <div className="ticket-header" style={{ display: 'flex', gap: '5px', width: '100%' }}>
                        <div className="icon-container">
                            <Image src={Ticket} alt="Ticket Icon" width={20} height={20} />
                        </div>
                        <div style={{ width: '90%' }}>
                            <div className="dfjs">
                                <h4 className="chapter-name" style={{ fontSize: '16px' }}>Ticket No. {ticketDetails?.name} </h4>
                                <button className="ticket-button" style={{ fontSize: '11px', padding: '5px 10px' }}>
                                    {/* {ticketDetails?.subject} */}
                                    {ticketDetails?.class}
                                
                                </button>
                            </div>
                            <p style={{ margin: '0px', fontSize: '13px', fontWeight: '600' }}>
                                Issue Type: <span style={{ color: '#6166AE' }}>{ticketDetails?.issue_type}</span>
                            </p>
                        </div>
                    </div>

                    {ticketDetails?.issue_type === 'Content' && (
                        <div className="chapter-details">
                            <div className="class-chapters">
                                <Image src={Chapter} alt="Issue Icon" width={20} height={20} />
                                <p style={{ margin: '0px', fontSize: '13px', fontWeight: '600' }}>
                                    Chapter : <span style={{ color: '#6166AE' }}>{ticketDetails?.chapter}</span>
                                </p>
                            </div>
                            <div className="class-chapters" style={{ marginTop: '5px' }}>
                                <Image src={Book} alt="Issue Icon" width={20} height={20} />
                                <p style={{ margin: '0px', fontSize: '13px', fontWeight: '600' }}>
                                    Topic : <span style={{ color: '#6166AE' }}>{ticketDetails?.topic}</span>
                                </p>
                            </div>
                        </div>
                    )}

                    <div className='feedbackDescription'>
                        <h4>Description</h4>
                        <p>{ticketDetails?.description || "No description available."}</p>
                    </div>

                    {/* Attachments */}
                    {attachments?.length > 0 && (
                        <div className="feedbackAttachment">
                            <h4>Attachments</h4>
                            <div className="uploaded-files">
                                {attachments.map((attachment, index) => (
                                    <div key={index} className="uploaded-file">
                                        {/* Check if attachment is an image */}
                                        {attachment.file_url.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                                            <a href={attachment.file_url} target="_blank" rel="noopener noreferrer" style={{width:'100%', height:'100%'}}>
                                                <Image 
                                                    src={attachment.file_url}
                                                    alt="Attachment Preview"
                                                    className="attachment-preview"
                                                    width={40} height={40}
                                                />
                                            </a>
                                        ) : (
                                            // Show a generic file icon or name for non-image files
                                            <a href={attachment.file_url} target="_blank" rel="noopener noreferrer">
                                                <span className="file-name">{attachment.file_url.split('/').pop()}</span>
                                            </a>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}


                    <div className="class-chapters" style={{ marginTop: '15px' }}>
                        <Image src={Calendar} alt="Calendar Icon" width={20} height={20} />
                        <p style={{ margin: '0px', fontSize: '13px', fontWeight: '600' }}>
                            Created on: <span style={{ color: '#6166AE' }}>
                                {new Date(ticketDetails?.date_of_issue).toLocaleDateString('en-GB')}
                            </span>
                        </p>
                    </div>
                </div>

                {/* Chat Section */}
                {messages.length > 0 && (
                    <div className="chat-container">
                        <div className="chat-header">
                            <span>Response from Support</span>
                        </div>
                        <div ref={chatRef} className="chat-messages">
                        {[...messages].reverse().map((msg, index) => (
                                <div key={index} className={`message-wrapper ${msg.sender === "me" ? "sent" : "received"}`}>
                                    {msg.sender === "other" && (
                                        <Image src={msg.image} alt="Profile" className="profile-pic" width={30} height={30} />
                                    )}
                                    <div className="message-box">
                                        <p className="message-text">{msg.text}</p>
                                        <span className="message-time">  {new Date(ticketDetails?.date_of_issue).toLocaleDateString('en-GB')}</span>
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
                                        <p class="resolved-date"><span style={{ fontWeight: '700' }}>Resolved Date:</span>   {new Date(ticketDetails?.modified).toLocaleDateString('en-GB')}</p>
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
