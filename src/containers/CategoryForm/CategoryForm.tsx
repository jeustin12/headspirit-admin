import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation,gql, useQuery } from '@apollo/client';
import { useDrawerDispatch } from 'context/DrawerContext';
import { Scrollbars } from 'react-custom-scrollbars';
import Uploader from 'components/Uploader/Uploader';
import Input from 'components/Input/Input';
import Button, { KIND } from 'components/Button/Button';
import Select from 'components/Select/Select';
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

const GET_CATEGORIES = gql`
  query getAllCategories{
  getAllCategories{
    id
    title
  }
}
`;
const CREATE_CATEGORY= gql`
mutation createCategory($input: CategoryInput!,$file: Upload!){
  createCategory(input:$input,file:$file)
}
`
const CREATE_SUB_CATEGORY= gql`
mutation createSubcategory($Input: SubcategoryInput!){
  createSubcategory(Input:$Input){
    id
    title
    slug
    parentId
  }
}
`

type Props = any;

const AddCategory: React.FC<Props> = (props) => {
  const dispatch = useDrawerDispatch();
  const [category, setCategory] = useState([]);
  const [ID, setID] = useState("");
  const [sub, setsub] = useState(false);
  const [CreateCategory] = useMutation(CREATE_CATEGORY)
  const [CreateSubcategory] = useMutation(CREATE_SUB_CATEGORY)
  const {data} = useQuery(GET_CATEGORIES);
  const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [
    dispatch,
  ]);
  
  const { register, handleSubmit,setValue} = useForm();
  React.useEffect(() => {
    register({ name: 'parent' });
    register({ name: 'image' });
  }, [register]);

  const handleUploader = (files) => {
    setValue('image',files[0]);
    console.log(files)
  };
  const handleChange = ({ value }) => {
    setValue('parent', value);
    setCategory(value);
    setID(value[0].id)
    setsub(true)
  };
  const onSubmit = async valores => {
    const {name,image}= valores
    try {
      if (sub === true) {
        await CreateSubcategory({
          variables: {
            Input: {
              title: name,
              slug: name,
              parentId:ID
            }
          }
        }
        )
      } else {
        await CreateCategory({
          variables: {
            input: {
              title: name,
              slug: name,
              type:"makeup"
            },
            file: image
          }
        }
        );
      }
      console.log(data)
      closeDrawer();
    } catch (error) {
      console.log(error)
    }
  };
// console.log(data.books)
  return (
    <>
      <DrawerTitleWrapper>
        <DrawerTitle>Añadir Categoria</DrawerTitle>
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
              <FieldDetails>Sube la imagen de tu categoria aqui</FieldDetails>
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
              Agrega la información necasaria 
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
                  <FormLabel>Parent</FormLabel>
                  <Select
                    options={data.getAllCategories}
                    getOptionValue
                    labelKey="title"
                    valueKey="id"
                    placeholder="Elige la categoria padre"
                    value={category}
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
            Crear Categoria
          </Button>
        </ButtonGroup>
      </Form>
    </>
  );
};

export default AddCategory;
