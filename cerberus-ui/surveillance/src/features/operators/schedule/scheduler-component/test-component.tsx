import React from 'react';
import { Calendar } from './index';
// import './styles.css'; // Ya no es necesario importar los estilos manualmente

// Test data
const testEvents = [
  {
    id: '1',
    title: 'Meeting',
    startDate: new Date(2024, 0, 15, 10, 0),
    endDate: new Date(2024, 0, 15, 11, 0),
    category: 'work'
  },
  {
    id: '2',
    title: 'Lunch',
    startDate: new Date(2024, 0, 15, 12, 0),
    endDate: new Date(2024, 0, 15, 13, 0),
    category: 'personal'
  }
];

const TestCalendar: React.FC = () => {
  const handleEventCreate = (event: any) => {
    console.log('Event created:', event);
  };

  const handleEventUpdate = (event: any) => {
    console.log('Event updated:', event);
  };

  const handleEventDelete = (eventId: string) => {
    console.log('Event deleted:', eventId);
  };

  return (
    <div style={{ height: '100vh', padding: '20px' }}>
      <h1>Scheduler Component Test</h1>
      <Calendar
        events={testEvents}
        defaultView="week"
        onEventCreate={handleEventCreate}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
        enableEventCreation={true}
        enableEventEditing={true}
      />
    </div>
  );
};

export default TestCalendar;
