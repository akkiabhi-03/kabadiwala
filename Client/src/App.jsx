import AllRoute from './Navigation/AllRoutes.jsx'
import { UserProvider } from './Contexts/UserContext.jsx'
import { Toaster, toast } from 'react-hot-toast';

function App() {
  return (
    <>
    <UserProvider>
      <Toaster position="top-center" revverseOrder={false} />
      <AllRoute/>
    </UserProvider>
    </>

  )
}

export default App;
