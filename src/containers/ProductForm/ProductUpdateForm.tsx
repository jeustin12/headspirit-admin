import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Scrollbars } from 'react-custom-scrollbars';
import { useDrawerDispatch, useDrawerState } from 'context/DrawerContext';
import Uploader from 'components/Uploader/Uploader';
import Button, { KIND } from 'components/Button/Button';
import DrawerBox from 'components/DrawerBox/DrawerBox';
import { Row, Col } from 'components/FlexBox/FlexBox';
import Input from 'components/Input/Input';
import { Textarea } from 'components/Textarea/Textarea';
import Select from 'components/Select/Select';
import { FormFields, FormLabel } from 'components/FormFields/FormFields';
import {gql,useMutation} from '@apollo/client'
import {
  Form,
  DrawerTitleWrapper,
  DrawerTitle,
  FieldDetails,
  ButtonGroup,
} from '../DrawerItems/DrawerItems.style';

const options = [
  { value: 'Fruits & Vegetables', name: 'Fruits & Vegetables', id: '1' },
  { value: 'Meat & Fish', name: 'Meat & Fish', id: '2' },
  { value: 'Purse', name: 'Purse', id: '3' },
  { value: 'Hand bags', name: 'Hand bags', id: '4' },
  { value: 'Shoulder bags', name: 'Shoulder bags', id: '5' },
  { value: 'Wallet', name: 'Wallet', id: '6' },
  { value: 'Laptop bags', name: 'Laptop bags', id: '7' },
  { value: 'Women Dress', name: 'Women Dress', id: '8' },
  { value: 'Outer Wear', name: 'Outer Wear', id: '9' },
  { value: 'Pants', name: 'Pants', id: '10' },
];

const CREATE_PRODUCT= gql`
mutation updateProduct($id: String!, $updateProductInput: UpdateProductInput!) {
  updateProduct(id:$id,updateProductInput:$updateProductInput)
}

`

const UPDATE_PRODUCT_IMAGE = gql`
mutation updateProduct(
  $id: String!
  $updateProductInput: UpdateProductInput!
  $file: Upload
) {
  updateProductImage(
    id: $id
    updateProductInput: $updateProductInput
    file: $file
  )
}
`

type Props = any;

const AddProduct: React.FC<Props> = () => {
  const dispatch = useDrawerDispatch();
  const data = useDrawerState('data');
  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [
    dispatch,
  ]);
  const { register, handleSubmit, setValue } = useForm({
    defaultValues: data,
  });
  const[createProduct]=useMutation(CREATE_PRODUCT)
  const[createProductImage]=useMutation(UPDATE_PRODUCT_IMAGE)
  const[counter,SetCounter]= useState(1)
  const [tag, setTag] = useState([]);
  const [description, setDescription] = useState(data.description);
  React.useEffect(() => {
    register({ name: 'type' });
    register({ name: 'categories' });
    register({ name: 'image' });
    register({ name: 'description' });
  }, [register]);

  const handleMultiChange = ({ value }) => {
    setValue('categories', value);
    setTag(value);
  };
  const handleDescriptionChange = (e) => {
    const value = e.target.value;
    setValue('description', value);
    setDescription(value);
  };

  const handleUploader = (files) => {
    setValue('image', files[0]);
    SetCounter(2)
    console.log(counter)
  };

  const onSubmit = (data2) => {
    const newProduct = {
      name: data2.name,
      type: "makeup",
      unit: data2.unit,
      price: Number(data2.price),
      discountInPercent: Number(data2.discountInPercent),
      quantity: Number(data2.quantity),
      salePrice: Number(data2.salePrice),
      // creation_date: new Date(),
      slug: data2.name,
      description: data2.description,
      isActive:"active"
    };
    if (counter === 2) {
      createProductImage({
        variables:{
          id:data.id,
          updateProductInput: newProduct, 
          file:data2.image
        }
      })
      console.log(data2.image)
    } else {
      createProduct({
        variables: {
          id:data.id,
          updateProductInput: newProduct 
        },
      });
      
    }
    closeDrawer();
  };

  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Editar Producto</DrawerTitle>
      </DrawerTitleWrapper>

      <Form
        onSubmit={handleSubmit(onSubmit)}
        style={{ height: '100%' }}
        noValidate
      >
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
              <DrawerBox>
                <Uploader onChange={handleUploader} imageURL={data.image} />
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
                  <FormLabel>Unidad</FormLabel>
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
                  <Input type="number" inputRef={register} name="quantity" />
                </FormFields>

                <FormFields>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    options={options}
                    labelKey="name"
                    valueKey="value"
                    placeholder="Product Tag"
                    value={tag}
                    onChange={handleMultiChange}
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
                    multi
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
            Update Product
          </Button>
        </ButtonGroup>
      </Form>
    </>
  );
};

export default AddProduct;
