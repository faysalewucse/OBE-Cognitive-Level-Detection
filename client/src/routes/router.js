import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "../Layout/MainLayout";
import { DashboardLayout } from "../Layout/DashboardLayout";
import Error404 from "../pages/Error404";
import PublicRoute from "../components/PublicRoute";
import Home from "../pages/Home";
import PrivateRoute from "../components/PrivateRoute";
import Login from "../pages/Login";
import Signup from "../pages/SignUp";
import MyPage from "../pages/MyPage";
import CreateQuiz from "../pages/CreateQuiz";
import EditQuiz from "../pages/EditQuiz";
import ParticipateQuiz from "../pages/ParticipateQuiz";
import Result from "../pages/Result";
import Dashboard from "../pages/Dashboard/Dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <Error404 />,
    children: [
      {
        path: "/",
        element: (
          <PublicRoute>
            <Home />
          </PublicRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "/signup",
        element: (
          <PublicRoute>
            <Signup />
          </PublicRoute>
        ),
      },
      {
        path: "/mypage",
        element: (
          <PrivateRoute>
            <MyPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/createQuiz",
        element: (
          <PrivateRoute>
            <CreateQuiz />
          </PrivateRoute>
        ),
      },
      {
        path: "/editQuiz/:id",
        element: (
          <PrivateRoute>
            <EditQuiz />
          </PrivateRoute>
        ),
      },
      {
        path: "/participateQuiz/:joinKey",
        element: (
          <PrivateRoute>
            <ParticipateQuiz />
          </PrivateRoute>
        ),
      },
      {
        path: "/result/:key",
        element: (
          <PrivateRoute>
            <Result />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "dashboard",
    element: <DashboardLayout />,
    children: [
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
    ],
  },
]);
