import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <div className="App">
      {/* <BrowserRouter>
        <AuthProvider>
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <PublicRoute>
                  <Home />
                </PublicRoute>
              }
            />
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicRoute>
                  <Signup />
                </PublicRoute>
              }
            />
            <Route
              path="/mypage"
              element={
                <PrivateRoute>
                  <MyPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/createQuiz"
              element={
                <PrivateRoute>
                  <CreateQuiz />
                </PrivateRoute>
              }
            />
            <Route
              path="/editQuiz/:id"
              element={
                <PrivateRoute>
                  <EditQuiz />
                </PrivateRoute>
              }
            />
            <Route
              path="/participateQuiz/:joinKey"
              element={
                <PrivateRoute>
                  <ParticipateQuiz />
                </PrivateRoute>
              }
            />
            <Route
              path="/result/:key"
              element={
                <PrivateRoute>
                  <Result />
                </PrivateRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter> */}
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </div>
  );
}

export default App;
