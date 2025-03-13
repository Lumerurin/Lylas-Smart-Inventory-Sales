import React, { useEffect, useState } from "react";
import axios from "axios";

const SalesOrder = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEventRevenue = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/event-revenue`);
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching event revenue:", error);
      }
    };

    fetchEventRevenue();
  }, []);

  return (
    <section className="p-5 bg-solidWhite rounded-lg shadow-lg flex flex-col h-fit">
      <div className="w-full flex justify-between items-center">
        <h2>Event Revenue</h2>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-sm md:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 md:px-4 py-2 text-left">Event Title</th>
                <th className="px-2 md:px-4 py-2 text-left">Schedule ID</th>
                <th className="px-2 md:px-4 py-2 text-left">Total Revenue</th>
              </tr>
            </thead>

            <tbody>
              {events.map((event, i) => (
                <tr key={i} className="hover:bg-gray-50 border-b">
                  <td className="px-2 md:px-4 py-2 text-xs md:text-sm">{event.EventTitle}</td>
                  <td className="px-2 md:px-4 py-2 text-xs md:text-sm">{event.ScheduleID}</td>
                  <td className="px-2 md:px-4 py-2 text-xs md:text-sm">${Number(event.TotalRevenue).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default SalesOrder;
