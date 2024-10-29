import { Link } from 'react-router-dom';
import { Gamepad2 } from 'lucide-react';
import { useStore } from '../store';

export default function Navbar() {
  const { categories, settings } = useStore();

  return (
    <nav className="bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Gamepad2 className="w-8 h-8 text-purple-500" />
            <span className="text-xl font-bold">{settings.site_name}</span>
          </Link>

          <div className="flex items-center space-x-4">
            {categories.map(cat => (
              <Link
                key={cat.id}
                to={`/category/${cat.id}`}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            <Link
              to="/admin"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Админ
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}