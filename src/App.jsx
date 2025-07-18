import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Body from "./components/Body";
import Profile from "./components/Profile";
import { Provider } from "react-redux";
import Feed from "./components/Feed";
import appStore from "./utils/appStore";
import CreateTeam from "./ems/CreateTeam";
import Connections from "./components/Connections";
import Request from "./components/Request";
import Premium from "./components/Premium";
import PrivacyPolicy from "./footer/PrivacyPolicy";
import TermsAndConditions from "./footer/TermsAndConditions";
import CancellationAndRefundPolicy from "./footer/Cancellation";
import ShippingAndDeliveryPolicy from "./footer/Shipping";
import ContactUs from "./footer/ContactUs";
import Newsapp from "./components/News";
import Chat from "./components/Chat";
import MediaCentre from "./footer/MediaCentre";
import RoomPage from "./components/Room";
import { SocketProvider } from "./context/SocketContext";
import { createSocketConnection } from "./utils/socket";
const socket = createSocketConnection();

function App() {
  return (
    <>
      <Provider store={appStore}>
 <SocketProvider>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<Body />}>
              <Route path="/" element={<Feed />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/user/connections" element={<Connections />} />
              <Route path="/requests" element={<Request />} />
              <Route path="/create/team" element={<CreateTeam />} />
              <Route path="/premium" element={<Premium />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/cancellation-and-refund-policy" element={<CancellationAndRefundPolicy />} />
              <Route path="/shipping-and-delivery-policy" element={<ShippingAndDeliveryPolicy />} />
              <Route path="/contact-us" element={<ContactUs />} />
              <Route path="/tech-news" element={<Newsapp />} />
              <Route path="/media-centre" element={<MediaCentre />} />
              <Route path="/chat/:targetUserId" element={<Chat />} />
              <Route path="/room/:roomId" element={<RoomPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
         </SocketProvider>
      </Provider>
    </>
  )
};

export default App;
