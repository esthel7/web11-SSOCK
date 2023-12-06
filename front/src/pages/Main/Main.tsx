import { useEffect, useRef, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { Loading } from '@utils';
import { SnowGlobeCanvas, UIContainer } from '@components';
import MainButtonBox from './MainButtonBox';
import MainBody from './MainBody';
import {
  SnowBallContext,
  UserData,
  SnowBallData
} from '@pages/Visit/SnowBallProvider';

const LeftBtn = styled.img`
  position: fixed;
  top: 50%;
  height: 4rem;
`;

const RightBtn = styled(LeftBtn)`
  right: 0;
`;

const moveSnowball = (
  move: 'Prev' | 'Next',
  userData: UserData,
  snowBallData: SnowBallData,
  setSnowBallData: React.Dispatch<React.SetStateAction<SnowBallData>>
) => {
  const nowSnowBallID = userData.snowball_list.findIndex(
    id => id === snowBallData.id
  );

  if (nowSnowBallID === undefined) {
    throw '알수없는 snowballID입니다.';
  }

  const nextIdx = move === 'Prev' ? userData.snowball_count - 1 : 1;
  const nextSnowBallID =
    userData.snowball_list[(nowSnowBallID + nextIdx) % userData.snowball_count];

  axios(`/api/snowball/${nextSnowBallID}`)
    .then(res => {
      setSnowBallData(res.data as SnowBallData);
    })
    .catch(e => {
      console.error(e);
    });
};

const MainBodyWrap = styled.div`
  width: 100%;
  height: 100%;
`;

const EmptyDiv = styled.div`
  width: 100%;
  height: 30%;
`;

const Main = () => {
  const navigate = useNavigate();
  const { setSnowBallData, setUserData, userData, snowBallData } =
    useContext(SnowBallContext);
  const leftArrowRef = useRef<HTMLImageElement>(null);
  const rightArrowRef = useRef<HTMLImageElement>(null);
  const [isLoading, setLoading] = useState(false);

  // 애니메이션 효과가 없어서 구현해야함
  const delayButton = () => {
    if (leftArrowRef.current && rightArrowRef.current) {
      leftArrowRef.current.style.pointerEvents = 'none';
      rightArrowRef.current.style.pointerEvents = 'none';
      setTimeout(() => {
        if (leftArrowRef.current && rightArrowRef.current) {
          leftArrowRef.current.style.pointerEvents = 'all';
          rightArrowRef.current.style.pointerEvents = 'all';
        }
      }, 1500);
    }
  };

  // const saveCookie = () => {
  //   const cookieToken = import.meta.env.VITE_APP_COOKIE_TOKEN;
  //   const cookieName = 'access_token';
  //   const cookieValue = cookieToken;
  //   const today = new Date();
  //   const expire = new Date();
  //   const secure = true;
  //   expire.setDate(today.getDate() + 1);
  //   document.cookie = `${cookieName}=${cookieValue}; expires=${expire.toUTCString()}; secure=${secure}; path=/`;
  // };

  useEffect(() => {
    //saveCookie();
    axios
      .get('/api/user', {
        withCredentials: true // axios 쿠키 값 전달
      })
      .then(res => {
        if (res.status === 200) {
          const userData = res.data.user as UserData;
          const snowballData = res.data.main_snowball as SnowBallData;
          setSnowBallData(snowballData);
          setUserData(userData);
          setLoading(true);
          if (
            userData.nickname === null ||
            userData.snowball_count === 0 ||
            userData.nickname === 'null'
          ) {
            navigate('/make');
          }
        }
      })
      .catch(e => {
        console.error(e);
        navigate('/');
      });
  }, [navigate]);

  return (
    <>
      {isLoading ? (
        <>
          <SnowGlobeCanvas />
          <MainBodyWrap>
            <UIContainer>
              {userData.snowball_list.length > 1 ? (
                <>
                  <LeftBtn
                    src={'/icons/prev.svg'}
                    onClick={() => {
                      moveSnowball(
                        'Prev',
                        userData,
                        snowBallData,
                        setSnowBallData
                      );
                      delayButton(leftArrowRef, rightArrowRef);
                    }}
                    ref={leftArrowRef}
                  />
                  <RightBtn
                    src={'/icons/next.svg'}
                    onClick={() => {
                      moveSnowball(
                        'Next',
                        userData,
                        snowBallData,
                        setSnowBallData
                      );
                      delayButton(leftArrowRef, rightArrowRef);
                    }}
                    ref={rightArrowRef}
                  />
                </>
              ) : null}

              <MainButtonBox
                leftArrow={leftArrowRef}
                rightArrow={rightArrowRef}
              />
              <MainBody />
              <EmptyDiv />
            </UIContainer>
          </MainBodyWrap>
        </>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Main;
