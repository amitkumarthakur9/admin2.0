import { jwtDecode } from "jwt-decode";
import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    ReactNode,
} from "react";

interface UserRoleContextType {
    roleId: number | null;
    userId: number | null;
}

const UserRoleContext = createContext<UserRoleContextType | undefined>(
    undefined
);

interface UserRoleProviderProps {
    children: ReactNode;
}

export const UserRoleProvider: React.FC<UserRoleProviderProps> = ({
    children,
}) => {
    const [roleId, setRoleId] = useState<number | null>(null);
    const [userId, setUserId] = useState<number | null>(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) {
            const decoded: any = jwtDecode(token);
            console.log("decoded", decoded)
            setRoleId(decoded.roleId);
            setUserId(decoded._id);
        }
    }, []);

    return (
        <UserRoleContext.Provider value={{ roleId,userId  }}>
            {children}
        </UserRoleContext.Provider>
    );
};

export const useUserRole = () => {
    const context = useContext(UserRoleContext);
    if (!context) {
        throw new Error("useUserRole must be used within a UserRoleProvider");
    }
    return context;
};
