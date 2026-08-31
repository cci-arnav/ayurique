import { useEffect, useState } from 'react';
import { announcements } from '@/data/config';

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % announcements.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [paused]);

  return (
    <div
      className="announcement-bar"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-label="Announcements"
    >
      <div className="announcement-track">
        {announcements.map((msg, i) => (
          <span
            key={msg}
            className={`announcement-msg ${i === index ? 'is-active' : ''}`}
            aria-hidden={i !== index}
          >
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
}
