/**
 * Rectangle placement.
 * 
 * @author Jamie CHEN
 * @since March 8, 2018
 */
; (function ($) {
    function Rectangle(graph, opts) {
        if (opts && opts.gap && typeof opts.gap == 'number') {
            opts.gap = [opts.gap, opts.gap];
        }
        this.options = $.extend({}, defaults, opts);
        this.init(graph);
    };
    var defaults = {
        /**
         * distance between each column and row
         */
        gap: [50, 50],
        /**
         * maximum item-number in a row
         */
        colmax: 20
    };
    Rectangle.prototype = {
        constructor: Rectangle,
        type: 'rectangle',
        description: '',

        calculate: function () {
            var r = 0, c = 0,
                gx = this.options.gap[0], gy = this.options.gap[1],
                max = Math.min(this.options.colmax, Math.ceil(Math.sqrt(this.vertics.length)));
            for (var i in this.vertics) {
                var v = this.vertics[i];
                v.y = r * gx;
                v.x = c * gy;
                c += 1;
                if (c == max) {
                    c = 0;
                    r += 1;
                }
            }
            return {
                nodes: this.vertics,
                links: this.edges
            };
        },
        getOption: function (opt) {
            if (!opt) {
                return this.options;
            } else {
                return this.options[opt];
            }
        },
        setOption: function (opt) {
            this.options = $.extend({}, this.options.opt);
        },
        init: function (g) {
            g.nodes || (g.nodes = []);
            this.vertics = $.extend(true, [], g.nodes);
            this.edges = $.extend(true, [], g.links);
        }
    };
    window.Rectangle = function (graph, options) {
        // invoke the constructor
        return new Rectangle(graph, options);
    };
})(jQuery);