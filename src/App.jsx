import { FaEdit, FaPlus } from "react-icons/fa";
import { FaTrashAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [students, setStudents] = useState([]);
  const [studentLoaded, setStudentsLoaded] = useState(false);

  useEffect(() => {
    if (!studentLoaded) {
      axios.get("http://localhost:5000/students").then((res) => {
        setStudents(res.data);
        setStudentsLoaded(true);
      });
    }
  }, [studentLoaded]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newStudent, setNewStudent] = useState({ name: '', date: '', reg: '' });
  const [selectedStudent, setSelectedStudent] = useState(null);


  // Add new student
  const handleAddStudent = () => {
    setStudents([...students, newStudent]);

    axios.post("http://localhost:5000/students", newStudent)
      .then(() => {
        alert("Student Added");
        setStudentsLoaded(false);
      })
      .catch((err) => {
        alert(err);
      });

    setNewStudent({ name: '', date: '', reg: '' });
    setShowAddModal(false);
  };

  // Update selected student
  const handleUpdateStudent = () => {
    axios.put(`http://localhost:5000/students/${selectedStudent.reg}`, selectedStudent)
      .then(() => {
        alert("Student Updated");
        setStudentsLoaded(false);
      })
      .catch((err) => {
        alert(err);
      });

    setSelectedStudent(null);
    setShowUpdateModal(false);
  };

  return (
    <div className="container mx-auto p-4">
      {/* Add Student Button */}
      <button
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-3 rounded-full shadow-md hover:bg-blue-600"
        onClick={() => setShowAddModal(true)}
      >
        <FaPlus />
      </button>

      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold">Student List</h1>
      </div>

      {/* Table Header */}
      <div className="flex justify-between items-center bg-gray-100 p-4 rounded-t-lg border border-gray-300 font-semibold">
        <div className="flex-1 text-gray-700">Registration Number</div>
        <div className="flex-1 text-gray-700">Name</div>
        <div className="flex-1 text-gray-700">Date</div>
        <div className="flex w-16"></div> {/* Empty space for edit/delete buttons */}
      </div>

      {/* Student Data */}
      <div className="flex flex-col space-y-4">
        {
          students.map((std, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-white p-4 shadow-md rounded-lg border border-gray-200"
            >
              <div className="flex-1">
                <p className="font-medium text-gray-700">{std.reg}</p>
              </div>
              <div className="flex-1">
                <p className="text-gray-600">{std.name}</p>
              </div>
              <div className="flex-1">
                <p className="text-gray-500">{std.date}</p>
              </div>
              <div className="flex space-x-2 w-16">
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => {
                    setSelectedStudent(std);
                    setShowUpdateModal(true);
                  }}
                >
                  <FaEdit />
                </button>
                <button className="text-red-500 hover:text-red-700" onClick={() => {
                  if (!confirm("Delete?")) return;

                  axios.delete(`http://localhost:5000/students/${std.reg}`)
                    .then(() => {
                      setStudentsLoaded(false);
                    });
                }}>
                  <FaTrashAlt />
                </button>
              </div>
            </div>
          ))
        }
      </div>

      {/* Modal for adding a new student */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Add New Student</h2>

            <form>
              <div className="mb-4">
                <label className="block text-gray-700">Registration Number</label>
                <input
                  type="text"
                  value={newStudent.reg}
                  onChange={(e) => setNewStudent({ ...newStudent, reg: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Date</label>
                <input
                  type="date"
                  value={newStudent.date}
                  onChange={(e) => setNewStudent({ ...newStudent, date: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddStudent}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Add Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal for updating a student */}
      {showUpdateModal && selectedStudent && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Update Student</h2>

            <form>
              <div className="mb-4">
                <label className="block text-gray-700">Registration Number</label>
                <input
                  type="text"
                  value={selectedStudent.reg}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, reg: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  value={selectedStudent.name}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Date</label>
                <input
                  type="date"
                  value={selectedStudent.date}
                  onChange={(e) => setSelectedStudent({ ...selectedStudent, date: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleUpdateStudent}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Update Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
