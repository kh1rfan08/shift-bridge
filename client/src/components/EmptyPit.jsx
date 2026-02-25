import { Link } from 'react-router-dom';

export default function EmptyPit() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="text-6xl mb-4">&#128293;</div>
      <h2 className="text-xl font-bold mb-2">The Pit is empty</h2>
      <p className="text-gray-400 mb-6 max-w-xs">
        No shifts need coverage right now. Post one if you need someone to pick up.
      </p>
      <Link
        to="/post"
        className="bg-pit-accent hover:bg-sky-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
      >
        Post a Shift
      </Link>
    </div>
  );
}
