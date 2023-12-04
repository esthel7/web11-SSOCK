import { useContext, useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { LongButton } from '../../../utils';
import { DecoContext } from './DecoProvider';
import { SnowBallContext } from '../SnowBallProvider';
import { useNavigate } from 'react-router-dom';

interface ButtonProps {
  text: string;
  color: string;
  view: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  visible: [number, React.Dispatch<React.SetStateAction<number>>];
}

type ColorProps = Pick<ButtonProps, 'color'>;

const StyledButton = styled(LongButton)<ColorProps>`
  background-color: ${props => props.color};
`;

const PostButtonWrap = styled.div`
  width: 100%;
`;

const StyledAlert = styled.div`
  color: ${props => props.theme.colors['--white-primary']};
  padding-bottom: 1rem;
  font: ${props => props.theme.font['--normal-introduce-font']};
`;

const PostButton = (props: ButtonProps) => {
  const { color, decoID, letterID, content, sender } = useContext(DecoContext);
  const { userData, snowBallData, setSnowBallData } =
    useContext(SnowBallContext);
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState(false);

  const ClickedPost = () => {
    //여기서 axios요청
    if (content === '' || sender === '') {
      setAlerts(true);
      return;
    }
    const a = {
      sender,
      content,
      decoration_id: decoID,
      decoration_color: color,
      letter_id: letterID
    };
    console.log('asdfasdf', snowBallData.id, a);
    axios
      .post(`/api/message/${userData.id}/${snowBallData.id}`, a)
      .then(() => {
        axios.get(`/api/snowball/${snowBallData.id}`).then(res => {
          setSnowBallData(res.data);

          props.view[1](!props.view[0]);
          props.visible[1](-1);
        });
      })
      .catch(e => {
        console.log(e);
        alert(
          '메시지가 꽉찼어요\n다른 스노우볼을 선택해주세요!\n작성중인 메시지는 유지됩니다!'
        );
        navigate('../');
      });
  };

  return (
    <>
      <PostButtonWrap>
        {alerts ? (
          <StyledAlert>내용과 이름을 입력해주세요 !</StyledAlert>
        ) : null}
        <StyledButton color={props.color} onClick={ClickedPost}>
          {props.text}
        </StyledButton>
      </PostButtonWrap>
    </>
  );
};

export default PostButton;
