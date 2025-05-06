import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Body from "./components/Body";
import Profile from "./components/Profile";
import { Provider } from "react-redux";
import Feed from "./components/Feed";
import appStore from "./utils/appStore";
import CreateTeam from "./ems/CreateTeam";
import Connections from "./components/Connections";

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
              <Route path="/user/connections" element={<Connections />} />
              <Route path="/request" element={<Profile />} />
              <Route path="/create/team" element={<CreateTeam />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  )
};

export default App;
