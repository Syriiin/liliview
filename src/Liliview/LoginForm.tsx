import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
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

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const user = await login(username, password);
        setLoading(false);
        if (user !== null) {
            setErrorMessage("");
            props.setUser(user);
        } else {
            setErrorMessage("Credentials are incorrect");
        }
        return false;
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
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col xs={4} className="align-middle">
                    <h1>welcome to lili</h1>
                    <p className="text-danger">{errorMessage}</p>
                    <Form onSubmit={handleLogin}>
                        <Form.Group className="mb-3" controlId="formBasicUsername">
                            <Form.Label>username</Form.Label>
                            <Form.Control className="text-light" placeholder="username" type="text" value={username} onChange={e => setUsername(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>password</Form.Label>
                            <Form.Control className="text-light" placeholder="password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={loading}>
                            login
                        </Button>{' '}
                        <Button variant="primary" disabled={loading} onClick={handleRegister}>
                            register
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default LoginForm;
