const $ = require("jquery");

const { mapGetters } = require("vuex");

module.exports = {
    template: require("./navbar.pug")(),

    computed: mapGetters("metadata", ["sigil", "title"]),

    created() {
        this.$html = $("html").addClass("has-navbar-fixed-top");
    },

    destroyed() {
        this.$html.removeClass("has-navbar-fixed-top");
    },

    mounted() {
        const $el = $(this.$el);
        this.$burger = $el.find(".navbar-burger");
        this.$menu = $el.find(".navbar-menu");
        this.menuToggle = () => {
            this.$burger.toggleClass("is-active");
            this.$menu.toggleClass("is-active");
        };

        this.$burger.on("click", this.menuToggle);
    },

    beforeDestroy() {
        this.$burger.off("click", this.menuToggle);
    }
};