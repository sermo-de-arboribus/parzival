const Vue = require("vue");

const VueLazyload = require("vue-lazyload");
const { focus } = require("vue-focus");

const Vuex = require("vuex");
const { mapGetters } = Vuex;

const VueRouter = require("vue-router");
const { sync } = require("vuex-router-sync");

const MQ = require("vue-match-media");

Vue.use(VueLazyload);
Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(MQ);

Vue.directive("focus", focus);

const store = require("./store");
const router = require("./router");

sync(store, router);

window.parzivalApp = new Vue({
    name: "parzival",

    el: document.querySelector(".parzival-app"),
    template: require("./index.pug")(),

    store, router,

    computed: mapGetters(["title"]),

    mq: {
        mobile: "(max-width: 768px)",
        tablet: "(min-width: 769px)",
        touch: "(max-width: 1087px)",
        desktop: "(min-width: 1088px)",
        widescreen: "(min-width: 1280px)",
        fullhd: "(min-width: 1472px)"
    },

    watch: {
        title() {
            this.updateTitle();
        }
    },

    mounted() {
        this.updateTitle();
    },

    methods: {
        updateTitle() {
            document.title = this.title;
        }
    }
});
