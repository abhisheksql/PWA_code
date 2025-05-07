'use client';
import React, { useState, useRef, useEffect } from 'react';
// import React, { useEffect } from 'react';
import Select from 'react-select';
import Link from 'next/link';
import Image from 'next/image';
import { RxCross2 } from "react-icons/rx";

import TopSvg from '../../../../../public/images/studentimg/BoosterTop.svg';
import BtmSvg from '../../../../../public/images/studentimg/Boosterbtm.svg';

// import TopSvg from '../../../../../public/images/studentimg/top-svg.svg';
import Gems from '../../../../../public/images/studentimg/Gems.svg';
import Coin from '../../../../../public/images/studentimg/Coin.svg';
import BoosterBluePopupImg from '../../../../../public/images/studentimg/BoosterBluePopupImg.svg';
import LockIcon from '../../../../../public/images/studentimg/locked.svg';
import BoosterMaths from '../../../../../public/images/studentimg/BoosterMaths.svg';


import Readiness from '../../../../../public/images/studentimg/Readiness.svg';
import Quest from '../../../../../public/images/studentimg/Quest.svg';
import Milestone from '../../../../../public/images/studentimg/Milestone.svg';
import Sapling from '../../../../../public/images/studentimg/Sapling.svg';
import Plant from '../../../../../public/images/studentimg/Plant.svg';
import Tree from '../../../../../public/images/studentimg/Tree.svg';

import ReadinessPopup from '../../../../../public/images/studentimg/ReadinessPopup.svg';
import QuestPopup from '../../../../../public/images/studentimg/QuestPopup.svg';
import MilestonePopup from '../../../../../public/images/studentimg/MilestonePopup.svg';
import SaplingPopup from '../../../../../public/images/studentimg/SaplingPopup.svg';
import PlantPopup from '../../../../../public/images/studentimg/PlantPopup.svg';
import TreePopup from '../../../../../public/images/studentimg/TreePopup.svg';
import BoosterPopup from '../../../../../public/images/studentimg/BoosterPopup.svg';

