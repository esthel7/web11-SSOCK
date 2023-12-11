import React, { useState, createContext } from 'react';
import mockData from '@mock';
import axios from 'axios';

interface SnowBallData {
  id: number;
  title: string;
  main_decoration_id: number;
  main_decoration_color: string;
  bottom_decoration_id: number;
  bottom_decoration_color: string;
  is_message_private: boolean;
}

interface UserData {
  id: number;
  username: string;
  nickname: string;
  user_id: string;
  snowball_count: number;
  main_snowball_id: number;
  snowball_list: Array<number>;
  message_count: number;
}

interface SnowBallContextType {
  snowBallData: SnowBallData;
  setSnowBallData: React.Dispatch<React.SetStateAction<SnowBallData>>;
  userData: UserData;
  setUserData: React.Dispatch<React.SetStateAction<UserData>>;
  changePrivate: () => void;
}

const SnowBallContext = createContext<SnowBallContextType>({
  snowBallData: mockData.snowball_data as SnowBallData,
  setSnowBallData: () => {},
  userData: mockData.user_data,
  setUserData: () => {},
  changePrivate: () => {}
});

const SnowBallProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [snowBallData, setSnowBallData] = useState<SnowBallData>(
    mockData.snowball_data as SnowBallData
  );
  const [userData, setUserData] = useState<UserData>(mockData.user_data);
  const changePrivate = () => {
    const newData = {
      title: snowBallData.title,
      is_message_private: !snowBallData.is_message_private
    };
    axios.put(`/api/snowball/${snowBallData.id}`, newData).then(res => {
      console.log(res.data);
      const resData = Object.assign({}, snowBallData);
      resData.is_message_private = res.data.is_message_private;
      setSnowBallData(resData);
    });
  };
  return (
    <SnowBallContext.Provider
      value={{
        snowBallData,
        setSnowBallData,
        userData,
        setUserData,
        changePrivate
      }}
    >
      {children}
    </SnowBallContext.Provider>
  );
};

export { SnowBallContext, SnowBallProvider };
export type { SnowBallData, UserData };
