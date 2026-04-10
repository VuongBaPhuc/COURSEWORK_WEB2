app.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template:
    /*html*/
    `<div class="product-details">
        <ul>
            <li v-for="(detail, index) in details" :key="index">{{ detail }}</li>
        </ul>
    </div>`
})
