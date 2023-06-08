import React, { useState, useEffect } from 'react'
import { Form, Button, Row, Col, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import NumberFormat from 'react-number-format'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import Spinner from '../components/layout/Spinner'
import Message from '../components/Message'
import { getUserDetails, updateUserProfile } from '../actions/userActions'
import { listMyOrders, deleteOrder } from '../actions/orderActions'
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants'

const ProfileScreen = ({ history }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [success, setSuccess] = useState(false)

  const dispatch = useDispatch()

  const userDetails = useSelector((state) => state.userDetails)
  const { error, user } = userDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderMyList = useSelector((state) => state.orderMyList)
  const {
    orders,
    loading,
    error: myListErrors,
    message: deleteOrderMessage,
  } = orderMyList

  const orderDelete = useSelector((state) => state.orderDelete)
  const { error: deleteOrderError } = orderDelete

  useEffect(() => {
    if (!userInfo) {
      history.push('/login')
    } else {
      if (!user || !user.name || success) {
        dispatch({ type: USER_UPDATE_PROFILE_RESET })
        dispatch(getUserDetails('profile'))
        dispatch(listMyOrders())      
      } else {
        let userObj = { ...user };
        if (userInfo.isAdmin) {
          userObj = { ...userInfo, hasOrders: false, hasPaidOrders: false };
        }
        setName(userObj.name);
        setEmail(userObj.email);
        if (userObj.address) {
          setAddress(userObj.address.address);
          setCity(userObj.address.city);
          setPostalCode(userObj.address.postalCode);
          setPhoneNumber(userObj.address.phoneNumber)
        }
      }
    }
  }, [history, userInfo, dispatch, user, success])

  const submitHandler = (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
            setTimeout(() => {
        setMessage(null)
      }, 2500)
    } else {
      dispatch(
        updateUserProfile({
          id: user._id,
          name,
          email,
          address: { address, city, postalCode, phoneNumber },
          password,
        })
      )
      setSuccess(true)
      setTimeout(() => {
        setSuccess(false)
      }, 1500)
    }
  }

  return (
    <>
      <Helmet>
      <title>Personal area</title>      </Helmet>
      <h1>
      <strong>Personal area</strong>      </h1>
      <Row>
        <Col md={3}>
        <h2>Personal details</h2>          {message && (
            <Message variant='danger' classN='alert-extra-wide'>
              {message}
            </Message>
          )}
          {success && (
            <Message variant='success' classN='alert-extra-wide'>
The details have been successfully updated            </Message>
          )}
          {error && (
            <Message variant='danger' classN='alert-extra-wide'>
              {error}
            </Message>
          )}
          <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
               <Form.Label>Full name</Form.Label>
               <Form.Control
                 type='name'
                 placeholder='first name and last name'
                 value={name}
                 onChange={(e) => setName(e.target.value)}
               ></Form.Control>
             </Form.Group>

             <Form.Group controlId='email'>
               <Form.Label>Email address</Form.Label>
               <Form.Control
                 type='email'
                 placeholder='email'
                 value={email}
                 onChange={(e) => setEmail(e.target.value)}
               ></Form.Control>
             </Form.Group>

             <Form.Row>
               <Form.Group controlId='password' as={Col}>
                 <Form.Label>Password</Form.Label>
                 <Form.Control
                   type='password'
                   placeholder='password'
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                 ></Form.Control>
               </Form.Group>

               <Form.Group controlId='confirmPassword' as={Col}>
                 <Form.Label>Authentication</Form.Label>
                 <Form.Control
                   type='password'
                   placeholder='password verification'
                   value={confirmPassword}
                   onChange={(e) => setConfirmPassword(e.target.value)}
                 ></Form.Control>
               </Form.Group>
             </Form.Row>

             <Form.Group controlId='address'>
               <Form.Label>Address</Form.Label>
               <Form.Control
                 type='text'
                 placeholder='street, house and apartment number'
                 value={address}
                 onChange={(e) => setAddress(e.target.value)}
               ></Form.Control>
             </Form.Group>

             <Form.Row>
               <Form.Group controlId='city' as={Col}>
                 <Form.Label>City</Form.Label>
                 <Form.Control
                   type='text'
                   placeholder='city'
                   value={city}
                   onChange={(e) => setCity(e.target.value)}
                 ></Form.Control>
               </Form.Group>

               <Form.Group controlId='postalCode' as={Col}>
                 <Form.Label>Zip Code</Form.Label>
                 <Form.Control
                   type='tel'
                   placeholder='7 digits'
                   pattern='[0-9]{7}'
                   value={postalCode}
                   onChange={(e) => setPostalCode(e.target.value)}
                 ></Form.Control>
               </Form.Group>
             </Form.Row>

             <Form.Group controlId='phoneNumber'>
               <Form.Label>Mobile phone number</Form.Label>
               <Form.Control
                 type='tel'
                 value={phoneNumber}
                 placeholder='mobile phone number (numbers only)'
                 pattern='[0-9]{10}'
                 onChange={(e) => setPhoneNumber(e.target.value)}
               ></Form.Control>
             </Form.Group>

             <Button className='btn-brand btn-block mt-4_5' type='submit'>
               update
             </Button>
          </Form>
        </Col>
        <Col md={9}>
          {deleteOrderMessage && (
            <div className='my-auto'>
              <Message
                variant='success'
                dismissible={true}
                classN='alert-delete-order alert-delete-order-sm'
              >
                {deleteOrderMessage}
              </Message>
            </div>
          )}
<h2>My orders</h2>
          {loading ? (
            <Spinner />
          ) : myListErrors ? (
            <Message variant='danger' dismissible={false}>
              {myListErrors}
            </Message>
          ) : deleteOrderError ? (
            <Message variant='danger' dismissible={true}>
              {deleteOrderError}
            </Message>
          ) : orders.length === 0 ? (
<h3>No orders have been placed yet</h3>          ) : (
            <>
              <Table striped bordered hover responsive className='table-sm'>
                <thead>
                <tr>
                     <th>order number</th>
                     <th>Date of making the order</th>
                     <th>Total order price</th>
                     <th className='sm-hide'>Payment Status</th>
                     <th className='sm-hide'>The date the payment was made</th>
                     <th className='sm-hide'>shipping status</th>
                     <th className='sm-hide'>The date the order was sent</th>
                     <th>Go to order details</th>
                     <th>cancellation of order</th>
                   </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>
                        <Link to={`/order/${order._id}`}>
                          {order._id.slice(17, 24)}
                        </Link>
                      </td>
                      <td>
                        <Link to={`/order/${order._id}`}>
                          {new Date(
                            order.createdAt.substring(0, 10)
                          ).toLocaleDateString('en-US')}
                        </Link>
                      </td>
                      <td
                        style={{
                          fontSize:
                            order.totalPrice < 999
                              ? '1rem'
                              : order.totalPrice > 9999
                              ? '0.75rem'
                              : '0.85rem',
                        }}
                      >
                        <Link to={`/order/${order._id}`}>
                          <NumberFormat
                            value={order.totalPrice}
                            displayType={'text'}
                            thousandSeparator={true}
                          />{' '}
                          $
                        </Link>
                      </td>
                      <td className='sm-hide'>
                        {order.isPaid ? (
                          <Link to={`/order/${order._id}`}>
                            <i
                              className='fas fa-check'
                              style={{ color: 'green' }}
                            />
                          </Link>
                        ) : (
                          <Link to={`/order/${order._id}`}>
                            <i
                              className='fas fa-times'
                              style={{ color: 'red' }}
                            />
                          </Link>
                        )}
                      </td>
                      <td className='sm-hide'>
                        <Link to={`/order/${order._id}`}>
                          {order.isPaid &&
                            new Date(
                              order.paidAt.substring(0, 10)
                            ).toLocaleDateString('en-US')}
                        </Link>
                      </td>
                      <td className='sm-hide'>
                        {order.isDelivered ? (
                          <Link to={`/order/${order._id}`}>
                            <i
                              className='fas fa-check'
                              style={{ color: 'green' }}
                            />
                          </Link>
                        ) : (
                          <Link to={`/order/${order._id}`}>
                            <i
                              className='fas fa-times'
                              style={{ color: 'red' }}
                            />
                          </Link>
                        )}
                      </td>
                      <td className='sm-hide'>
                        <Link to={`/order/${order._id}`}>
                          {order.isDelivered &&
                            new Date(
                              order.deliveredAt.substring(0, 10)
                            ).toLocaleDateString('en-US')}
                        </Link>
                      </td>
                      <td>
                        <LinkContainer to={`/order/${order._id}`}>
                          <Button className='btn-sm'>פרטים</Button>
                        </LinkContainer>
                      </td>
                      <td>
                        {!order.isPaid && (
                          <i
                            className='fas fa-trash-alt'
                            style={{ color: '#AAAAAA' }}
                            onClick={() =>
                              dispatch(deleteOrder(order._id, order.user))
                            }
                          ></i>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Col>
      </Row>
    </>
  )
}

export default ProfileScreen
