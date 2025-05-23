export const signup = async (formData, setIsSuccess, setIsSubmitting) => {
    const VITE_BASE_API = import.meta.env.VITE_BASE_API || 'http://localhost:3000/api';
    try {
        // First validate again on client side
        if (!formData.first_name || !formData.last_name || !formData.email || 
            !formData.password || !formData.confirmPassword || !formData.preferredTime || !formData.timeZone) {
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
        if (setIsSuccess) {
            setIsSuccess(true);
        }
        
        // Store user data and token in localStorage
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Store the token without any prefix - the backend will handle the prefix
        if (data.token) {
            // Remove any existing 'Bearer ' prefix if present
            const cleanToken = data.token.replace('Bearer ', '');
            localStorage.setItem('authToken', cleanToken);
            console.log("Token stored successfully:", cleanToken.substring(0, 10) + "...");
            
            // Verify token was stored correctly
            const storedToken = localStorage.getItem('authToken');
            if (!storedToken) {
                throw new Error("Failed to store authentication token");
            }
            
            // Add a small delay to ensure token is stored
            await new Promise(resolve => setTimeout(resolve, 100));
        } else {
            throw new Error("No authentication token received from server");
        }
        
        // Return user data so we can pass it to the payment page
        return data.user;
        
    } catch (error) {
        console.error("Signup error:", error);
        // Clear any partially stored data
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        throw error; // Re-throw to be handled by the component
    } finally {
        if (setIsSubmitting) {
            setIsSubmitting(false);
        }
    }
};

