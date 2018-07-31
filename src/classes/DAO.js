import axios from 'axios';

class DAO {
    constructor() {
        this.url = "http://localhost:3000";
    }

    getItemOrders(name) {
        return axios.get(`${this.url}/${name}`);
    }
}

export default DAO;