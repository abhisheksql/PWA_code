
import axiosInstance from '../auth';
import { toast } from 'react-toastify';

export const fetchTeacherDetails = async () => {
  try {
    const response = await axiosInstance.get(`/teacherapis/teacher_details/`)
    return response.data; // Return the data directly
  } catch (error) {
    console.error('Error fetching teacher details:', error);
    throw error;
  }
};

export const fetchTeacherClasses = async (subject) => {
  try {
    const url = subject
    ? `/teacherapis/classes/details/?subject=${subject}`
    : `/teacherapis/classes/details/`;

    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher classes:', error);
    throw error;
  }
}
export const fetchTeacherAssignedChapter = async (subject) => {
  try {
    const url = subject
    ? `/teacherapis/assigned_chapters/?subject=${subject}`
    : `/teacherapis/assigned_chapters/`;

    const response = await axiosInstance.get(url);
    return response.data
  } catch (error) {
    console.error('Error fetching teacher classes:', error);
    throw error;
  }
}

// fetch teacher class list with option grade and subject 
export const fetchTeacherClassesList = async (grade, subject) => {
  try {
    let response;

    // Check if grade and subject are provided
    if (grade && subject) {
      response = await axiosInstance.get(`/teacherapis/classes/list/?grade=${grade}&course_id=${subject}`);
    } else {
      response = await axiosInstance.get(`/teacherapis/classes/list/`);
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching teacher classes:', error);
    throw error;
  }
};

export const fetchTeacherClassOverview = async (class_id, course_id) => {
  try {
    const response = await axiosInstance.get(`/teacherapis/class/data/?class_id=${class_id}&course_id=${course_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher classes:', error);
    throw error;
  }
}

export const fetchChapterAssignTimeline = async (class_id, course_id) => {
  try {
    const response = await axiosInstance.get(`/teacherapis/chapters_assign_timeline/?class_id=${class_id}&course_id=${course_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher classes:', error);
    throw error;
  }
}

export const fetchStudentsList = async (class_id, course_id) => {
  try {
    const response = await axiosInstance.get(`/teacherapis/class/students/?class_id=${class_id}&course_id=${course_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student list data:', error);
    throw error;
  }
}

export const fetchMilestonePopupData = async (class_id, course_id, chapter_id) => {
  try {
    const response = await axiosInstance.get(`/teacherapis/milestone_popup_data/?class_id=${class_id}&course_id=${course_id}&chapter_id=${chapter_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching milestone popup data:', error);
    throw error;
  }
}

export const updateEndedChapter = async (chapterId, courseId, sectionId,topic_ids , isCLTAvailable,timestamp) => {
  try {
    const payload = {
      chapter_id: chapterId,
      section_id: sectionId,
      ...(topic_ids && topic_ids.length > 0 && { topic_ids }),
      is_CLT_available: isCLTAvailable,
      chapter_due_date: timestamp,
    };
    console.log("payload1", payload);
    const response = await axiosInstance.patch('/teacherapis/end_assign_chapter/', payload);

    if (response.status === 200 && response.data.status === 'success') {
      toast.success(response.data.message || 'Chapter started successfully!');
    } else {
      toast.warning(response.data.message || 'Something went wrong, please try again.');
    }
    return response.data;

  } catch (error) {

    // Handle errors
    if (error.response && error.response.data) {
      // API-specific error messages
      const apiMessage = error.response.data.message || 'Something went wrong.';
      toast.error(apiMessage);
    } else {
      // General network or unexpected errors
      console.error('Error updating ended chapter:', error);
      toast.error('Failed to update the chapter. Please try again.');
    }
    throw error;
  }
};

export const fetchUpcomingChapters = async (class_id, course_id) => {
  try {
    const response = await axiosInstance.get('/teacherapis/upcoming_chapters/?class_id=' + class_id + '&course_id=' + course_id);
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming chapters:', error);
    throw error;
  }
}

export const fetchChapterList = async (class_id, course_id) => {
  try {
    const response = await axiosInstance.get('/teacherapis/all_chapters/?class_id=' + class_id + '&course_id=' + course_id);
    return response.data;
  } catch (error) {
    console.error('Error fetching chapter list:', error);
    throw error;
  }
}

export const fetchCompletedChapters = async (class_id, course_id) => {
  try {
    const response = await axiosInstance.get('/teacherapis/completed_chapters/?class_id=' + class_id + '&course_id=' + course_id);
    return response.data;
  } catch (error) {
    console.error('Error fetching chapter list:', error);
    throw error;
  }
}

export const fetchChapterData = async (class_id, course_id, chapter_id) => {
  try {
    const response = await axiosInstance.get(
      `/teacherapis/chapter_data/?class_id=${class_id}&course_id=${course_id}&chapter_id=${chapter_id}`
    );

    if (response.status >= 200 && response.status < 300) {
      // toast.success(response.data.message || "Chapter data fetched successfully.");
      return response.data;
    } else {
      toast.error(response.data?.message || "Unexpected response from server.");
      throw new Error(response.data?.message || "Unexpected response status.");
    }
  } catch (error) {
    console.error("Error fetching chapter data:", error);

    if (error.response) {
      const { status_code, message } = error.response.data;

      switch (status_code) {
        case 404:
          toast.error(message || "Requested resource not found (404).");
          break;
        default:
          toast.error(message || `Error: ${status_code}`);
          break;
      }
    } else if (error.request) {
      toast.error("Network error: No response received from server.");
    } else {
      toast.error("Unexpected error occurred. Please try again.");
    }

    throw error;
  }
};

export const startChapter = async (class_id, course_id, chapter_id, payload) => {
  try {

    console.log('Sending API request with payload:', payload);

    const response = await axiosInstance.post('/teacherapis/assign_chapter/', payload);

    console.log('API Response:', response);
    if (response.status >= 200 && response.status < 300) {
      toast.success( response.data.message);
    } else {
      toast.error( response.data.message);
    }
    return response.data; 
  } catch (error) {
    toast.error( error.response.data.message);
    // toast.error(error);
    throw error;
  }
};


export const UpdateAssignChapter = async (payload) => {
  try {

    const response = await axiosInstance.patch('/teacherapis/update_assign_chapter/', payload);
    console.log('API Response:new', response);

    if (response.status >= 200 && response.status < 300) {
      if(response.data.message !== ''){
      toast.success( response.data.message);
      }
    } else {
      if(response.data.message !== ''){
      toast.error( response.data.message);
      }
    }
    return response.data;
  
  } catch (error) {
  
    console.error("Error fetching chapter data:", error);
    
    if (error.response) {
      const { status_code, message } = error.response.data;

      switch (status_code) {
        case 404:
          toast.error(message || "Requested resource not found (404).");
          break;
        default:
          toast.error(message || `Error: ${status_code}`);
          break;
      }
    } else if (error.request) {
      toast.error("Network error: No response received from server.");
    } else {
      toast.error("Unexpected error occurred. Please try again.");
    }

    throw error;
  
  }
};


export const fetchQuickEndChapterData = async (class_id, course_id,chapter_id) => {
  try {
    const response = await axiosInstance.get(`/teacherapis/milestone_popup_data/?class_id=${class_id}&course_id=${course_id}&chapter_id=${chapter_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chapter list:', error);
    throw error;
  }
}


export const QuickEndChapter = async (class_id, chapter_id,topic_ids,isAssigned) => {
  console.log('Sending API request with payload:', { chapter_id, class_id, topic_ids,isAssigned });
  try {
    console.log('Sending API request with payload:', { chapter_id, class_id, topic_ids,isAssigned });
    const response = await axiosInstance.patch(`/teacherapis/end_assign_chapter/`,
      {
        chapter_id: chapter_id,
        section_id: class_id,
        topic_ids: topic_ids,  // Add topic IDs if needed
        is_CLT_available: isAssigned,
        end_Confirmation:true // optional fields
    },

    );

    if (response.status == 200 && response.data.status === 'success') {
      toast.success(response.data.message || 'Chapter Ended successfully!');
    } else {
      toast.warning(response.data.message || 'Something went wrong, please try again.');
    }

    return response.data;
  } catch (error) {
    console.error('Error fetching chapter list:', error);
    throw error;
  }
}


export const fetchcriticaltaskslist= async () => {
  try {
    const response = await axiosInstance.get(`/teacherapis/critical_tasks/list/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chapter list:', error);
    throw error;
  }
}


export const TodoListUpdate = async (school_id,
  header,
case_message,
class_id,  
  course_id,
  chapter_id) => {
  // console.log('Sending API request with payload:', { chapter_id, class_id, topic_ids });
  try {
    // console.log('Sending API request with payload:', { chapter_id, class_id, topic_ids });
    const response = await axiosInstance.post(`/teacherapis/update_notification/`,
      {
        school_id:school_id,
        header:header,
        case:case_message,
        section_id:class_id,
        course_id:course_id,
        chapter_id:chapter_id
    },

    );
    return response.data;
  } catch (error) {
    console.error('Error fetching chapter list:', error);
    throw error;
  }
}



export const fetchtodotaskslist= async () => {
  try {
    const response = await axiosInstance.get(`/teacherapis/todo_tasks/list/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chapter list:', error);
    throw error;
  }
}

export const fetchQuestionList= async (class_id,chapter_id,course_id,topic_id,test_type) => {
  try {
    const response = await axiosInstance.get(`/teacherapis/test_data/?class_id=${class_id}&chapter_id=${chapter_id}&course_id=${course_id}&topic_id=${topic_id}&test_type=${test_type}`,);
    return response.data;
  } catch (error) {
    console.error('Error fetching chapter list:', error);
    throw error;
  }
}
// fetchQuestionList
// updateEndedChapter

export const updateEndedChapterTopic = async (payload) => {
  try {

    // console.log("payload1", payload);

    const response = await axiosInstance.patch('/teacherapis/update_ended_chapter/', payload);

    if (response.status == 200 && response.data.status === 'success') {
      toast.success(response.data.message || 'Topic assigned successfully!');
    } else {
      toast.warning(response.data.message || 'Something went wrong, please try again.');
    }
    return response.data;

  } catch (error) {

    // Handle errors
    if (error.response && error.response.data) {
      // API-specific error messages
      const apiMessage = error.response.data.message || 'Something went wrong.';
      toast.error(apiMessage);
    } else {
      // General network or unexpected errors
      console.error('Error updating ended chapter:', error);
      toast.error('Failed to update the chapter. Please try again.');
    }
    throw error;
  }
};

export const addTicket = async (payload) => {
  try {
    const response = await axiosInstance.post('/onboarding/add_ticket/', payload, {
      headers: {
        "Content-Type": "multipart/form-data",  // ✅ Ensures correct format for file uploads
      },
    });

    console.log('API Response:', response);
    return response;  // ✅ Axios returns full response
  } catch (error) {
    console.error('Error adding ticket:', error.response?.data || error.message);
    throw error;
  }
};

// get tickets list api {{url}}/onboarding/get_user_tickets/?userid=2
export const getTicketsList = async (userid,start,limit ) => {
  try {
    const response = await axiosInstance.get('/onboarding/get_user_tickets/?userid=' + userid + '&start=' + start + '&page_length=' + limit);
    return response;
  } catch (error) {
    console.error('Error fetching chapter list:', error);
    throw error;
  }
}

// get ticket details api {{url}}/onboarding/get_ticket/TS-01269

export const getTicketDetails = async (ticketid ) => {
  try {
    const response = await axiosInstance.get('/onboarding/get_ticket/' + ticketid + '/');
    return response;
  } catch (error) {
    console.error('Error fetching chapter list:', error);
    throw error;
  }
}

// report apis

export const getTeacherPerformance = async (class_id, course_id) => {
  try {
    const response = await axiosInstance.get('/teacherapis/reports/teacher_performance/');
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher performance:', error);
    throw error;
  }
}

export const getTeacherClassPerformance = async (subject, grade) => {
  try {
    const response = await axiosInstance.get('/teacherapis/reports/performance_overview_chart/?subject='+subject+'&grade='+grade);
    return response.data;
  } catch (error) {
    console.error('Error fetching teacher class performance:', error);
    throw error;
  }
}


export const getChapters = async (classId, courseId) => {
  try {
      const response = await axiosInstance.get(`/teacherapis/all_chapters/?class_id=${classId}&course_id=${courseId}`);
      return response.data;
  } catch (error) {
      console.error('Error fetching chapters:', error);
      throw error;
  }
};

export const getStudents = async (classId, courseId) => {
  try {
      const response = await axiosInstance.get(`/teacherapis/class/students/?class_id=${classId}&course_id=${courseId}`);
      return response.data;
  } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
  }
};

export const getChapter_Crq_Performance = async (class_id, course_id, chapter_id) => {
  try {
    const response = await axiosInstance.get(`/teacherapis/reports/chapter_crq_performance/?class_id=${class_id}&course_id=${course_id}&chapter_id=${chapter_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chapter performance:', error);
    throw error;
  }
}

export const getChapterPerformance = async (class_id, course_id, chapter_id) => {
  try {
    const response = await axiosInstance.get(`/teacherapis/reports/chapter_performance/?class_id=${class_id}&course_id=${course_id}&chapter_id=${chapter_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chapter performance:', error);
    throw error;
  }
}

export const getChapterPerformanceBreakdown = async (class_id, course_id, chapter_id, lu_id, fetch_type) => {
  try {
    let url; // Declare url variable

    if (fetch_type === 'topic') {
      url = `/teacherapis/reports/chapter_crq_performance_breakdown/?class_id=${class_id}&course_id=${course_id}&chapter_id=${chapter_id}&lu_id=${lu_id}`;
    } else {
      url = `/teacherapis/reports/chapter_crq_performance_breakdown/?class_id=${class_id}&course_id=${course_id}&chapter_id=${chapter_id}&student_id=${lu_id}`;
    }

    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching chapter performance:', error);
    throw error;
  }
};


export const getChapterTopicPerformance = async (class_id, course_id, chapter_id, lu_id) => {
  try {
    const response = await axiosInstance.get(`/teacherapis/reports/chapter_topic_performance_breakdown/?class_id=${class_id}&course_id=${course_id}&chapter_id=${chapter_id}&topic_id=${lu_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chapter performance:', error);
    throw error;
  }
}

export const chapter_subtopic_student_attempts = async (class_id, course_id, chapter_id, topic_id, lu_id) => {
  try {
    const response = await axiosInstance.get(`/teacherapis/reports/chapter_subtopic_student_attempts/?class_id=${class_id}&course_id=${course_id}&chapter_id=${chapter_id}&topic_id=${topic_id}&lu_id=${lu_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching chapter performance:', error);
    throw error;
  }
}

export const student_performance = async (class_id, course_id, student_id) => {
  try {
    const response = await axiosInstance.get(`/teacherapis/reports/student_performance/?class_id=${class_id}&course_id=${course_id}&student_id=${student_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student performance:', error);
    throw error;
  }
}


export const chapter_student_performance_breakdown = async (class_id, course_id, chapter_id, student_id) => {
  try {
    const response = await axiosInstance.get(`/teacherapis/reports/chapter_student_performance_breakdown/?class_id=${class_id}&course_id=${course_id}&chapter_id=${chapter_id}&student_id=${student_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching student performance:', error);
    throw error;
  }
}


export const getTeacherGradesBySubject = async (subject) => {
  try {
    const response = await axiosInstance.get(`/teacherapis/reports/performance_tab/`, {
      params: { subject }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching grades by subject:', error);
    throw error;
  }
};
