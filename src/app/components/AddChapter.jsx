'use client';
import { use, useState, useEffect } from 'react';
import Select from 'react-select';
import Link from 'next/link';
import { FaArrowLeft } from "react-icons/fa";
import { FiEdit3, FiTrash2 } from "react-icons/fi";
import Image from 'next/image';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from 'react-toastify';
import { produce } from 'immer';
import axiosInstance from '../auth';
import Loader from "../components/Loader";
import { set } from 'date-fns';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import { useSearchParams } from 'next/navigation';


const leapApiUrl = process.env.NEXT_PUBLIC_LEAP_API_URL;
const yourBearerToken = process.env.NEXT_PUBLIC_BEARER_TOKEN;


// Define item types for dragging
const ItemTypes = {
    CHAPTER: 'CHAPTER',
    TOPIC: 'TOPIC',
    LU: 'LU',
};

// Custom component for drag-and-drop
function DraggableItem({ item, index, moveItem, type, children }) {
    const [, ref] = useDrag({
        type,
        item: { index },
    });

    const [, drop] = useDrop({
        accept: type,
        hover(draggedItem) {
            if (draggedItem.index !== index) {
                moveItem(draggedItem.index, index, type);
                draggedItem.index = index; // Update the dragged item's index
            }
        },
    });

    return (
        <div ref={(node) => ref(drop(node))}>
            {children}
        </div>
    );
}

