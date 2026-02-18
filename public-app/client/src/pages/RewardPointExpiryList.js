import React, { useState } from "react";

 const sampleData = [
  {
    id: 1,
    name: "Ashish Chandel",
    accountId: "RWC0000024",
    contact: "7668249437",
    email: "ashish.chandel@ens.enterprises",
    points: 100000,
    pointsToDeduct: 100000,
    expiryOn: "25/05/2026",
    status: "Active",
    createdAt: "10/25/2024, 9:24:52 AM",
  },
  {
    id: 2,
    name: "Keshwati Rawat",
    accountId: "RWC0000036",
    contact: "9617000668",
    email: "keshwati.rawat@gmail.com",
    points: 100000,
    pointsToDeduct: 96814,
    expiryOn: "25/05/2026",
    status: "Active",
    createdAt: "10/25/2024, 4:38:42 PM",
  },
  {
    id: 3,
    name: "Ayushi Binani",
    accountId: "RWC0000035",
    contact: "9911292356",
    email: "kirandsgroup@gmail.com",
    points: 100000,
    pointsToDeduct: 96967,
    expiryOn: "25/05/2026",
    status: "Active",
    createdAt: "10/25/2024, 1:27:07 PM",
  },
  {
    id: 4,
    name: "Kiran Singh",
    accountId: "RWC0000028",
    contact: "9140584545",
    email: "er.kiransingh12@gmail.com",
    points: 15000,
    pointsToDeduct: 11159,
    expiryOn: "23/05/2026",
    status: "Active",
    createdAt: "10/23/2024, 11:10:32 AM",
  },
  {
    id: 5,
    name: "Nikki Devi",
    accountId: "RWC0000032",
    contact: "6387764410",
    email: "nikki.devi@ens.enterprises",
    points: 2000,
    pointsToDeduct: 2000,
    expiryOn: "22/05/2026",
    status: "Active",
    createdAt: "10/22/2024, 12:20:24 PM",
  },
  {
    id: 6,
    name: "Ajay Mina",
    accountId: "RWC0000023",
    contact: "8650880807",
    email: "ajay.kumar@ens.enterprises",
    points: 100,
    pointsToDeduct: 100,
    expiryOn: "08/05/2024",
    status: "Expired",
    createdAt: "10/8/2024, 3:16:00 PM",
  },
  {
    id: 7,
    name: "Aviral K",
    accountId: "RWC0000024",
    contact: "7668249437",
    email: "aviral@dsgroup.com",
    points: 4000,
    pointsToDeduct: 4000,
    expiryOn: "21/10/2024",
    status: "Expired",
    createdAt: "10/8/2024, 3:31:34 PM",
  },
  {
    id: 8,
    name: "Srishti Sharma",
    accountId: "RWC0000024",
    contact: "7668249437",
    email: "srishti.sharma@ens.enterprises",
    points: 250,
    pointsToDeduct: 49,
    expiryOn: "21/10/2024",
    status: "Used",
    createdAt: "10/8/2024, 3:16:00 PM",
  },
  {
    id: 9,
    name: "Ashish Chandel",
    accountId: "RWC0000007",
    contact: "9911292356",
    email: "ashish.chandel@ens.enterprises",
    points: 5000,
    pointsToDeduct: 5000,
    expiryOn: "21/10/2024",
    status: "Expired",
    createdAt: "10/10/2024, 2:46:32 PM",
  },
  {
    id: 10,
    name: "Kiran Singh",
    accountId: "RWC0000028",
    contact: "9140584545",
    email: "er.kiransingh12@gmail.com",
    points: 6000,
    pointsToDeduct: 2907,
    expiryOn: "29/10/2024",
    status: "Used",
    createdAt: "10/17/2024, 10:57:42 AM",
  },
  {
    id: 11,
    name: "Amit Saini",
    accountId: "RWC0000040",
    contact: "9987654321",
    email: "amit.saini@example.com",
    points: 75000,
    pointsToDeduct: 50000,
    expiryOn: "30/12/2026",
    status: "Active",
    createdAt: "10/26/2024, 8:30:15 AM",
  },
  {
    id: 12,
    name: "Priya Sharma",
    accountId: "RWC0000041",
    contact: "9876543210",
    email: "priya.sharma@example.com",
    points: 12000,
    pointsToDeduct: 3000,
    expiryOn: "15/11/2025",
    status: "Active",
    createdAt: "10/26/2024, 9:45:37 AM",
  },
  {
    id: 13,
    name: "Rohit Verma",
    accountId: "RWC0000042",
    contact: "8765432109",
    email: "rohit.verma@example.com",
    points: 15000,
    pointsToDeduct: 15000,
    expiryOn: "05/01/2025",
    status: "Active",
    createdAt: "10/26/2024, 10:15:45 AM",
  },
  {
    id: 14,
    name: "Anjali K",
    accountId: "RWC0000043",
    contact: "7654321098",
    email: "anjali.k@example.com",
    points: 5000,
    pointsToDeduct: 5000,
    expiryOn: "20/10/2026",
    status: "Active",
    createdAt: "10/26/2024, 11:25:30 AM",
  },
  {
    id: 15,
    name: "Vikas Bhatt",
    accountId: "RWC0000044",
    contact: "6543210987",
    email: "vikas.bhatt@example.com",
    points: 100000,
    pointsToDeduct: 70000,
    expiryOn: "11/11/2026",
    status: "Active",
    createdAt: "10/26/2024, 12:35:55 PM",
  },
];


