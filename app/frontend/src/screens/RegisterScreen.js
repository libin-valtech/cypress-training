import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import Spinner from '../components/layout/Spinner'
import { register, login } from '../actions/userActions'

const RegisterScreen = ({ location, history }) => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState(null)

  const [googleEmail, setGoogleEmail] = useState('')
  const [googleId, setGoogleId] = useState('')
  const [loginSuccess, setLoginSuccess] = useState(false)

  const dispatch = useDispatch()

  const userRegister = useSelector((state) => state.userRegister)
  const { loading, error } = userRegister

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }

    if (error === 'המשתמש קיים' && googleEmail !== '') {
      setLoginSuccess(true)
      dispatch(login(googleEmail, googleId))
      history.push('/')
    }
  }, [
    history,
    userInfo,
    redirect,
    error,
    email,
    dispatch,
    googleEmail,
    googleId,
  ])

  const submitHandler = (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setMessage('הסיסמאות אינן תואמות')
      setTimeout(() => {
        setMessage(null)
      }, 2500)
    } else {
      dispatch(register(name, email, password))
    }
  }

  return (
    <>
      <Helmet>
      <title>Registration</title>      </Helmet>
      <FormContainer>
        {message && (
          <Message variant='danger' classN='alert-register'>
            {message}
          </Message>
        )}
        {!loginSuccess && error && (
          <Message variant='danger' classN='alert-register'>
            {error}
          </Message>
        )}
        {loading && <Spinner />}       
        <h1>Register</h1>        <Form onSubmit={submitHandler}>
        <Form.Group controlId='name'>
<Form.Label>Full name</Form.Label> <Form.Control
               type='name'
               placeholder='first name and last name'
               value={name}
               onChange={(e) => setName(e.target.value)}
               required
             ></Form.Control>
           </Form.Group>
           <Form.Group controlId='email'>
             <Form.Label>Email address</Form.Label>
             <Form.Control
               type='email'
               placeholder='email'
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
             ></Form.Control>
           </Form.Group>
           <Form.Group controlId='password'>
             <Form.Label>Password</Form.Label>
             <Form.Control
               type='password'
               placeholder='password'
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
             ></Form.Control>
           </Form.Group>
           <Form.Group controlId='confirmPassword'>
             <Form.Label>Password Validation</Form.Label>
             <Form.Control
               type='password'
               placeholder='password verification'
               value={confirmPassword}
               onChange={(e) => setConfirmPassword(e.target.value)}
               required
             ></Form.Control>
           </Form.Group>
           <Button className='btn-brand mt-3' type='submit'>
             enrollment
           </Button>
         </Form>
         <Row className='py-3'>
           <Col>
             Existing Customer?{' '}
             <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
               Login
             </Link>
           </Col>
         </Row>
      </FormContainer>
    </>
  )
}

export default RegisterScreen
