import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid';
import { useMutation, gql } from '@apollo/client';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDrawerDispatch } from 'context/DrawerContext';
import Input from 'components/Input/Input';
import Checkbox from 'components/CheckBox/CheckBox';
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

const CREATE_STAFF = gql`
mutation createStaff($input: UserInput!) {
    Register(input:$input) {
      id
      name
      email
      number
    }
  }
`;

type Props = any;

const StaffMemberForm: React.FC<Props> = (props) => {
  const dispatch = useDrawerDispatch();
  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [
    dispatch,
  ]);
  const { register, handleSubmit } = useForm();
  const [country, setCountry] = React.useState(undefined);
  const [checked, setChecked] = React.useState(true);
  const [text, setText] = React.useState('');

  const [createStaff] = useMutation(CREATE_STAFF);
  const onSubmit = async valores => {
    const {name,number,email,password} = valores
    try {
      const data = await createStaff({
        variables: {
          input: {
            name:name,
            number:number,
            email:email,
            password:password
          }
        }
      }
      );
      closeDrawer();
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Add Staff Member</DrawerTitle>
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
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    inputRef={register({ required: true })}
                    name="email"
                  />
                </FormFields>
                <FormFields>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="text"
                    inputRef={register({ required: true })}
                    name="password"
                  />
                </FormFields>
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
