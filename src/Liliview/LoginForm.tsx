import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { login, register } from "../requests";
import { User } from "../types";

interface SubmitEvent extends Event {
    readonly submitter: HTMLElement;
}

interface LoginFormProps {
    setUser: (user: User) => void;
}

const LoginForm = (props: LoginFormProps) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // TODO: remove this in favour of a separate form for registering
        // SubmitEvent isn't standard yet
        const submitterName = (
            (e.nativeEvent as SubmitEvent)?.submitter as HTMLButtonElement
        )?.name;
        if (submitterName === "registerButton") {
            handleRegister();
        } else {
            handleLogin();
        }
    };

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
        return false;
    };

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
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col xs={4} className="align-middle">
                    <h1>welcome to lili</h1>
                    <p className="text-danger">{errorMessage}</p>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group
                            className="mb-3"
                            controlId="formBasicUsername"
                        >
                            <Form.Label>username</Form.Label>
                            <Form.Control
                                className="text-light"
                                placeholder="username"
                                type="text"
                                value={username}
                                required
                                maxLength={30}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group
                            className="mb-3"
                            controlId="formBasicPassword"
                        >
                            <Form.Label>password</Form.Label>
                            <Form.Control
                                className="text-light"
                                placeholder="password"
                                type="password"
                                value={password}
                                required
                                maxLength={30}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={loading}
                            name="loginButton"
                        >
                            login
                        </Button>{" "}
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={loading}
                            name="registerButton"
                        >
                            register
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginForm;
