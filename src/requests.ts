import ky from "ky";
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
        localStorage.setItem("liliToken", data.token)
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
        localStorage.setItem("liliToken", data.token)
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
        return [];
    }
}

export async function createLilipad(name: string): Promise<Lilipad | null> {
    try {
        return await http.post("lilipads", {
            json: {
                name
            }
        }).json<Lilipad>();
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function loadLilipad(id: number): Promise<Lilipad | null> {
    try {
        return await http.get(`lilipads/${id}`).json<Lilipad>();
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function updateLilipad(lilipad: Lilipad): Promise<Lilipad | null> {
    try {
        return await http.put(`lilipads/${lilipad.id}`, {
            json: {
                name: lilipad.name,
                text: lilipad.text
            }
        }).json<Lilipad>();
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function deleteLilipad(lilipad: LilipadInfo): Promise<boolean> {
    try {
        await http.delete(`lilipads/${lilipad.id}`);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
