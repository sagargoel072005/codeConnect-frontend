import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Body from "./components/Body";
import Profile from "./components/Profile";
import { Provider } from "react-redux";
import Feed from "./components/Feed";
import appStore from "./utils/appStore";

function App() {
  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Body />}>
              <Route path="/" element={<Feed />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
};

export default App;
