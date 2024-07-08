import Typography from '@mui/material/Typography';
import {useEffect, useState} from 'react';

export const Timer = ({targetDateTime}) => {
  const [remainingTime, setRemainingTime] = useState(0);
  const [intervalId, setIntervalId] = useState<number | null>(null);

  useEffect(() => {
    const targetDate = new Date(targetDateTime);
    const targetTimeLocal =
      targetDate.getTime() + targetDate.getTimezoneOffset() * 60 * 1000;

    const updateRemainingTime = () => {
      const currentTime = Date.now();
      const timeDifference = targetTimeLocal - currentTime;

      setRemainingTime(timeDifference);

      if (timeDifference <= 0) {
        clearInterval(intervalId as number);
      }
    };

    const newIntervalId = setInterval(updateRemainingTime, 1000);
    setIntervalId(newIntervalId);

    return () => clearInterval(newIntervalId);
  }, [targetDateTime]);

  const formatTime = (milliseconds: number) => {
    const seconds = Math.floor((milliseconds / 1000) % 60);
    const minutes = Math.floor((milliseconds / (1000 * 60)) % 60);
    const hours = Math.floor((milliseconds / (1000 * 60 * 60)) % 24);
    const days = Math.floor(milliseconds / (1000 * 60 * 60 * 24));

    return `${Math.abs(days)}d ${Math.abs(hours)}h ${Math.abs(
      minutes
    )}m ${Math.abs(seconds)}s`;
  };

  return (
    <Typography className='!font-bold !text-lg !tracking-widest'>
      {formatTime(remainingTime)}
    </Typography>
  );
};
