import { useEffect, useState } from 'react';
import { announcements as defaultAnnouncements } from '@/data/config';

type AnnouncementBarProps = {
  items?: string[];
};

export function AnnouncementBar({ items }: AnnouncementBarProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const list = items && items.length > 0 ? items : defaultAnnouncements;

  useEffect(() => {
    if (paused) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % list.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [paused, list.length]);

  return (
    <div
      className="announcement-bar"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-label="Announcements"
    >
      <div className="announcement-track">
        {list.map((msg, i) => (
          <span
            key={`${msg}-${i}`}
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
