import React, { useContext ,useState} from 'react';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { AuthContext } from 'context/auth';
import {gql,useQuery} from '@apollo/client'
import {
  FormFields,
  FormLabel,
  FormTitle,
  Error,
} from 'components/FormFields/FormFields';
import { Wrapper, FormWrapper, LogoImage, LogoWrapper } from './Login.style';
import Input from 'components/Input/Input';
import Button from 'components/Button/Button';
import Logoimage from 'assets/image/PickBazar.png';


const LOGIN = gql`
query login ($password: String!, $email: String!){
  Login(email:$email,password:$password){
    name
    email
  }
}
`

const initialValues = {
  username: '',
  password: '',
};

const getLoginValidationSchema = () => {
  return Yup.object().shape({
    username: Yup.string().required('El correo es necesario!'),
    password: Yup.string().required('La contraseña es necesaria!'),
  });
};

const MyInput = ({ field, form, ...props }) => {
  return <Input {...field} {...props} />;
};

export default function Login() {
  const [loginerror,setLoginerror]=useState('')
  const {data,refetch}=useQuery(LOGIN,
    {
      variables:{
        email:"...",
        password:"..."
      }
    })
  let history = useHistory();
  let location = useLocation();
  const { authenticate, isAuthenticated } = useContext(AuthContext);
  if (isAuthenticated) return <Redirect to={{ pathname: '/' }} />;

  let { from } = (location.state as any) || { from: { pathname: '/' } };
  const login = async (valores) => {
    const{username,password}= valores
    try {
      await refetch({
          email:username,
          password:password
        })
        authenticate({ username, password }, () => {
          history.replace(from);
        });
    } catch (error) {
      console.log(error);
      setLoginerror('el usuario o la contraseña es incorrecta')
    }
    
  };

  return (
    <Wrapper>
      <FormWrapper>
        <Formik
          initialValues={initialValues}
          onSubmit={login}
          render={({ errors, status, touched, isSubmitting }) => (
            <Form>
              <FormFields>
                <LogoWrapper>
                  <LogoImage src={Logoimage} alt="pickbazar-admin" />
                </LogoWrapper>
                <FormTitle>Admin login</FormTitle>
                <h3
                style={{
                  color:'red'
                }}
                >{loginerror}</h3>
              </FormFields>

              <FormFields>
                <FormLabel>Correo</FormLabel>
                <Field
                  type="email"
                  name="username"
                  component={MyInput}
                />
                {errors.username && touched.username && (
                  <Error>{errors.username}</Error>
                )}
              </FormFields>
              <FormFields>
                <FormLabel>Contraseña</FormLabel>
                <Field
                  type="password"
                  name="password"
                  component={MyInput}
                />
                {errors.password && touched.password && (
                  <Error>{errors.password}</Error>
                )}
              </FormFields>
              <h3>{(data === undefined)? '': `i`}</h3>
              <Button
                type="submit"
                disabled={isSubmitting}
                overrides={{
                  BaseButton: {
                    style: ({ $theme }) => ({
                      width: '100%',
                      marginLeft: 'auto',
                      borderTopLeftRadius: '3px',
                      borderTopRightRadius: '3px',
                      borderBottomLeftRadius: '3px',
                      borderBottomRightRadius: '3px',
                    }),
                  },
                }}
              >
                Submit
              </Button>
            </Form>
          )}
          validationSchema={getLoginValidationSchema}
        />
      </FormWrapper>
    </Wrapper>
  );
}
