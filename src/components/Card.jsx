import React from 'react';

const Card = ({ data }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((curItem, index) => {
        if (!curItem.image) return null; // ✅ GNews uses "image"

        return (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
          >
            <img
              src={curItem.image} // ✅ Changed from urlToImage
              alt="news"
              className="h-48 w-full object-cover"
            />
            <div className="p-4 flex flex-col flex-grow">
              <a
                href={curItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-lg font-semibold text-blue-600 hover:underline mb-2"
              >
                {curItem.title}
              </a>
              <p className="text-gray-700 flex-grow">
                {curItem.description || 'No description available.'}
              </p>
              <button
                onClick={() => window.open(curItem.url)}
                className="mt-4 self-start bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-300"
              >
                Read More
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Card;
