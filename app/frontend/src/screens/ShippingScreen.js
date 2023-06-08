import React, { useState, useEffect } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { Helmet } from 'react-helmet'
import CheckoutSteps from '../components/CheckoutSteps'
import { saveShippingAddress } from '../actions/cartActions'

const ShippingScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart)
  const { shippingAddress, cartItems } = cart

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')

  useEffect(() => {
    if (!userInfo) {
      history.push('/cart')
    }

    if (cartItems.length === 0) {
      history.push('/')
    }

    if (shippingAddress !== null) {
      setAddress(shippingAddress.address)
      setCity(shippingAddress.city)
      setPostalCode(shippingAddress.postalCode)
      setPhoneNumber(shippingAddress.phoneNumber)
    } else if (userInfo) {
      setAddress(userInfo.address.address)
      setCity(userInfo.address.city)
      setPostalCode(userInfo.address.postalCode)
      setPhoneNumber(userInfo.address.phoneNumber)
    }
  }, [history, userInfo, shippingAddress, cartItems])

  const dispatch = useDispatch()

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(
      saveShippingAddress({
        address,
        city,
        postalCode,
        phoneNumber,
      })
    )
    history.push('/placeorder')
  }

  return (
    <>
      <Helmet>
      <title>Shipping address</title>      </Helmet>
      <CheckoutSteps
        step1
        step2
        step4={shippingAddress !== null && shippingAddress.address}
      />
      <FormContainer>
         <h1 className='mb-n3' style={{ color: '#AAAAAA' }}>
           shipping address
         </h1>
         <small>* Mandatory fields</small>
         <Form onSubmit={submitHandler} className='mt-3'>
           <Form.Group controlId='address'>
             <Form.Label>* street, house and apartment number</Form.Label>
             <Form.Control
               type='text'
               placeholder='street, house and apartment number'
               value={address}
               onChange={(e) => setAddress(e.target.value)}
               required
             ></Form.Control>
           </Form.Group>
           <Form.Group controlId='city'>
             <Form.Label>* City</Form.Label>
             <Form.Control
               type='text'
               placeholder='city'
               value={city}
               onChange={(e) => setCity(e.target.value)}
               required
             ></Form.Control>
           </Form.Group>
           <Form.Group controlId='postalCode'>
             <Form.Label>Zip Code</Form.Label>
             <Form.Control
               type='tel'
               placeholder='Zip code (7 digits)'
               pattern='[0-9]{7}'
               value={postalCode}
               onChange={(e) => setPostalCode(e.target.value)}
             ></Form.Control>
           </Form.Group>
           <Form.Group controlId='phoneNumber'>
             <Form.Label>Mobile number</Form.Label>
             <Form.Control
               type='tel'
               value={phoneNumber}
               placeholder='mobile number (numbers only)'
               pattern='[0-9]{10}'
               onChange={(e) => setPhoneNumber(e.target.value)}
             ></Form.Control>
           </Form.Group>
           <Button type='submit' className='btn-brand btn-block mt-5'>
             Place the order
           </Button>
         </Form>
       </FormContainer>
    </>
  )
}

export default ShippingScreen
