import { Heart, X, UserCircle } from 'lucide-react';

const UCard = ({ user }) => {
  const { firstName, lastName, photoUrl, age, gender, about, location } = user;

  return (
    <div className="w-96 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-white to-gray-100 border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
      <div className="relative">
        <img
          src={photoUrl || "https://via.placeholder.com/400x300?text=No+Image"}
          alt={`${firstName} ${lastName}`}
          className="w-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white text-xs px-2 py-1 rounded-full shadow text-gray-600">
          {gender}
        </div>
      </div>
      <div className="p-4 text-center">
        <h2 className="text-xl font-semibold text-gray-800 flex justify-center items-center gap-2">
          <UserCircle size={20} /> {firstName} {lastName}
        </h2>
        <p className="text-gray-500 text-sm mt-1">{age} years old {location ? `• ${location}` : ''}</p>
        <p className="text-gray-700 text-sm mt-3 italic">
          {about || "This user hasn't shared anything yet."}
        </p>
      </div>
    </div>
  );
};

export default UCard;
