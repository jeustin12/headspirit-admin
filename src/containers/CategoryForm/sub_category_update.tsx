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

const GET_SUB_CATEGORIES_ID = gql`
query Subcategory($id: String!){
  findonesubcategory(id:$id){
    title
    slug
  }
}
`;

const UPDATE_SUB_CATEGORY= gql`
mutation updateCategory($id: String!, $Input: SubcategoryInputUpdate!){
  updateSubcategory(id:$id,Input:$Input)
}
`
type Props = any;

const AddCategory= (props) => {
const dispatch = useDrawerDispatch();
const id = useDrawerState('data')
const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [
  dispatch,
]);
const {data,loading,error} = useQuery(GET_SUB_CATEGORIES_ID
  ,{
  variables:{id},
  });
const { register, handleSubmit,setValue} = useForm();
React.useEffect(() => {
  register({ name: 'parent' });
  register({ name: 'image' });
}, [register]);
const [name, setname] = useState('');
const [Slug, setSlug] = useState('');
const [setc, setsetc] = useState(true);

const[updateSubcategory]= useMutation(UPDATE_SUB_CATEGORY)


if(loading) return 'Cargando...';

const handleSlugChange = ({ value }) => {
  setValue('parent', value);
  setSlug(value);
};
const handleNameChange = ({ value }) => {
  setValue('title', value);
  setname(value);
};

  const onSubmit = async valores => {
    const {Name,slug}= valores
    try {
        await updateSubcategory({
          variables:{
            id:id,
            Input:{
              title:Name,
              slug:slug
            },
          }
        });
      closeDrawer();
    } catch (error) {
      console.log(error)
    }
  };
const set = () => {
  setTimeout(()=>{
    setsetc(false)
    setname(data.findonesubcategory.title)
    setSlug(data.findonesubcategory.slug)
  },100)
};
if (setc === true) set()
return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Editar  Subcategoria</DrawerTitle>
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
            Cancelar
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
            Actualizar Subcategoria
          </Button>
        </ButtonGroup>
      </Form>
    </>
  );
};

export default AddCategory;
