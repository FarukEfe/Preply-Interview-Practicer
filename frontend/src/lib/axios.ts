import axios from "axios";

export const backend = axios.create({
    baseURL: "http//localhost:5001/api",
    withCredentials: true,
})

// export const jobsapi = axios.create({
//     baseURL: ""
// })