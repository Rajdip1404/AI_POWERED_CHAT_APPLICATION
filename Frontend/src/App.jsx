import React, { useEffect } from 'react'
import FloatingShape from './components/FloatingShape'
import AppRouter from './routes/AppRouter';
import { useAuthStore } from './store/auth.store';
import { UserProvider } from './context/user.context';



const App = () => {

  return (
    <>
      <div className="relative min-h-screen bg-gradient-to-br from-gray-100 via-blue-100 to-cyan-200 overflow-hidden">
        <FloatingShape
          color="bg-blue-600"
          size="w-64 h-64"
          top="-5%"
          left="0%"
          delay={0}
        />
        <FloatingShape
          color="bg-blue-800"
          size="w-32 h-32"
          top="70%"
          left="80%"
          delay={5}
        />
        <FloatingShape
          color="bg-blue-800"
          size="w-20 h-20"
          top="10%"
          left="70%"
          delay={2}
        />
        <UserProvider>
          <AppRouter />
        </UserProvider>
      </div>
    </>
  );
}

export default App