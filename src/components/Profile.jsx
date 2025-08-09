import EditProfile from './EditProfile';
import GitHubIntegration from './GitHubIntegration';
import PostEdit from './PostEdit';
import { useSelector } from 'react-redux';

const Profile = () => {
  const user = useSelector((store) => store.user);
  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-12 bg-gray-50 min-h-screen">
      
      {/* Page Title */}
      <header className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Your Profile Dashboard
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Manage your account details, GitHub integrations, and posts all in one place.
        </p>
      </header>

      {/* Edit Profile Section */}
      <section className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-3xl font-semibold text-indigo-700 mb-6 border-b border-indigo-300 pb-2">
          Edit Profile
        </h2>
        <EditProfile user={user} />
      </section>

      {/* GitHub Integration Section */}
      <section className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-3xl font-semibold text-indigo-700 mb-6 border-b border-indigo-300 pb-2">
          Connect your GitHub account to sync repositories 
        </h2>
        <GitHubIntegration />
      </section>

      {/* Post Edit Section */}
      <section className="bg-white rounded-lg shadow-lg p-8 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-3xl font-semibold text-indigo-700 mb-6 border-b border-indigo-300 pb-2">
          Manage Your Posts
        </h2>
        <PostEdit />
      </section>
    </div>
  );
};

export default Profile;
