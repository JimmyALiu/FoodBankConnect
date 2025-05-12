function Dashboard({
  setCurrentPage,
}: {
  setCurrentPage: (page: string) => void;
}) {
  const pages = [
    { label: "Dashboard", page: "Home" },
    { label: "Search Clients", page: "Search" },
    { label: "Flagged Entries", page: "Flagged" },
    { label: "Log Out", page: "Home" },
  ];

  return (
    <aside className="bg-blue-800 shadow-lg flex flex-col px-4 h-[100vh] w-[16vw]">
      <div className="py-6 flex items-center justify-center">
        <span className="text-white text-xl font-bold">
          🍎 Foodbank Connect
        </span>
      </div>
      <nav className="flex-1 mt-2">
        <ul className="space-y-6">
          {pages.map(({ label, page }) => (
            <li key={label}>
              <button
                onClick={() => setCurrentPage(page)}
                className="px-6 py-2 text-blue-500 text-xl hover:bg-blue-500 hover:text-blue-800 rounded-lg transition duration-200"
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Dashboard;
