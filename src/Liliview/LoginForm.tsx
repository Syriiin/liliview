import { useState } from "react";
import { login, register } from "../requests";
import { User } from "../types";

interface LoginFormProps {
    setUser: (user: User) => void;
}

const LoginForm = (props: LoginFormProps) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async () => {
        setLoading(true);
        const user = await login(username, password);
        setLoading(false);
        if (user !== null) {
            setErrorMessage("");
            props.setUser(user);
        } else {
            setErrorMessage("Credentials are incorrect");
        }
    }

    const handleRegister = async () => {
        setLoading(true);
        const user = await register(username, password);
        setLoading(false);
        if (user !== null) {
            setErrorMessage("");
            props.setUser(user);
        } else {
            setErrorMessage(`Username ${username} is not available`);
        }
    }

    return (
        <div>
            <p>{errorMessage}</p>
            <input placeholder="username" type="text" value={username} onChange={e => setUsername(e.target.value)} disabled={loading} />
            <input placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} disabled={loading} />
            <button onClick={handleLogin} disabled={loading}>login</button>
            <button onClick={handleRegister} disabled={loading}>register</button>
        </div>
    );
}

export default LoginForm;
