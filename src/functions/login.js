import axios from 'axios';

export const login = async (formData) => {
    const BASE_API=import.meta.env.BASE_API
    try {
        const response = await axios.post(`${BASE_API}/auth/login`, 
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
        localStorage.setItem('authTokens', JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.error('Login failed:', error);
        
        if (error.response && error.response.data) {
            throw error.response.data;
        }
        throw error;
    }
}


