app.component('product-display', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template:
    /*html*/
    `<div class="product-display">
       <div class="product-container">
           <div class="product-image">
            <img :src="image" :class="{ 'out-of-stock-img': !inStock }">
          </div>
            <div class="product-info">
              <h1>{{ title }}</h1>
              <p v-if="inStock > 10"> In Stock </p>
              <p v-else-if="inStock <= 10 && inStock > 0"> Almost sold out! </p>
              <p v-else> Out of Stock</p>
              <p>Shipping: {{ shipping }}</p>
              <p> New {{ product }} have arrived with 2 diffrent color</p>
              <product-details :details="details"></product-details>
              <div v-for="(variant, index) in variants" 
                   :key="variant.id" 
                   @mouseover="updateVariant(index)"
                   class="color-circle"
                   :style="{ backgroundColor: variant.color }"> </div>
              <button
                 class="button" 
                 :class="{disabledButton: !inStock }"
                 :disabled="!inStock"
                 @click="addToCart">
                 Add to Cart
              </button>
            </div>
         </div>
       </div>
    </div>`,
    data(){
        return{
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
            this.$emit('add-to-cart')
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
        shipping() {
            if (this.premium) {
                return 'Free'
            }
            return 2.99
        }
    }
})