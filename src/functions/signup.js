export const signup = async (formData, setIsSuccess, setIsSubmitting) => {
    const VITE_BASE_API = import.meta.env.VITE_BASE_API || 'http://localhost:3000/api';
    try {
        // First validate again on client side
        if (!formData.first_name || !formData.last_name || !formData.email || 
            !formData.password || !formData.confirmPassword || !formData.preferredTime || formData.timeZone) {
            throw new Error("All fields are required");
        }
        
        if (formData.password !== formData.confirmPassword) {
            throw new Error("Passwords do not match");
        }
        
        if (formData.password.length < 6) {
            throw new Error("Password must be at least 6 characters");
        }
        
        // Prepare the data for your API - sending first_name and last_name separately
        const userData = {
            first_name: formData.first_name,
            last_name: formData.last_name,
            email: formData.email,
            password: formData.password,
            preferredTime: formData.preferredTime,
            timeZone: formData.timeZone
        };

        // Make the API call to your backend
        const response = await fetch(`${VITE_BASE_API}/quotes/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || "Signup failed. Please try again.");
        }
        
        // If successful
        setIsSuccess(true);
        localStorage.setItem('user', JSON.stringify(data.user));
        
    } catch (error) {
        console.error("Signup error:", error);
        throw error; // Re-throw to be handled by the component
    } finally {
        setIsSubmitting(false);
    }
};

