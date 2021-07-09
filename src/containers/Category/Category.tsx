import React, { useCallback, useState } from 'react';
import { withStyle } from 'baseui';
import { Grid, Row as Rows, Col as Column } from 'components/FlexBox/FlexBox';
import { useDrawerDispatch } from 'context/DrawerContext';
import{Image} from '../Layout/Topbar/Topbar.style'
import Input from 'components/Input/Input';
import Button from 'components/Button/Button';
import { useQuery, gql, useMutation } from '@apollo/client';
import { Wrapper, Header, Heading } from 'components/Wrapper.style';
import {
  TableWrapper,
  StyledTable,
  StyledHeadCell,
  StyledCell,
  ImageWrapper,
} from './Category.style';
import { Plus } from 'assets/icons/Plus';
import NoResult from 'components/NoResult/NoResult';
import Swal from 'sweetalert2'
import Whiteimage from 'assets/image/white.jpg'

const GET_CATEGORIES = gql`
  query getAllCategories{
    getAllCategories{
      id
      icon
      title
      slug
    }
    findallsubcategory{
      id
      parentId
      title
      slug
      parent{
        title
      }
    }
  }
`;
const DELETE_CATEGORY=gql`
mutation deleteCategory($id: String!){
  removeCategory(id:$id)
}
`;
const DELETE_SUB_CATEGORY=gql`
mutation deletesubcategory($id: String!){
  removeSubcategory(id:$id)
}
`;
const Col = withStyle(Column, () => ({
  '@media only screen and (max-width: 767px)': {
    marginBottom: '20px',

    ':last-child': {
      marginBottom: 0,
    },
  },
}));

const Row = withStyle(Rows, () => ({
  '@media only screen and (min-width: 768px)': {
    alignItems: 'center',
  },
}));


