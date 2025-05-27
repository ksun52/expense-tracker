import { Link } from 'react-router-dom';

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Table View', href: '/table' },
  { name: 'Analytics', href: '/analytics' },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-background">
      <nav className="space-y-1 p-4">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.href}
            className="flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-accent hover:text-accent-foreground"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
} 