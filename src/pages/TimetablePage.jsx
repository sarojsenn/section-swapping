import Timetable from '../components/Timetable';
import { useEffect } from 'react';

export default function TimetablePage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <Timetable />
    </div>
  );
}
