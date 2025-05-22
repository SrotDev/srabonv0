import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // You need to install react-toastify for the toast notification

const CreateCoursePage = () => {
  const [courseSubject, setCourseSubject] = useState(''); // State for subject input
  const [courseTitle, setCourseTitle] = useState(''); // State for title input
  const navigate = useNavigate();

  const handleSubjectChange = (e) => setCourseSubject(e.target.value);
  const handleTitleChange = (e) => setCourseTitle(e.target.value);

  const handleGenerateCourse = async () => {
    if (!courseSubject || !courseTitle) {
      toast.error('Please fill both the subject and title fields.');
      return;
    }

    try {
      const response = await fetch("/api/api/addcoursess/", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subject: courseSubject, title: courseTitle }),
      });

      if (response.ok) {
        toast.success('Course Generated Successfully');
        navigate('/courses');
      } else {
        throw new Error('Failed to generate course');
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong');
    }
  };

  return (
    <div className="create-course-page">
      <div className="create-course-form">
        <h2>Create AI Generated Course</h2>
        
        <div className="form-field">
          <label htmlFor="course-subject">Course Subject</label>
          <input 
            type="text" 
            id="course-subject" 
            value={courseSubject} 
            onChange={handleSubjectChange} 
            placeholder="Enter course subject"
          />
        </div>

        <div className="form-field">
          <label htmlFor="course-title">Course Title</label>
          <input 
            type="text" 
            id="course-title" 
            value={courseTitle} 
            onChange={handleTitleChange} 
            placeholder="Enter course title"
          />
        </div>

        <div className="form-actions">
          <button onClick={handleGenerateCourse} className="generate-btn">
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCoursePage;
