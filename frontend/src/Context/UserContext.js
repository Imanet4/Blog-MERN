import { createContext, useContext, useEffect, useState } from "react";
import axios from 'axios';
import { useCookies} from 'react-cookie';

const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [cookies, setCookie, removeCookie] = useCookies(['token']);




        useEffect(() => {
        const fetchUser = async () => {
            try {
                if (cookies.token) {
                    const res = await axios.get('http://localhost:5000/auth/me', { 
                        headers: {
                            Authorization: `Bearer ${cookies.token}`
                        }
                    });
                    setUser(res.data.user);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Error fetching user:", error);
                setUser(null);
            }
        };
        fetchUser();
    }, [cookies.token]);

    const value = {
        user,
        setUser,
        cookies,
        setCookie,
        removeCookie
    };

    return <UserData.Provider value={value}>{children}</UserData.Provider>;

};

const useUser = () => {
    const context = useContext(UserData);
    if (!context) {
        throw new Error ('useUser must be used within a UserProvider');
    }
    return context
}



export { UserProvider, useUser};