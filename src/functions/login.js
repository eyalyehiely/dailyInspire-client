import axios from 'axios';

export const login = async (formData) => {
    try {
        const response = await axios.post('http://localhost:3000/api/auth/login', 
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


