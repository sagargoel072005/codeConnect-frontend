import axios from 'axios';
import { FaCrown, FaMedal } from 'react-icons/fa';
import { useEffect, useState } from "react";
import { BASE_URL } from '../utils/constants';
import VideoLogin from './VideoLogin';

const Premium = () => {

  const [isUserPremium, setIsUserPremium] = useState(false);
  useEffect(() => {
    verifyPremiumUser();
  }, []);

  const verifyPremiumUser = async () => {
    const res = await axios.get(BASE_URL + "/premium/verify", {
      withCredentials: true,
    });
    console.log(res.data); // should now show isPremium: true
    if (res.data.isPremium) {
      setIsUserPremium(true);
    }
  };


  const handleBuyClick = async (type) => {
    const order = await axios.post(
      BASE_URL + "/payment/create",
      {
        membershipType: type,
      },
      {
        withCredentials: true
      });

    const { amount, keyId, currency, notes, orderId } = order.data;

    const options = {
      key: keyId,
      amount,
      currency,
      name: "codeconnect",
      description: "Connect to other developers",
      order_id: orderId,
      prefill: {
        name: notes.firstName + " " + notes.lastName,
        email: notes.emailId,
        contact: "9999999999",
      },
      theme: {
        color: "#F37254",
      },
      handler: verifyPremiumUser,

    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return isUserPremium ? (
    <VideoLogin />
  ) : (
    <div className="m-10">
      <div className="flex w-full flex-col lg:flex-row items-center justify-center gap-8">

        <div className="card w-80 shadow-xl border border-gray-200 hover:shadow-2xl transition duration-300 cursor-pointer bg-gradient-to-br from-slate-100 to-slate-200">
          <div className="card-body items-center text-center">
            <FaMedal className="text-4xl text-yellow-500 mb-2" />
            <h2 className="card-title text-xl font-semibold mb-2">Silver Membership</h2>
            <p className="text-gray-600 mb-4">Basic access with limited perks for budget-friendly users.</p>
            <button onClick={() => handleBuyClick("silver")} className="btn btn-outline btn-primary">Choose Silver</button>
          </div>
        </div>

        <div className="divider lg:divider-horizontal">OR</div>

        <div className="card w-80 shadow-xl border border-yellow-400 hover:shadow-2xl transition duration-300 cursor-pointer bg-gradient-to-br from-yellow-100 to-yellow-200">
          <div className="card-body items-center text-center">
            <FaCrown className="text-4xl text-yellow-600 mb-2" />
            <h2 className="card-title text-xl font-semibold mb-2">Gold Membership</h2>
            <p className="text-gray-700 mb-4">Premium benefits with exclusive features and priority support.</p>
            <button onClick={() => handleBuyClick("gold")} className="btn btn-primary">Choose Gold</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Premium;
