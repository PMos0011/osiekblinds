import * as React from 'react';
import Box from '@mui/material/Box';
import CircularProgress, {
  circularProgressClasses,
  CircularProgressProps
} from '@mui/material/CircularProgress';
import styled from 'styled-components';

const CustomCircularProgress = (props: CircularProgressProps) => {
  return (
    <Box sx={{ position: 'relative' }}>
      <CircularProgress
        variant="determinate"
        sx={{
          color: (theme) => theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800]
        }}
        size={30}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        sx={{
          color: (theme) => (theme.palette.mode === 'light' ? '#4e4e56' : '#308fe8'),
          animationDuration: '550ms',
          position: 'absolute',
          left: 0,
          [`& .${circularProgressClasses.circle}`]: {
            strokeLinecap: 'round'
          }
        }}
        size={30}
        thickness={4}
        {...props}
      />
    </Box>
  );
};

interface Props {
  moving: boolean;
}

const Wrapper = styled.div`
  width: 30px;
  display: flex;
  margin-right: 10px;
`;

const Spinner = ({ moving }: Props) => {
  return <Wrapper>{moving ? <CustomCircularProgress /> : null}</Wrapper>;
};

export default Spinner;
