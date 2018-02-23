/**
 * FR-mothod of Force-directed placement.
 * 
 * @author Jamie CHEN
 * @since February 23, 2018
 */
; (function ($) {
    function FR(graph, opts) {
        this.options = $.extend({}, defaults, opts);
        this.init(graph);
    };
    var defaults = {
        /**
         * client height
         */
        H: 500,
        /**
         * client width
         */
        W: 500,
        /**
         * repulsive force fraction
         */
        gravity: 0.5,
        /**
         * whehter to use the fixed initial placement or not
         */
        fixedInitialization: false
    },
        /**
         * maximum iteration times
         */
        maxLoop = 1000,
        /**
         * initial angle, only used for fixedInitialization=true
         */
        initAngle = Math.PI / 6,
        sqrt = Math.sqrt,
        max = Math.max,
        min = Math.min,
        cos = Math.cos,
        sin = Math.sin,
        random = Math.random;

    /**
     * cooldown
     * @param {num} z 
     */
    function _cool(z) {
        return 0.95 * z;
    };
    /**
     * calculate attractive force
     * @param {num} z
     * @param {FR} ctx context
     */
    function _fa(z, ctx) {
        return z * z / ctx.K;
    };
    /**
     * calculate repulsive force
     * @param {num} z
     * @param {FR} ctx context
     */
    function _fr(z, ctx) {
        if (z < 2 * ctx.K) {
            return ctx.options.gravity * ctx.K * ctx.K / z;
        } else {
            return 0;
        }
    };
    /**
     * calculate 2-norm of a vector
     * @param {} v a vector with tow properties: x and y 
     */
    function _norm2(v) {
        // 
        return sqrt(v.x * v.x + v.y * v.y);
    };
    FR.prototype = {
        constructor: FR,
        type: 'force',
        description: 'based on "Graph Drawing by Force-directed Placement" THOMAS M. J. FRUCHTERMAN and EDWARD M. REINGOLD',

        calculate: function () {
            // FR-method begins.
            for (var i = 0; i < maxLoop; ++i) {
                // calculate repulsive force
                for (var j in this.vertics) {
                    var v = this.vertics[j];
                    v.disp = {
                        x: 0,
                        y: 0
                    };
                    for (var l in this.vertics) {
                        if (j != l) {
                            var u = this.vertics[l];
                            var delta = {
                                x: v.x - u.x,
                                y: v.y - u.y
                            };
                            var m = _norm2(delta);
                            if (m == 0) {
                                delta.x = random();
                                delta.y = random();
                                m = 1;
                            }
                            var c = _fr(m, this) / m;
                            v.disp.x += delta.x * c;
                            v.disp.y += delta.y * c;
                        }
                    }
                }

                // calculate attractive forces 
                for (var j in this.edges) {
                    var v = this.vertics[+this.edges[j].source],
                        u = this.vertics[+this.edges[j].target],
                        delta = {
                            x: v.x - u.x,
                            y: v.y - u.y
                        };
                    var m = _norm2(delta);
                    var c = m / this.K; // c = _fa(m,this) / m;
                    v.disp.x -= delta.x * c;
                    v.disp.y -= delta.y * c;
                    u.disp.x += delta.x * c;
                    u.disp.y += delta.y * c;
                }

                // limit the maximum displacement to the temperature t and then prevent from being displaced outside frame
                //var E = 0;
                for (var j in this.vertics) {
                    var v = this.vertics[j],
                        m = _norm2(v.disp);
                    //E += m * m;
                    if (m != 0) {
                        m = min(m, this.T) / m;
                    }
                    v.x += v.disp.x * m;
                    v.y += v.disp.y * m;

                    v.x = max(-this.options.W / 2, min(this.options.W / 2, v.x));
                    v.y = max(-this.options.H / 2, min(this.options.H / 2, v.y));
                }

                this.T = _cool(this.T);
                if (this.T < 0.1) {
                    //console.log({ t: T, iterator: i});
                    break;
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
            g.links || (g.links = []);
            this.K = sqrt(this.options.H * this.options.W / g.nodes.length);
            this.T = min(this.options.H, this.options.W) * 0.5;
            this.initRadius = max(min(this.options.H, this.options.W) / g.nodes.length, 10);
            this.vertics = $.extend(true, [], g.nodes);
            this.edges = $.extend(true, [], g.links);
            for (var i in this.vertics) {
                var v = this.vertics[i];
                if (this.options.fixedInitialization) {
                    var radius = this.initRadius * sqrt(i), angle = i * initAngle;
                    v.x = radius * cos(angle);//(random() - 0.5) * W,
                    v.y = radius * sin(angle);//(random() - 0.5) * H,
                } else {
                    v.x = (random() - 0.5) * this.options.W;
                    v.y = (random() - 0.5) * this.options.H;
                }
            }
        }
    };
    window.FR = function (graph, options) {
        //调用其方法
        return new FR(graph, options);
    };
})(jQuery);