import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './views/Login/Login.js';
import TodoApp from './views/TodoApp/TodoApp.js';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.js';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/' element={<ProtectedRoute><TodoApp /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
