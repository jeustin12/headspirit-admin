import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation,gql, useQuery } from '@apollo/client';
import { useDrawerDispatch, useDrawerState } from 'context/DrawerContext';
import { Scrollbars } from 'react-custom-scrollbars';
import Select from 'components/Select/Select';
import Input from 'components/Input/Input';
import Button, { KIND } from 'components/Button/Button';
import DrawerBox from 'components/DrawerBox/DrawerBox';
import { Row, Col } from 'components/FlexBox/FlexBox';
import dayjs from 'dayjs';


import {
Form,
DrawerTitleWrapper,
DrawerTitle,
FieldDetails,
ButtonGroup,
} from '../DrawerItems/DrawerItems.style';
import { FormFields, FormLabel } from 'components/FormFields/FormFields';
import Swal from 'sweetalert2';

const GET_ORDER_ID = gql`
query	GetOneOrder($id:String!){
FindOneOrder(id:$id){
id
custumerName
custumerId
creation_date
delivery_address
Total_amount
contact
Status
guide_number
Products
}
}
`;

const UPDATE_ORDER= gql`
mutation UpdateOrder($input: OrderInputUpdate!, $id: String!) {
UpdateOrder(input: $input, id: $id)
}
`


const options = [
    { value: 'pending', label: '1 - Pendiente de Pago' },
    { value: 'processing', label: '2 - Pago realizado' },
    { value: 'delivered', label: '3 - Enviado' },
    { value: 'failed', label: '4 - Inconsistencias' },
];


const UpdateOrder = (props) => {
const dispatch = useDrawerDispatch();
const id = useDrawerState('data')
const closeDrawer = useCallback(() => dispatch({ type: 'CLOSE_DRAWER' }), [
    dispatch,
]);
const {data,loading} = useQuery(GET_ORDER_ID
,{
variables:{id},
});





const [status, setStatus] = useState('');
const [statust, setStatust] = useState('');
const [message, setMessage] = useState('');
const [guide_number, setGuide_number] = useState('');
const [stat,SetStat]= useState('')
const [setc, setsetc] = useState(true);
const { register, handleSubmit,setValue} = useForm();
React.useEffect(() => {
register({ name: 'parent' });
register({ name: 'image' });
register({ name: 'message' });
}, [register]);

const[updateOrder]= useMutation(UPDATE_ORDER)

if(loading) return <h1>Cargando...</h1>
const handleSlugChange = ({ value }) => {
setValue('parent', value);
setGuide_number(value);
};

const handleMessageChange = ({ value }) => {
    setValue('parent', value);
    setMessage(value);
    };

const handleChange = ({ value }) => {
    setValue('parent', value);
    setStatust(value);
    setStatus(value[0].label);
    SetStat(value[0].label)
    // console.log(value[0].label)
}
let myNumber=data.FindOneOrder.contact.replace(/ /g,'')

function getLinkWhastapp(number, message) {
    message = message.split(' ').join('%20')
    if ([
        'iPad Simulator',
        'iPhone Simulator',
        'iPod Simulator',
        'iPad',
        'iPhone',
        'iPod'
      ].includes(navigator.platform)
      // iPad on iOS 13 detection
      || (navigator.userAgent.includes("Mac") && "ontouchend" in document)) {
        return Swal.fire({
            position: 'center',
            icon: 'error',
            title: "Por favor asegurese de ingresar ya sea el mensaje o el numero de guia",
            showConfirmButton: true,
          })
        //   return window.location.href = 'https://api.whatsapp.com/send?phone=' + number + '&text=%20' + message
    }
    return window.open('https://api.whatsapp.com/send?phone=' + number + '&text=%20' + message)
    
}

console.log(
    navigator.userAgent
);
const onSubmit = async valores => {
    const {message,guide_number}= valores
    
    let ship_message = message + guide_number
    if (stat === undefined) {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: "Por favor selecciona un estado",
            showConfirmButton: true,
          })
    } else if (stat === '1 - Pendiente de Pago') {
        await updateOrder({
            variables:{
            id:id,
            input:{
                Status:stat
            },
            }
        }); 
        if (message !== '') {
            getLinkWhastapp(myNumber,message)
        }
        closeDrawer();
        
    } else if(stat === '2 - Pago realizado' && message !== ''){
        await updateOrder({
            variables:{
                id:id,
                input:{
                    Status:stat
                },
            }
        });
        getLinkWhastapp(myNumber,message)
        closeDrawer();        
    }else if(stat === '3 - Enviado' && message !== '' && guide_number !== ''){
        await updateOrder({
            variables:{
                id:id,
                input:{
                    Status:stat,
                    guide_number:guide_number
                },
            }
        });
        getLinkWhastapp(myNumber,ship_message)
        closeDrawer();
    }else if(stat === '4 - Inconsistencias' && message !== ''){
        await updateOrder({
            variables:{
                id:id,
                input:{
                    Status:stat,
                },
            }
        });
        getLinkWhastapp(myNumber,message)
        closeDrawer();
    }
    else{
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: "Por favor asegurese de ingresar ya sea el mensaje o el numero de guia",
            showConfirmButton: true,
          })
    }
    return console.log('heh')
    
}


