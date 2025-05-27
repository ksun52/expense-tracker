export default function Header() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <h1 className="text-xl font-semibold">Expense Tracker</h1>
        <div className="ml-auto flex items-center space-x-4">
          {/* Add user profile, notifications, etc. here */}
        </div>
      </div>
    </header>
  );
} 