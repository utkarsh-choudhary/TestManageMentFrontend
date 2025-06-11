import apiInstance from "../axiosInstance/axiosInstance";

export const register = async (data) => {

    try {
        const response = await apiInstance.post('/api/users/register', data, {
            headers: {
                'Content-Type': 'application/json',
                
            }
        });
        return response;
    } catch (error) {
        console.log(error);
        if (error.response) {
            throw new Error(error.response.data.message || 'Registration failed.');
        } else {
            throw new Error('An error occurred during registration. Please try again.');
        }
    }
}

export const login=async(data)=>{
    try {
        const response = await apiInstance.post('/api/auth/login', data,{
            headers: {
                'Content-Type': 'application/json',
              }
        });
        return response;
    } catch (error) {  
        if (error.response) {
            throw new Error(error.response.data.message || 'Login failed.');
        } else {
            throw new Error('An error occurred during login. Please try again.');
        }
    }
}

export const inviteUser = async (data) => {
    try {
        const response = await apiInstance.post('/api/users/invite', data, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'User invitation failed.');
        } else {
            throw new Error('An error occurred while inviting the user. Please try again.');
        }
    }
}

export const getUsers = async () => {
    try {
        const response = await apiInstance.get('/api/users', {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to fetch users.');
        } else {
            throw new Error('An error occurred while fetching users. Please try again.');
        }
    }
}

export const updateUserRole = async (userId, newRole) => {
    try {
        const response = await apiInstance.patch(`/api/users/${userId}/role`, { role: newRole }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Failed to update user role.');
        } else {
            throw new Error('An error occurred while updating user role. Please try again.');
        }
    }
}


