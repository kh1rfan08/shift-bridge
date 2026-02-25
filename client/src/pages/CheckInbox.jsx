import { useLocation, Link } from 'react-router-dom';

export default function CheckInbox() {
  const location = useLocation();
  const email = location.state?.email || 'your email';

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <div className="text-6xl mb-6">&#9993;&#65039;</div>
        <h1 className="text-2xl font-bold mb-2">Check your inbox</h1>
        <p className="text-gray-400 mb-6">
          We sent a login link to<br />
          <span className="text-gray-200 font-medium">{email}</span>
        </p>
        <p className="text-gray-500 text-sm mb-8">
          The link expires in 15 minutes. Check spam if you don't see it.
        </p>
        <Link to="/login" className="text-pit-accent hover:underline text-sm">
          Use a different email
        </Link>
      </div>
    </div>
  );
}
