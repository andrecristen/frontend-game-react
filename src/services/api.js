import axios from "axios";

export const URL_API = "http://129.148.45.90";
export const URL_WS = "ws://129.148.45.90";

export const api = axios.create({
    baseURL: URL_API,
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

export const listRoom = async () => {
    return api.get('/api/v1/room/')
        .then((result) => {
            return result;
        })
        .catch((error) => {
            return error.response;
        });
}

export const findRoom = async (id) => {
    return api.get('/api/v1/room/' + id + "/")
        .then((result) => {
            return result;
        })
        .catch((error) => {
            return error.response;
        });
}

export const createRoom = async (room) => {
    return api.post('/api/v1/room/', room)
        .then((result) => {
            return result;
        })
        .catch((error) => {
            return error.response;
        });
}

export const editRoom = async (room) => {
    return api.put('/api/v1/room/' + room.id + '/', room)
        .then((result) => {
            return result;
        })
        .catch((error) => {
            return error.response;
        });
}

export const addUserRoom = async (roomId, userId) => {
    return api.put('/api/v1/room/' + roomId + '/add_user/', {
        user: userId
    }).then((result) => {
        return result;
    }).catch((error) => {
        return error.response;
    });
}

export const removeUserRoom = async (roomId, userId) => {
    return api.put('/api/v1/room/' + roomId + '/remove_user/', {
        user: userId
    }).then((result) => {
        return result;
    }).catch((error) => {
        return error.response;
    });
}

export const usersRoom = async (room) => {
    return api.get('/api/v1/room/' + room.id + '/users/')
        .then((result) => {
            return result;
        })
        .catch((error) => {
            return error.response;
        });
}

export const getBoard = async (boardId) => {
    return api.get('/api/v1/board/' + boardId + '/')
        .then((result) => {
            return result;
        })
        .catch((error) => {
            return error.response;
        });
}

export const getBoardList = async () => {
    return api.get('/api/v1/board/')
        .then((result) => {
            return result;
        })
        .catch((error) => {
            return error.response;
        });
}

