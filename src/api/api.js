import axios from "axios";
import md5   from "md5";

let setZero = (digit) => {
    return digit < 10 ? `0` + digit : digit
}

let date       = new Date()
const today    = `${date.getUTCFullYear()}${setZero(date.getUTCMonth()+1)}${setZero(date.getUTCDate())}`
const password = "Valantis"
const xAuth    = `${password}_${today}`

const instance = axios.create({
    baseURL: `https://api.valantis.store:41000/`,
    headers: {
        "X-Auth": md5(xAuth)
    }
});

export const goodsAPI = {
    findGoods (field, value) {
        return instance.post(``, {
            action: "filter",
            "params": { [field]: value }
        })
    },

    getIds (offset = 0, limit = 50) {
        offset = offset*limit - limit
        return instance.post(``, {
            action: "get_ids",
            params: {offset, limit: limit + 1}
        })
    },
    getParams (ids =[]) {
        return instance.post(``, {
            action: "get_items",
            params: {ids}
        })
    }
}