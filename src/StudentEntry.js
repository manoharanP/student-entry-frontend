import React, { useState } from "react";

const StudentEntry = () => {
  const [student, setStudent] = useState({ name: "", age: "", email: "", course: "" });

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(student),
      });

      if (response.ok) {
        alert("Student added successfully!");
        setStudent({ name: "", age: "", email: "", course: "" });
      } else {
        alert("Failed to add student");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <h2>Student Entry Application</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" value={student.name} onChange={handleChange} required />
        <input type="number" name="age" placeholder="Age" value={student.age} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={student.email} onChange={handleChange} required />
        <input type="text" name="course" placeholder="Course" value={student.course} onChange={handleChange} required />
        <button type="submit">Add Student</button>
      </form>
    </div>
  );
};

export default StudentEntry;
