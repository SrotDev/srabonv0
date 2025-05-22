import { useState, useEffect } from "react";
import StepName from "../components/survey/StepName";
import StepClass from "../components/survey/StepClass";
import StepSubjects from "../components/survey/StepSubjects";
import StepLoading from "../components/survey/StepLoading";
import SurveyProgress from "../components/survey/SurveyProgress";
import { useNavigate } from "react-router-dom";
const token = localStorage.getItem("token");

const StudentJourneyPage = () => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const navigate = useNavigate();

  

  useEffect(() => {
  if (step === 3) {
    // Final step: POST data
    const timer = setTimeout(() => {
      fetch("/api/api/studentinfo/", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify({
          name,
          class: studentClass,
          // subjects,
        }),
      })
        .then((res) => res.json())
        .then(() => {
          // Store data in localStorage
          localStorage.setItem('name', name);
          localStorage.setItem('class', studentClass);
          localStorage.setItem('subjects', JSON.stringify(subjects)); // Store array as string
          
          // Iterate over the subjects and post each course data
          const subjectTitles = {
            "Physics": ["Physics - Fundamentals", "Physics - Advanced Concepts"],
            "Chemistry": ["Intro to Chemistry", "Advanced Chemistry Techniques"],
            "Math": ["Mathematics - Basics", "Advanced Calculus"],
            "History": ["World History - Overview", "Modern History"],
            "Economics": ["Microeconomics", "Macroeconomics Principles"],
            "Biology": ["Intro to Biology", "Genetics and Evolution"],
            "Agriculture": ["Agriculture 101", "Sustainable Farming Techniques"],
            "English": ["English Literature", "Advanced English Grammar"]
          };

          // POST a new course for each subject
          subjects.forEach((subject) => {
            const courseTitles = subjectTitles[subject];
            courseTitles.forEach((title) => {
              fetch("/api/api/addcourses", {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify({
                  subject,
                  title,
                }),
              })
                .then((res) => res.json())
                .then(() => {
                  console.log(`Course ${title} for ${subject} created successfully.`);
                })
                .catch((err) => {
                  console.error(`Failed to create course ${title} for ${subject}:`, err);
                });
            });
          });

          // Redirect after posting all courses
          navigate("/functionalities");
        })
        .catch((err) => {
          console.error("❌ Survey submission failed", err);
          navigate("/functionalities");
        });
    }, 2000);

    return () => clearTimeout(timer);
  }
}, [step]);



  const goNext = () => {
    if (step < 3) setStep((prev) => prev + 1);
  };

  const goBack = () => {
    if (step > 0) setStep((prev) => prev - 1);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepName name={name} setName={setName} />;
      case 1:
        return <StepClass selectedClass={studentClass} setSelectedClass={setStudentClass} />;
      case 2:
        return <StepSubjects selectedSubjects={subjects} setSelectedSubjects={setSubjects} />;
      case 3:
        return <StepLoading name={name} />;
      default:
        return null;
    }
  };

  return (
    <div className="survey-container">
      <div className="survey-nav">
        <button onClick={goBack} className="nav-btn">←</button>
        <SurveyProgress step={step} />
        <button onClick={goNext} className="nav-btn">→</button>
      </div>
      {renderStep()}
    </div>
  );
};

export default StudentJourneyPage;
