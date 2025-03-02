export const logout = async () => {
    try {
        const response = await axios.post('http://localhost:3000/api/auth/logout');
        return response.data;
    } catch (error) {
        console.error('Logout failed:', error);
        throw error;
    }
}