export const metadata = {
  title: "System Admin Dashboard",
};
const BirthCareLogo = () => (
  <svg
    className="w-10 h-10 text-indigo-600"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 64 64"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="32" cy="20" r="8" fill="currentColor" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M20 44c0-8 12-16 12-16s12 8 12 16a12 12 0 01-24 0z"
      fill="currentColor"
    />
  </svg>
);

const Dashboard = () => {
  const birthingHomes = [
    {
      id: 1,
      name: "St. Anne Birthing Home",
      status: "Pending",
      type: "Private",
    },
    { id: 2, name: "Hope Clinic", status: "Approved", type: "Public" },
    { id: 3, name: "Blessed Womb Center", status: "Rejected", type: "Private" },
    { id: 4, name: "MotherCare", status: "Approved", type: "Private" },
  ];

  const subscriptions = [
    { id: 1, facility: "Hope Clinic", status: "Active" },
    { id: 2, facility: "Blessed Womb Center", status: "Expired" },
    { id: 3, facility: "MotherCare", status: "Active" },
  ];

  const getStatusBadge = (status) => {
    const base = "inline-block px-3 py-1 text-xs font-semibold rounded-full";
    switch (status) {
      case "Approved":
        return `${base} bg-green-100 text-green-700`;
      case "Pending":
        return `${base} bg-yellow-100 text-yellow-700`;
      case "Rejected":
        return `${base} bg-red-100 text-red-700`;
      default:
        return `${base} bg-gray-100 text-gray-700`;
    }
  };

  const getTypeBadge = (type) => {
    return type === "Private"
      ? "inline-block px-3 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-700"
      : "inline-block px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-700";
  };

  return (
    <div className="py-12 px-6 bg-gradient-to-br from-indigo-50 to-white min-h-screen">
      <h1 className="text-3xl font-bold text-indigo-700 mb-12 drop-shadow-md">
        System Admin's Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {[
          {
            title: "Total Birthing Homes",
            count: birthingHomes.length,
          },
          {
            title: "Registrations",
            count: birthingHomes.length,
          },
          {
            title: "Pending Approvals",
            count: birthingHomes.filter((r) => r.status === "Pending").length,
          },
          {
            title: "Active Subscriptions",
            count: subscriptions.filter((s) => s.status === "Active").length,
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-xl p-6 hover:scale-105 transition transform duration-300 ease-in-out"
          >
            <h2 className="text-lg font-medium text-gray-600 mb-2">
              {item.title}
            </h2>
            <p className="text-4xl font-bold text-indigo-600">{item.count}</p>
          </div>
        ))}
      </div>

      {/* Additional Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
        {[
          {
            title: "Rejected Registrations",
            count: birthingHomes.filter((r) => r.status === "Rejected").length,
          },
          {
            title: "Expired Subscriptions",
            count: subscriptions.filter((s) => s.status === "Expired").length,
          },
          {
            title: "Approved Registrations",
            count: birthingHomes.filter((r) => r.status === "Approved").length,
          },
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl shadow-xl p-6 hover:scale-105 transition transform duration-300 ease-in-out"
          >
            <h2 className="text-lg font-medium text-gray-600 mb-2">
              {item.title}
            </h2>
            <p className="text-4xl font-bold text-indigo-600">{item.count}</p>
          </div>
        ))}
      </div>

      {/* Birthing Home List */}
      <div className="bg-white rounded-2xl shadow-2xl p-6">
        <h2 className="text-3xl font-semibold mb-6 text-indigo-700">
          Birthing Home List
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 rounded-xl overflow-hidden">
            <thead className="bg-indigo-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-indigo-800 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-indigo-800 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-indigo-800 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-indigo-800 uppercase tracking-wider">
                  Type
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {birthingHomes.map((home) => (
                <tr
                  key={home.id}
                  className="hover:bg-indigo-50 transition duration-200"
                >
                  <td className="px-6 py-4 text-sm text-gray-900">{home.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {home.name}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={getStatusBadge(home.status)}>
                      {home.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className={getTypeBadge(home.type)}>{home.type}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