const set = () => {
setTimeout(()=>{
    setsetc(false)
    SetStat(data.FindOneOrder.Status)
    setStatus(data.FindOneOrder.Status)
},100)
};
if (setc === true) set()

return (
<>
<DrawerTitleWrapper>
    <DrawerTitle>Editar Orden</DrawerTitle>
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

</Row>
<Row>
    <Col lg={4}>
    <FieldDetails>
        Estado de la orden: {stat}<br/>
        Cliente: {data.FindOneOrder.custumerName}<br/>
        Teléfono: {data.FindOneOrder.contact}<br/>
        Ordenado el: {dayjs(data.FindOneOrder.creation_date).format('DD MMM YYYY')}<br/>
        Productos Ordenados: {data.FindOneOrder.Products}
    </FieldDetails>
    </Col>

    
    {/* <FieldDetails>
        {data.FindOneOrder.contact}
    </FieldDetails> */}
    

        <Col lg={8}>
        <DrawerBox>
            <FormFields>
            <FormLabel>Nuevo Estado</FormLabel>
            <Select
                options={options}
                getOptionValue
                labelKey="label"
                valueKey="value"
                placeholder={stat}
                value={statust}
                searchable={false}
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
            {(status === '1 - Pendiente de Pago') ?
            <FormFields>
            <FormLabel>Mensaje</FormLabel>
            <Input
                inputRef={register({maxLength: 1000 })}
                name="message"
                value={message}
                onChange={handleMessageChange}
            />
            </FormFields>
            : ''
            }
            {(status === '2 - Pago realizado') ?
            <FormFields>
            <FormLabel>Mensaje</FormLabel>
            <Input
                inputRef={register({maxLength: 1000 })}
                name="message"
                value={message}
                onChange={handleMessageChange}
            />
            </FormFields>
            : ''
            }
            {(status === '4 - Inconsistencias') ?
            <FormFields>
            <FormLabel>Mensaje del problema</FormLabel>
            <Input
                inputRef={register({maxLength: 1000 })}
                name="message"
                value={message}
                onChange={handleMessageChange}
            />
            </FormFields>
            : ''
            }
            {(status === '3 - Enviado') ?
            <div>
            
            <FormFields>
            <FormLabel>Mensaje</FormLabel>
            <Input
                inputRef={register({maxLength: 1000 })}
                name="message"
                value={message}
                onChange={handleMessageChange}
            />
            </FormFields>
            <FormFields>
            <FormLabel>Numero de guia</FormLabel>
            <Input
                inputRef={register({maxLength: 500 })}
                name="guide_number"
                value={guide_number}
                onChange={handleSlugChange}
            />
            </FormFields>
            </div>
            : ''
            }
            
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
                Actualizar Orden
            </Button>
            </ButtonGroup>
        </Form>
        </>
    );
    };

    export default UpdateOrder;
