import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation,gql, useQuery } from '@apollo/client';
import { useDrawerDispatch, useDrawerState } from 'context/DrawerContext';
import { Scrollbars } from 'react-custom-scrollbars';
import Uploader from 'components/Uploader/Uploader';
import Input from 'components/Input/Input';
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

const GET_CATEGORIES_ID = gql`
query  category($id: String!){
  getOneCategory(id:$id){
    icon
    title
    slug
  }
}
`;
const UPDATE_CATEGORY_WHIT_IMAGE= gql`
mutation UPDATEIMAGE(
  $input:CategoryInputUpdate!,
  $file:Upload!, 
  $id:String!
){
  UPDATEIMAGE(
  id:$id,
  input:$input,
  file:$file
  ){
    id
    icon
    title
    slug
  }
}
`
const UPDATE_CATEGORY= gql`
mutation updateCategory(
  $input: CategoryInputUpdate!,
  $id:String!){
  updateCategory(
    id:$id,
    input:$input
  )
}
`


const AddCategory= (props) => {
  const dispatch = useDrawerDispatch();
  const id = useDrawerState('data')
  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [
    dispatch,
  ]);
  const {data,loading} = useQuery(GET_CATEGORIES_ID
    ,{
      variables:{id},
    });
    const [name, setname] = useState('');
    const [Slug, setSlug] = useState('');
    const [Image, setImage] = useState('');
      
    const [counter,SetCounter]= useState(1)
    const [setc, setsetc] = useState(true);
    const { register, handleSubmit,setValue} = useForm();
    React.useEffect(() => {
      register({ name: 'parent' });
      register({ name: 'image' });
    }, [register]);
    
    const[updateCategory]= useMutation(UPDATE_CATEGORY)
    const[updateCategoryImage]= useMutation(UPDATE_CATEGORY_WHIT_IMAGE)
    
    if(loading) return <h1>Cargando...</h1>
    const handleSlugChange = ({ value }) => {
      setValue('parent', value);
      setSlug(value);
    };
    const handleNameChange = ({ value }) => {
      setValue('title', value);
      setname(value);
    };
    const handleUploader = (files) => {
      setValue('image',files[0]);
      console.log(Image);
      SetCounter(2)
    };
    const onSubmit = async valores => {
      const {Name,slug,image}= valores
      
      if (counter === 2) {
        try {
           updateCategoryImage({
            variables:{
              id:id,
              input:{
                title:Name,
                slug:slug
              },
              file:image,
            }
          });
          closeDrawer();
          
        } catch (error) {
          console.log(error)
        }
      } else {
        try {
           await updateCategory({
            variables:{
              id:id,
              input:{
                title:Name,
                slug:slug
              },
            }
          });
          closeDrawer();
        } catch (error) {
          console.log(error)
        }
      }
    };
    
    const set = () => {
      setTimeout(()=>{
        setsetc(false)
        setname(data.getOneCategory.title)
        setSlug(data.getOneCategory.slug)
        setImage(data.getOneCategory.icon)
      },100)
    };
    if (setc === true) set()
    return (
      <>
      <DrawerTitleWrapper>
        <DrawerTitle>Editar Categoria</DrawerTitle>
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
              <FieldDetails>Sube la imagen para tu categoria aqui</FieldDetails>
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
              imageURL={data.getOneCategory.icon}
              />
              </DrawerBox>
            </Col>
          </Row>
          <Row>
            <Col lg={4}>
              <FieldDetails>
                Agrega la información necasaria 
              </FieldDetails>
            </Col>

            <Col lg={8}>
              <DrawerBox>
                <FormFields>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    inputRef={register({ required: true, maxLength: 20 })}
                    name="Name"
                    value={name}
                    // placeholder={data.getOneCategory.title}
                    onChange={handleNameChange}
                  />
                </FormFields>
                <FormFields>
                  <FormLabel>Palabra clave</FormLabel>
                  <Input
                    inputRef={register({ required: true, maxLength: 20 })}
                    name="slug"
                    value={Slug}
                    // placeholder={data.getOneCategory.slug}
                    onChange={handleSlugChange}
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
            Update Category
          </Button>
        </ButtonGroup>
      </Form>
    </>
  );
};

export default AddCategory;