export default function Category() {

const [search, setSearch] = useState('');
const [ID, setID] = useState('active');

const { data, error, refetch ,loading} = useQuery(GET_CATEGORIES
    ,{
      pollInterval: 3000,
    }
    );
const dispatch = useDrawerDispatch();
const openDrawer = useCallback(
() => dispatch({ type: 'OPEN_DRAWER', drawerComponent: 'CATEGORY_FORM' }),
[dispatch]);

const passid =(id)=>{
  setID(id)
  setTimeout(() => {
    if (ID === 'active') {
      console.log('')
    }
    else if (ID.length===36) {
      setTimeout(()=>{
        openDrawerUpdate()
        // console.log(ID)
      },1000);
    } else{
      setTimeout(()=>{
        openDrawerSubUpdate()
        // console.log(ID)
      },1000);
    }
  }, 1000);
}
const openDrawerUpdate = useCallback(
  () => dispatch({ type: 'OPEN_DRAWER',
  drawerComponent: 'CATEGORY_UPDATE_FORM',
  data:ID}),
  [dispatch,ID]
);
const openDrawerSubUpdate = useCallback(
  () => dispatch({ type: 'OPEN_DRAWER',
  drawerComponent: 'SUBCATEGORY_UPDATE_FORM',
  data:ID}),
  [dispatch,ID]
);
const [deleteCategory]= useMutation(DELETE_CATEGORY)
const [deleteSubategory]= useMutation(DELETE_SUB_CATEGORY)

  
if (error) {
  return <div>Error! {error.message}</div>;
}
if (loading) {
  return <div>Cargando..</div>;
}

function handleSearch(event) {
  const value = event.currentTarget.value;
  setSearch(value);
  refetch();
}

const confirmDeleteProduct=(id)=>{
  Swal.fire({
    title: '¿Seguro quieres eliminar la Categoria?',
    text: "No seras capaz de revertir esta acción",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Si!, eliminar'
  }).then(async(result)=>{
    if(result.isConfirmed){
    try {
      if (id.length === 36) {
        const{data}= await deleteCategory({
          variables:{
            id:id
          }
        });
        Swal.fire(
          'Eliminada',
          data.deleteCategory,
          'success'
          )
          console.log(id)
      } else {
        const{data}= await deleteSubategory({
          variables:{
            id:id
          }
        });
        Swal.fire(
          'Eliminada',
          data.deletesubcategory,
          'success'
          )
      }
      } catch (error) {
        console.log(error)
      }
    }
  })
}
let sub=data.findallsubcategory
let cate=data.getAllCategories
let array=cate.concat(sub)
return (
  <Grid fluid={true}>
    <Row>
      <Col md={12}>
        <Header
          style={{
            marginBottom: 30,
            boxShadow: '0 0 5px rgba(0, 0 ,0, 0.05)',
          }}
        >
          <Col md={2}>
            <Heading>Categorias</Heading>
          </Col>
          <Col md={10}>
            <Row>
              <Col md={5} lg={6}>
                <Input
                  value={search}
                  placeholder="Ex: Buscar por nombre"
                  onChange={handleSearch}
                  clearable
                />
              </Col>
              <Col md={4} lg={3}>
                <Button
                  onClick={openDrawer}
                  startEnhancer={() => <Plus />}
                  overrides={{
                    BaseButton: {
                      style: () => ({
                        width: '100%',
                        borderTopLeftRadius: '3px',
                        borderTopRightRadius: '3px',
                        borderBottomLeftRadius: '3px',
                        borderBottomRightRadius: '3px',
                        background:"#CBC0D3"
                      }),
                    },
                  }}
                >
                  Añadir Categoria
                </Button>
              </Col>
              
            </Row>
          </Col>
        </Header>
        <Wrapper style={{ boxShadow: '0 0 5px rgba(0, 0 , 0, 0.05)' }}>
          <TableWrapper>
            <StyledTable $gridTemplateColumns=" minmax(100px, 100px) minmax(150px, 150px) minmax(150px, 150px) minmax(70px, 100px) minmax(60px, auto) minmax(60px, auto)">
              <StyledHeadCell>Imagen</StyledHeadCell>
              <StyledHeadCell>Nombre</StyledHeadCell>
              <StyledHeadCell>Palabra Clave</StyledHeadCell>
              <StyledHeadCell>Parent</StyledHeadCell>
              <StyledHeadCell>Editar</StyledHeadCell>
              <StyledHeadCell>Borrar</StyledHeadCell>
              {array ? (
                array.length ? (
                  array
                    .map((item) => Object.values(item))
                    .map((row, index) => (
                      <React.Fragment key={index}>
                        <StyledCell>
                          <ImageWrapper>
                            {(row[2].length === 36)? <Image src={Whiteimage}></Image>:<Image src={row[2]}></Image>}
                          </ImageWrapper>
                        </StyledCell>
                        <StyledCell>{row[3]}</StyledCell>
                        <StyledCell>{row[4]}</StyledCell>
                        <StyledCell>{( row[5] === undefined || null) ? ``: `${row[5].title}`}</StyledCell>
                        <StyledCell>
                        <Button
                        onClick={()=>{passid(row[1])}}
                        overrides={{
                          BaseButton: {
                            style: () => ({
                              width: '100%',
                              borderTopLeftRadius: '3px',
                              borderTopRightRadius: '3px',
                              borderBottomLeftRadius: '3px',
                              borderBottomRightRadius: '3px',
                            }),
                          },
                        }}
                        >
                          Editar
                        </Button>
                        </StyledCell>
                        <StyledCell>
                        <Button
                        onClick={()=>{confirmDeleteProduct(row[1])}}
                          overrides={{
                            BaseButton: {
                              style: () => ({
                                width: '100%',
                                borderTopLeftRadius: '3px',
                                borderTopRightRadius: '3px',
                                borderBottomLeftRadius: '3px',
                                borderBottomRightRadius: '3px',
                              }),
                            },
                          }}
                        >
                          Borrar
                        </Button>
                        </StyledCell>
                      </React.Fragment>
                    ))
                ) : (
                  <NoResult
                    hideButton={false}
                    style={{
                      gridColumnStart: '1',
                      gridColumnEnd: 'one',
                    }}
                  />
                )
              ) : null}
            </StyledTable>
          </TableWrapper>
        </Wrapper>
      </Col>
    </Row>
  </Grid>
);
}
