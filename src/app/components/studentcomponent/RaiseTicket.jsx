'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import backArrowImg from '../../../../public/images/studentimg/left.svg';
import { Editor } from 'primereact/editor';

const RaiseTicket = () => {
    const router = useRouter();
    const [text, setText] = useState("");
    const [file, setFile] = useState(null);
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };
    const handleGoBack = () => {
        router.back();
    };
    return (
        <div className="profile-container">
            <div className="profile-back-arrow">
                <span>
                    <Image src={backArrowImg} alt="Back" onClick={handleGoBack} />
                </span>
                <h4>Report a Problem </h4>
            </div>
            <div className="chapterList">

                <div className="ReportCard">
                    <div className="chapterInfo" style={{ alignItems: 'flex-start', flexDirection: 'column', gap: '25px' }}>
                        <span className="chapterTitle" style={{ fontSize: '24px' }}>Issue Type </span>
                        <div style={{ display: 'flex', flexDirection: 'row', gap: '40px' }}>

                            <span className="chapterTitle" style={{ display: 'flex', alignItems: 'center', fontSize: '16px' }}><input type="checkbox" name="" id="" /> Video Error</span>
                            <span className="chapterTitle" style={{ display: 'flex', alignItems: 'center', fontSize: '16px' }}><input type="checkbox" name="" id="" /> System Error</span>
                            <span className="chapterTitle" style={{ display: 'flex', alignItems: 'center', fontSize: '16px' }}><input type="checkbox" name="" id="" /> Others</span>
                        </div>
                    </div>

                    <div>
                        <span className="chapterTitle" style={{ fontSize: '24px', paddingBottom: '20px' }}> Description </span>
                        <Editor value={text} onTextChange={(e) => setText(e.htmlValue)} style={{ height: '200px' }} />
                        {/* Attachment Section */}
                        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column' }}>
                            <span className="chapterTitle" style={{ fontSize: '24px' }}> Attachments </span>
                            <input type="file" onChange={handleFileChange} style={{ marginTop: '10px' }} />
                        </div>
                    </div>

                    <div className="button-section">
                        <span></span>
                        <button className="yes-btn" style={{ width: '20%' }} >
                            Submit Quiz
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RaiseTicket;
