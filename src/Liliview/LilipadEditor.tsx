import { useState, useEffect } from "react";
import { loadLilipad, updateLilipad } from "../requests";
import { LilipadInfo, Lilipad } from "../types";

interface LilipadEditorProps {
    lilipadId: number;
    deleteLilipad: (lilipad: LilipadInfo) => void;
}

function LilipadEditor(props: LilipadEditorProps) {
    const [loading, setLoading] = useState(true);
    const [lilipad, setLilipad] = useState<Lilipad | null>(null);
    const [text, setText] = useState("");

    useEffect(() => {
        async function request() {
            setLoading(true);
            setLilipad(null);
            const pad = await loadLilipad(props.lilipadId);
            setLilipad(pad);
            if (pad !== null) {
                setText(pad.text);
            }
            setLoading(false);
        }

        request();
    }, [props.lilipadId]);

    const handleSaveLilipad = async () => {
        setLilipad(await updateLilipad({
            ...lilipad as Lilipad,
            text
        }));
    }

    return (
        <>
            {loading && (
                <div>Loading...</div>
            )}
            {lilipad !== null && (
                <>
                    <h4>{lilipad.name}</h4>
                    <textarea value={text} onChange={e => setText(e.target.value)} />
                    <button onClick={handleSaveLilipad}>save</button>
                    <button onClick={() => props.deleteLilipad(lilipad)}>delete</button>
                </>
            )}
        </>
    );
}

export default LilipadEditor;
