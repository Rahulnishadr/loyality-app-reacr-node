import React from 'react'

function Dashboard() {
  return (
    <div>
          <div className="flex h-screen">
                    
                    <div className="flex-1 p-4">
                     
                        <div className="flex justify-between items-center mb-4">
                            <div className="flex items-center">
                                <img src="https://placehold.co/40" alt="Avatar" className="rounded-full mr-2"/>
                                <div>
                                    <div className="font-bold">Name</div>
                                    <div className="text-sm">Role <i className="fas fa-caret-down"></i></div>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Button</button>
                                <button className="bg-gray-300 text-black px-4 py-2 rounded">Logout</button>
                            </div>
                        </div>

                        {/* {/ Module Section /} */}
                        <div className="bg-white p-4 rounded shadow">
                            <div className="flex justify-between items-center mb-4">
                                <div className="text-xl font-bold">Module</div>
                                <button className="bg-green-500 text-white px-4 py-2 rounded">Create</button>
                            </div>
                            <div className="mb-4">
                                <input type="text" placeholder="Search" className="border p-2 w-full"/>
                            </div>
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border p-2">Name</th>
                                        <th className="border p-2">Code</th>
                                        <th className="border p-2">Status</th>
                                        <th className="border p-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="border p-2">-</td>
                                        <td className="border p-2">-</td>
                                        <td className="border p-2">-</td>
                                        <td className="border p-2">
                                            <button className="text-blue-500 mr-2">Edit</button>
                                            <button className="text-red-500">Delete</button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
    </div>
  )
}

export default Dashboard