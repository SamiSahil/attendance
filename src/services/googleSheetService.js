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
export const deleteStudent = (rowIndex) => callApi('deleteStudent', rowIndex);
export const deleteMultipleStudents = (rowIndices) => callApi('deleteMultipleStudents', rowIndices);
export const recordAttendance = (attendancePayload) => callApi('recordAttendance', attendancePayload);

/**
 * NOTE: For this to work, you must update your Google Apps Script
 * to handle the 'recordPayment' action. It should expect a payload like:
 * { date: "YYYY-MM-DD", records: [{ studentId: "SI-100", amount: 500 }, ...] }
 * It also needs to be updated to return a `payments` object in `getInitialData`.
 */
export const recordPayment = (paymentPayload) => callApi('recordPayment', paymentPayload);