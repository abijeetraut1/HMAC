import { useEffect } from 'react'
import './App.css'
import axiosInterceptor from './lib/axios/axios.interceptor';

function App() {
  useEffect(() => {
    (async() =>{
      const res = await axiosInterceptor.get('/');
      console.log(res);
    })();
  }, []);

  return (
  <>
  </>
  )
}

export default App
