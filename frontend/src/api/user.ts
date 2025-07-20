import { backend } from "../lib/axios";

export const userSignUp = async (email: string, password: string, fullname: string, username: string) => {

    try {
        const body = {
            fullname, username, password, email
        }
        const response = await backend.post("/user/signup", body);

        if (response.status !== 201) {
            console.log("Error signing up user:", response.status);
            return null;
        }

        return response.data;

    } catch (err) {
        console.error("Error signing up user:", err);
        return null;
    }
}

export const userSignIn = async (email: string, password: string) => {
    try {
        const body = {
            email, password
        }
        const response = await backend.post("/user/signin", body);

        if (response.status !== 200) {
            console.log("Error signing in user:", response.status);
            return null;
        }

        return {
            message: "User signed in successfully",
            data: response.data
        }

    } catch (err) {
        console.error("Error signing in user:", err);
        return null;
    }
}