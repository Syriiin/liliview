import { useState, useEffect } from "react";
import { loadLilipads, deleteLilipad, createLilipad } from "../requests";
import { LilipadInfo } from "../types";
import LilipadEditor from "./LilipadEditor";

const LilipadList = () => {
    const [lilipads, setLilipads] = useState<LilipadInfo[]>([]);
    const [selectedLilipad, setSelectedLilipad] = useState<LilipadInfo | null>(null);

    useEffect(() => {
        async function request() {
            setLilipads(await loadLilipads());
        }

        request();
    }, []);

    const handleDeleteLilipad = async (lilipad: LilipadInfo) => {
        const success = await deleteLilipad(lilipad);
        if (success) {
            setLilipads(lilipads.filter(l => l.id !== lilipad.id));
            if (selectedLilipad?.id === lilipad.id) {
                setSelectedLilipad(null);
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
    
    return (
        <>
            <div>
                <h3>lilipads</h3>
                <ul>
                    {lilipads.map(lilipad => (
                        <li key={lilipad.id}>
                            <button onClick={() => setSelectedLilipad(lilipad)}>{lilipad.name}</button>
                        </li>
                    ))}
                </ul>
                <button onClick={handleNewLilipad}>new lilipad</button>
            </div>
            {selectedLilipad !== null && (
                <LilipadEditor lilipadId={selectedLilipad.id} deleteLilipad={handleDeleteLilipad} />
            )}
        </>
    );
};

export default LilipadList;
