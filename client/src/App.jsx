import { useEffect, useState } from 'react'

const App = () => {
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('http://localhost:5000/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => setMessage('Error: ' + err.message))
  }, [])

  return <div>{message || 'Loading...'}</div>
}

export default App