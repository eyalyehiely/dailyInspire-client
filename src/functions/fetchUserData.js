export const fetchUserData = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/auth/user');
        return response.data;
    } catch (error) {
        console.error('Fetch user data failed:', error);
        throw error;
    }
}