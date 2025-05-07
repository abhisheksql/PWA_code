'use client';
import '../../../../public/style/teacher.css';
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { HiFlag } from "react-icons/hi";
import TodoImage1 from '../../../../public/images/teacher/todoImage1.svg';
import TodoImage2 from '../../../../public/images/teacher/todoImage2.svg';

import NoTodo from '../../../../public/images/teacher/noTodo.svg';
import { fetchtodotaskslist } from "../../api/teacherAPI";
import { TodoListUpdate } from "../../api/teacherAPI";
import Loader from "../../components/teacher/Loader";
import { useRouter } from "next/navigation";

const Todo = () => {
  const router = useRouter();
  // const [activeType, setActiveType] = useState(null);

  const [recallTodo, setRecallTodo] = useState(0);
  const [todoTasksListData, setTodoTasksListData] = useState([]);
  const [highCount, setHignCount] = useState(0);
  const [midCount, setMidCount] = useState(0);
  const [lowCount, setLowCount] = useState(0);

  const [isLoader, setIsLoader] = useState(false);
  const [activeType, setActiveType] = useState("high"); // Default active is "high"
  // const [recallTodo, setRecallTodo] = useState(0);
  // const [todoTasksListData, setTodoTasksListData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoader(true);
      try {
        const response = await fetchtodotaskslist();

        console.log("API Response: fetchcriticaltaskslist", response);
        setTodoTasksListData(response);

        console.log('test', response.message.data.count.High);
        if (response.message.data.count.High) {
          setActiveType('high');
        } else {
          setActiveType(null);
        }
        setHignCount(response.message.data.count.High);
        setMidCount(response.message.data.count.Mid);
        setLowCount(response.message.data.count.Low);

      } catch (err) {
        console.error("Error fetching chapter details:", err);
      } finally {
        setIsLoader(false);
      }
    };

    fetchData();
  }, [recallTodo]);

  const handleTodoList = async (type, class_id, course_id, chapter_id, school_id, header, case_message) => {
    setIsLoader(true);
    if (type == 1) {
      router.push(
        `/teacher/class_overview/upcoming_chapters?class_id=${class_id}&course_id=${course_id}`
      );
    } else if (type == 2 || type == 3) {
      router.push(
        `/teacher/chapter_details?chapter_id=${chapter_id}&class_id=${class_id}&course_id=${course_id}`
      );
    } else {
      try {
        const response = await TodoListUpdate(
          school_id,
          header,
          case_message,
          class_id,
          course_id,
          chapter_id
        );
      } catch (err) {
        console.error("Error TodoListUpdate", err);
      } finally {
        setRecallTodo((pre) => (pre === 0 ? 1 : 0));
        setIsLoader(false);
      }
    }
  };

  const StatCard = ({ type, label, count, activeType, setActiveType }) => {
    const isActive = activeType === type;
    const isGray = activeType !== null && !isActive; // Only gray if another is active
    const handleClick = () => {
      setActiveType(isActive ? null : type); // Toggle active state
    };



    return (
      <div
        className={`stat-card ${isActive ? `${type} active` : isGray ? "gray" : type
          }`}
        onClick={handleClick}
        style={{
          display: "flex",
          gap: "15px",
          padding: "10px",
          cursor: "pointer",
        }}
      >
        <span>
          <HiFlag
            className={`icon ${isActive ? "icon-active" : isGray ? "icon-gray" : ""
              }`}
          />
        </span>
        <div className="class-cont" style={{ textAlign: "left" }}>
          <p style={{ fontSize: "13px", margin: '0px' }}>{label}</p>
          <h4 className="fw" style={{ fontSize: "22px", margin: '0px' }}>
            {count}
          </h4>
        </div>
      </div>
    );
  };

  const filteredTasks =
    activeType === null
      ? todoTasksListData?.message?.data?.notification || []
      : todoTasksListData?.message?.data?.notification?.filter(
        (task) => task.priority === activeType
      ) || [];


  const handleChapterReportClick = async (type, class_id, course_id, chapter_id, grade, school_id, header, case_message) => {
    try {
      setIsLoader(true);
      const response = await TodoListUpdate(
        school_id,
        header,
        case_message,
        class_id,
        course_id,
        chapter_id
      );
    } catch (err) {
      console.error("Error TodoListUpdate", err);
    } finally {
      setRecallTodo((pre) => (pre === 0 ? 1 : 0));
      const baseUrl = `reports/chapterdetails/?class_id=${class_id}&course_id=${course_id}&chapter_id=${chapter_id}&grade=${grade}`;

      let url = baseUrl;
      
      if (case_message === "REPORTS_7") {
        url += "&tab=performance&childtab=student";
      } else if (case_message === "REPORTS_2") {
          url += "&childtab=student";
      }else if (case_message === "REPORTS_4") {
          url += "&tab=performance";
      }else if (case_message === "REPORTS_1") {
        url += "&tab=readiness";
      }else{
        url += "&tab=performance";
      }
      
      router.push(url);
      setIsLoader(false);
    }
  };
  return (
    <div className="main-content">

      <div className="my-classes-section">
        <div className="todo-head-container">
          <StatCard
            type="high"
            label="High Priority Tasks"
            count={highCount}
            activeType={activeType}
            setActiveType={setActiveType}
          />
          <StatCard
            type="medium"
            label="Medium Priority Tasks"
            count={midCount}
            activeType={activeType}
            setActiveType={setActiveType}
          />
          <StatCard
            type="low"
            label="Low Priority Tasks"
            count={lowCount}
            activeType={activeType}
            setActiveType={setActiveType}
          />
        </div>

        {/* Check if there are no tasks */}
        {filteredTasks.length === 0 ? (
          <div style={{ width: '100%', height: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Image src={NoTodo} alt="No Tasks" width={250} height={250} />
          </div>
        ) : (
          filteredTasks.map((task, index) => (

            task.header_condition == "appreciation_messages" ? (
              <div key={index} className='chart-section mb20 mt20'>
                <div className='dfjs'>
                  <div className='todocardtop medium-head'>
                    <p>Appreciation</p>
                  </div>
                  <Image src={TodoImage1} alt="Student Icon" width={60} height={60} />
                </div>

                <div className='dfjs '>
                  <div className='df'>
                    <p className="chapter-name" style={{ fontSize: '16px', color: '#6166AE' }}>
                      {task.notification_message.title}
                    </p>
                    <p className="subheading">{task.notification_message.message}</p>
                  </div>
                  <div className='df' style={{ gap: '10px', flexDirection: 'row' }}>
                    <button className="modal-yes-button" onClick={() =>
                      handleTodoList(
                        0,
                        task.section_id,
                        task.course_id,
                        task.chapter_id,
                        task.school_id,
                        task.header,
                        task.case
                      )
                    }>Ok, Thank you</button>
                  </div>
                </div>
              </div>
            ) : task.header_condition == "general_reminders" ? (
              <div key={index} className='chart-section mb20 mt20'>
                <div className='dfjs'>
                  <div className='todocardtop medium-head'>
                    <p>General Reminder</p>
                  </div>
                  <Image src={TodoImage2} alt="Student Icon" width={60} height={60} />
                </div>

                <div className='dfjs '>
                  <div className='df'>
                    <p className="chapter-name" style={{ fontSize: '16px', color: '#6166AE' }}>
                      {task.notification_message.title}
                    </p>
                    <p className="subheading">{task.notification_message.message}</p>
                  </div>
                  <div className='df' style={{ gap: '10px', flexDirection: 'row' }}>
                    <button className="modal-yes-button" onClick={() =>
                      handleTodoList(
                        0,
                        task.section_id,
                        task.course_id,
                        task.chapter_id,
                        task.school_id,
                        task.header,
                        task.case
                      )
                    }>Ok, Got it</button>
                  </div>
                </div>
              </div>
            ) :
            <div
              key={index}
              className="chart-section mb20 mt20"
              filter={task.priority}
            >
              <div className={`dfjs todocardtop ${task.priority === "high" ? "high-head" :
                task.priority === "medium" ? "medium-head" :
                  task.priority === "low" ? "low-head" : ""
                }`}>
                <p>{task.header}</p>
                <span>{task.class_name}</span>
              </div>
              <div className={`todocardContant ${task.priority === "high" ? "highborder" :
                task.priority === "medium" ? "mediumborder" :
                  task.priority === "low" ? "lowborder" : ""
                }`}>

                <div className="todocardContantleft" >
                  <p
                    className="chapter-name"
                    style={{ fontSize: "16px", color: "#6166AE" }}
                  >
                    {task.notification_message.title}
                  </p>
                  <p className="subheading">
                    {task.notification_message.message}
                  </p>
                </div>
                <div className="df" style={{ gap: "10px", flexDirection: "row" }}>
                  {task.header_condition === "start_chapter" ? (
                    <>
                      <button
                        className="modal-no-button"
                        onClick={() =>
                          handleTodoList(
                            0,
                            task.section_id,
                            task.course_id,
                            task.chapter_id,
                            task.school_id,
                            task.header,
                            task.case
                          )
                        }
                      >
                        Not Yet, Starting Soon
                      </button>
                      <button
                        className="modal-yes-button"
                        onClick={() =>
                          handleTodoList(
                            1,
                            task.section_id,
                            task.course_id,
                            task.chapter_id,
                            task.school_id,
                            task.header,
                            task.case
                          )
                        }
                      >
                        Yes, Start Now
                      </button>
                    </>
                  ) : task.header_condition === "end_chapter" ? (
                    <>
                      <button
                        className="modal-no-button"
                        onClick={() =>
                          handleTodoList(
                            0,
                            task.section_id,
                            task.course_id,
                            task.chapter_id,
                            task.school_id,
                            task.header,
                            task.case
                          )
                        }
                      >
                        Not Yet, Ending Soon
                      </button>
                      <button
                        className="modal-yes-button"
                        onClick={() =>
                          handleTodoList(
                            2,
                            task.section_id,
                            task.course_id,
                            task.chapter_id,
                            task.school_id,
                            task.header,
                            task.case
                          )
                        }
                      >
                        Yes, End Now
                      </button>
                    </>
                  ) : task.header_condition === "assign_more_topics" ? (
                    <>
                      <button
                        className="modal-no-button"
                        onClick={() =>
                          handleTodoList(
                            3,
                            task.section_id,
                            task.course_id,
                            task.chapter_id,
                            task.school_id,
                            task.header,
                            task.case
                          )
                        }
                      >
                        No, End Chapter
                      </button>
                      <button
                        className="modal-yes-button"
                        onClick={() =>
                          handleTodoList(
                            3,
                            task.section_id,
                            task.course_id,
                            task.chapter_id,
                            task.school_id,
                            task.header,
                            task.case
                          )
                        }
                      >
                        Yes, Assign Topics
                      </button>
                    </>
                  ) : task.header_condition === "general_reminders" ? (
                    <>
                      <button
                        className="modal-yes-button"
                        onClick={() =>
                          handleTodoList(
                            0,
                            task.section_id,
                            task.course_id,
                            task.chapter_id,
                            task.school_id,
                            task.header,
                            task.case
                          )
                        }
                      >
                        Ok, Got it
                      </button>
                    </>
                  ) : task.header_condition === "appreciation_messages" ? (
                    <>
                      <button
                        className="modal-yes-button"
                        onClick={() =>
                          handleTodoList(
                            0,
                            task.section_id,
                            task.course_id,
                            task.chapter_id,
                            task.school_id,
                            task.header,
                            task.case
                          )
                        } 
                      >
                        Ok, Thank you
                      </button>
                    </>
                  ) : task.header_condition === "reports" ? (
                    <>
                      <button className="modal-yes-button"
                        onClick={() =>
                          handleChapterReportClick(
                            0,
                            task.section_id,
                            task.course_id,
                            task.chapter_id,
                            task.grade,
                            task.school_id,
                            task.header,
                            task.case
                          )
                        }
                      >
                        View Reports</button>
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          ))
        )}

      </div>
      {isLoader ? <Loader /> : ""}
    </div>
  );
};
export default Todo;