const BoostMainContent = () => {
    const [showPopup, setShowPopup] = useState({
        readiness: false,
        quest: false,
        milestone: false,
        magicLamp: false,
        sapling: false,
        plant: false,
        tree: false,
    });

    // useEffect(() => {
    //     // Initialize Bootstrap Popovers
    //     if (typeof window !== 'undefined') {
    //         const bootstrap = require('bootstrap');
    //         const popoverTriggerList = Array.from(
    //             document.querySelectorAll('[data-bs-toggle="popover"]')
    //         );
    //         popoverTriggerList.map(
    //             (popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl)
    //         );
    //     }
    // }, []);








    useEffect(() => {
        if (typeof window !== 'undefined') {
            const bootstrap = require('bootstrap');

            // Initialize Popovers
            const popoverTriggerList = Array.from(
                document.querySelectorAll('[data-bs-toggle="popover"]')
            );
            popoverTriggerList.forEach(
                (popoverTriggerEl) =>
                    new bootstrap.Popover(popoverTriggerEl, {
                        html: true,
                        sanitize: false,
                    })
            );

            // Event Listener for closing all popovers
            const closeAllPopovers = (event) => {
                const popovers = document.querySelectorAll('.popover');
                popovers.forEach((popover) => {
                    if (!popover.contains(event.target)) {
                        const instance = bootstrap.Popover.getInstance(
                            document.querySelector('[data-bs-toggle="popover"]')
                        );
                        if (instance) instance.hide();
                    }
                });
            };
            document.addEventListener('click', closeAllPopovers);
            return () => {
                document.removeEventListener('click', closeAllPopovers);
            };
        }
    }, []);







    const handleIconClick = (popupType) => {
        setShowPopup({ ...showPopup, [popupType]: true });
    };

    const handleClosePopup = (popupType) => {
        setShowPopup({ ...showPopup, [popupType]: false });
    };

    return (
        <div className="boostmainContent">

            <div className='sticky'>
                <div className='progress-head'>
                    <div className='progress-head-icon'>
                        <Image src={BoosterMaths} alt="Readiness" className="progress-show" />
                    </div>
                    <div>
                        <span>Know your Progress</span>
                        <p>Click on each icon to understand what they represent and how they help your learning journey</p>
                    </div>
                </div>
            </div>

            <div className="topic-name-container">
                <div className="topicline"></div>
                <div className="topic-name-box">Topic Name</div>
                <div className="topicline"></div>
            </div>

            <div className="progress">

                <div className="stage">
                    <div className="Booster-stage-icon1">
                        <span
                            data-bs-toggle="popover"
                            data-bs-placement="bottom"
                            data-bs-trigger="click"
                            data-bs-html="true"
                            data-bs-content={`
                        <div class="popover-content">
                            <div class="progress-head-icon">
                                    <img src="${LockIcon.src}" alt="lock" class="progress-show" />
                            </div>
                            <div>
                                <h5 class="popover-title">Readiness</h5>
                                <p class="popover-text">Stay tuned! This quiz will unlock soon.</p>
                            </div>
                        </div>
                    `}
                        >
                            <Image src={Readiness} alt="Readiness" className="progress-icon" />
                        </span>
                        <p>Readiness</p>
                    </div>


                    <Image src={TopSvg} alt="Top svg" className="progress-show boostresponsive-svg" />
                </div>

                <div className="stage">
                    <div className="Booster-stage-icon2">
                        <span
                            data-bs-toggle="popover"
                            data-bs-placement="bottom"
                            data-bs-trigger="click"
                            data-bs-html="true"
                            data-bs-content={`
                        <div class="popover-content">
                            <div class="progress-head-icon">
                                    <img src="${LockIcon.src}" alt="lock" class="progress-show" />
                            </div>
                            <div>
                                <h5 class="popover-title">Quest</h5>
                                <p class="popover-text">Stay tuned! This quiz will be assigned soon.</p>
                            </div>
                        </div>
                    `}
                        >
                            <Image src={Quest} alt="Quest" className="progress-icon" />
                        </span>
                        <p>Quest</p>
                    </div>

                    <Image src={BtmSvg} alt="Bottom Svg" className="progress-show boostresponsive-svg" />
                </div>


                <div className="topic-name-container">
                    <div className="topicline"></div>
                    <div className="topic-name-box">Topic Name</div>
                    <div className="topicline"></div>
                </div>

                <div className="stage">
                    <div className="Booster-stage-icon1">
                        <span >
                            <Image src={Readiness} alt="Readiness" className="progress-icon" />
                        </span>
                        <p>Readiness</p>
                    </div>
                    <Image src={TopSvg} alt="Top svg" className="progress-show boostresponsive-svg" />
                </div>

                <div className="stage">
                    <div className="Booster-stage-icon2">
                        <span onClick={() => handleIconClick('quest')}>
                            <Image src={Quest} alt="Quest" className="progress-icon" />
                        </span>
                        <p>Quest</p>
                    </div>
                    <Image src={BtmSvg} alt="Bottom Svg" className="progress-show boostresponsive-svg" />
                </div>






                <div className="topic-name-container">
                    <div className="topicline"></div>
                    <div className="topic-name-box">Topic Name</div>
                    <div className="topicline"></div>
                </div>





                <div className="stage">
                    <div className="Booster-stage-icon1">
                        <span
                            data-bs-toggle="popover"
                            data-bs-placement="bottom"
                            data-bs-trigger="click"
                            data-bs-html="true"
                            data-bs-content={`
                        <div class="popover-content">
                           <div class="progress-head-icon">
                                    <img src="${LockIcon.src}" alt="lock" class="progress-show" />
                            </div>
                            <div>
                                <h5 class="popover-title">Milestone</h5>
                                <p class="popover-text">Stay tuned! This quiz will unlock soon.</p>
                            </div>
                        </div>
                    `}
                        >
                            <Image src={Milestone} alt="Milestone" className="progress-icon" />
                        </span>
                        <p>Milestone</p>
                    </div>

                    <Image src={TopSvg} alt="Top svg" className="progress-show boostresponsive-svg" />
                    <Image src={Quest} alt="Magic Lamp" className="magicright" onClick={() => handleIconClick('magicLamp')} />
                </div>
            </div>

            {/* Popups Section */}
            {/* {showPopup.readiness && <ReadinessPopupBox handleClosePopup={handleClosePopup} />} */}
            {showPopup.quest && <QuestPopupBox handleClosePopup={handleClosePopup} />}
            {showPopup.milestone && <MilestonePopupBox handleClosePopup={handleClosePopup} />}

        </div >
    );
};

