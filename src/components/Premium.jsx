import React from 'react';
import { FaCrown, FaMedal } from 'react-icons/fa';

const Premium = () => {
  return (
    <div className="m-10">
      <div className="flex w-full flex-col lg:flex-row items-center justify-center gap-8">
        
        <div className="card w-80 shadow-xl border border-gray-200 hover:shadow-2xl transition duration-300 cursor-pointer bg-gradient-to-br from-slate-100 to-slate-200">
          <div className="card-body items-center text-center">
            <FaMedal className="text-4xl text-yellow-500 mb-2" />
            <h2 className="card-title text-xl font-semibold mb-2">Silver Membership</h2>
            <p className="text-gray-600 mb-4">Basic access with limited perks for budget-friendly users.</p>
            <button className="btn btn-outline btn-primary">Choose Silver</button>
          </div>
        </div>

        <div className="divider lg:divider-horizontal">OR</div>

        <div className="card w-80 shadow-xl border border-yellow-400 hover:shadow-2xl transition duration-300 cursor-pointer bg-gradient-to-br from-yellow-100 to-yellow-200">
          <div className="card-body items-center text-center">
            <FaCrown className="text-4xl text-yellow-600 mb-2" />
            <h2 className="card-title text-xl font-semibold mb-2">Gold Membership</h2>
            <p className="text-gray-700 mb-4">Premium benefits with exclusive features and priority support.</p>
            <button className="btn btn-primary">Choose Gold</button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default Premium;
