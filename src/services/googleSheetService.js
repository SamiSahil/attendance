// src/services/googleSheetService.js
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

const callApi = async (action, payload = {}) => {
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, payload }),
  });
  const data = await res.json();
  if (data.status === 'Error') throw new Error(data.message);
  return data;
};

export const getInitialData = () => callApi('getInitialData');
export const addStudent = (studentData) => callApi('addStudent', studentData);
export const updateStudent = (studentData) => callApi('updateStudent', studentData);

// --- MODIFIED FUNCTION ---
// Now sends the entire student object to the backend.
export const deleteStudent = (student) => callApi('deleteStudent', student);

// --- MODIFIED FUNCTION ---
// Now sends an array of student objects to the backend.
export const deleteMultipleStudents = (students) => callApi('deleteMultipleStudents', students);

export const recordAttendance = (attendancePayload) => callApi('recordAttendance', attendancePayload);
export const recordPayment = (paymentPayload) => callApi('recordPayment', paymentPayload);