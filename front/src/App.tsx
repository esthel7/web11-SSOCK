import { Canvas } from '@react-three/fiber';
// import * as THREE from 'three';
// import Tree from './Tree';
// import Cylinder from './Cylinder';
// import Glass from './Glass';
import { OrbitControls } from '@react-three/drei';
import SnowGlobe from './SnowGlobe';
// import CustomCamera from './CustomCamera';
import { IntroButtonBox } from './components';
import GlobalStyles from './GlobalStyles';
import styled from 'styled-components';
import theme from './utils/theme';

const CanvasBox = styled.div`
  margin: auto;
  width: 100vw;
  height: 100vh;
  @media (min-width: ${theme.size['--desktop-min-width']}) {
    width: ${theme.size['--desktop-width']};
  }
`;

const App = () => {
  return (
    <>
      <GlobalStyles />

      <CanvasBox>
        <Canvas camera={{ position: [0, 10, -40] }}>
          {/* <CustomCamera /> */}
          <OrbitControls />
          <ambientLight intensity={0.5} color={'#cfcabb'} />
          <directionalLight
            position={[1, 1, 0]}
            intensity={3}
            color={'#e2bb83'}
          />

          {/* <Glass />
          <Tree />
          <Cylinder /> */}
          <SnowGlobe />
        </Canvas>
      </CanvasBox>

      <IntroButtonBox />
    </>
  );
};

export default App;
