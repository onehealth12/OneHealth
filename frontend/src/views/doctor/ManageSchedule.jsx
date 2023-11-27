import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction";
import axios from "axios";
import SelectTime from "../../components/modals/SelectTime";

const ManageSchedule = () => {
  const [userRole, setUserRole] = useState("doctor");
  const [events, setEvents] = useState([]);
  const [isTimeModalVisible, setTimeModalVisible] = useState(false);
  const [selectedDateInfo, setSelectedDateInfo] = useState(null);
  const tokenObject = JSON.parse(localStorage.getItem("token"));
  const token = tokenObject.token;

  const headerToken = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/doctor/availability/get`, headerToken)
      .then((res) => {
        const adjustedEvents = res.data.map((event) => {
          const adjustedStart = new Date(event.start);
          adjustedStart.setHours(adjustedStart.getHours());

          const adjustedEnd = new Date(event.end);
          adjustedEnd.setHours(adjustedEnd.getHours());

          return {
            ...event,
            start: adjustedStart.toISOString(),
            end: adjustedEnd.toISOString(),
          };
        });

        setEvents(adjustedEvents);
      })
      .catch((err) => console.log("Error: " + err));
  }, []);

  const currentDate = new Date();
  const validDate = {
    start: currentDate.toISOString(),
  };

  const handleDateSelect = (selectInfo) => {
    let title = "Availability";
    let calendarApi = selectInfo.view.calendar;
  
    calendarApi.unselect(); // clear date selection
  
    if (title) {
      const adjustedEndStr = new Date(selectInfo.endStr);
      adjustedEndStr.setMinutes(adjustedEndStr.getMinutes() - 1);
  
      const formattedEndStr = adjustedEndStr.toISOString().split('T')[0]; // Extract date part
  
      setSelectedDateInfo({
        startStr: selectInfo.startStr,
        endStr: formattedEndStr,
      });
      setTimeModalVisible(true);
    }
  };

  const handleEventClick = (clickInfo) => {
    if (
      confirm(
        `Are you sure you want to delete the event '${clickInfo.event.title}'`
      )
    ) {
      const eventId = clickInfo.event.extendedProps._id; // Extract the _id property from event

      // Make an API call to delete the event from the database
      axios
        .delete(
          `http://localhost:5000/api/doctor/availability/${eventId}`,
          headerToken
        )
        .then((res) => {
          console.log("Deleted Successfully");
          // If the deletion was successful, remove the event from the calendar
          clickInfo.event.remove();
        })
        .catch((err) => console.log("Error: " + err));
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar userRole={userRole} />
      <div className="bg-white w-full p-4 flex flex-col justify-center items-center">
        <div className="w-2/3">
          <h1 className="text-center text-2xl text-[#4867D6] font-bold mb-8">
            Manage Availability
          </h1>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              start: "",
              center: "title",
              end: "today prev,next",
            }}
            timeZone="Asia/Manila"
            selectable={true}
            select={handleDateSelect}
            validRange={validDate}
            events={events}
            eventClick={handleEventClick}
            height={650}
          />
      <SelectTime
        token={token}
        visible={isTimeModalVisible}
        onClose={() => setTimeModalVisible(false)}
        onDelete={() => {
          // Handle delete logic if needed
          // For now, just close the modal
          setTimeModalVisible(false);
        }}
        selectedDateInfo={selectedDateInfo}
      />
        </div>
      </div>
    </div>
  );
};

export default ManageSchedule;
