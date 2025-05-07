"use client"
import React, { useState } from 'react';
import { FiChevronDown, FiChevronRight } from 'react-icons/fi';
import Image from 'next/image';
import { FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import QuizIcon from '../../../../public/imgs/studentimg/Quiz.svg';
import BlueQuizIcon from '../../../../public/imgs/studentimg/BlueQuiz.svg';
import VideoIcon from '../../../../public/imgs/studentimg/VideoCamera.svg';

const ResourcesPlay = () => {
    const [expandedTopic, setExpandedTopic] = useState(null);

    const toggleTopic = (index) => {
        setExpandedTopic(index === expandedTopic ? null : index);
    };

    const topics = [
        {
            name: 'Factors',
            quizzes: [
                { title: 'Quest', icon: QuizIcon },
            ],
            multimedia: [
                { title: 'Video', icon: VideoIcon },
            ],
        },
        {
            name: 'Multiples',
            quizzes: [
                { title: 'Quest', icon: QuizIcon },
                { title: 'Booster', icon: BlueQuizIcon },
                { title: 'Quest', icon: QuizIcon },
                { title: 'Booster', icon: BlueQuizIcon },
                { title: 'Booster', icon: BlueQuizIcon },
            ],
            multimedia: [
                { title: 'Video', icon: VideoIcon },
            ],
        },
        {
            name: 'Prime and Composite Numbers',
            quizzes: [
                { title: 'Quest', icon: QuizIcon },
                { title: 'Booster', icon: BlueQuizIcon },
                { title: 'Booster', icon: BlueQuizIcon }
            ],
            multimedia: [
                
            ],
            
        },
        {
            name: 'Rules of Divisibility',
            quizzes: [
                { title: 'Quest', icon: QuizIcon },
            ],
            multimedia: [
                { title: 'Video', icon: VideoIcon },
                { title: 'Video', icon: VideoIcon },
                { title: 'Video', icon: VideoIcon },
            ],
        },
    ];

    return (
        <div className="progress-container">
            <div className="progressheader">
                <Link href="/" style={{ display: 'flex' }}>
                    <FiArrowLeft className="back-icon" />
                </Link>
                <h2>Understanding Elementary Shapes</h2>
            </div>

            {/* Topics Section */}
            <div className="topics-section">
                {topics.map((topic, index) => (
                    <div key={index} className="topic-item" style={{ border: '1px solid #EAEAEA', borderRadius: '8px', marginBottom: '10px', backgroundColor: '#FFF', padding: '15px' }}>
                        <div
                            className="topic-header"
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <div className="progress-p-icon previous-icon" style={{ color: '#FF8A00', cursor: 'pointer' }} onClick={() => toggleTopic(index)}>
                                    {expandedTopic === index ? <FiChevronDown size={25} /> : <FiChevronRight size={25} />}
                                </div>
                                <span style={{ fontSize: '20px', fontWeight: '700', color: '#535353' }}>{topic.name}</span>
                            </div>
                            <div className="resources-info">
                                <span > Quizzes -  {topic.quizzes.length} </span>
                                <span className="vertical-line"></span>
                                <span > Multimedia - {topic.multimedia.length}</span>
                            </div>
                        </div>

                        {expandedTopic === index && (
                            <div className="topic-details" style={{ marginTop: '15px' }}>
                                <div className="quizzes-section" style={{ marginBottom: '10px' }}>
                                    <h4 style={{ fontSize: '16px', color: '#949494', marginBottom: '10px' }}>Quizzes</h4>
                                    {topic.quizzes.map((quiz, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                            <div className={`progress-p-icon ${quiz.title === 'Booster' ? 'booster-icon' : 'previous-icon'}`}>
                                                <Image src={quiz.icon} alt="Quiz Icon" width={30} height={30} />
                                            </div>
                                            <span style={{ fontSize: '18px', color: quiz.title === 'Booster' ? '#3EA8FF' : '#FF8A00' }}>{quiz.title}</span>
                                        </div>
                                    ))}
                                </div>
                                <div className="multimedia-section">
                                    <h4 style={{ fontSize: '16px', color: '#949494', marginBottom: '10px' }}>Multimedia</h4>
                                    {topic.multimedia.map((media, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>

                                            <div className="progress-p-icon previous-icon">
                                                <Image src={media.icon} alt="Multimedia Icon" width={30} height={30} />
                                            </div>

                                            <span style={{ fontSize: '18px', color: '#FF8A00' }}>{media.title}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ResourcesPlay;
