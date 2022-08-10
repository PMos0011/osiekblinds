import * as React from 'react';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';

interface Props {
  progress: number;
}

const ProgressBar = ({ progress }: Props) => {
  return (
    <Box sx={{ width: '90%' }}>
      <LinearProgress color="inherit" variant="determinate" value={progress} />
    </Box>
  );
};

export default ProgressBar;
