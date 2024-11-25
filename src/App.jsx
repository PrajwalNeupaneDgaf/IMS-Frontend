import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import { theme } from './theme';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import AddItem from './pages/AddItem';
import EditItem from './pages/EditItem';
import DetailedItem from './pages/DetailedItem';
import Setting from './pages/Setting';
import SalePage from './pages/SalePage';
import Users from './pages/Users';
import AddDealPage from './pages/AddDealPage';
import ManageEntitiesPage from './pages/ManageEntitiesPage';
import EditSale from './pages/EditSale';
import DetailedSale from './pages/DetailedSale';

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Routes without Layout */}
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />

                {/* Routes with Layout */}
                <Route
                  path='*'
                  element={
                    <Layout>
                      <Routes>
                        <Route path='/' element={<Dashboard />} />
                        <Route path='/inventory' element={<Inventory />} />
                        <Route path='/inventory/add' element={<AddItem />} />
                        <Route path='/inventory/edit/:id' element={<EditItem />} />
                        <Route path='/inventory/detail/:id' element={<DetailedItem />} />
                        <Route path='/sales' element={<SalePage />} />
                        <Route path='/Users' element={<Users />} />
                        <Route path='/settings' element={<Setting />} />
                        <Route path='/add-deal' element={<AddDealPage />} />
                        <Route path='/sales/:id' element={<DetailedSale />} />
                        <Route path='/edit-sale/:id' element={<EditSale />} />
                        <Route path='/manage-entity' element={<ManageEntitiesPage />} />
                      </Routes>
                    </Layout>
                  }
                />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </QueryClientProvider>
      </ChakraProvider>
    </>
  );
}

export default App;
