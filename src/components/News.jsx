import React, { useEffect, useState } from 'react';
import Card from './Card';

const Newsapp = () => {
  const [search, setSearch] = useState('');
  const [newsData, setNewsData] = useState(null);
  const API_KEY = '23e3580a01e0409ab68cc249d1c91745';

  const getData = async () => {
    let query = 'technology';
    if (search.trim() !== '') {
      query += ` AND ${search.trim()}`;
    }

    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&apiKey=${API_KEY}`
    );

    const jsonData = await response.json();
    console.log(jsonData.articles);
    let dt = jsonData.articles.slice(0, 10);
    setNewsData(dt);
  };

  useEffect(() => {
    getData();
  }, []);

  const handleInput = (e) => {
    setSearch(e.target.value);
  };

  const userInput = (event) => {
    setSearch(event.target.value);
    getData();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* ✅ Centered Navbar */}
      <nav className="bg-white shadow-md py-4 flex justify-center">
        <div className="flex items-center gap-2 w-full max-w-xl px-4">
          <input
            type="text"
            placeholder="Search Tech News"
            value={search}
            onChange={handleInput}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-600"
          />
          <button
            onClick={getData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Search
          </button>
        </div>
      </nav>

      {/* Hero Text */}
      <div className="text-center mt-8">
        <p className="text-3xl font-bold text-gray-800">
          Stay Updated with <span className="text-blue-600">Developer Tech News</span>
        </p>
      </div>

      {/* Category Buttons */}
      <div className="flex flex-wrap justify-center gap-4 my-6">
        {['AI', 'Blockchain', 'Cloud', 'Web Development', 'Open Source'].map(
          (category) => (
            <button
              key={category}
              value={category}
              onClick={userInput}
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors duration-300"
            >
              {category}
            </button>
          )
        )}
      </div>

      {/* Cards */}
      <div className="container mx-auto px-4">
        {newsData ? (
          <Card data={newsData} />
        ) : (
          <p className="text-center text-gray-500">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Newsapp;