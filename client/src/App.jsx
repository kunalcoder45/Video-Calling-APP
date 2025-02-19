import AppRoutes from './routes/AppRoute.jsx';
import { BrowserRouter } from 'react-router-dom';

import './App.css'

function App() {

  return (
    <>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
    </>
  )
}

export default App
