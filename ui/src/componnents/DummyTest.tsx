import React, { useEffect } from 'react';
import styled from 'styled-components';
// @ts-ignore
import Draggable from 'gsap/Draggable';
import Scrollbar from 'smooth-scrollbar';
import room1 from '../assets/room1.jpg';
import room2 from '../assets/room2.jpg';
import room3 from '../assets/room3.jpg';
import room4 from '../assets/room4.jpg';
import gsap from 'gsap';

const Container = styled.div`
  margin-left: 5vw;
  margin-top: 5vh;
  width: 95vw;
  height: 95vh;
  display: flex;
  flex-direction: row;
  overflow: hidden;
`;

const OverCont = styled.div`
  display: flex;
  height: fit-content;
  width: fit-content;
`;

const TestCont = styled.div`
  position: absolute;
  margin-top: 200px;
  margin-left: 300px;
`;

const Rows = styled.div`
  height: fit-content;
  display: flex;
  flex-direction: column;
`;

const StyledImage = styled.img`
  display: flex;
  padding: 2vh 2vw;
  width: 90vw;
  height: 90vh;
`;

const DummyTest = () => {
  useEffect(() => {
    const elems = document.getElementsByClassName('panel');
    const { width: w, height: h } = document.getElementById('app')!.getBoundingClientRect();

    const scb = Scrollbar.init(document.getElementById('space')!);

    gsap.registerPlugin(Draggable);

    Draggable.create('#other', {
      onDragEnd: () => {
        let res;
        let elem: HTMLElement;

        for (let i = 0; i < elems.length; i++) {
          const { top, left, width, height } = elems.item(i)!.getBoundingClientRect();

          const a = Math.pow(top + height / 2 - h / 2, 2);
          const b = Math.pow(left + width / 2 - w / 2, 2);
          const c = Math.sqrt(a + b);

          if (res === undefined) {
            res = c;
            elem = elems.item(i) as HTMLElement;
          } else if (res > c) {
            res = c;
            elem = elems.item(i) as HTMLElement;
          }
        }

        scb.scrollIntoView(elem!, {
          alignToTop: true,
          onlyScrollIfNeeded: false
        });
      }
    });
  }, []);

  return (
    <Container id={'space'}>
      <OverCont id={'other'}>
        <Rows>
          <div>
            <TestCont>DUPA</TestCont>
            <StyledImage className={'panel'} id={'r1'} src={room1} />
          </div>
          <div>
            <TestCont>DUPA DWA</TestCont>
            <StyledImage className={'panel'} id={'r2'} src={room2} />
          </div>
        </Rows>
        <Rows>
          <StyledImage className={'panel'} id={'r3'} src={room3} />
          <StyledImage className={'panel'} id={'r4'} src={room4} />
        </Rows>
      </OverCont>
    </Container>
  );
};

export default DummyTest;
