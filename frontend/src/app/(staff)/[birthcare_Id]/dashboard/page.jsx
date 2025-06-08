const Dashboard = () => {
  const patients = [
    {
      id: 1,
      name: "Maria Santos",
      admissionDate: "2025-06-01",
      status: "Admitted",
    },
    {
      id: 2,
      name: "Anna Reyes",
      admissionDate: "2025-05-29",
      status: "Postnatal",
    },
    {
      id: 3,
      name: "Grace Delos Reyes",
      admissionDate: "2025-06-03",
      status: "In Labor",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-tr from-indigo-100 to-white py-12 px-6">
      <h1 className="text-3xl font-bold text-indigo-800 mb-12 tracking-tight drop-shadow-lg">
        Midwife's Dashboard
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {[
          {
            label: "Total Patients",
            value: patients.length,
          },
          {
            label: "Current Admissions",
            value: patients.filter((p) => p.status === "Admitted").length,
          },
          {
            label: "Postnatal Patients",
            value: patients.filter((p) => p.status === "Postnatal").length,
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-xl border border-indigo-200 p-6 transform transition duration-300 hover:scale-105 hover:shadow-xl"
          >
            <h3 className="text-xl text-gray-600 mb-2">{card.label}</h3>
            <p className="text-5xl font-bold text-indigo-700">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Patient Table */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100">
        <h2 className="text-3xl font-semibold text-indigo-800 mb-6">
          Patient List
        </h2>
        <div className="overflow-x-auto rounded-lg">
          <table className="min-w-full text-sm text-left border border-indigo-200">
            <thead>
              <tr className="bg-indigo-100 text-indigo-900 text-sm">
                <th className="px-6 py-3 border-b border-indigo-200">ID</th>
                <th className="px-6 py-3 border-b border-indigo-200">Name</th>
                <th className="px-6 py-3 border-b border-indigo-200">
                  Admission Date
                </th>
                <th className="px-6 py-3 border-b border-indigo-200">Status</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr
                  key={patient.id}
                  className="even:bg-indigo-50 odd:bg-white hover:bg-indigo-100 transition"
                >
                  <td className="px-6 py-4">{patient.id}</td>
                  <td className="px-6 py-4 font-medium">{patient.name}</td>
                  <td className="px-6 py-4">{patient.admissionDate}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        patient.status === "Admitted"
                          ? "bg-green-100 text-green-700"
                          : patient.status === "Postnatal"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {patient.status}
                    </span>
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
