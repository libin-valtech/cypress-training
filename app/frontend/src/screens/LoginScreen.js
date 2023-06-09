import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import { Helmet } from 'react-helmet'
import Message from '../components/Message'
import FormContainer from '../components/FormContainer'
import Spinner from '../components/layout/Spinner'
import { login, register } from '../actions/userActions'

const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)

  const [googleName, setGoogleName] = useState('')
  const [googleEmail, setGoogleEmail] = useState('')
  const [googleId, setGoogleId] = useState('')
  const [loginSuccess, setLoginSuccess] = useState(false)

  const dispatch = useDispatch()

  const userLogin = useSelector((state) => state.userLogin)
  const { loading, error, userInfo } = userLogin

  const redirect = location.search ? location.search.split('=')[1] : '/'

  useEffect(() => {
    if (userInfo) {
      history.push(redirect)
    }

    if (error === 'Incorrect email or password' && googleName !== '') {
      dispatch(register(googleName, googleEmail, googleId))
      setLoginSuccess(true)
      history.push('/')
    }
  }, [
    history,
    userInfo,
    redirect,
    error,
    dispatch,
    googleName,
    googleEmail,
    googleId,
  ])

  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(login(email, password))
  }

  const googleLogin = (response) => {
    const {
      profileObj: { name, email },
      googleId,
    } = response

    setGoogleEmail(email)
    setGoogleName(name)
    setGoogleId(googleId)

    if (email) {
      dispatch(login(email, googleId))
    } else {
      setMessage('An error occurred. must try again')
      setTimeout(() => {
        setMessage(null)
      }, 2500)
    }
  }

  return (
    <>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <FormContainer>
        <h1>login</h1>
        {message && (
          <Message variant='danger' classN='alert-wide'>
            {message}
          </Message>
        )}
        {!loginSuccess && error && (
          <Message variant='danger' classN='alert-wide'>
            {error}
          </Message>
        )}
        {loading && <Spinner />}
        {/* <GoogleLogin
          clientId='816282195701-kdd4l2l5bnun3kbpsq8kqcusfb1cjkcr.apps.googleusercontent.com'
          onSuccess={googleLogin}
          onFailure={googleLogin}
          buttonText='כניסה באמצעות Google'
          className='google-login'
        />
        <h2>או כניסה עם סיסמה</h2> */}
        <h2>Login</h2>
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='email'>
          <Form.Label>Email address</Form.Label>
            <Form.Control
              type='email'
              placeholder='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='password'>
          <Form.Label>Password</Form.Label>
    <Form.Control
              type='password'
              placeholder='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Button className='btn-brand' data-cy="loginButton" type='submit'>
            Login
          </Button>
        </Form>
        <Row className='py-3'>
          <Col>
          New client?{' '}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : '/register'}
            >
              enrollment
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </>
  )
}

export default LoginScreen
