const app = Vue.createApp({
    data() {
        return{
            product: 'Socks',
            image: './assets/images/socks_green.jpg',
            inventory: 10,
            onSale: true,
            url: 'https://www.example.com/product/socks'
        }
    }

})
