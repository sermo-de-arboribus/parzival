module.exports = {
    name: "facsimile",
    props: ["manuscript", "pages"],

    mixins: [require("./manuscript-location")],

    components: {
        Container: require("./container"),
        FacsimileViewer: require("./facsimile-viewer")
    },

    template: require("./facsimile.pug")()
};