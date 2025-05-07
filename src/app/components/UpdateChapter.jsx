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

    const [chapters, setChapters] = useState(null);
    const [visibleChapters, setVisibleChapters] = useState([]);
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

    const [isLoader, setIsLoader] = useState(false);
    const [loadingStates, setLoadingStates] = useState({
        courseData: false,
        boards: false,
        publications: false,
        grades: false,
        subjects: false,
        chapters: false,
        topics: false,
        learningUnits: false
    });
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
    // const [loading, setIsLoader] = useState(true);

    const [popupLus, setPopupLu] = useState([]);

    const [CurrentChapterIndex, setCurrentChapterIndex] = useState(-1);
    const [CurrentTopicIndex, setCurrentTopicIndex] = useState(-1);


    // Helper function to update loading state
    const setLoadingState = (key, value) => {
        setLoadingStates(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // Helper function to check if any loading state is active
    const isAnyLoading = () => {
        return Object.values(loadingStates).some(state => state === true);
    };

    // Update useEffect to check loading states
    useEffect(() => {
        setIsLoader(isAnyLoading());
    }, [loadingStates]);

    const fetchFromAPI = async (query, loadingKey) => {
        if (loadingKey) {
            setLoadingState(loadingKey, true);
        } else {
            setIsLoader(true);
        }
        
        try {
            const result = await axiosInstance.get(`onboarding/template/structure/?${query}`);
            return result.data.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error(`Error fetching data: ${error.message}`);
            return null;
        } finally {
            if (loadingKey) {
                setLoadingState(loadingKey, false);
            } else {
                setIsLoader(false);
            }
        }
    };

    useEffect(() => {
        console.log('Popup Chapter Options updated: ', PopupChapterOptions);
    }, [PopupChapterOptions]);


    useEffect(() => {
        const fetchPopupBoards = async () => {
            const data = await fetchFromAPI('', 'boards');
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
                const data = await fetchFromAPI(`board=${PopupBoard.label}`, 'publications');
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
                const data = await fetchFromAPI(`board=${PopupBoard.label}&publication=${PopupPublication.value}`, 'grades');
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
                const data = await fetchFromAPI(`board=${PopupBoard.value}&grade=${PopupGrade.value}`, 'subjects');
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
                console.log('PopupBoardlabel',PopupBoard)
                try {
                    setLoadingState('chapters', true);
                    const response = await fetchFromAPI(`board=${PopupBoard.label}&publication=${PopupPublication.value}&grade=${PopupGrade.value}&subject=${PopupSubject.label}`);
                    if (response && response.chapters) {
                        const chapterOptionsForSelect = response.chapters.map((chapter) => ({
                            value: chapter.id,
                            label: chapter.name
                        }));
                        setPopupChapterOptions(chapterOptionsForSelect);
                    }
                } catch (error) {
                    console.error('Error fetching chapters:', error);
                    toast.error(`Error fetching chapters: ${error.message}`);
                } finally {
                    setLoadingState('chapters', false);
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
                setLoadingState('topics', true);
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
                toast.error(`Error fetching topics: ${error.message}`);
            } finally {
                setLoadingState('topics', false);
            }
        };

        fetchTopics();
    };

    const handlePopupTopicChange = (selectedTopic) => {
        setPopupTopic(selectedTopic);
        const fetchTopics = async () => {
            try {
                setLoadingState('learningUnits', true);
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
                toast.error(`Error fetching learning units: ${error.message}`);
            } finally {
                setLoadingState('learningUnits', false);
            }
        };

        fetchTopics();
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
            console.log('Fetching course data...');
            setLoadingState('courseData', true);
            try {
                const response = await axiosInstance.get(`onboarding/course/${courseid}/`);
                console.log('Course Data:', response);
                if (response.status == 200) {
                    const course = response.data.data && response.data.data.length > 0 ? response.data.data[0] : null;

                    if (course) {
                        setSchoolName(course.school_name || '');
                        setCourseName(course.course_name || '');

                        if (course.chapters && course.chapters.length > 0) {
                            const formattedChapters = course.chapters.map((chapter) => ({
                                id: chapter.id,
                                name: chapter.name,
                                is_locked: chapter.is_locked,
                                topics: chapter.topics.map((topic) => ({
                                    id: topic.id,
                                    title: topic.name,
                                    learning_units: topic.learning_units
                                        ? topic.learning_units.map((lu) => ({
                                            id: lu.id,
                                            name: lu.name
                                        }))
                                        : []
                                }))
                            }));
                            console.log('Formatted Chapters:', formattedChapters);
                            setChapters(formattedChapters);
                        }
                    } else {
                        throw new Error('No course data found');
                    }
                }
            } catch (error) {
                console.error('Error fetching course data:', error);
                setError(error.message);
                toast.error(`Error fetching course data: ${error.message}`);
            } finally {
                setLoadingState('courseData', false);
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
    
    const handleSubmit = async () => {
        setLoadingState('courseData', true);
        console.log('Submitting course data:', chapters);

        try {
            // Update each chapter individually
            for (const chapter of chapters) {
                const chapterData = {
                    id: chapter.id,
                    name: chapter.name,
                    is_locked: chapter.is_locked,
                    topics: chapter.topics.map((topic) => ({
                        id: topic.id,
                        name: topic.title,
                        learning_unit_ids: topic.learning_units
                            .filter((unit) =>
                                !uncheckedUnitIds.some(
                                    (item) =>
                                        item.chapterIndex === chapters.indexOf(chapter) &&
                                        item.topicIndex === chapter.topics.indexOf(topic) &&
                                        item.unitId === unit.id
                                )
                            )
                            .map((unit) => unit.id),
                    })),
                };

                try {
                    const response = await axiosInstance.put(`onboarding/chapters/${courseid}/update/${chapter.id}/`, chapterData);
                    
                    if (response.status === 200) {
                        console.log(`Chapter ${chapter.id} updated successfully!`);
                        toast.success(`Chapter "${chapter.name}" updated successfully!`);
                    } else {
                        console.log(`Failed to update chapter ${chapter.id}. Please try again.`);
                        toast.error(`Failed to update chapter "${chapter.name}". Please try again.`);
                    }
                } catch (error) {
                    console.error(`Error updating chapter ${chapter.id}:`, error);
                    toast.error(`Error updating chapter "${chapter.name}": ${error.response?.data?.message || error.message}`);
                }
            }
        } catch (error) {
            console.error('Error in chapter updates:', error);
            toast.error('An error occurred while updating chapters. Please try again.');
        } finally {
            setLoadingState('courseData', false);
        }
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
        setCurrentChapterIndex(null);
        setaddTopicModal(false);
    };


    const handleAddNewChapter = async () => {
        setLoadingState('courseData', true);
        try {
            const newChapterData = {
                name: 'New Chapter',  // Default chapter name
                is_locked: false,
                topics: []
            };

            const response = await axiosInstance.post(`onboarding/chapters/${courseid}/add/`, newChapterData);
            
            if (response.status === 201) {
                const newChapter = response.data.data;
                setChapters(prevChapters => [...prevChapters, {
                    id: newChapter.chapter_id,
                    name: newChapter.chapter_name,
                    is_locked: newChapter.is_locked,
                    topics: newChapter.topics || []
                }]);
                toast.success(`New chapter "${newChapter.chapter_name}" created successfully!`);
                
                // Scroll to the newly added chapter
                setTimeout(() => {
                    const chapterElement = document.getElementById('chapter-' + (chapters.length + 1));
                    if (chapterElement) {
                        chapterElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            } else {
                toast.error('Failed to create new chapter. Please try again.');
            }
        } catch (error) {
            console.error('Error creating new chapter:', error);
            toast.error(`Error creating new chapter: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoadingState('courseData', false);
        }
    };

    const handleAddChapters = async () => {
        // Ensure PopupChapter is selected
        if (!PopupChapter) {
            toast.error("Please select a chapter to add.");
            return;
        }

        setLoadingState('courseData', true);
        try {
            // Create a new chapter with the selected data
            const newChapterData = {
                name: PopupChapter.label,
                is_locked: false,
                topics: Object.keys(selectedTopics)
                    .filter(key => !key.includes('_all_selected'))
                    .map(topicId => {
                        const topicData = PopupTopicLu.find(topic => topic.id === topicId);
                        const selectedLUs = selectedTopics[topicId] || [];
                        return {
                            id: topicData ? topicData.id : '',
                            name: topicData ? topicData.name : '',
                            learning_unit_ids: selectedLUs.map(lu => lu.id)
                        };
                    })
            };

            const response = await axiosInstance.post(`onboarding/chapters/${courseid}/add/`, newChapterData);
            
            if (response.status === 201) {
                const newChapter = response.data.data;
                setChapters(prevChapters => [...prevChapters, {
                    id: newChapter.chapter_id,
                    name: newChapter.chapter_name,
                    is_locked: newChapter.is_locked,
                    topics: newChapter.topics.map(topic => ({
                        id: topic.topic_id,
                        title: topic.name,
                        learning_units: topic.learning_unit_ids.map(luId => ({
                            id: luId,
                            name: luId // You might want to fetch the actual LU names here
                        }))
                    }))
                }]);
                
                toast.success(`Chapter "${newChapter.chapter_name}" added successfully!`);
                
                // Reset states
                setPopupTopicLu([]);
                setPopupChapter(null);
                setPopupTopicOptions([]);
                setSelectedTopics({});
                setaddTopicModal(false);
                setShowChapterModal(false);
                setShowChapterModal(!showChapterModal);
                setSelectAll(false);

                // Scroll to the newly added chapter
                setTimeout(() => {
                    const chapterElement = document.getElementById('chapter-' + (chapters.length + 1));
                    if (chapterElement) {
                        chapterElement.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 100);
            } else {
                toast.error('Failed to add chapter. Please try again.');
            }
        } catch (error) {
            console.error('Error adding chapter:', error);
            toast.error(`Error adding chapter: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoadingState('courseData', false);
        }
    };

    const [showChapterModal, setShowChapterModal] = useState(false);

    const toggleChapterModal = () => {
        setShowChapterModal(!showChapterModal);
    };


    // Handler to add a new chapter
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

    // Delete topic function
    const handleDeleteTopic = (chapterIndex, topicIndex) => {
        const updatedChapters = [...chapters];
        updatedChapters[chapterIndex].topics = updatedChapters[chapterIndex].topics.filter((_, tIndex) => tIndex !== topicIndex);
        setChapters(updatedChapters);
    };

    // Delete chapter function with backend integration
    const handleDeleteChapter = async (index) => {
        setLoadingState('courseData', true);
        try {
            const chapterToDelete = chapters[index];
            const response = await axiosInstance.delete(`onboarding/chapters/${courseid}/delete/${chapterToDelete.id}/`);
            
            if (response.status === 200) {
                // Only update UI after successful backend deletion
                const updatedChapters = chapters.filter((_, chapterIndex) => chapterIndex !== index);
                setChapters(updatedChapters);
                toast.success(`Chapter "${chapterToDelete.name}" deleted successfully!`);
            } else {
                toast.error(`Failed to delete chapter "${chapterToDelete.name}". Please try again.`);
            }
        } catch (error) {
            console.error('Error deleting chapter:', error);
            toast.error(`Error deleting chapter: ${error.response?.data?.message || error.message}`);
        } finally {
            setLoadingState('courseData', false);
        }
    };

    // New function to update a single chapter
    const handleUpdateSingleChapter = async (chapterIndex) => {
        setLoadingState('courseData', true);
        const chapter = chapters[chapterIndex];
        
        try {
            const chapterData = {
                id: chapter.id,
                name: chapter.name,
                is_locked: chapter.is_locked,
                topics: chapter.topics.map((topic) => ({
                    id: topic.id,
                    name: topic.title,
                    learning_unit_ids: topic.learning_units
                        .filter((unit) =>
                            !uncheckedUnitIds.some(
                                (item) =>
                                    item.chapterIndex === chapterIndex &&
                                    item.topicIndex === chapter.topics.indexOf(topic) &&
                                    item.unitId === unit.id
                            )
                        )
                        .map((unit) => unit.id),
                })),
            };

            const response = await axiosInstance.put(`onboarding/chapters/${courseid}/update/${chapter.id}/`, chapterData);
            
            if (response.status === 200) {
                const testGenResponse = response.data.data.test_generation_response;
                console.log('testGenResponse 2', testGenResponse.error);
                if(testGenResponse.error) {
                    toast.error(`${testGenResponse.error}`);
                } else if (testGenResponse && testGenResponse.message) {
                    toast.success(`${response.data.message} ${testGenResponse.message}`);
                } else {
                    toast.success(`${response.data.message} `);
                }
            } else {
                console.log(`Failed to update chapter ${chapter.id}. Please try again.`);
                toast.error(`Failed to update chapter "${chapter.name}". Please try again.`);
            }
        } catch (error) {
            console.error(`Error updating chapter ${chapter.id}:`, error);
            toast.error(`Error updating chapter "${chapter.name}": ${error.response?.data?.message || error.message}`);
        } finally {
            setLoadingState('courseData', false);
        }
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

    console.log('chapters ', chapters);

    const searchParams = useSearchParams();
    const schoolId_urlFromURL = searchParams.get("school_id");
    // return   
    return (
        <DndProvider backend={HTML5Backend}>
            
            <ToastContainer />
            <div className="right_content">
                <div className="sch-creation-container">
                    <div className="left-section" >
                    <Link 
                        href={`/onboarding/course/list?school_id=${schoolId_urlFromURL}`} 
                        className="link-button" 
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
                    <div className="create-chapterdiv">

                        <div className="buttonGroup">
                            <div className="left">
                                <h3>Chapters ({chapters?.length}) </h3>
                            </div>
                            <div className="right">
                                <button className="saveButton" onClick={handleAddNewChapter}>Create New Chapter</button>
                                <button onClick={toggleChapterModal} className='coursecreation-btn' style={{ width: '225px' }}>Add Existing Chapter</button>
                            </div>
                        </div>

                        <div className="chapters-section">
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
                                                />
                                            ) : (
                                                <span style={{ cursor: 'pointer' }}>{chapter.name}</span>
                                            )}

                                            <div className="drag-handle">
                                                <Image src="/images/drag.svg" alt="Drag Chapter" width={30} height={30} />
                                            </div>
                                            
                                            {!chapter.is_locked && (
                                                <div style={{ display: 'flex',alignItems:'center' , gap: '10px' }}>
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
                                                    
                                                    <button 
                                                        className="update-btn" 
                                                        style={{ 
                                                            backgroundColor: '#4CAF50', 
                                                            color: 'white', 
                                                            border: 'none', 
                                                            borderRadius: '4px', 
                                                            padding: '5px 10px',
                                                            cursor: 'pointer',
                                                            fontSize: '14px'
                                                        }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleUpdateSingleChapter(chapterIndex);
                                                        }}
                                                    >
                                                        Update
                                                    </button>
                                                </div>
                                            )}
                                            {chapter.is_locked && (
                                                <span style={{ 
                                                    backgroundColor: '#FDE5CA',
                                                    color: '#FF8A00',
                                                    padding: '5px 10px',
                                                    borderRadius: '4px',
                                                    fontSize: '14px'
                                                }}>
                                                    Chapter in progress
                                                </span>
                                            )}
                                        </div>

                                        {visibleChapters[chapterIndex] && chapter.topics.map((topic, topicIndex) => (
                                            <DraggableItem
                                                key={topicIndex}
                                                index={topicIndex}
                                                moveItem={(fromIndex, toIndex) => moveItem(fromIndex, toIndex, 'TOPIC', chapterIndex)}
                                                type="TOPIC"
                                            >
                                                <div className="topic-container" style={{display:'flex', alignItems:'center' , gap:'15px'}}>

                                                    <div className="drag-handle">
                                                        <Image
                                                            src="/images/drag-up.svg"
                                                            alt="Drag Topic"
                                                            width={15}
                                                            height={15}
                                                        />
                                                    </div>

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

                                                            {chapter.is_locked === false && (    
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                <span className="add-lu-btn" onClick={() => lumodal(chapterIndex, topicIndex)}>Add NEW LU</span>
                                                                {editTopic.chapterIndex === chapterIndex && editTopic.topicIndex === topicIndex ? (
                                                                    <button onClick={() => handleSaveTopicClick(chapterIndex, topicIndex)} className='edit-save-btn-blue'>Save</button>
                                                                ) : (
                                                                    <FiEdit3
                                                                        className="edit-icon"
                                                                        style={{ color: '#6166AE' }}
                                                                        onClick={() => handleEditTopicClick(chapterIndex, topicIndex, topic.title)} // Enter topic edit mode
                                                                    />
                                                                )}
                                                                <FiTrash2 className="delete-icon" style={{ color: '#6166AE' }} onClick={() => handleDeleteTopic(chapterIndex, topicIndex)} />
                                                            </div>
                                                            )}
                                                        </div>
                                                        {topic.learning_units.map((unit, unitIndex) => (
                                                            <DraggableItem key={unitIndex} index={unitIndex} moveItem={(fromIndex, toIndex) => moveItem(fromIndex, toIndex, 'LU', chapterIndex, topicIndex)} type="LU">
                                                                <div className="lu-item">
                                                                    <span style={{ display: 'flex' }}>
                                                                    {chapter.is_locked === false && (  
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={unit.checked !== false} // Defaults to checked
                                                                            onChange={() => handleCheckboxChange(chapterIndex, topicIndex, unitIndex)}
                                                                        />
                                                                        )}
                                                                        {unit.name}
                                                                    </span>
                                                                </div>
                                                            </DraggableItem>
                                                        ))}
                                                    </div>
                                                </div>
                                            </DraggableItem>
                                        ))}
                                    {chapter.is_locked === false && (
                                        <div className="buttonGroup">
                                            <div className="right" style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                                                <button className="saveButton" onClick={() => topicmodal(chapterIndex)} >Add Existing Topic</button>
                                                <button className="create-topic-btn" onClick={() => handleAddNewTopic(chapterIndex)}>Create New Topic</button>
                                            </div>
                                        </div>
                                    )}
                                    </div>
                                </DraggableItem>
                            )) : (
                                <div className="no-chapters">
                                    <p>No chapters yet</p>
                                </div>
                            )}
                        </div>
                    </div>


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
                                        />
                                    </div>
                                </div>
                                <div className="topic-container">
                                    {/* {loading ? <Loader /> : ''} */}
                                    <div className="topic-title" >
                                        <span style={{ color: '#FF8A00', display: 'flex', alignItems: 'center' }} >LU&apos;s ({popupLus.length})</span>
                                        <div className="right-section lu-item">
                                            <input
                                                type="checkbox"
                                                className='lu-item'
                                                checked={isSelectAll}
                                                onChange={handleSelectAllChange}
                                            />
                                            <span style={{ fontWeight: '700', color: '#6166AE' }}>Select & Deselect All</span>
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
                                    {/* {loading ? <Loader /> : ''} */}
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
                                                                    {/* <input
                                                                        type="checkbox"
                                                                        checked={selectedTopics[topic.id]?.includes(lu.id) || false}
                                                                        onChange={(e) => handleLuSelection(topic.id, lu.id, e.target.checked)}
                                                                    />
                                                                    {`${lu.name}`} */}

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

                    <br></br>
                    <button className="nextButton" onClick={handleSubmit}>
                        Update Course
                    </button>
                </div>
            </div>
            {isLoader ? <Loader /> : ""}
        </DndProvider>
        
    );
}