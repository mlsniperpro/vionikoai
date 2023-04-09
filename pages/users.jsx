import React, { useEffect, useState } from "react";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../config/firebase";


function Users() {
   const [searchTerm, setSearchTerm] = useState("");
   const [userData, setUserData] = useState([]);
   const [actions, setActions] = useState({});
    //Write code to retrieve users from firebase collection users
    const retrieveUsers=async()=>{
      console.log("I started running here")
      const users = [];
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        users.push(doc.data());
      });
      console.log(users)
      return users;
    }
    const getUsers=async()=>{
    const newData = await retrieveUsers();
    setUserData(newData);
    }
    useEffect(()=>{
      getUsers();
    },[])
 

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleConfirm = (id) => {
    // Perform action based on selectedAction
    //Delete the action from the actions object
    const updatedActions = {...actions}
    delete updatedActions[id]
    setActions(updatedActions)
    alert(`Action Completed`)
  };
  const filteredData = userData.filter((user) => {
    return user.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  const handleActionChange = (event, id) => {
    const userToUpdate = userData.find((user) => user.uid === id);
    userToUpdate.action = event.target.value;
    setActions({...actions, [id]: event.target.value})
  };
  

  return (
    
    <div>
      <div className="mt-4 mx-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold text-gray-900">Users</h1>
          <input
            type="text"
            placeholder="Search users"
            value={searchTerm}
            onChange={handleSearch}
            className="px-4 py-2 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          />
        </div>
        <div className="w-full overflow-hidden rounded-lg shadow-xs">
          <div className="w-full overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                  <th className="px-4 py-3">User</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date Signed Up</th>
                  <th>Take Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                {filteredData.map((user) => (
                  <tr
                    key={user.uid||user.userId}
                    className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center text-sm">
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">${user.amount}</td>
                    <td className="px-4 py-3 text-xs">
                      <span
                        className={`px-2 py-1 font-semibold leading-tight ${
                          user.status === "approved"
                            ? "text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100"
                            : "text-yellow-700 bg-yellow-100"
                        } rounded-full`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">{user.dateSignedUp}</td>
                    <td className="px-4 py-3 text-sm">
                      <select
                        value={user.action}
                        onChange={(event)=>handleActionChange(event, user.id)}
                        className="px-4 py-2 border border-gray-400 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                      >
                        <option value="">Take Action</option>
                        <option value="Deactivate"> Reactivate</option>
                        <option value="Demote">Demote</option>
                        <option value="Suspend">Deactivate</option>
                      </select>
                      {console.log(actions[user.userId]) /*&& (
                        <button
                          onClick={()=>handleConfirm(user.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-opacity-50"
                        >
                          Confirm
                        </button>
                      )*/}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Users;
