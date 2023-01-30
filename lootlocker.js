class LootLocker {
    static #GAME_APIKEY = "//**//";
    static #GAME_VERSION = "0.1.0.0";


    static saveInfo(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }
    static getInfo(key, parse=true, null_response=null) {
        let _value = localStorage.getItem(key);
        return _value? parse? JSON.parse(_value): _value: null_response;
    }
    static clearInfo(key) {
        localStorage.removeItem(key);
    }


    static async fetchHelp(url, body, header_extra={}, method="POST") {
        let _headers = header_extra;
        _headers["Content-Type"] = "application/json";
        console.log(_headers);
        return fetch(url, {
            body: JSON.stringify(body),
            method: method,
            headers: _headers
        }).then((response) => response.json());
    }

    static authGuest(name) {
        LootLocker.fetchHelp("https://api.lootlocker.io/game/v2/session/guest", {
            'game_key': this.#GAME_APIKEY,
            'game_version': this.#GAME_VERSION,
            'player_identifier': LootLocker.getInfo("player_identifier")
        }).then((data) => {
            console.log(data);

            // Saving info for future functionalities
            LootLocker.saveInfo("player_identifier", data.player_identifier);
            
            //LootLocker.saveInfo("session_token", data.session_token);
            LootLocker.session_token = data.session_token;
            
            // TODO
            // if(!data.player_name) {
            //     LootLocker.setPlayerName(name);
            // }
        });
    }

    // TODO
    static setPlayerName(name) {
        LootLocker.fetchHelp("https://api.lootlocker.io/game/player/name",
        { 'name': name }, {
        'x-session_token': LootLocker.session_token,
        'LL-Version': "2021-03-01"
        }, "PATCH");
    }

    static newRoom(name) {

    }

    static getAllRooms() {

    }

    static findRoom(UID, name) {

    }
}