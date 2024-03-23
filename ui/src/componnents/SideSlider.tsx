import React, { ReactNode } from 'react';
import styled from 'styled-components';
import ManageHistoryIcon from '@mui/icons-material/ManageHistory';
import AcUnitIcon from '@mui/icons-material/AcUnit';

const Container = styled.div<{ isOpen: boolean; secondOpen: boolean }>`
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  transform: translateX(${({ secondOpen }) => (secondOpen ? -60 : 0)}px);
  width: ${(props) => (props.isOpen ? 90 : 1)}%;
  height: 100%;
  background-color: whitesmoke;
  z-index: 10;
  border-radius: 0 6px 6px 0;
  box-shadow: 8px 8px 24px 0 rgba(0, 0, 0, 0.6);
  transition-duration: 0.5s;
  transition-delay: ${(props) => (props.isOpen ? 0 : 0.3)}s;
`;

const ManageIconWrapper = styled.div<{ bottom: boolean }>`
  margin-top: ${({ bottom }) => (bottom ? '70px' : '10px')};
  margin-left: auto;
  margin-right: -20px;
  display: flex;
  z-index: 11;
  width: fit-content;
  height: fit-content;
  justify-content: right;
  border-radius: 0 8px 8px 0;
  background-color: whitesmoke;
  box-shadow: 8px 8px 24px 0 rgba(0, 0, 0, 0.8);

  &:before {
    border-radius: 0 6px 6px 0;
    content: ' ';
    position: absolute;
    top: 0;
    left: 0;

    width: calc(100% + 1px);
    height: 100%;
    background-color: whitesmoke;
  }
`;

const ContentWrapper = styled.div`
  z-index: 15;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

interface Props {
  children: ReactNode;
  isOpen: boolean;
  secondOpen: boolean;
  toggleSidebar: () => void;
  type: 'SCHEDULE' | 'AC';
}

const SideSlider = ({ children, isOpen, secondOpen, toggleSidebar, type }: Props) => {
  return (
    <Container isOpen={isOpen} secondOpen={secondOpen}>
      <ContentWrapper>{children}</ContentWrapper>
      <ManageIconWrapper bottom={type === 'AC'}>
        {type === 'SCHEDULE' ? (
          <ManageHistoryIcon
            onClick={toggleSidebar}
            style={{ margin: '8px', zIndex: 25, cursor: 'pointer' }}
          />
        ) : (
          <AcUnitIcon
            onClick={toggleSidebar}
            style={{ margin: '8px', zIndex: 25, cursor: 'pointer' }}
          />
        )}
      </ManageIconWrapper>
    </Container>
  );
};

export default SideSlider;
