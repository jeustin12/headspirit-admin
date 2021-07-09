import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, gql,useQuery } from '@apollo/client';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDrawerDispatch, useDrawerState } from 'context/DrawerContext';
import Input from 'components/Input/Input';
import PhoneInput from 'components/PhoneInput/PhoneInput';
import Button, { KIND } from 'components/Button/Button';
import DrawerBox from 'components/DrawerBox/DrawerBox';
import { Row, Col } from 'components/FlexBox/FlexBox';
import {
  Form,
  DrawerTitleWrapper,
  DrawerTitle,
  FieldDetails,
  ButtonGroup,
} from '../DrawerItems/DrawerItems.style';
import { FormFields, FormLabel } from 'components/FormFields/FormFields';
const GET_USER_ID =gql`
query OneUsert($id: String!){
  fetoneuser(id:$id){
    name
    number
    email
  }
}
`


const UPDATE_STAFF = gql`
mutation updateUSer($id: String!, $input: UpdateProjectInput!){
  updateUser(id:$id,project:$input)
}
`;

type Props = any;

const StaffMemberForm: React.FC<Props> = (props) => {
  const dispatch = useDrawerDispatch();
  const id = useDrawerState('data');
  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [
    dispatch,
  ]);
  const { register, handleSubmit } = useForm();
  const [country, setCountry] = React.useState(undefined);
  const [text, setText] = React.useState('');
  const [name,setName]= React.useState('');
  const [number,setNumber]= React.useState('');
  const [email,setEmail]= React.useState('');
  const [setc, setsetc]= React.useState(true);

  const {data,loading,error}=useQuery(GET_USER_ID,{
    variables:{id}
  })
  const [createStaff] = useMutation(UPDATE_STAFF);
  if (loading) {
    return <h1>Cargando...</h1>
  }

  const handleNameChange = ({ value }) => {
    setName(value);
  };

  const handleNumberChange = ({ value }) => {
    setNumber(value);
  };

  const handleEmailChange = ({ value }) => {
    setNumber(value);
  };

  const onSubmit = async valores => {
    const {name,number,email,password} = valores
    try {
      const data = await createStaff({
        variables: {
          id:id,
          input: {
            name:name,
            number:number,
            email:email,
          }
        }
      }
      );
      closeDrawer();
    } catch (error) {
      console.log(error)
    }
  };

  const set = () => {
    setTimeout(()=>{
      setsetc(false)
      setName(data.fetoneuser.name)
      setNumber(data.fetoneuser.number)
      setEmail(data.fetoneuser.email)
    },100)
  };
  if (setc === true) set()



  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Edit Staff Member</DrawerTitle>
      </DrawerTitleWrapper>

      <Form onSubmit={handleSubmit(onSubmit)} style={{ height: '100%' }}>
        <Scrollbars
          autoHide
          renderView={(props) => (
            <div {...props} style={{ ...props.style, overflowX: 'hidden' }} />
          )}
          renderTrackHorizontal={(props) => (
            <div
              {...props}
              style={{ display: 'none' }}
              className="track-horizontal"
            />
          )}
        >
          <Row>
            <Col lg={4}>
              <FieldDetails>
                Add staff name, description and necessary information from here
              </FieldDetails>
            </Col>

            <Col lg={8}>
              <DrawerBox>
                <FormFields>
                  <FormLabel>Name</FormLabel>
                  <Input
                    inputRef={register({ required: true, maxLength: 50 })}
                    name="name"
                    value={name}
                    onChange={handleNameChange}
                  />
                </FormFields>
                <FormFields>
                  <FormLabel>Contact No.</FormLabel>
                  <PhoneInput
                    country={country}
                    onCountryChange={({ option }) => setCountry(option)}
                    text={text}
                    onTextChange={(e) => setText(e.currentTarget.value)}
                    inputRef={register({ required: true })}
                    name="number"
                    value={number}
                    onChange={handleNumberChange}
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    inputRef={register({ required: true })}
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                  />
                </FormFields>
                {/* <FormFields>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="text"
                    inputRef={register({ required: true })}
                    name="password"
                  />
                </FormFields> */}
              </DrawerBox>
            </Col>
          </Row>
        </Scrollbars>

        <ButtonGroup>
          <Button
            kind={KIND.minimal}
            onClick={closeDrawer}
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  width: '50%',
                  borderTopLeftRadius: '3px',
                  borderTopRightRadius: '3px',
                  borderBottomRightRadius: '3px',
                  borderBottomLeftRadius: '3px',
                  marginRight: '15px',
                  color: $theme.colors.red400,
                }),
              },
            }}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            overrides={{
              BaseButton: {
                style: ({ $theme }) => ({
                  width: '50%',
                  borderTopLeftRadius: '3px',
                  borderTopRightRadius: '3px',
                  borderBottomRightRadius: '3px',
                  borderBottomLeftRadius: '3px',
                }),
              },
            }}
          >
            Add Staff
          </Button>
        </ButtonGroup>
      </Form>
    </>
  );
};

export default StaffMemberForm;
