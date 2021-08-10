import Editor from "@monaco-editor/react";
import { useState, useEffect } from "react";
import { Button, Col, Container, ListGroup, Row } from "react-bootstrap";
import { loadLilipads, deleteLilipad, createLilipad, loadLilipad, updateLilipad } from "../requests";
import { Lilipad, LilipadInfo, User } from "../types";

interface LilipadListProps {
    user: User;
    logout: () => void;
}

const LilipadList = (props: LilipadListProps) => {
    const [lilipads, setLilipads] = useState<LilipadInfo[]>([]);
    const [selectedLilipad, setSelectedLilipad] = useState<LilipadInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [editingLilipad, setEditingLilipad] = useState<Lilipad | null>(null);
    const [text, setText] = useState("");

    useEffect(() => {
        async function request() {
            setLilipads(await loadLilipads());
        }

        request();
    }, []);

    useEffect(() => {
        async function request() {
            if (selectedLilipad !== null) {
                setLoading(true);
                setEditingLilipad(null);
                const lilipad = await loadLilipad(selectedLilipad.id);
                setLoading(false);
                setEditingLilipad(lilipad);
                if (lilipad !== null) {
                    setText(lilipad.text);
                }
            }
        }

        request();
    }, [selectedLilipad]);

    const handleDeleteLilipad = async (lilipad: LilipadInfo) => {
        if (window.confirm("Are you sure you want to delete this lilipad?")) {
            const success = await deleteLilipad(lilipad);
            if (success) {
                setLilipads(lilipads.filter(l => l.id !== lilipad.id));
                if (selectedLilipad?.id === lilipad.id) {
                    setSelectedLilipad(null);
                    setEditingLilipad(null);
                }
            }
        }
    }

    const handleNewLilipad = () => {
        async function request() {
            const lilipad = await createLilipad(prompt("lilipad name") || "lilipad");
            if (lilipad !== null) {
                setLilipads([
                    ...lilipads,
                    lilipad
                ]);
                setSelectedLilipad(lilipad);
            }
        }

        request();
    }

    const handleSaveLilipad = async () => {
        setEditingLilipad(await updateLilipad({
            ...editingLilipad as Lilipad,
            text
        }));
    }

    const handleEditorChange = (value: string | undefined) => {
        if (value !== undefined) {
            setText(value);
        }
    }

    return (
        <Container fluid>
            <Row className="vh-100">
                <Col xs={2} className="g-0 d-flex flex-column justify-content-between">
                    <div>
                        <h3 className="m-3">lilipads</h3>
                        <ListGroup className="mt-3" variant="flush">
                            {lilipads.map(lilipad => (
                                <ListGroup.Item active={lilipad.id === selectedLilipad?.id} key={lilipad.id} action as="button" onClick={() => setSelectedLilipad(lilipad)}>
                                    {lilipad.name}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                        <div className="m-3 d-flex justify-content-evenly">
                            <Button variant="info" onClick={handleNewLilipad}>new lilipad</Button>
                            {selectedLilipad !== null && (
                                <>
                                    <Button onClick={handleSaveLilipad}>save</Button>
                                    <Button variant="danger" onClick={() => handleDeleteLilipad(selectedLilipad)}>delete</Button>
                                </>
                            )}
                        </div>
                    </div>

                    <Row className="m-3 align-items-center text-center justify-content-evenly">
                        <Col xs="auto">
                            logged in as <strong>{props.user.username}</strong>
                        </Col>
                        <Col xs="auto">
                            <Button variant="secondary" onClick={props.logout}>logout</Button>
                        </Col>
                    </Row>
                </Col>
                <Col xs={10} className="g-0 overflow-hidden">
                    {loading && (
                        <h3 className="m-5">Loading...</h3>
                    )}
                    {editingLilipad !== null && (
                        <Editor
                            height="100vh"
                            theme="vs-dark"
                            defaultLanguage="markdown"
                            defaultValue={text}
                            onChange={handleEditorChange}
                        />
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default LilipadList;