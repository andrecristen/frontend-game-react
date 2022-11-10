import axios from "axios";

export const api = axios.create({
    baseURL: "http://129.148.45.90",
});

export const auth = async (email, password) => {
    return api.post('/api/v1/auth/', { username: email, password })
        .then((result) => {
            return result;
        })
        .catch((error) => {
            return error.response;
        });
}

export const create = async (user) => {
    return api.post('/api/v1/user/', user)
        .then((result) => {
            return result;
        })
        .catch((error) => {
            return error.response;
        });
}