// Popup Boxes Code Section

{/* Readiness Popup */ }
// const ReadinessPopupBox = ({ handleClosePopup }) => (
//     // <div className="popup-overlay">
//     //     <div className="popup-box">
//     //         <div className="popup-header">
//     //             <h2>Readiness</h2>
//     //             <button className="close-btn" onClick={() => handleClosePopup('readiness')}> <RxCross2 /> </button>
//     //         </div>
//     //         <Image src={ReadinessPopup} alt="ReadinessPopup" className="progress-popup-icon" />
//     //         <div className="popup-content">
//     //             <p>A readiness quiz assesses your knowledge before starting a new chapter.</p>
//     //             <p>This quiz is assigned at the beginning of each new chapter.</p>
//     //         </div>
//     //         <div className="popup-footer">
//     //             <button onClick={() => handleClosePopup('readiness')} className="understood-btn">I Understand</button>
//     //             <div className="three-dots">
//     //                 <div className="dot"></div>
//     //                 <div className="dot middle"></div>
//     //                 <div className="dot"></div>
//     //             </div>
//     //         </div>
//     //     </div>
//     // </div>
//     <div
//         className="popup-box"
//         style={{
//             position: 'absolute',
//             top: imageRef.current
//                 ? imageRef.current.getBoundingClientRect().bottom + window.scrollY + 10
//                 : '50%',
//             left: imageRef.current
//                 ? imageRef.current.getBoundingClientRect().left + window.scrollX
//                 : '50%',
//             zIndex: 1000,
//             padding: '10px',
//             backgroundColor: '#fff',
//             border: '1px solid #ccc',
//             boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
//             borderRadius: '5px',
//             minWidth: '200px',
//         }}
//     >
//         <div>
//             <p><strong>Milestone</strong></p>
//             <p>Stay tuned! This quiz will unlock soon.</p>
//             <button onClick={togglePopup} className="btn btn-secondary btn-sm">
//                 Close
//             </button>
//         </div>
//     </div>

// );

{/* Quest Popup */ }
const QuestPopupBox = ({ handleClosePopup }) => (
    <div className="popup-overlay">
    <div className="popup-box">
        <div className="popup-header" style={{ justifyContent: 'left' }}>
            <div className="popup-header-left">
                <h2>Booster</h2>
            </div>
            <button className="close-btn" onClick={() => handleClosePopup('quest')}> <RxCross2 /> </button>
        </div>
        <div className="popup-center">
            <span className='col1' >
                <Image src={Coin} alt="Discovery Coins" width={25} height={25} />
                +100
            </span>
            <Image src={BoosterBluePopupImg} alt="Readiness Pink" className="progress-popup-icon" />
        </div>
        <div className="popup-content" style={{ marginTop: '0px' }}>
            <h3>Discover the Explorer Within You!</h3>
            <p>Start your quiz if you’ve studied this topic in class.</p>
        </div>
        <div className="popup-footer">
            <button onClick={() => handleClosePopup('readiness')} className="Booster-start-btn gem-btn" >Start</button>
        </div>
    </div>
</div>
);

{/* Milestone Popup */ }
const MilestonePopupBox = ({ handleClosePopup }) => (
    <div className="popup-overlay">
        <div className="popup-box">
            <div className="popup-header">
                <h2>Milestone</h2>
                <button className="close-btn" onClick={() => handleClosePopup('milestone')}> <RxCross2 /> </button>
            </div>
            <Image src={MilestonePopup} alt="MilestonePopup" className="progress-popup-icon" />
            <div className="popup-content">
                <p>A milestone assesses your knowledge of a chapter.</p>
                <p>After finishing all the quests, take this quiz to see how much you have learned.</p>
            </div>
            <div className="popup-footer">
                <button onClick={() => handleClosePopup('milestone')} className="understood-btn">I Understand</button>
                <div className="three-dots">
                    <div className="dot"></div>
                    <div className="dot middle"></div>
                    <div className="dot"></div>
                </div>
            </div>
        </div>
    </div>
);





export default BoostMainContent;



