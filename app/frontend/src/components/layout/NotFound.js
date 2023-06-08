import { Helmet } from 'react-helmet'

const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>{`The developer's house Not found`}</title>
      </Helmet>
      <div style={{ height: '200px' }}></div>
      <div className='text-center'>
        <h1 className='x-large text-brand'>
          <i
            className='fas fa-exclamation-triangle'
            style={{ color: '#53dbb2' }}
          ></i>{' '}
          הדף לא נמצא
        </h1>
        <p className='large'>Sorry, this page does not exist</p>
      </div>
    </>
  )
}

export default NotFound
