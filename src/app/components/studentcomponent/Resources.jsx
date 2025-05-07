'use client';
import Link from 'next/link';
import Image from 'next/image';
import React from 'react';

import OngoingMaths from '../../../../public/images/studentimg/OngoingMaths.svg';

const Resources = () => {
    return (
        <div className="progress-container">
            <h2 className="progresstitle">Resources</h2>
            <div className="chapterList">
                {chapters.map((chapter, index) => (
                    <Link href={"progresschapter"} key={index} style={{ textDecoration: 'none' }}>
                        <div className="chapterCard">
                            <div className="chapterInfo">
                                <div className="progress-p-icon previous-icon">
                                    <Image src={OngoingMaths} alt="Chapter Icon" className="avatar" />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                                    <span className="chapterTitle">{chapter.name}</span>
                                    {chapter.status === 'Assigned' && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <div className="statusOngoing">
                                                {chapter.status}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

const chapters = [
    { name: "Playing with Numbers", status: "Assigned" },
    { name: "Understanding Elementary Shapes", status: "Assigned" },
    { name: "Understanding Elementary Shapes", status: "Not Assigned" },
    { name: "Fractions and Decimals", status: "Not Assigned" },
    { name: "Basic Geometrical Shapes", status: "Not Assigned" },
    { name: "Visualising Solid Shapes", status: "Assigned" },
    { name: "Understanding Elementary Shapes", status: "Not Assigned" },
    { name: "Fractions and Decimals", status: "Not Assigned" },
    { name: "Basic Geometrical Shapes", status: "Not Assigned" },
    { name: "Whole Numbers", status: "Assigned" },
    { name: "Knowing Our Numbers", status: "Assigned" },
    { name: "Integers", status: "Assigned" },
    { name: "Understanding Elementary Shapes", status: "Not Assigned" },
    { name: "Fractions and Decimals", status: "Not Assigned" },
    { name: "Basic Geometrical Shapes", status: "Not Assigned" },
];

export default Resources;