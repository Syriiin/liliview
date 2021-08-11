import { useEffect, useState } from "react";
import { loadMe } from "../requests";
import { User } from "../types";
import LilipadList from "./LilipadList";
import LoginForm from "./LoginForm";

const Liliview = () => {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        async function request() {
            setUser(await loadMe());
        }

        request();
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("liliToken");
        setUser(null);
    };

    return (
        <div className="liliview-container">
            {user !== null ? (
                <LilipadList user={user} logout={handleLogout} />
            ) : (
                <LoginForm setUser={setUser} />
            )}
        </div>
    );
};

export default Liliview;
