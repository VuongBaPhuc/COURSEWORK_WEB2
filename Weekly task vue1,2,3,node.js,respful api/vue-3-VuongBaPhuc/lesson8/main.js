const app = Vue.createApp({
    data() {
        return{
            cart: 0,
            product: 'Socks',
            brand: 'Vue Mastery',
            selectedvariant: 0,
            onSale: true,
            inventory: 10,
            details: ['50% cotton', '20% polyester ', '30% wool'],
            variants: [
                { id: 2234, color: 'green', image: './assets/images/socks_green.jpg',quantity: 50 },
                { id: 2235, color: 'blue', image: './assets/images/socks_blue.jpg', quantity: 0 }
            ]
        }
    },
    
    methods: {
        addToCart() {
            this.cart += 1
        },
        updateVariant(index) {
            this.selectedvariant = index
        }
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product
        },
        image() {
            return this.variants[this.selectedvariant].image
        },
        inStock() {
            return this.variants[this.selectedvariant].quantity
        },
        saleMessage() {
            return this.onSale ? this.brand + ' ' + this.product + ' is on sale' : ''
        }
}})
