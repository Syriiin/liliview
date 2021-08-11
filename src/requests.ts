import ky from "ky";
import { toast } from "react-toastify";
import { Lilipad, LilipadInfo, User } from "./types";

const http = ky.create({
    prefixUrl: "/api",
    hooks: {
        beforeRequest: [
            request => {
                const token = localStorage.getItem("liliToken");
                if (token !== null) {
                    request.headers.set("Authorization", `Bearer ${token}`);
                }
            }
        ]
    }
});

export async function register(username: string, password: string): Promise<User | null> {
    try {
        const data: { token: string } = await http.post("register", {
            json: {
                username,
                password
            }
        }).json();
        localStorage.setItem("liliToken", data.token);
        return await loadMe();
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function login(username: string, password: string): Promise<User | null> {
    try {
        const data: { token: string } = await http.post("login", {
            json: {
                username,
                password
            }
        }).json();
        localStorage.setItem("liliToken", data.token);
        return await loadMe();
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function loadMe(): Promise<User | null> {
    try {
        return await http.get("me").json<User>();
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function loadLilipads(): Promise<LilipadInfo[]> {
    try {
        return await http.get("lilipads").json<LilipadInfo[]>();
    } catch (error) {
        console.log(error);
        toast.error("failed to load lilipads...", {
            autoClose: 5000
        });
        return [];
    }
}

export async function createLilipad(name: string): Promise<Lilipad | null> {
    try {
        const lilipad = await http.post("lilipads", {
            json: {
                name
            }
        }).json<Lilipad>();
        toast.success("lilipad created");
        return lilipad;
    } catch (error) {
        console.log(error);
        toast.error("failed to create lilipad...", {
            autoClose: 5000
        });
        return null;
    }
}

export async function loadLilipad(id: number): Promise<Lilipad | null> {
    try {
        return await http.get(`lilipads/${id}`).json<Lilipad>();
    } catch (error) {
        console.log(error);
        toast.error("failed to load lilipad...", {
            autoClose: 5000
        });
        return null;
    }
}

export async function updateLilipad(lilipad: Lilipad): Promise<Lilipad | null> {
    try {
        const updatedLilipad = await http.put(`lilipads/${lilipad.id}`, {
            json: {
                name: lilipad.name,
                text: lilipad.text
            }
        }).json<Lilipad>();
        toast.info("lilipad saved");
        return updatedLilipad;
    } catch (error) {
        console.log(error);
        toast.error("failed to save lilipad...", {
            autoClose: 5000
        });
        return null;
    }
}

export async function deleteLilipad(lilipad: LilipadInfo): Promise<boolean> {
    try {
        await http.delete(`lilipads/${lilipad.id}`);
        toast.info("lilipad deleted");
        return true;
    } catch (error) {
        console.log(error);
        toast.error("failed to delete lilipad...", {
            autoClose: 5000
        });
        return false;
    }
}
