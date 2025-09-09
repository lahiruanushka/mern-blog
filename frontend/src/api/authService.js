export const signout = async () => {
    try {
        const res = await fetch("/api/auth/signout", {
            method: "POST",
        });
        const data = await res.json();
        if (!res.ok) {
            console.log(data.message);
            return data;
        } 
        return data;
    } catch (error) {
        console.log(error.message);
        return error;
    }    
};
