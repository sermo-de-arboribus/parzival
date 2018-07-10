const debounce = require("lodash.debounce");

const { mapGetters, mapMutations } = require("vuex");

const OpenSeadragon = require("openseadragon");
const prefixUrl = "/openseadragon/images/";

const { dzi } = require("./images");

module.exports = {
    name: "facsimile-viewer",
    mixins: [require("./routing")],

    template: require("./facsimile-viewer.pug")(),

    computed: {
        ...mapGetters("facsimile", ["initialViewport"]),
        ...mapGetters("metadata", ["manuscript", "page", "quireIcon"]),

        quireIconPath() {
            const { quireIcon } = this;
            return quireIcon ? `/quire-icons/${quireIcon}.gif` : quireIcon;
        }
    },

    methods: {
        ...mapMutations("facsimile", ["viewportChange"]),

        openPages() {
            if (!this.osd) {
                return;
            }
            this.imageOpen = false;
            this.osd.close();

            const { manuscript, page } = this;
            const { sigil } = manuscript;

            let { length } = page;
            const width = 1 / length;

            const success = () => {
                if (--length == 0) {
                    this.imageOpen = true;
                    this.osd.viewport.fitBounds(
                        this.initialViewport,
                        true
                    );
                    this.updateViewport();
                }
            };

            page.forEach((page, pi) => {
                if (page !== undefined) {
                    this.osd.addTiledImage({
                        tileSource: dzi(sigil, page),
                        width,
                        x: (pi * width),
                        success
                    });
                }
            });
        },

        withOpenImage(fn) {
            const { osd, imageOpen } = this;
            return osd ? fn(osd, imageOpen) : false;
        },

        updateViewport() {
            this.withOpenImage(({ viewport }, imageOpen) => imageOpen ? this.viewportChange(
                { viewport: viewport.getConstrainedBounds() }
            ) : false);
        },

        zoomIn() {
            this.withOpenImage(({ viewport }) => viewport.zoomBy(2));
        },

        zoomOut() {
            this.withOpenImage(({ viewport }) => viewport.zoomBy(0.5));

        },

        rotate(degrees) {
            this.withOpenImage(
                ({ viewport }) => viewport.setRotation(viewport.getRotation() + degrees)
            );
        },

        rotateLeft() {
            this.rotate(-90);
        },

        rotateRight() {
            this.rotate(90);
        }

    },

    watch: {
        manuscript() {
            this.openPages();
        },

        page() {
            this.openPages();
        }
    },

    created() {
        this.imageOpen = false;
    },

    mounted() {
        const element = this.$el.querySelector(".parzival-facsimile");
        const osd = this.osd = OpenSeadragon({
            prefixUrl, element,
            showNavigator: true,
            showNavigationControl: false,
            showRotationControl: false,
            debugMode: false
        });

        osd.addHandler("viewport-change", debounce(
            this.updateViewport.bind(this), 250, { leading: true }
        ));

        this.openPages();
    },

    beforeDestroy() {
        if (this.osd) {
            this.osd.destroy();
        }
    }
};