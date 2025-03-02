import axios from 'axios';

export const signup = async (formData, setIsSuccess, setIsSubmitting) => {
    try {
        // First validate again on client side
        if (!formData.full_name || !formData.email || !formData.password || !formData.confirmPassword) {
            throw new Error("All fields are required");
        }
        
        if (formData.password !== formData.confirmPassword) {
            throw new Error("Passwords do not match");
        }
        
        if (formData.password.length < 6) {
            throw new Error("Password must be at least 6 characters");
        }
        
        // Prepare the data for your API
        const userData = {
            full_name: formData.full_name,
            email: formData.email,
            password: formData.password,
            notificationTime: formData.notificationTime,
            timeZone: formData.timeZone
        };

    // Make the API call to your backend
    const response = await fetch("http://localhost:3000/api/quotes/signup", {
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

