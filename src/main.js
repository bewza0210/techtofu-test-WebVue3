import { createApp } from 'vue'
import App from './App.vue'

import 'vuetify/styles'
import 'font-awesome/css/font-awesome.min.css'
import { createVuetify } from 'vuetify'
import { aliases, fa } from 'vuetify/iconsets/fa4'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'fa',
        aliases,
        sets: {
          fa,
        },
    },
})

createApp(App).use(vuetify).mount('#app')