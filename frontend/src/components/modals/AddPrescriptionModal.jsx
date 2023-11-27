import React, { useState } from 'react';
import { useStore } from '../../store';
import axios from 'axios'
const AddPrescriptionModal = ({ visible, onClose, id }) => {
  const [medicines, setMedicines] = useState([{ name: '', dosage: '', quantity: '', notes: '' }]);
  const { createPrescription } = useStore() // Access the createPrescriptionWithMedicines method from your store
  
  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: '', dosage: '', quantity: '', notes: '' }]);
  };

  const handleMedicineChange = (index, event) => {
    const { name, value } = event.target;
    const updatedMedicines = [...medicines];
    updatedMedicines[index][name] = value;
    setMedicines(updatedMedicines);
  };

  const handleRemoveMedicine = (index) => {
    const updatedMedicines = [...medicines];
    updatedMedicines.splice(index, 1);
    setMedicines(updatedMedicines);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    createPrescription(id, medicines);// Pass the medicines array along with the appointment ID
    onClose()
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal-overlay fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
      <div className="modal-container bg-white w-[800px] rounded-lg shadow-lg z-50 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-black hover:text-gray-700 focus:outline-none"
        >
                    <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="modal-header bg-[#4867D6] text-white p-4 rounded-t-lg">
          <h2 className="text-2xl font-semibold">Add Prescription</h2>
        </div>
        <div className="modal-content p-4" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <div>
            <h2>Prescription Form</h2>
            <form onSubmit={handleSubmit}>
              {medicines.map((medicine, index) => (
                <div key={index} className="mb-4 p-4 border border-gray-300 rounded">
                  {/* Group inputs horizontally */}
                  <div className="flex">
                    <div className="w-1/4 pr-4">
                      <label htmlFor={`name-${index}`}>Medicine Name</label>
                      <input
                        type="text"
                        id={`name-${index}`}
                        name="name"
                        value={medicine.name}
                        onChange={(event) => handleMedicineChange(index, event)}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div className="w-1/4 pr-4">
                      <label htmlFor={`dosage-${index}`}>Dosage</label>
                      <input
                        type="text"
                        id={`dosage-${index}`}
                        name="dosage"
                        value={medicine.dosage}
                        onChange={(event) => handleMedicineChange(index, event)}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div className="w-1/4 pr-4">
                      <label htmlFor={`quantity-${index}`}>Quantity</label>
                      <input
                        type="number"
                        step={1}
                        id={`quantity-${index}`}
                        name="quantity"
                        value={medicine.quantity}
                        onChange={(event) => handleMedicineChange(index, event)}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                    <div className="w-1/4">
                      <label htmlFor={`notes-${index}`}>Notes</label>
                      <textarea
                        id={`notes-${index}`}
                        name="notes"
                        value={medicine.notes}
                        onChange={(event) => handleMedicineChange(index, event)}
                        className="w-full p-2 border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                      onClick={() => handleRemoveMedicine(index)}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
                onClick={handleAddMedicine}
              >
                Add Medicine
              </button>
              <button type="submit" className="bg-blue-500 ml-4 text-white p-2 rounded hover:bg-blue-600">
                Submit Prescription
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPrescriptionModal;
