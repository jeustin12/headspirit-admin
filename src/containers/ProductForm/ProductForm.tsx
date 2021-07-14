import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, gql, useQuery } from '@apollo/client';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDrawerDispatch } from 'context/DrawerContext';
import Uploader from 'components/Uploader/Uploader';
import Button, { KIND } from 'components/Button/Button';
import DrawerBox from 'components/DrawerBox/DrawerBox';
import { Row, Col } from 'components/FlexBox/FlexBox';
import Input from 'components/Input/Input';
import { Textarea } from 'components/Textarea/Textarea';
import Select from 'components/Select/Select';
import { FormFields, FormLabel } from 'components/FormFields/FormFields';

import {
  Form,
  DrawerTitleWrapper,
  DrawerTitle,
  FieldDetails,
  ButtonGroup,
} from '../DrawerItems/DrawerItems.style';


const CREATE_PRODUCT = gql`
mutation createproduct($Input: CreateProductInput!,$file: Upload!){
  createProduct(Input:$Input,file:$file){
    id
  }
}
`;

const GET_CATEGORIES = gql`
  query getAllCategories{
  getAllCategories{
    id
    title
  }
  findallsubcategory{
      id
      title
    }
}
`;

type Props = any;

const AddProduct: React.FC<Props> = (props) => {
  const {data,loading} = useQuery(GET_CATEGORIES);
  const dispatch = useDrawerDispatch();
  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [
    dispatch,
  ]);
  const { register, handleSubmit, setValue } = useForm();
  const [category, setCategory] = useState();
  const [category2, setCategory2] = useState();
  const [subcategory, setSubcategory] = useState();
  const [subcategory2, setSubcategory2] = useState();
  const [description, setDescription] = useState('');

  React.useEffect(() => {
    register({ name: 'type' });
    register({ name: 'categories' });
    register({ name: 'image', required: true });
    register({ name: 'description' });
  }, [register]);

  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setValue('description', value);
    setDescription(value);
  };
  const [createProduct] = useMutation(CREATE_PRODUCT)
  if (loading) {
    <h1>Loading</h1>
  }
  const handleChange = ({ value }) => {
    setValue('parent', value);
    setCategory2(value)
    setCategory(value[0].title);
  };
  const handleSubChange = ({ value }) => {
    setValue('parent', value);
    setSubcategory2(value)
    setSubcategory(value[0].title);
  };
 
  const handleUploader = (files) => {
    setValue('image', files[0]);
  };
  const onSubmit = (data) => {
    const newProduct = {
      name: data.name,
      // image: data.image && data.image.length !== 0 ? data.image : '',
      type: "makeup",
      unit: data.unit,
      price: Number(data.price),
      discountInPercent: Number(data.discountInPercent),
      quantity: Number(data.quantity),
      salePrice: Number(data.salePrice),
      // creation_date: new Date(),
      slug: data.name,
      description: data.description,
      isActive:"active",
      category: category,
      subcategory: subcategory
    };
    try {
      createProduct({
        variables: { 
          Input: newProduct,
          file: data.image
        },
      });
      
    } catch (error) {
      console.log(error)
    }
    closeDrawer();
  };

  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Añadir Producto</DrawerTitle>
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
              <FieldDetails>Sube la imagen de tu producto aqui</FieldDetails>
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
                <Uploader onChange={handleUploader} />
              </DrawerBox>
            </Col>
          </Row>

          <Row>
            <Col lg={4}>
              <FieldDetails>
                Añade la descripcion del producto y toda la informacion necesaria
              </FieldDetails>
            </Col>

            <Col lg={8}>
              <DrawerBox>
                <FormFields>
                  <FormLabel>Nombre</FormLabel>
                  <Input
                    inputRef={register({ required: true, maxLength: 20 })}
                    name="name"
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Descripcion</FormLabel>
                  <Textarea
                    value={description}
                    onChange={handleDescriptionChange}
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Unit</FormLabel>
                  <Input type="text" inputRef={register} name="unit" />
                </FormFields>

                <FormFields>
                  <FormLabel>Precio</FormLabel>
                  <Input
                    type="number"
                    inputRef={register({ required: true })}
                    name="price"
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Precio de venta</FormLabel>
                  <Input type="number" inputRef={register} name="salePrice" />
                </FormFields>

                <FormFields>
                  <FormLabel>Porcentaje de descuento</FormLabel>
                  <Input
                    type="number"
                    inputRef={register}
                    name="discountInPercent"
                  />
                </FormFields>

                <FormFields>
                  <FormLabel>Inventario del producto</FormLabel>
                  <Input
                    type="number"
                    inputRef={register({ required: true })}
                    name="quantity"
                  />
                </FormFields>
                <FormFields>
                  <FormLabel>Parent</FormLabel>
                  <Select
                    options={data.getAllCategories}
                    getOptionValue
                    labelKey="title"
                    valueKey="id"
                    placeholder="Choose parent category"
                    value={category2}
                    searchable={true}
                    onChange={handleChange}
                    overrides={{
                      Placeholder: {
                        style: ({ $theme }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $theme.colors.textNormal,
                          };
                        },
                      },
                      DropdownListItem: {
                        style: ({ $theme }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $theme.colors.textNormal,
                          };
                        },
                      },
                      OptionContent: {
                        style: ({ $theme, $selected }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $selected
                              ? $theme.colors.textDark
                              : $theme.colors.textNormal,
                          };
                        },
                      },
                      SingleValue: {
                        style: ({ $theme }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $theme.colors.textNormal,
                          };
                        },
                      },
                      Popover: {
                        props: {
                          overrides: {
                            Body: {
                              style: { zIndex: 5 },
                            },
                          },
                        },
                      },
                    }}
                  />
                </FormFields>
                <FormFields>
                  <FormLabel>Sub Category</FormLabel>
                  <Select
                    options={data.findallsubcategory}
                    getOptionValue
                    labelKey="title"
                    valueKey="id"
                    placeholder="Choose subcategory"
                    value={subcategory2}
                    searchable={true}
                    onChange={handleSubChange}
                    overrides={{
                      Placeholder: {
                        style: ({ $theme }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $theme.colors.textNormal,
                          };
                        },
                      },
                      DropdownListItem: {
                        style: ({ $theme }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $theme.colors.textNormal,
                          };
                        },
                      },
                      OptionContent: {
                        style: ({ $theme, $selected }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $selected
                              ? $theme.colors.textDark
                              : $theme.colors.textNormal,
                          };
                        },
                      },
                      SingleValue: {
                        style: ({ $theme }) => {
                          return {
                            ...$theme.typography.fontBold14,
                            color: $theme.colors.textNormal,
                          };
                        },
                      },
                      Popover: {
                        props: {
                          overrides: {
                            Body: {
                              style: { zIndex: 5 },
                            },
                          },
                        },
                      },
                    }}
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
            Crear Producto
          </Button>
        </ButtonGroup>
      </Form>
    </>
  );
};

export default AddProduct;
