export default class Room {

    get STATUS_WAITING_FOR_PLAYERS() {
        return 1;
    }

    get STATUS_IN_PROGRESS() {
        return 2;
    }

    get STATUS_FINISHED() {
        return 3;
    }

    name;
    password;
    status;
    max_players;
    board;
    owner;
    users;

    constructor() {

    }

}