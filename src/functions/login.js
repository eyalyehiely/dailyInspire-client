import axios from 'axios';

export const login = async (formData) => {
    const VITE_BASE_API=import.meta.env.VITE_BASE_API
    try {
        const response = await axios.post(`${VITE_BASE_API}/auth/login`, 
            {
                email: formData.email,
                password: formData.password
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
        
        // Store the token directly with key 'authToken' to match ProtectedRoute.jsx
        localStorage.setItem('authToken', response.data.token);
        
        // Also store user data if needed
        localStorage.setItem('userData', JSON.stringify(response.data.user));
        
        return response.data;
    } catch (error) {
        console.error('Login failed:', error);
        
        if (error.response && error.response.data) {
            throw error.response.data;
        }
        throw error;
    }
}


