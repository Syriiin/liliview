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
    }

    return (
        <div>
            <h1>welcome to lili</h1>
            {user !== null ? (
                <>
                    <h3>logged in as {user.username}</h3>
                    <button onClick={handleLogout}>logout</button>
                    <LilipadList />
                </>
            ) : (
                <>
                    <LoginForm setUser={setUser} />
                </>
            )}
        </div>
    );
}

export default Liliview;