const RewardPointExpiryList = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleFilter = () => {
    // Add filter logic here
  };

  const handleExport = () => {
    // Add export logic here
  };

  return (
    <div className="max-w-5xl mx-auto p-3 shadow-md ">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-medium">Reward Point Expiry List</h1>

        <div className="flex items-center gap-x-2">
          <input
            type="text"
            placeholder="Search By, Account No, Email, ContactNo"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-3/4 lg:w-[400px]" />
          <button
            onClick={handleFilter}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Filter
          </button>
          <button
            onClick={handleExport}
            className="bg-green-500 text-white px-4 py-2 rounded-md"
          >
            Export
          </button>
        </div>
      </div>


    
      <div className="overflow-x-auto w-full">
        <table className="min-w-full border border-gray-200 table-auto border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b h-12">
              <th className="px-2 py-2 border-r font-medium text-base whitespace-nowrap">Sr. No</th>
              <th className="px-2 py-2 border-r font-medium text-base whitespace-nowrap">Seller Name</th>
              <th className="px-2 py-2 border-r font-medium text-base whitespace-nowrap">Account Number</th>
              <th className="px-2 py-2 border-r font-medium text-base whitespace-nowrap">Contact No.</th>
              <th className="px-2 py-2 border-r font-medium text-base whitespace-nowrap">Email</th>
              <th className="px-2 py-2 border-r font-medium text-base whitespace-nowrap">Points</th>
              <th className="px-2 py-2 border-r font-medium text-base whitespace-nowrap">Point to be Deduct</th>
              <th className="px-2 py-2 border-r font-medium text-base whitespace-nowrap">Expiry On</th>
              <th className="px-2 py-2 border-r font-medium text-base whitespace-nowrap">Status</th>
              <th className="px-2 py-2 border-r font-medium text-base whitespace-nowrap">Created At</th>
            </tr>
          </thead>

          <tbody>
            {sampleData.map((item, index) => (
              <tr key={item.id} className="border-b hover:bg-gray-50 h-12">
                <td className="px-2 border-r text-sm font-medium whitespace-nowrap">{index + 1}</td>
                <td className="px-2 border-r text-sm font-medium whitespace-nowrap">{item.name}</td>
                <td className="px-2 border-r text-sm font-medium whitespace-nowrap">{item.accountId}</td>
                <td className="px-2 border-r text-sm font-medium whitespace-nowrap">{item.contact}</td>
                <td className="px-2 border-r text-sm font-medium whitespace-nowrap">{item.email}</td>
                <td className="px-2 border-r text-sm font-medium whitespace-nowrap">{item.points}</td>
                <td className="px-2 border-r text-sm font-medium whitespace-nowrap text-center">{item.pointsToDeduct}</td>
                <td className="px-2 border-r text-sm font-medium whitespace-nowrap">{item.expiryOn}</td>
                <td className="px-2 border-r text-sm font-medium whitespace-nowrap">{item.status}</td>
                <td className="px-2 border-r text-sm font-medium whitespace-nowrap">{item.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default RewardPointExpiryList;
