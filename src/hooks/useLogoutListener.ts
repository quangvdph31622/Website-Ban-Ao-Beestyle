import { useEffect } from "react";

const useLogoutListener = () => {

    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === "loggedOut") {
                window.location.href = '/admin-account';
            } else if (e.key === "loggedOutUser") {
                window.location.href = '/';
            }
        };
        window.addEventListener("storage", handleStorageChange);
        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);
};

export default useLogoutListener;
