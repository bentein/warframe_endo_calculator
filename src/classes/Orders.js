import DAO from "./DAO";

class Orders {
    constructor(name, platform) {
        this.name = name;
        this.platform = platform;
        this.dao = new DAO();
    }

    getOrders(callback) {
        this.dao.getItemOrders(this.name)
        .then(callback)
        .catch((err)=> {
            console.log(err);
        });
    }
}

export default Orders;