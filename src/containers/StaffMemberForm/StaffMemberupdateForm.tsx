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
import Uploader from 'components/Uploader/Uploader';
const GET_USER_ID =gql`
query OneUsert($id: String!){
  fetoneuser(id:$id){
    name
    number
    email
    image
  }
}
`
const UDDATE_STAFF_IMAGE = gql`
mutation createStaff($input: UpdateProjectInput!,$file:Upload!,$id:String!) {
  updateUserImage(project:$input,file:$file,id:$id) 
  }
`;

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
  const [image,setImage]= React.useState('no')

  const {data,loading}=useQuery(GET_USER_ID,{
    variables:{id},
  })
  const [createStaff] = useMutation(UPDATE_STAFF);
  const [updateImage] = useMutation(UDDATE_STAFF_IMAGE);
  if (loading) {
    return <h1>Cargando...</h1>
  }

  const handleUploader = (files) => {
    setImage(files[0]);
    console.log(files)
  };
  const handleNameChange = ({ value }) => {
    setName(value);
  };

  const handleNumberChange = ({ value }) => {
    setNumber(value);
  };

  const handleEmailChange = ({ value }) => {
    setEmail(value);
  };

  const onSubmit = async valores => {
    const {name,number,email} = valores
    if (image==='no') {
      try {
         await createStaff({
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
    }
    try {
      await updateImage({
        variables:{
          id:id,
          input:{
            name:name,
            number:number,
            email:email,
          },
          file: image
        }
      })
      closeDrawer();

    } catch (error) {
      
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
              <FieldDetails>Sube la imagen del usuario aqui</FieldDetails>
            </Col>
            <Col lg={8}>
              <DrawerBox
                overrides={{
                  Block: {
                    style: {
                      width: '100%',
                      height: 'auto',
                      padding: '30px',
                      borderRadius: '3px',
                      backgroundColor: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                  },
                }}
              >
              <Uploader onChange={handleUploader} 
              imageURL={data.fetoneuser.image}
              />
              </DrawerBox>
            </Col>
            </Row>
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
