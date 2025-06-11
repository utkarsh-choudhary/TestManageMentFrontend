import React, { useState, useEffect } from "react"
import { User, Plus, Shield, Users, UserCog } from "lucide-react"
import InviteModal from "./InviteModal"
import { getUsers, updateUserRole } from "../../api/user"

export default function UserContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        const response = await getUsers();
        // Ensure we have an array of users
        if (Array.isArray(response)) {
          setUsers(response);
          // Set current user's role from the response
          const currentUser = response.find(user => user._id === localStorage.getItem('userId'));
          if (currentUser) {
            setCurrentUserRole(currentUser.role.toLowerCase());
          }
        } else if (response && Array.isArray(response.data)) {
          setUsers(response.data);
          // Set current user's role from the response
          const currentUser = response.data.find(user => user._id === localStorage.getItem('userId'));
          if (currentUser) {
            setCurrentUserRole(currentUser.role.toLowerCase());
          }
        } else {
          console.error('Unexpected API response format:', response);
          setUsers([]);
          setError('Invalid data format received from server');
        }
        setError(null);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message);
        setUsers([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleInvite = (email, role) => {
    // Handle invite logic here
    console.log("Sending invite to:", email, "with role:", role);
    setIsModalOpen(false);
  };

  const handleRoleChange = async (userId, newRole, currentRole) => {
    try {
      // Check permissions
      if (currentUserRole === 'ADMIN') {
        // Admin can change HR and USER roles
        if (currentRole.toLowerCase() === 'ADMIN') {
          setError("Admins cannot change other ADMIN roles");
          return;
        }
      } else if (currentUserRole === 'HR') {
        // HR can only change USER roles
        if (currentRole.toLowerCase() !== 'USER') {
          setError("HR can only change user roles");
          return;
        }
      } else {
        setError("You don't have permission to change roles");
        return;
      }

      await updateUserRole(userId, newRole);
      // Refresh users list
      const response = await getUsers();
      if (Array.isArray(response)) {
        setUsers(response);
      } else if (response && Array.isArray(response.data)) {
        setUsers(response.data);
      }
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>Error: {error}</p>
      </div>
    );
  }

  // Ensure users is an array before reducing
  if (!Array.isArray(users)) {
    console.error('Users is not an array:', users);
    return (
      <div className="text-center text-red-600 p-4">
        <p>Error: Invalid data format</p>
      </div>
    );
  }

  // Group users by role
  const groupedUsers = users.reduce((acc, user) => {
    const role = (user.role || 'USER').toLowerCase(); // Convert role to lowercase
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(user);
    return acc;
  }, {
    admin: [],
    hr: [],
    user: []
  });

  // Check if all role groups are empty
  const isAllGroupsEmpty = Object.values(groupedUsers).every(group => group.length === 0);

  const renderUserCard = (user) => {
    
    const canChangeRole = (currentUserRole === 'ADMIN' && user.role.toLowerCase() !== 'ADMIN') ||
                         (currentUserRole === 'HR' && user.role.toLowerCase() === 'USER');

    return (
      <div key={user._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <User className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-900">
              {user.firstName === "Pending" && user.lastName === "Registration" 
                ? "Pending Registration" 
                : `${user.firstName} ${user.lastName}`}
            </p>
            <p className="text-sm text-gray-500">{user.email}</p>
            {!user.isActive && (
              <span className="text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                Pending
              </span>
            )}
          </div>
        </div>
        {canChangeRole && (
          <select
            value={user.role}
            onChange={(e) => handleRoleChange(user._id, e.target.value, user.role)}
            className="px-2 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="USER">User</option>
            {currentUserRole === 'ADMIN' && <option value="HR">HR</option>}
            {currentUserRole === 'ADMIN' && <option value="ADMIN">Admin</option>}
          </select>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with Invite Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Users</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Send Invite</span>
        </button>
      </div>

      {isAllGroupsEmpty ? (
        <div className="text-center py-8 text-gray-500">
          No data found
        </div>
      ) : (
        /* Users List */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Admins */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-900">Admins</h3>
            </div>
            <div className="space-y-3">
              {groupedUsers.admin?.length > 0 ? (
                groupedUsers.admin?.map(renderUserCard)
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No data found
                </div>
              )}
            </div>
          </div>

          {/* HR */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center space-x-2 mb-4">
              <UserCog className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-gray-900">HR</h3>
            </div>
            <div className="space-y-3">
              {groupedUsers.hr?.length > 0 ? (
                groupedUsers.hr?.map(renderUserCard)
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No data found
                </div>
              )}
            </div>
          </div>

          {/* Regular Users */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="h-5 w-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-900">Users</h3>
            </div>
            <div className="space-y-3">
              {groupedUsers.user?.length > 0 ? (
                groupedUsers.user?.map(renderUserCard)
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No data found
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      <InviteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onInvite={handleInvite}
      />
    </div>
  )
} 