export default function AddChapter({ courseid }) {
    const [board, setBoard] = useState(null);
    const [publication, setPublication] = useState(null);
    const [grade, setGrade] = useState(null);
    const [subject, setSubject] = useState(null);
    const [chapters, setChapters] = useState(null);
    const [visibleChapters, setVisibleChapters] = useState([]);

    const [boardOptions, setBoardOptions] = useState([]);
    const [publicationOptions, setPublicationOptions] = useState([]);
    const [gradeOptions, setGradeOptions] = useState([]);
    const [subjectOptions, setSubjectOptions] = useState([]);
    const [chapterOptions, setChapterOptions] = useState([]);

    const [PopupBoard, setPopupBoard] = useState(null);
    const [PopupBoardOptions, setPopupBoardOptions] = useState([]);
    const [PopupPublication, setPopupPublication] = useState(null);
    const [PopupPublicationOptions, setPopupPublicationOptions] = useState([]);
    const [PopupGrade, setPopupGrade] = useState(null);
    const [PopupGradeOptions, setPopupGradeOptions] = useState([]);
    const [PopupSubject, setPopupSubject] = useState(null);
    const [PopupSubjectOptions, setPopupSubjectOptions] = useState([]);
    const [PopupChapter, setPopupChapter] = useState(null);
    const [PopupChapterOptions, setPopupChapterOptions] = useState([]);

    const [PopupTopic, setPopupTopic] = useState([]);
    const [PopupTopicOptions, setPopupTopicOptions] = useState([]);

    const [PopupTopicLu, setPopupTopicLu] = useState([]);
    const [selectedTopics, setSelectedTopics] = useState({});
    const [selectAll, setSelectAll] = useState(false);

    const [schoolName, setSchoolName] = useState(''); // State to store the school_name
    const [courseName, setCourseName] = useState(''); // State to store the course_name

    const [addLuModal, setaddLuModal] = useState(false);
    const [addTopicModal, setaddTopicModal] = useState(false);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const [showPreview, setShowPreview] = useState(false);

    const [popupLus, setPopupLu] = useState([]);

    const [CurrentChapterIndex, setCurrentChapterIndex] = useState(-1);
    const [CurrentTopicIndex, setCurrentTopicIndex] = useState(-1);

    const fetchFromAPI = async (query) => {

        setLoading(true);
        try {
            const result = await axiosInstance.get(`onboarding/template/structure/?${query}`);

            setLoading(false);
            return result.data.data;

        } catch (error) {
            setLoading(false);
            console.error('Error fetching data:', error);
            return null;
        }
    };

    // Fetch boards on initial load
    useEffect(() => {
        const fetchBoards = async () => {
            const data = await fetchFromAPI('');
            console.log('data',data);
            if (data) {
                setBoardOptions(data.map((board) => ({ value: board.board_id, label: board.board })));
            }
        };
        fetchBoards();
    }, []);

    // Fetch publications when a board is selected
    useEffect(() => {
        if (board) {
            setChapters(null);
            const fetchPublications = async () => {
                const data = await fetchFromAPI(`board=${board.label}`);
                if (data && data.publications) {
                    setPublicationOptions(data.publications.map((pub) => ({ value: pub, label: pub })));
                }
            };
            fetchPublications();
        }
    }, [board]);

    // Fetch grades when a publication is selected
    useEffect(() => {
        if (board && publication) {
            setChapters(null);
            const fetchGrades = async () => {
                const data = await fetchFromAPI(`board=${board.label}&publication=${publication.value}`);
                if (data && data.grades) {
                    setGradeOptions(data.grades.map((grade) => ({ value: grade, label: grade })));
                }
            };
            fetchGrades();
        }
    }, [board, publication]);

    // Fetch subjects when a grade is selected
    useEffect(() => {
        if (board && publication && grade) {
            setChapters(null);
            const fetchSubjects = async () => {
                // const data = await fetchFromAPI(`board=${board.value}&publication=${publication.value}&grade=${grade.value}`);
                const data = await fetchFromAPI(`board=${board.value}&grade=${grade.value}`);
                if (data && data) {
                    const subjects = Array.isArray(data) ? data : [data]; // Convert to array if it's a single subject
                    console.log('subjects -- ', subjects);
                    setSubjectOptions(subjects.map((subject) => ({ value: subject.subject_id, label: subject.subject })));
                } else {
                    console.error('Data is not in the expected format:', data);
                }
            };
            fetchSubjects();
        }
    }, [board, publication, grade]);

    // Fetch chapters when a subject is selected
    useEffect(() => {
        if (board && publication && grade && subject) {
            const fetchChapters = async () => {
                try {
                    const response = await fetchFromAPI(`board=${board.label}&publication=${publication.value}&grade=${grade.value}&subject=${subject.label}`);
                    if (response && response.chapters) {
                        const formattedChapters = response.chapters.map((chapter) => ({
                            name: chapter.name,
                            topics: chapter.topics.map((topic) => ({
                                id: topic.id,
                                title: topic.name,
                                learning_units: topic.learning_units
                            }))
                        }));
                        setChapters(formattedChapters);
                        console.log('formattedChapters', formattedChapters);

                        const chapterOptionsForPopup = formattedChapters.map((chapter) => ({
                            value: chapter.name,
                            label: chapter.name
                        }));

                        const chapterOptionsForSelect = response.chapters.map((chapter) => ({
                            value: chapter.id,
                            label: chapter.name
                        }));

                        // setPopupChapterOptions(chapterOptionsForSelect);
                        setChapterOptions(chapterOptionsForSelect);
                    }
                } catch (error) {
                    console.error('Error fetching chapters:', error);
                }
            };

            fetchChapters();
        }
    }, [board, publication, grade, subject]);

    useEffect(() => {
        console.log('Popup Chapter Options updated: ', PopupChapterOptions);
    }, [PopupChapterOptions]);


    useEffect(() => {
        const fetchPopupBoards = async () => {
            const data = await fetchFromAPI('');
            if (data) {
                setPopupBoardOptions(data.map((board) => ({ value: board.board_id, label: board.board })));
            }
        };
        fetchPopupBoards();
    }, []);

    // Fetch publications when a board is selected
    useEffect(() => {
        if (PopupBoard) {
            const fetchPopupPublications = async () => {
                const data = await fetchFromAPI(`board=${PopupBoard.label}`);
                if (data && data.publications) {
                    setPopupPublicationOptions(data.publications.map((pub) => ({ value: pub, label: pub })));
                }
            };
            fetchPopupPublications();
        }
    }, [PopupBoard]);

    // Fetch grades when a publication is selected
    useEffect(() => {
        if (PopupBoard && PopupPublication) {
            const fetchPopupGrades = async () => {
                const data = await fetchFromAPI(`board=${PopupBoard.label}&publication=${PopupPublication.value}`);
                if (data && data.grades) {
                    setPopupGradeOptions(data.grades.map((grade) => ({ value: grade, label: grade })));
                }
            };
            fetchPopupGrades();
        }
    }, [PopupBoard, PopupPublication]);

    // Fetch subjects when a grade is selected
    useEffect(() => {
        if (PopupBoard && PopupPublication && PopupGrade) {
            const fetchPopupSubjects = async () => {
                const data = await fetchFromAPI(`board=${PopupBoard.value}&grade=${PopupGrade.value}`);
                if (data) {
                    setPopupSubjectOptions(data.map((subject) => ({ value: subject.subject_id, label: subject.subject })));
                }
            };
            fetchPopupSubjects();
        }
    }, [PopupBoard, PopupPublication, PopupGrade]);

    // Fetch chapters when a subject is selected
    useEffect(() => {
        if (PopupBoard && PopupPublication && PopupGrade && PopupSubject) {
            console.log('Fetching chapters...');
            setPopupChapter([]);
            const fetchPopupChapters = async () => {
                try {
                    const response = await fetchFromAPI(`board=${PopupBoard.label}&publication=${PopupPublication.value}&grade=${PopupGrade.value}&subject=${PopupSubject.label}`);
                    if (response && response.chapters) {

                        const chapterOptionsForSelect = response.chapters.map((chapter) => ({
                            value: chapter.id,
                            label: chapter.name
                        }));

                        // setPopupChapter(chapterOptionsForSelect);
                        setPopupChapterOptions(chapterOptionsForSelect);
                    }
                } catch (error) {
                    console.error('Error fetching chapters:', error);
                }
            };

            fetchPopupChapters();
        }
    }, [PopupBoard, PopupPublication, PopupGrade, PopupSubject]);

    const handlePopupChapterChange = (selectedChapter) => {
        setPopupChapter(selectedChapter);
        console.log('Selected Chapter:', selectedChapter);
        const fetchTopics = async () => {
            try {
                const response = await fetchFromAPI(`board=${PopupBoard.label}&publication=${PopupPublication.value}&grade=${PopupGrade.value}&subject=${PopupSubject.label}&chapterid=${selectedChapter.value}`);
                if (response && response.topics) {
                    const formattedTopics = response.topics.map((topic) => ({
                        value: topic.id,
                        label: topic.name
                    }));

                    setPopupTopicOptions(formattedTopics);
                    console.log('Formatted Topics:', response.topics);
                    setPopupTopicLu(response.topics);
                }
            } catch (error) {
                console.error('Error fetching topics:', error);
            }
        };

        fetchTopics();
    };

    const handlePopupTopicChange = (selectedTopic) => {
        setPopupTopic(selectedTopic);
        const fetchTopics = async () => {
            try {
                const response = await fetchFromAPI(`board=${PopupBoard.label}&publication=${PopupPublication.value}&grade=${PopupGrade.value}&subject=${PopupSubject.label}&chapterid=${PopupChapter.value}&topicid=${selectedTopic.value}`);
                if (response && response.learning_units) {
                    const formattedLus = response.learning_units.map((lu) => ({
                        value: lu.id,
                        label: lu.name
                    }));

                    setPopupLu(formattedLus)
                }
            } catch (error) {
                console.error('Error fetching topics:', error);
            }
        };

        fetchTopics();
    };

    const handleBoardChange = (selectedBoard) => {
        setBoard(selectedBoard);
        setPublication(null);
        setGrade(null);
        setSubject(null);
    };

    const handlePublicationChange = (selectedPublication) => {
        setPublication(selectedPublication);
        setGrade(null);
        setSubject(null);
    };

    const handleGradeChange = (selectedGrade) => {
        setGrade(selectedGrade);
        setSubject(null);
    };

    const handleSubjectChange = (selectedSubject) => {
        setSubject(selectedSubject);
    };

    // Popup change handlers
    const handlePopupBoardChange = (selectedBoard) => {
        setPopupBoard(selectedBoard);
        setPopupPublication(null);
        setPopupGrade(null);
        setPopupSubject(null);
        setPopupChapter(null);
        setPopupTopic(null);
        setPopupLu([]);
        setPopupTopicLu([]);
        setPopupGradeOptions([]);
        setPopupSubjectOptions([]);
        setPopupChapterOptions([]);
        setPopupTopicOptions([]);

    };

    const handlePopupPublicationChange = (selectedPublication) => {
        setPopupPublication(selectedPublication);
        setPopupGrade(null);
        setPopupSubject(null);
        setPopupChapter(null);
        setPopupTopic(null);
        setPopupLu([]);
        setPopupTopicLu([]);
        setPopupSubjectOptions([]);
        setPopupChapterOptions([]);
        setPopupTopicOptions([]);
    };

    const handlePopupGradeChange = (selectedGrade) => {
        setPopupGrade(selectedGrade);
        setPopupSubject(null);
        setPopupChapter(null);
        setPopupTopic(null);
        setPopupLu([]);
        setPopupTopicLu([]);
        setPopupChapterOptions([]);
        setPopupTopicOptions([]);
    };

    const handlePopupSubjectChange = (selectedSubject) => {
        setPopupSubject(selectedSubject);
        setPopupChapter(null);
        setPopupTopic(null);
        setPopupLu([]);
        setPopupTopicLu([]);
        setPopupTopicOptions([]);
    };
    // Popup change handlers

    useEffect(() => {
        const fetchCourseData = async () => {
            try {


                const response = await axiosInstance.get(`onboarding/course/${courseid}/`);

                if (response.status == 200) {
                    const course = response.data.data && response.data.data.length > 0 ? response.data.data[0] : null;

                    console.log('zeeshan', course);

                    if (course) {
                        setSchoolName(course.school_name || '');
                        setCourseName(course.course_name || '');
                    } else {
                        throw new Error('No course data found');
                    }
                }

                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };

        fetchCourseData();
    }, [courseid]);

    const lumodal = (chapterIndex, topicIndex) => {
        setCurrentChapterIndex(chapterIndex);
        setCurrentTopicIndex(topicIndex);
        setaddLuModal(!addLuModal);
    };

    const topicmodal = (chapterIndex) => {
        setCurrentChapterIndex(chapterIndex);
        setaddTopicModal(!addTopicModal);
    };

    const customStyles = {
        control: (base) => ({
            ...base,
            width: "100%",
            padding: "8px",
            borderColor: "#ccc",
            boxShadow: "none",
            borderRadius: "5px",
            fontSize: "16px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            cursor: 'pointer',
            '&:hover': {
                borderColor: '#ccc',
            },
        }),
        placeholder: (base) => ({
            ...base,
            color: "rgba(179, 179, 179, 1)",
            fontWeight: "700",
            fontSize: "16px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
        }),
        singleValue: (base) => ({
            ...base,
            color: "rgba(83, 83, 83, 1)",
            fontWeight: "700",
            fontSize: "16px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
        }),
        indicatorSeparator: () => ({
            display: "none",
        }),
        dropdownIndicator: (base) => ({
            ...base,
            color: "#ff8a00",
            padding: "0 8px",
        }),
        option: (styles, { isSelected }) => ({
            ...styles,
            backgroundColor: isSelected ? "rgba(253, 229, 202, 1)" : "#fff",
            color: isSelected ? "#ff8a00" : "#000",
            ":hover": {
                backgroundColor: "rgba(253, 229, 202, 1)",
                color: "#ff8a00",
            },
        }),
    };


    useEffect(() => {
        if (Array.isArray(chapters) && chapters.length > 0) {
            setVisibleChapters(chapters.map(() => true));
        }
    }, [chapters]);

    const toggleChapterVisibility = (index) => {
        const updatedVisibility = [...visibleChapters];
        updatedVisibility[index] = !updatedVisibility[index];
        setVisibleChapters(updatedVisibility);
    };

    // const moveItem = (fromIndex, toIndex, type, chapterIndex, topicIndex) => {
    //     const updatedChapters = [...chapters];

    //     if (type === ItemTypes.CHAPTER) {
    //         const movedChapter = updatedChapters.splice(fromIndex, 1)[0];
    //         updatedChapters.splice(toIndex, 0, movedChapter);
    //     } else if (type === ItemTypes.TOPIC && chapterIndex !== undefined) {
    //         const chapter = updatedChapters[chapterIndex];
    //         const movedTopic = chapter.topics.splice(fromIndex, 1)[0];
    //         chapter.topics.splice(toIndex, 0, movedTopic);
    //     } else if (type === ItemTypes.LU && chapterIndex !== undefined && topicIndex !== undefined) {
    //         const topic = updatedChapters[chapterIndex].topics[topicIndex];
    //         const movedLU = topic.learningUnits.splice(fromIndex, 1)[0];
    //         topic.learningUnits.splice(toIndex, 0, movedLU);
    //     }

    //     setChapters(updatedChapters);
    // };

    const moveItem = (fromIndex, toIndex, type, chapterIndex, topicIndex) => {
        console.log("Moving item:", { fromIndex, toIndex, type });

        setChapters(produce(draft => {
            if (type === ItemTypes.CHAPTER) {
                const [movedChapter] = draft.splice(fromIndex, 1);
                draft.splice(toIndex, 0, movedChapter);
            } else if (type === ItemTypes.TOPIC) {
                const chapter = draft[chapterIndex];
                const [movedTopic] = chapter.topics.splice(fromIndex, 1);
                chapter.topics.splice(toIndex, 0, movedTopic);
            } else if (type === ItemTypes.LU) {
                const topic = draft[chapterIndex].topics[topicIndex];
                const [movedLU] = topic.learning_units.splice(fromIndex, 1);
                topic.learning_units.splice(toIndex, 0, movedLU);
            }
        }));
        console.log("Updated chapters:", chapters);
    };

    const router = useRouter();
    const handlePreview = () => {
        router.push({
            pathname: '/coursepreview',
            query: {
                data: JSON.stringify(chapters)
            }
        });
    };

    const handlePreviewToggle = () => {
        setShowPreview(!showPreview);
    };

    const searchParams = useSearchParams();
    const schoolId_urlFromURL = searchParams.get("school_id");

    const handleSubmit = async () => {
        setLoading(true);
        console.log('Submitting course data:', chapters);

        const formattedChaptersData = {
            chapters: chapters.map((chapter, chapterIndex) => ({
                name: chapter.name,
                is_locked: false,
                topics: chapter.topics.map((topic, topicIndex) => ({
                    id: topic.id,
                    name: topic.title,
                    // Filter out unchecked units using chapterIndex and topicIndex
                    learning_unit_ids: topic.learning_units
                        .filter((unit) =>
                            !uncheckedUnitIds.some(
                                (item) =>
                                    item.chapterIndex === chapterIndex &&
                                    item.topicIndex === topicIndex &&
                                    item.unitId === unit.id
                            )
                        )
                        .map((unit) => unit.id), // Get only the ids of the remaining units
                })),
            })),
        };

        console.log('Formatted chapters data:', formattedChaptersData);
        
        try {

            const response = await axiosInstance.post(`onboarding/chapters/${courseid}/create/`, formattedChaptersData);

            if (response.status == 201) {
                console.log('Course data submitted successfully!');
                toast.success('Course data submitted successfully!');
                
                setTimeout(() => {
                    router.push('/onboarding/course/list?school_id='+schoolId_urlFromURL);
                }, 2000); // 2000ms = 2 seconds
                // router.push('/onboarding/course/list');
            } else {
                console.log('Failed to submit course data. Please try again.');
                toast.error('Failed to submit course data. Please try again.');
            }

        } catch (error) {
            console.error('Error submitting course data:', error);

        }
        setLoading(false);
    };

    const [checkedLus, setCheckedLus] = useState(popupLus.map(() => false));
    const [isSelectAll, setIsSelectAll] = useState(false);

    const handleSelectAllChange = () => {
        console.log(popupLus);
        const newSelectAll = !isSelectAll;
        setIsSelectAll(newSelectAll);
        setCheckedLus(popupLus.map(() => newSelectAll));
    };

    const handleLuChange = (index) => {
        console.log(index);
        const updatedCheckedLus = [...checkedLus];
        updatedCheckedLus[index] = !updatedCheckedLus[index];
        setCheckedLus(updatedCheckedLus);

        const allChecked = updatedCheckedLus.every((item) => item);
        setIsSelectAll(allChecked);
    };

    const handleAddLUs = (CurrentChapterIndex, CurrentTopicIndex) => {
        const selectedLus = popupLus
            .filter((_, index) => checkedLus[index])
            .map((lu) => ({
                "id": lu.value,
                "name": lu.label
            }));

        console.log('selected lus ', popupLus);
        const updatedChapters = chapters.map((chapter, chapterIndex) => {
            if (chapterIndex === CurrentChapterIndex) {
                console.log('chapter ', chapter);
                return {
                    ...chapter,
                    topics: chapter.topics.map((topic, topicIndex) => {
                        if (topicIndex === CurrentTopicIndex) {
                            const currentLearningUnitIds = Array.isArray(topic.learning_units)
                                ? topic.learning_units
                                : [];

                            console.log('currentLearningUnitIds lus ', currentLearningUnitIds);
                            return {
                                ...topic,
                                learning_units: [...new Set([...currentLearningUnitIds, ...selectedLus])],
                            };
                        }
                        return topic;
                    }),
                };
            }
            return chapter;
        });
        console.log('updatedChapters ', updatedChapters);
        setChapters(updatedChapters);
        setaddLuModal(!addLuModal);
        setPopupLu([]);
        setPopupTopic([]);
        setPopupTopicOptions([]);
        setCheckedLus(popupLus.map(() => false));
        setIsSelectAll(false);
    };

    const handleLuSelection = (topicId, luId, isSelected) => {
        setSelectedTopics((prevSelected) => {
            const updatedLus = isSelected
                ? [...(prevSelected[topicId] || []), luId]
                : (prevSelected[topicId] || []).filter(id => id !== luId);
            const allLUsSelected = updatedLus.length === PopupTopicLu.find(topic => topic.id === topicId).learning_units.length;
            return {
                ...prevSelected,
                [topicId]: updatedLus,
                [`${topicId}_all_selected`]: allLUsSelected
            };
        });
    };

    const handleTopicSelection = (topicId, isSelected) => {
        const selectedLUs = isSelected
            ? PopupTopicLu.find(topic => topic.id === topicId).learning_units
            : [];
        console.log('selected lus ', selectedLUs);
        setSelectedTopics((prevSelected) => ({
            ...prevSelected,
            [topicId]: selectedLUs,
            [`${topicId}_all_selected`]: isSelected
        }));
    };

    const handleSelectAll = (isSelected) => {
        setSelectAll(isSelected);
        const allSelected = isSelected
            ? PopupTopicLu.reduce((acc, topic) => {
                acc[topic.id] = topic.learning_units;
                acc[`${topic.id}_all_selected`] = true;
                return acc;
            }, {})
            : {};

        setSelectedTopics(allSelected);
    };

    const handleAddTopicsToChapters = () => {
        if (CurrentChapterIndex === null || !chapters[CurrentChapterIndex]) {
            console.error("No valid chapter index");
            return;
        }

        const selectedData = Object.keys(selectedTopics).filter(key => !key.includes('_all_selected'));

        const updatedChapters = [...chapters];

        selectedData.forEach((topicId) => {
            const topicData = PopupTopicLu.find(topic => topic.id === topicId);
            const selectedLUs = selectedTopics[topicId];

            if (topicData && selectedLUs.length > 0) {
                const existingTopic = updatedChapters[CurrentChapterIndex].topics.find(topic => topic.title === topicData.name);

                if (existingTopic) {
                    existingTopic.learningUnits = [...new Set([...existingTopic.learning_units, ...selectedLUs])];

                } else {
                    updatedChapters[CurrentChapterIndex].topics.push({
                        id: topicData.id,
                        title: topicData.name,
                        learning_units: selectedLUs
                    });
                }
            }
        });
        console.log('updatedChapters ', updatedChapters);
        setChapters(updatedChapters);
        setPopupTopicLu([]);
        setChapterOptions([]);
        setCurrentChapterIndex(null);
        setaddTopicModal(false);
    };




    const handleAddChapters = () => {
        // Ensure PopupChapter is selected
        if (!PopupChapter) {
            console.error("No chapter selected.");
            return;
        }

        // Check if the chapter already exists in the chapters state
        const existingChapter = chapters.find(chapter => chapter.name === PopupChapter.label);

        // Create a new chapters array to work with
        const updatedChapters = [...chapters];

        // Get selected topics and learning units (LUs)
        const selectedData = Object.keys(selectedTopics).filter(key => !key.includes('_all_selected'));

        // Create a new chapter object with topics and learning units (LUs)
        const newChapter = {
            name: PopupChapter.label,  // Use the selected PopupChapter label as the chapter name
            topics: selectedData.map((topicId) => {
                const topicData = PopupTopicLu.find(topic => topic.id === topicId);
                const selectedLUs = selectedTopics[topicId] || [];

                return {
                    id: topicData ? topicData.id : '',
                    title: topicData ? topicData.name : '',
                    learning_units: selectedLUs,  // Learning units associated with this topic
                };
            })
        };

        // If the chapter exists, update the existing chapter
        if (existingChapter) {
            newChapter.topics.forEach((newTopic) => {
                const existingTopic = existingChapter.topics.find(topic => topic.title === newTopic.title);

                // If topic exists, merge LUs with existing LUs
                if (existingTopic) {
                    existingTopic.learning_units = [...new Set([...existingTopic.learning_units, ...newTopic.learning_units])];
                } else {
                    // If topic doesn't exist, add it to the existing chapter
                    existingChapter.topics.push(newTopic);
                }
            });
        } else {
            // If the chapter doesn't exist, add the new chapter to the chapters array
            updatedChapters.push(newChapter);
        }

        
        // Update the chapters state
        setChapters(updatedChapters);
        // count total chapter
        console.log('checking here', updatedChapters);
        // Scroll to the newly added/updated chapter
        setTimeout(() => {
            const chapterElement = document.getElementById('chapter-' + updatedChapters.length);
            if (chapterElement) {
                chapterElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);  // Delay to ensure DOM updates before scrolling

        // Reset states after adding the chapter
        setPopupTopicLu([]);
        setPopupChapter(null);  // Reset the selected chapter
        setPopupTopicOptions([]);
        setSelectedTopics({});
        setaddTopicModal(false);  // Close the modal
        setShowChapterModal(!showChapterModal);
        setSelectAll(false);

    };

    const [showChapterModal, setShowChapterModal] = useState(false);

    const toggleChapterModal = () => {
        setShowChapterModal(!showChapterModal);
    };


    // Handler to add a new chapter
    const handleAddNewChapter = () => {
        const newChapter = {
            name: 'Chapter',  // Default chapter name
            topics: [],       // No topics initially
        };

        setChapters((prevChapters) => [...prevChapters, newChapter]);
        setTimeout(() => {
            const chapterElement = document.getElementById('chapter-' + chapters.length);
            if (chapterElement) {
                chapterElement.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);  // Delay to ensure DOM updates before scrolling
    };

    const handleAddNewTopic = (chapterIndex) => {
        console.log('chapterindex', chapterIndex);

        const newTopicTitle = `New Topic ${chapters[chapterIndex].topics.length + 1}`;  // Dynamically generate topic name

        const newTopic = {
            title: newTopicTitle,
            learning_units: [],  // Empty learning units
        };

        setChapters((prevChapters) => {
            const updatedChapters = [...prevChapters];

            // Check if a topic with the same title already exists
            const topicExists = updatedChapters[chapterIndex].topics.some(
                (topic) => topic.title === newTopicTitle
            );

            if (!topicExists) {
                // Add the new topic if it doesn't exist
                updatedChapters[chapterIndex].topics = [
                    ...updatedChapters[chapterIndex].topics,
                    newTopic
                ];
                console.log('New topic added:', newTopicTitle);
            } else {
                console.log('Topic with the same title already exists:', newTopicTitle);
            }

            return updatedChapters;
        });
    };


    const [editChapterIndex, setEditChapterIndex] = useState(null);
    const [chapterName, setChapterName] = useState(''); // For chapter edit
    const [editTopic, setEditTopic] = useState({ chapterIndex: null, topicIndex: null }); // For topic edit
    const [topicTitle, setTopicTitle] = useState(''); // For topic title editing

    const handleEditClick = (index, currentName) => {
        setEditChapterIndex(index);  // Enter edit mode for the selected chapter
        setChapterName(currentName); // Set the initial value of the input field
    };

    const handleSaveClick = (index, newName) => {
        console.log('ChapterName ', chapterName)
        chapters[index].name = chapterName; // Update the chapter name directly
        setEditChapterIndex(null);  // Exit edit mode
    };

    const handleInputChange = (e) => {
        console.log('e.target.value ', e.target.value)
        setChapterName(e.target.value);  // Update the input value locally without re-rendering everything
    };

    // Edit functions for topic
    const handleEditTopicClick = (chapterIndex, topicIndex, currentTitle) => {
        setEditTopic({ chapterIndex, topicIndex });  // Enter topic edit mode
        setTopicTitle(currentTitle);  // Set the initial value of the input field for the topic
    };

    const handleSaveTopicClick = (chapterIndex, topicIndex) => {
        const updatedChapters = [...chapters];
        updatedChapters[chapterIndex].topics[topicIndex].title = topicTitle; // Update the topic title
        setEditTopic({ chapterIndex: null, topicIndex: null }); // Exit edit mode for topics
    };

    const handleTopicInputChange = (e) => {
        setTopicTitle(e.target.value); // Update the topic title input locally
    };

    // Delete chapter function
    const handleDeleteChapter = (index) => {
        const updatedChapters = chapters.filter((_, chapterIndex) => chapterIndex !== index);
        setChapters(updatedChapters);
    };

    // Delete topic function
    const handleDeleteTopic = (chapterIndex, topicIndex) => {
        const updatedChapters = [...chapters];
        updatedChapters[chapterIndex].topics = updatedChapters[chapterIndex].topics.filter((_, tIndex) => tIndex !== topicIndex);
        setChapters(updatedChapters);
    };


    const [uncheckedUnitIds, setUncheckedUnitIds] = useState([]);

    // Add a handler for checkbox change
    const handleCheckboxChange = (chapterIndex, topicIndex, unitIndex) => {
        setChapters((prevChapters) => {
            const updatedChapters = [...prevChapters];
            const unit = updatedChapters[chapterIndex].topics[topicIndex].learning_units[unitIndex];
            const unitId = unit.id;  // Store the id of the unit
            const unitChecked = !unit.checked;
            unit.checked = unitChecked;

            // If unchecked, add to uncheckedUnitIds array
            if (!unitChecked) {
                setUncheckedUnitIds((prevUncheckedUnitIds) => [
                    ...prevUncheckedUnitIds,
                    { chapterIndex, topicIndex, unitId },  // Store chapterIndex, topicIndex, and unitId
                ]);
            } else {
                // If checked again, remove from uncheckedUnitIds
                setUncheckedUnitIds((prevUncheckedUnitIds) =>
                    prevUncheckedUnitIds.filter(
                        (item) => item.chapterIndex !== chapterIndex || item.topicIndex !== topicIndex || item.unitId !== unitId
                    )
                );
            }

            return updatedChapters;
        });
    };

    return (
        <DndProvider backend={HTML5Backend}>
            {loading ? <Loader /> : ''}
            <ToastContainer />
            <div className="right_content">
                <div className="sch-creation-container">
                    <div className="left-section" >
                    <Link 
                        href={`/onboarding/course/list?school_id=${schoolId_urlFromURL}`} 
                        className="link-button" 
                        style={{ display: showPreview ? 'none' : 'block' }}
                        >
                        <FaArrowLeft />
                        </Link>
                        <span>{schoolName}</span>
                    </div>
                    <div className="right-section">
                        <span style={{ fontWeight: '700', }}>Course Name : {courseName}</span>
                    </div>
                </div>

                <div className="creation-wreaper">
                    <div className="create-chapterdiv" style={{ display: showPreview ? 'none' : 'block' }}>
                        <div className="create-classSection" style={{ margin: "10px 0" }}>
                            <div className="formRow">
                                <div className="inputGroup">
                                    <label>Board</label>
                                    <Select
                                        options={boardOptions}
                                        styles={customStyles}
                                        placeholder="Select Board"
                                        value={board}
                                        onChange={handleBoardChange}
                                         menuPosition="fixed"
                                    />
                                </div>
                                <div className="inputGroup">
                                    <label>Publication</label>
                                    <Select
                                        options={publicationOptions}
                                        styles={customStyles}
                                        placeholder="Select Publication"
                                        value={publication}
                                        onChange={handlePublicationChange}
                                        isDisabled={!board}
                                         menuPosition="fixed"
                                    />
                                </div>
                                <div className="inputGroup">
                                    <label>Grade</label>
                                    <Select
                                        options={gradeOptions}
                                        styles={customStyles}
                                        placeholder="Select Grade"
                                        value={grade}
                                        onChange={handleGradeChange}
                                        isDisabled={!publication}
                                         menuPosition="fixed"
                                    />
                                </div>
                                <div className="inputGroup">
                                    <label>Subject</label>
                                    <Select
                                        options={subjectOptions}
                                        styles={customStyles}
                                        placeholder="Select Subject"
                                        value={subject}
                                        onChange={handleSubjectChange}
                                        isDisabled={!grade}
                                         menuPosition="fixed"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="buttonGroup">
                            <div className="left">
                                {/* show chapter count */}
                                <h3>Chapters {Array.isArray(chapters) && chapters.length > 0 && `: ${chapters.length}`} </h3>
                            </div>
                            <div className="right">
                                <button className="saveButton" onClick={handleAddNewChapter}>Create New Chapter</button>
                                <button onClick={toggleChapterModal} className='coursecreation-btn' style={{ width: '225px' }}>Add Existing Chapter</button>
                            </div>
                        </div>

                        <div className="chapters-section" >
                            {Array.isArray(chapters) && chapters.length > 0 ? chapters.map((chapter, chapterIndex) => (
                                <DraggableItem
                                    key={chapterIndex}
                                    index={chapterIndex}
                                    moveItem={(fromIndex, toIndex) => moveItem(fromIndex, toIndex, 'CHAPTER')}
                                    type="CHAPTER"
                                >
                                    <div className="chapter-container" id={`chapter-${chapterIndex + 1}`}>
                                        <div className="chapter-title" onClick={() => toggleChapterVisibility(chapterIndex)}>
                                            {editChapterIndex === chapterIndex ? (
                                                <input
                                                    type="text"
                                                    value={chapterName}
                                                    onChange={handleInputChange}
                                                    className='edit-input-txt-orange'
                                                // autoFocus
                                                />
                                            ) : (
                                                <span style={{ cursor: 'pointer' }}>{chapter.name}</span>
                                            )}

                                            <div className="drag-handle">
                                                <Image src="/images/drag.svg" alt="Drag Chapter" width={30} height={30} />
                                            </div>

                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                {editChapterIndex === chapterIndex ? (
                                                    <button onClick={() => handleSaveClick(chapterIndex)} className='edit-save-btn-orange'>Save</button>
                                                ) : (
                                                    <FiEdit3
                                                        className="edit-icon"
                                                        style={{ fontSize: '20px' }}
                                                        onClick={() => handleEditClick(chapterIndex, chapter.name)}
                                                    />
                                                )}
                                                <FiTrash2 className="delete-icon" style={{ fontSize: '20px' }} onClick={() => handleDeleteChapter(chapterIndex)} />
                                            </div>
                                        </div>

                                        {visibleChapters[chapterIndex] && chapter.topics.map((topic, topicIndex) => (
                                            <DraggableItem
                                                key={topicIndex}
                                                index={topicIndex}
                                                moveItem={(fromIndex, toIndex) => moveItem(fromIndex, toIndex, 'TOPIC', chapterIndex)}
                                                type="TOPIC"
                                            >



                                                <div className="topic-container" style={{ display: 'flex', alignItems: 'center', gap: '15px' }} >

                                                    <div className="drag-handle">
                                                        <Image
                                                            src="/images/drag-up.svg"
                                                            alt="Drag Topic"
                                                            width={15}
                                                            height={15}
                                                        />
                                                    </div>

                                                    {/* <div className={`learning-unit chapter-${chapterIndex}-topic-${topicIndex}`}>
                                                        {topic.learning_units.map((unit, unitIndex) => (
                                                            <DraggableItem
                                                                key={unitIndex}
                                                                index={unitIndex}
                                                                moveItem={(fromIndex, toIndex) => moveItem(fromIndex, toIndex, 'LU', chapterIndex, topicIndex)}
                                                                type="LU"
                                                            >
                                                                <div className="lu-item">
                                                                    <span style={{ display: 'flex' }}><input type="checkbox" checked/> {unit.name}</span>
                                                                    <div className="drag-handle">
                                                                        <Image src="/images/drag-up.svg" alt="Drag LU" width={15} height={15} />
                                                                    </div>
                                                                </div>
                                                            </DraggableItem>
                                                        ))}
                                                    </div> */}

                                                    <div className={`learning-unit chapter-${chapterIndex}-topic-${topicIndex}`}>


                                                        <div className="topic-title">
                                                            {editTopic.chapterIndex === chapterIndex && editTopic.topicIndex === topicIndex ? (
                                                                <input
                                                                    type="text"
                                                                    value={topicTitle}
                                                                    onChange={handleTopicInputChange} // Local state update for topics
                                                                    autoFocus
                                                                    className='edit-input-txt-blue'
                                                                />
                                                            ) : (
                                                                <span>{topic.title}</span>
                                                            )}
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px'  }}>
                                                                <span className="add-lu-btn" onClick={() => lumodal(chapterIndex, topicIndex)}>Add NEW LU</span>
                                                                {editTopic.chapterIndex === chapterIndex && editTopic.topicIndex === topicIndex ? (
                                                                    <button onClick={() => handleSaveTopicClick(chapterIndex, topicIndex)} className='edit-save-btn-blue' >Save</button>
                                                                ) : (
                                                                    <FiEdit3
                                                                        className="edit-icon"
                                                                        style={{ color: '#6166AE' }}
                                                                        onClick={() => handleEditTopicClick(chapterIndex, topicIndex, topic.title)} // Enter topic edit mode
                                                                    />
                                                                )}
                                                                <FiTrash2 className="delete-icon" style={{ color: '#6166AE' }} onClick={() => handleDeleteTopic(chapterIndex, topicIndex)} />
                                                            </div>
                                                        </div>

                                                        {topic.learning_units.map((unit, unitIndex) => (
                                                            <DraggableItem key={unitIndex} index={unitIndex} moveItem={(fromIndex, toIndex) => moveItem(fromIndex, toIndex, 'LU', chapterIndex, topicIndex)} type="LU">
                                                                <div className="lu-item">
                                                                    <span style={{ display: 'flex' }}>
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={unit.checked !== false} // Defaults to checked
                                                                            onChange={() => handleCheckboxChange(chapterIndex, topicIndex, unitIndex)}
                                                                        />
                                                                        {unit.name}
                                                                    </span>
                                                                </div>
                                                            </DraggableItem>
                                                        ))}
                                                    </div>
                                                </div>
                                            </DraggableItem>
                                        ))}

                                        <div className="buttonGroup">
                                            <div className="right" style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                                                <button className="saveButton" onClick={() => topicmodal(chapterIndex)} >Add Existing Topic</button>
                                                <button className="create-topic-btn" onClick={() => handleAddNewTopic(chapterIndex)}>Create New Topic</button>
                                            </div>
                                        </div>
                                    </div>
                                </DraggableItem>
                            )) : (
                                <div className="no-chapters">
                                    <p>No chapters yet</p>
                                </div>
                            )}
                        </div>
                    </div>


                    {/* Preview Content */}
                    {showPreview && (
                        <div className="preview-section">
                            <div className="chapters-section" >

                                {Array.isArray(chapters) && chapters.length > 0 ? chapters.map((chapter, chapterIndex) => (
                                    <DraggableItem
                                        key={chapterIndex}
                                        index={chapterIndex}
                                        moveItem={(fromIndex, toIndex) => moveItem(fromIndex, toIndex, 'CHAPTER')}
                                        type="CHAPTER"
                                    >
                                        <div className="chapter-container">
                                            <div className="chapter-title" onClick={() => toggleChapterVisibility(chapterIndex)}>
                                                <span style={{ cursor: 'pointer' }}>{chapter.name}</span>
                                            </div>

                                            {visibleChapters[chapterIndex] && chapter.topics.map((topic, topicIndex) => (
                                                <DraggableItem
                                                    key={topicIndex}
                                                    index={topicIndex}
                                                    moveItem={(fromIndex, toIndex) => moveItem(fromIndex, toIndex, 'TOPIC', chapterIndex)}
                                                    type="TOPIC"
                                                >
                                                    <div className="topic-container">
                                                        <div className="topic-title">
                                                            <span>{topic.title}</span>
                                                        </div>
                                                        {/* <div className="learning-unit">
                                                            {topic.learning_units.map((unit, unitIndex) => (
                                                                <DraggableItem
                                                                    key={unitIndex}
                                                                    index={unitIndex}
                                                                    moveItem={(fromIndex, toIndex) => moveItem(fromIndex, toIndex, 'LU', chapterIndex, topicIndex)}
                                                                    type="LU"
                                                                >
                                                                    <div className="lu-item">
                                                                        <span style={{ display: 'flex' }}>{unit.name}</span>
                                                                    </div>
                                                                </DraggableItem>
                                                            ))}
                                                        </div> */}

                                                        <div className="learning-unit">
                                                            {topic.learning_units
                                                                .filter((unit) =>
                                                                    !uncheckedUnitIds.some(
                                                                        (item) => item.chapterIndex === chapterIndex && item.topicIndex === topicIndex && item.unitId === unit.id
                                                                    )
                                                                )  // Filter out unchecked units for the specific chapter and topic
                                                                .map((unit, unitIndex) => (
                                                                    <DraggableItem
                                                                        key={unitIndex}
                                                                        index={unitIndex}
                                                                        moveItem={(fromIndex, toIndex) => moveItem(fromIndex, toIndex, 'LU', chapterIndex, topicIndex)}
                                                                        type="LU"
                                                                    >
                                                                        <div className="lu-item">
                                                                            <span style={{ display: 'flex' }}>{unit.name}</span>
                                                                        </div>
                                                                    </DraggableItem>
                                                                ))}
                                                        </div>

                                                    </div>
                                                </DraggableItem>
                                            ))}
                                        </div>
                                    </DraggableItem>
                                )) : (
                                    <div className="no-chapters">
                                        <p>No chapters yet</p>
                                    </div>
                                )}
                                {chapters?.length > 0 && (
                                    <button onClick={handleSubmit} className='submit-btn nextButton'>Submit Course</button>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Add LU - Modal */}
                    {addLuModal && (
                        <div className="modal-overlay" onClick={lumodal}>
                            <div className="delete-modal" style={{ width: "800px", maxHeight: '80vh', overflowY: 'auto', scrollbarWidth: 'none' }} onClick={(e) => e.stopPropagation()}>
                                <span style={{ margin: '0px', fontWeight: '800', fontSize: '25px', color: '#6166AE' }}>Add New LU</span>

                                <div className="formRow" style={{ marginTop: '20px' }}>
                                    <div className="inputGroup" style={{ width: "32%" }}>
                                        <label>Board</label>
                                        <Select
                                            options={PopupBoardOptions}
                                            styles={customStyles}
                                            placeholder="Select Board"
                                            value={PopupBoard}
                                            onChange={handlePopupBoardChange}
                                            //  menuPosition="fixed"
                                        />
                                    </div>
                                    <div className="inputGroup" style={{ width: "32%" }}>
                                        <label>Template</label>
                                        <Select
                                            options={PopupPublicationOptions}
                                            styles={customStyles}
                                            placeholder="Select Publication"
                                            value={PopupPublication}
                                            onChange={handlePopupPublicationChange}
                                            isDisabled={!PopupBoard}
                                            //  menuPosition="fixed"
                                        />
                                    </div>

                                    <div className="inputGroup" style={{ width: "32%" }}>
                                        <label>Grade</label>
                                        <Select
                                            options={PopupGradeOptions}
                                            styles={customStyles}
                                            placeholder="Select Grade"
                                            value={PopupGrade}
                                            onChange={handlePopupGradeChange}
                                            isDisabled={!PopupPublication}
                                            //  menuPosition="fixed"
                                        />
                                    </div>
                                </div>
                                <div className="formRow">
                                    <div className="inputGroup" style={{ width: "32%" }}>
                                        <label>Subject</label>
                                        <Select
                                            options={PopupSubjectOptions}
                                            styles={customStyles}
                                            placeholder="Select Subject"
                                            value={PopupSubject}
                                            onChange={handlePopupSubjectChange}
                                            isDisabled={!PopupGrade}
                                            //  menuPosition="fixed"
                                        />
                                    </div>

                                    <div className="inputGroup" style={{ width: "32%" }}>
                                        <label>Chapter</label>
                                        <Select
                                            options={PopupChapterOptions}
                                            styles={customStyles}
                                            placeholder="Select Chapter"
                                            value={PopupChapter}
                                            onChange={handlePopupChapterChange}
                                            isDisabled={!PopupSubject}
                                            //  menuPosition="fixed"
                                        />
                                    </div>
                                    <div className="inputGroup" style={{ width: "32%" }}>
                                        <label>Topic</label>
                                        <Select
                                            options={PopupTopicOptions}
                                            styles={customStyles}
                                            placeholder="Select Topic"
                                            onChange={handlePopupTopicChange}
                                            isDisabled={!PopupChapter}
                                            //  menuPosition="fixed"
                                        />
                                    </div>
                                </div>
                                <div className="topic-container">
                                    {loading ? <Loader /> : ''}
                                    <div className="topic-title" >
                                        <span style={{ color: '#FF8A00', display: 'flex', alignItems: 'center' }} >LU’s ({popupLus.length})</span>
                                        <div className="right-section lu-item">
                                            <input
                                                type="checkbox"
                                                className='lu-item'
                                                checked={isSelectAll}
                                                onChange={handleSelectAllChange}
                                            />
                                            <span style={{ fontWeight: '700', color: '#6166AE' }}>Select & Deselect Al</span>
                                        </div>
                                    </div>

                                    <div className="learning-unit" style={{ paddingLeft: '30px' }}>
                                        {popupLus.map((lu, index) => (
                                            <div className="lu-item" key={lu.value} style={{ marginBottom: '10px' }}>
                                                <span style={{ display: 'flex', alignItems: 'center' }}>
                                                    <input
                                                        type="checkbox"
                                                        id={`lu-${lu.value}`}
                                                        checked={checkedLus[index] || false}
                                                        onChange={() => handleLuChange(index)}
                                                    />
                                                    <label htmlFor={`lu-${lu.value}`} style={{ marginLeft: '8px' }}>{lu.label}</label>
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="modal-actions" style={{ marginTop: '20px' }} >
                                    <button onClick={lumodal} className="cancel-btn">Cancel</button>
                                    <button
                                        className="confirm-btn"
                                        onClick={() => handleAddLUs(CurrentChapterIndex, CurrentTopicIndex)} // Call function to add selected LUs
                                        style={{ width: '150px' }}
                                    >
                                        Add LU
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* End of addLuModal */}

                    {/* Add Existing Topic Modal */}
                    {addTopicModal && (
                        <div className="modal-overlay" onClick={topicmodal}>
                            <div className="delete-modal" style={{ width: "800px", maxHeight: '80vh', overflowY: 'auto', scrollbarWidth: 'none' }} onClick={(e) => e.stopPropagation()}>
                                <span style={{ margin: '0px', fontWeight: '800', fontSize: '25px', color: '#6166AE' }}>Add Existing Topic</span>
                                <div className="formRow" style={{ marginTop: '20px' }}>
                                    <div className="inputGroup" style={{ width: "32%" }}>
                                        <label>Board</label>
                                        <Select
                                            options={PopupBoardOptions}
                                            styles={customStyles}
                                            placeholder="Select Board"
                                            value={PopupBoard}
                                            onChange={handlePopupBoardChange}
                                            //  menuPosition="fixed"
                                        />
                                    </div>
                                    <div className="inputGroup" style={{ width: "32%" }}>
                                        <label>Template</label>
                                        <Select
                                            options={PopupPublicationOptions}
                                            styles={customStyles}
                                            placeholder="Select Publication"
                                            value={PopupPublication}
                                            onChange={handlePopupPublicationChange}
                                            isDisabled={!PopupBoard}
                                            // menuPosition="fixed"
                                        />
                                    </div>

                                    <div className="inputGroup" style={{ width: "32%" }}>
                                        <label>Grade</label>
                                        <Select
                                            options={PopupGradeOptions}
                                            styles={customStyles}
                                            placeholder="Select Grade"
                                            value={PopupGrade}
                                            onChange={handlePopupGradeChange}
                                            isDisabled={!PopupPublication}
                                            // menuPosition="fixed"
                                        />
                                    </div>
                                </div>
                                <div className="formRow">
                                    <div className="inputGroup" style={{ width: "32%" }}>
                                        <label>Subject</label>
                                        <Select
                                            options={PopupSubjectOptions}
                                            styles={customStyles}
                                            placeholder="Select Subject"
                                            value={PopupSubject}
                                            onChange={handlePopupSubjectChange}
                                            isDisabled={!PopupGrade}
                                            // menuPosition="fixed"
                                        />
                                    </div>

                                    <div className="inputGroup" style={{ width: "32%" }}>
                                        <label>Chapter</label>
                                        <Select
                                            options={PopupChapterOptions}
                                            styles={customStyles}
                                            placeholder="Select Chapter"
                                            value={PopupChapter}
                                            onChange={handlePopupChapterChange}
                                            isDisabled={!PopupSubject}
                                            // menuPosition="fixed"
                                        />
                                    </div>
                                </div>

                                <div className="sch-creation-container">
                                    <div className="left-section">
                                        <span style={{ color: '#FF8A00' }}>Topic ({PopupTopicLu.length})</span>
                                    </div>
                                    <div className="right-section">
                                        <input
                                            type="checkbox"
                                            checked={selectAll}
                                            onChange={(e) => handleSelectAll(e.target.checked)}
                                        />
                                        <span style={{ fontWeight: '700', color: '#FF8A00' }}>Select & Deselect All</span>
                                    </div>
                                </div>

                                {/* Display topics and their learning units */}
                                <div className="chapters-section">
                                    {loading ? <Loader /> : ''}
                                    {PopupTopicLu.length > 0 &&
                                        PopupTopicLu.map((topic, topicIndex) => {
                                            const topicSelected = selectedTopics[`${topic.id}_all_selected`] || false;

                                            return (
                                                <div className="topic-container" key={topic.id} style={{ marginBottom: '20px' }}>
                                                    {/* Topic Title */}
                                                    <div className="topic-title">
                                                        <span style={{ color: '#FF8A00', display: 'flex', alignItems: 'center' }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={topicSelected}
                                                                onChange={(e) => handleTopicSelection(topic.id, e.target.checked)}
                                                            />
                                                            {`${topic.name} (${topic.learning_units.length})`}
                                                        </span>
                                                    </div>

                                                    {/* Display the Learning Units */}
                                                    <div className="learning-unit" style={{ paddingLeft: '30px' }}>
                                                        {topic.learning_units.map((lu, luIndex) => (
                                                            <div className="lu-item" key={lu.id}>
                                                                <span style={{ display: 'flex' }}>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedTopics[topic.id]?.some((selectedLu) => selectedLu.id === lu.id) || false}
                                                                        onChange={(e) => handleLuSelection(topic.id, lu.id, e.target.checked)}
                                                                    />
                                                                    {`${lu.name}`}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                                <div className="modal-actions" style={{ marginTop: '20px' }} >
                                    <button onClick={topicmodal} className="cancel-btn">Cancel</button>
                                    <button className="confirm-btn" onClick={handleAddTopicsToChapters} style={{ width: '150px' }}>
                                        Add Topic
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {showChapterModal && (
                        <div className="modal-overlay" onClick={toggleChapterModal}>
                            <div className="delete-modal" style={{ width: "800px", maxHeight: '80vh', overflowY: 'auto', scrollbarWidth: 'none' }} onClick={(e) => e.stopPropagation()}>
                                <span style={{ margin: '0px', fontWeight: '800', fontSize: '25px', color: '#6166AE' }}>Add Existing Chapter</span>
                                <div className="formRow" style={{ marginTop: '20px' }}>
                                    <div className="inputGroup" style={{ width: "32%" }}>
                                        <label>Board</label>
                                        <Select
                                            options={PopupBoardOptions}
                                            styles={customStyles}
                                            placeholder="Select Board"
                                            value={PopupBoard}
                                            onChange={handlePopupBoardChange}
                                            // menuPosition="fixed"
                                        />
                                    </div>
                                    <div className="inputGroup" style={{ width: "32%" }}>
                                        <label>Template</label>
                                        <Select
                                            options={PopupPublicationOptions}
                                            styles={customStyles}
                                            placeholder="Select Publication"
                                            value={PopupPublication}
                                            onChange={handlePopupPublicationChange}
                                            isDisabled={!PopupBoard}
                                            // menuPosition="fixed"
                                        />
                                    </div>

                                    <div className="inputGroup" style={{ width: "32%" }}>
                                        <label>Grade</label>
                                        <Select
                                            options={PopupGradeOptions}
                                            styles={customStyles}
                                            placeholder="Select Grade"
                                            value={PopupGrade}
                                            onChange={handlePopupGradeChange}
                                            isDisabled={!PopupPublication}
                                            // menuPosition="fixed"
                                        />
                                    </div>
                                </div>
                                <div className="formRow">
                                    <div className="inputGroup" style={{ width: "32%" }}>
                                        <label>Subject</label>
                                        <Select
                                            options={PopupSubjectOptions}
                                            styles={customStyles}
                                            placeholder="Select Subject"
                                            value={PopupSubject}
                                            onChange={handlePopupSubjectChange}
                                            isDisabled={!PopupGrade}
                                            // menuPosition="fixed"
                                        />
                                    </div>

                                    <div className="inputGroup" style={{ width: "32%" }}>
                                        <label>Chapter</label>
                                        <Select
                                            options={PopupChapterOptions}
                                            styles={customStyles}
                                            placeholder="Select Chapter"
                                            value={PopupChapter}
                                            onChange={handlePopupChapterChange}
                                            isDisabled={!PopupSubject}
                                            // menuPosition="fixed"
                                        />
                                    </div>
                                </div>

                                {
                                    Array.isArray(PopupTopicLu) && PopupTopicLu.length > 0 ? (
                                        <div className="sch-creation-container">
                                            <div className="left-section">
                                                <span style={{ color: '#FF8A00' }}>{PopupChapter?.label}</span>
                                            </div>
                                            <div className="right-section">
                                                <input
                                                    type="checkbox"
                                                    checked={selectAll}
                                                    onChange={(e) => handleSelectAll(e.target.checked)}
                                                />
                                                <span style={{ fontWeight: '700', color: '#FF8A00' }}>Select & Deselect All</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="sch-creation-container">
                                            <span style={{ color: '#FF8A00' }}>Please select any chapter</span>
                                        </div>
                                    )
                                }

                                {/* Display topics and their learning units */}
                                <div className="chapters-section">
                                    {loading ? <Loader /> : ''}
                                    {PopupTopicLu.length > 0 &&
                                        PopupTopicLu.map((topic, topicIndex) => {
                                            const topicSelected = selectedTopics[`${topic.id}_all_selected`] || false;

                                            return (
                                                <div className="topic-container" key={topic.id} style={{ marginBottom: '20px' }}>
                                                    {/* Topic Title */}
                                                    <div className="topic-title">
                                                        <span style={{ color: '#FF8A00', display: 'flex', alignItems: 'center' }}>
                                                            <input
                                                                type="checkbox"
                                                                checked={topicSelected}
                                                                onChange={(e) => handleTopicSelection(topic.id, e.target.checked)}
                                                            />
                                                            {`${topic.name} (${topic.learning_units.length})`}
                                                        </span>
                                                    </div>

                                                    {/* Display the Learning Units */}
                                                    <div className="learning-unit" style={{ paddingLeft: '30px' }}>
                                                        {topic.learning_units.map((lu, luIndex) => (
                                                            <div className="lu-item" key={lu}>
                                                                <span style={{ display: 'flex' }}>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={selectedTopics[topic.id]?.some((selectedLu) => selectedLu.id === lu.id) || false}
                                                                        onChange={(e) => handleLuSelection(topic.id, lu.id, e.target.checked)}
                                                                    />
                                                                    {`${lu.name}`}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>

                                <div className="modal-actions" style={{ marginTop: '20px' }} >
                                    <button onClick={toggleChapterModal} className="cancel-btn">Cancel</button>
                                    <button className="confirm-btn" onClick={handleAddChapters} style={{ width: '150px' }}>
                                        Add Chapter
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* End Topic modal */}
                    {/* show preview button only when chapters are added */}
                    {chapters?.length > 0 && (
                        <button className="nextButton" onClick={handlePreviewToggle}>
                            {showPreview ? 'Back to Edit' : 'Preview'}
                        </button>
                    )}
                </div>
            </div>
        </DndProvider>
    );
}
