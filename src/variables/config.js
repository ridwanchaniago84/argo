import axios from 'axios';

export const endPoint = 'https://e4d1-158-140-163-210.ngrok.io/';

export const setAuthToken = token => {
    if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        return;
    }

    delete axios.defaults.headers.common["Authorization"];
    return;
}

export const dataUser = () => new Promise((resolve) => {
    axios.get(`${endPoint}info`)
        .then(response => {
            const data = response.data.response;
            localStorage.setItem("userData", JSON.stringify(data));
            resolve();
        });
});

export const getUserData = () => {
    const dataStorage = localStorage.getItem("userData");
    return JSON.parse(dataStorage);
}

export const formatRupiah = (money) => {
    return new Intl.NumberFormat('id-ID',
        { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }
    ).format(money);
}
