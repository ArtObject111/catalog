import axios from "axios";
import md5   from "md5";

let setZero = (digit) => {
    return digit < 10 ? `0` + digit : digit
}

let date       = new Date()
const today    = `${date.getUTCFullYear()}${setZero(date.getUTCMonth()+1)}${setZero(date.getUTCDate())}`
const password = "Valantis"
const xAuth    = `${password}_${today}`
// console.log(xAuth)

// console.log("xAuth: " + xAuth)

const instance = axios.create({
    baseURL: `https://api.valantis.store:41000/`,
    headers: {
        "X-Auth": md5(xAuth)
    }
});

export const goodsAPI = {
    // getGoods (action = "get_ids", offset = 10, limit = 3) {
    //     return instance.post(``, {
    //         action,
    //         params: {offset, limit}
    //     })
    // }
    // {
    //     "result": [
    //         "18e4e3bd-5e60-4348-8c92-4f61c676be1f",
    //         "711837ec-57f6-4145-b17f-c74c2896bafe",
    //         "6c972a4a-5b91-4a98-9780-3a19a7f41560"
    //     ]
    // }
    // getGoods (action = "get_items", offset = 10, limit = 3) {
    //     return instance.post(``, {
    //         action,
    //         params: {ids: [
    //             "18e4e3bd-5e60-4348-8c92-4f61c676be1f",
    //             "711837ec-57f6-4145-b17f-c74c2896bafe",
    //             "6c972a4a-5b91-4a98-9780-3a19a7f41560"
    //         ]}
    //     })
    // }
    // {
    //     "result": [
    //         {
    //             "brand": "Jacob & Co",
    //             "id": "18e4e3bd-5e60-4348-8c92-4f61c676be1f",
    //             "price": 52400.0,
    //             "product": "\u0417\u043e\u043b\u043e\u0442\u043e\u0435 \u043a\u043e\u043b\u044c\u0446\u043e \u0441 \u0431\u0440\u0438\u043b\u043b\u0438\u0430\u043d\u0442\u043e\u043c"
    //         },
    //         {
    //             "brand": null,
    //             "id": "711837ec-57f6-4145-b17f-c74c2896bafe",
    //             "price": 4500.0,
    //             "product": "\u0417\u043e\u043b\u043e\u0442\u043e\u0435 \u043a\u043e\u043b\u044c\u0446\u043e \u0441 \u0431\u0440\u0438\u043b\u043b\u0438\u0430\u043d\u0442\u0430\u043c\u0438"
    //         },
    //         {
    //             "brand": null,
    //             "id": "6c972a4a-5b91-4a98-9780-3a19a7f41560",
    //             "price": 55000.0,
    //             "product": "\u0417\u043e\u043b\u043e\u0442\u043e\u0439 \u0431\u0440\u0430\u0441\u043b\u0435\u0442 \u0441 \u0431\u0440\u0438\u043b\u043b\u0438\u0430\u043d\u0442\u0430\u043c\u0438 \u0438 \u0430\u043c\u0435\u0442\u0438\u0441\u0442\u0430\u043c\u0438"
    //         }
    //     ]
    // }
    // выводит упорядоченные поля товаров field: product, price, brand
    // getGoods (action = "get_items", offset = 10, limit = 3) {
    //     return instance.post(``, {
    //         "action": "get_fields",
    //         "params": {"field": "price", "offset": 0, "limit": 10}
    //     })
    // }
    // {
    //     "result": [
    //         16700.0,
    //         12500.0,
    //         8500.0,
    //         26600.0,
    //         34440.0,
    //         23363.0,
    //         159800.0,
    //         74600.0,
    //         63000.0,
    //         90000.0
    //     ]
    // }

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