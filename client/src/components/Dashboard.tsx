import { useAuth0 } from '@auth0/auth0-react';

function Dashboard({
  setCurrentPage,
}: {
  setCurrentPage: (page: string) => void;
}) {
  // authentication
  const { logout } = useAuth0();

  const pages = [
    { label: "Dashboard", page: "Home" },
    { label: "Search Clients", page: "Search" },
    { label: "Flagged Entries", page: "Flagged" },
  ];

  return (
    <aside className="shadow-lg flex flex-row w-[100%] h-20 sticky top-0 bg-white">
      <div className="w-[20%] px-6 py-6 flex items-center justify-start">
        <img src="/logo.svg" className="h-6 px-1"></img>
        <span className="text-blue-400 text-xl font-bold">
          Foodbank Connect
        </span>
      </div>
      <nav className="w-[80%] flex items-center justify-end px-[2vw]">
        <ul className="flex flex-row space-x-6">
          {pages.map(({ label, page }) => (
            <li key={label}>
              <button
                onClick={() => setCurrentPage(page)}
                className="navBtn px-6 py-2 text-blue-500 text-xl hover:text-blue-800 rounded-lg transition duration-200"
              >
                {label}
              </button>
            </li>
          ))}
          <li>
            <button
              onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
              className="navBtn px-6 py-2 text-blue-500 text-xl hover:text-blue-800 rounded-lg transition duration-200"
            >
              Log Out
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

export default Dashboard;
