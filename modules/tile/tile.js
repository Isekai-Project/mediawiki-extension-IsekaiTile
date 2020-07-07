/* global Colors */
var TileDefaultConfig = {
    tileDeferred: 0,
    size: "medium",
    cover: "",
    coverPosition: "center",
    effect: "",
    effectInterval: 3000,
    effectDuration: 500,
    target: null,
    canTransform: true,
    onClick: () => {},
    onTileCreate: () => {},
};

var METRO_THROWS = true;
var GRID_GAP = 5;

if(typeof isekai == 'undefined'){
    var isekai = {};
}

isekai.tile = {};

isekai.tile.setup = function (options) {
    TileDefaultConfig = jQuery.extend({}, TileDefaultConfig, options);
};

isekai.tile.init = function () {
    
};

(function($){
    var Utils = {
        isValue: function(val){
            return val !== undefined && val !== null && val !== "";
        },

        isUrl: function (val) {
            /* eslint-disable-next-line */
            return /^(\.\/|\.\.\/|ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@\-\/]))?/.test(val);
        },
    
        isTag: function(val){
            /* eslint-disable-next-line */
            return /^<\/?[\w\s="/.':;#-\/\?]+>/gi.test(val);
        },

        isType: function(o, t){
            if (!Utils.isValue(o)) {
                return false;
            }
    
            if (typeof o === t) {
                return o;
            }
    
            if (Utils.isTag(o) || Utils.isUrl(o)) {
                return false;
            }
    
            if (typeof window[o] === t) {
                return window[o];
            }
    
            if (typeof o === 'string' && o.indexOf(".") === -1) {
                return false;
            }
    
            if (typeof o === 'string' && o.indexOf("/") !== -1) {
                return false;
            }
    
            if (typeof o === 'string' && o.indexOf(" ") !== -1) {
                return false;
            }
    
            if (typeof o === 'string' && o.indexOf("(") !== -1) {
                return false;
            }
    
            if (typeof o === 'string' && o.indexOf("[") !== -1) {
                return false;
            }
    
            if (typeof o === "number" && t.toLowerCase() !== "number") {
                return false;
            }
    
            var ns = o.split(".");
            var i, context = window;
    
            for(i = 0; i < ns.length; i++) {
                context = context[ns[i]];
            }
    
            return typeof context === t ? context : false;
        },

        isFunc: function(f){
            return Utils.isType(f, 'function');
        },

        /**
         *
         * @param {TouchEvent|Event|MouseEvent} e
         * @returns {{x: (*), y: (*)}}
         */
        pageXY: function(e){
            return {
                x: e.changedTouches ? e.changedTouches[0].pageX : e.pageX,
                y: e.changedTouches ? e.changedTouches[0].pageY : e.pageY
            };
        },

        isRightMouse: function(e){
            return "which" in e ? e.which === 3 : "button" in e ? e.button === 2 : undefined;
        },

        func: function(f){
            /* jshint -W054 */
            return new Function("a", f);
        },

        exec: function(f, args, context){
            var result;
            if (f === undefined || f === null) {return false;}
            var func = Utils.isFunc(f);
    
            if (func === false) {
                func = Utils.func(f);
            }
    
            try {
                result = func.apply(context, args);
            } catch (err) {
                result = null;
                if (METRO_THROWS === true) {
                    throw err;
                }
            }
            return result;
        },
    };

    var FrameAnimation = {
        duration: 100,
        func: "linear",
    
        switch: function(current, next){
            current.hide();
            next.css({top: 0, left: 0}).show();
        },
    
        slideUp: function(current, next, duration, func){
            var h = current.parent().outerHeight(true);
            if (duration === undefined) {duration = this.duration;}
            if (func === undefined) {func = this.func;}
    
            current
                .css("z-index", 1)
                .animate({
                    draw: {
                        top: -h,
                        opacity: 0
                    },
                    dur: duration,
                    ease: func
                });
    
            next
                .css({
                    top: h,
                    left: 0,
                    zIndex: 2
                })
                .animate({
                    draw: {
                        top: 0,
                        opacity: 1
                    },
                    dur: duration,
                    ease: func
                });
        },
    
        slideDown: function(current, next, duration, func){
            var h = current.parent().outerHeight(true);
            if (duration === undefined) {duration = this.duration;}
            if (func === undefined) {func = this.func;}
    
            current
                .css("z-index", 1)
                .animate({
                    draw: {
                        top: h,
                        opacity: 0
                    },
                    dur: duration,
                    ease: func
                });
    
            next
                .css({
                    left: 0,
                    top: -h,
                    zIndex: 2
                })
                .animate({
                    draw: {
                        top: 0,
                        opacity: 1
                    },
                    dur: duration,
                    ease: func
                });
        },
    
        slideLeft: function(current, next, duration, func){
            var w = current.parent().outerWidth(true);
            if (duration === undefined) {duration = this.duration;}
            if (func === undefined) {func = this.func;}
            current
                .css("z-index", 1)
                .animate({
                    draw: {
                        left: -w,
                        opacity: 0
                    },
                    dur: duration,
                    ease: func
                });
    
            next
                .css({
                    left: w,
                    zIndex: 2
                })
                .animate({
                    draw: {
                        left: 0,
                        opacity: 1
                    },
                    dur: duration,
                    ease: func
                });
        },
    
        slideRight: function(current, next, duration, func){
            var w = current.parent().outerWidth(true);
            if (duration === undefined) {duration = this.duration;}
            if (func === undefined) {func = this.func;}
    
            current
                .css("z-index", 1)
                .animate({
                    draw: {
                        left:  w,
                        opacity: 0
                    },
                    dur: duration,
                    ease: func
                });
    
            next
                .css({
                    left: -w,
                    zIndex: 2
                })
                .animate({
                    draw: {
                        left: 0,
                        opacity: 1
                    },
                    dur: duration,
                    ease: func
                });
        },
    
        fade: function(current, next, duration){
            if (duration === undefined) {duration = this.duration;}
    
            current
                .animate({
                    draw: {
                        opacity: 0
                    },
                    dur: duration
                });
    
            next
                .css({
                    top: 0,
                    left: 0,
                    opacity: 0
                })
                .animate({
                    draw: {
                        opacity: 1
                    },
                    dur: duration
                });
        }
    };

    var Colors = {
        PALETTES: {
            ALL: "colorList",
            METRO: "colorListMetro",
            STANDARD: "colorListStandard"
        },

        colorListMetro: {
            lime: '#a4c400',
            green: '#60a917',
            emerald: '#008a00',
            blue: '#00AFF0',
            teal: '#00aba9',
            cyan: '#1ba1e2',
            cobalt: '#0050ef',
            indigo: '#6a00ff',
            violet: '#aa00ff',
            pink: '#dc4fad',
            magenta: '#d80073',
            crimson: '#a20025',
            red: '#CE352C',
            orange: '#fa6800',
            amber: '#f0a30a',
            yellow: '#fff000',
            brown: '#825a2c',
            olive: '#6d8764',
            steel: '#647687',
            mauve: '#76608a',
            taupe: '#87794e'
        },
    
        colorListStandard: {
            aliceBlue: "#f0f8ff",
            antiqueWhite: "#faebd7",
            aqua: "#00ffff",
            aquamarine: "#7fffd4",
            azure: "#f0ffff",
            beige: "#f5f5dc",
            bisque: "#ffe4c4",
            black: "#000000",
            blanchedAlmond: "#ffebcd",
            blue: "#0000ff",
            blueViolet: "#8a2be2",
            brown: "#a52a2a",
            burlyWood: "#deb887",
            cadetBlue: "#5f9ea0",
            chartreuse: "#7fff00",
            chocolate: "#d2691e",
            coral: "#ff7f50",
            cornflowerBlue: "#6495ed",
            cornsilk: "#fff8dc",
            crimson: "#dc143c",
            cyan: "#00ffff",
            darkBlue: "#00008b",
            darkCyan: "#008b8b",
            darkGoldenRod: "#b8860b",
            darkGray: "#a9a9a9",
            darkGreen: "#006400",
            darkKhaki: "#bdb76b",
            darkMagenta: "#8b008b",
            darkOliveGreen: "#556b2f",
            darkOrange: "#ff8c00",
            darkOrchid: "#9932cc",
            darkRed: "#8b0000",
            darkSalmon: "#e9967a",
            darkSeaGreen: "#8fbc8f",
            darkSlateBlue: "#483d8b",
            darkSlateGray: "#2f4f4f",
            darkTurquoise: "#00ced1",
            darkViolet: "#9400d3",
            deepPink: "#ff1493",
            deepSkyBlue: "#00bfff",
            dimGray: "#696969",
            dodgerBlue: "#1e90ff",
            fireBrick: "#b22222",
            floralWhite: "#fffaf0",
            forestGreen: "#228b22",
            fuchsia: "#ff00ff",
            gainsboro: "#DCDCDC",
            ghostWhite: "#F8F8FF",
            gold: "#ffd700",
            goldenRod: "#daa520",
            gray: "#808080",
            green: "#008000",
            greenYellow: "#adff2f",
            honeyDew: "#f0fff0",
            hotPink: "#ff69b4",
            indianRed: "#cd5c5c",
            indigo: "#4b0082",
            ivory: "#fffff0",
            khaki: "#f0e68c",
            lavender: "#e6e6fa",
            lavenderBlush: "#fff0f5",
            lawnGreen: "#7cfc00",
            lemonChiffon: "#fffacd",
            lightBlue: "#add8e6",
            lightCoral: "#f08080",
            lightCyan: "#e0ffff",
            lightGoldenRodYellow: "#fafad2",
            lightGray: "#d3d3d3",
            lightGreen: "#90ee90",
            lightPink: "#ffb6c1",
            lightSalmon: "#ffa07a",
            lightSeaGreen: "#20b2aa",
            lightSkyBlue: "#87cefa",
            lightSlateGray: "#778899",
            lightSteelBlue: "#b0c4de",
            lightYellow: "#ffffe0",
            lime: "#00ff00",
            limeGreen: "#32dc32",
            linen: "#faf0e6",
            magenta: "#ff00ff",
            maroon: "#800000",
            mediumAquaMarine: "#66cdaa",
            mediumBlue: "#0000cd",
            mediumOrchid: "#ba55d3",
            mediumPurple: "#9370db",
            mediumSeaGreen: "#3cb371",
            mediumSlateBlue: "#7b68ee",
            mediumSpringGreen: "#00fa9a",
            mediumTurquoise: "#48d1cc",
            mediumVioletRed: "#c71585",
            midnightBlue: "#191970",
            mintCream: "#f5fffa",
            mistyRose: "#ffe4e1",
            moccasin: "#ffe4b5",
            navajoWhite: "#ffdead",
            navy: "#000080",
            oldLace: "#fdd5e6",
            olive: "#808000",
            oliveDrab: "#6b8e23",
            orange: "#ffa500",
            orangeRed: "#ff4500",
            orchid: "#da70d6",
            paleGoldenRod: "#eee8aa",
            paleGreen: "#98fb98",
            paleTurquoise: "#afeeee",
            paleVioletRed: "#db7093",
            papayaWhip: "#ffefd5",
            peachPuff: "#ffdab9",
            peru: "#cd853f",
            pink: "#ffc0cb",
            plum: "#dda0dd",
            powderBlue: "#b0e0e6",
            purple: "#800080",
            rebeccaPurple: "#663399",
            red: "#ff0000",
            rosyBrown: "#bc8f8f",
            royalBlue: "#4169e1",
            saddleBrown: "#8b4513",
            salmon: "#fa8072",
            sandyBrown: "#f4a460",
            seaGreen: "#2e8b57",
            seaShell: "#fff5ee",
            sienna: "#a0522d",
            silver: "#c0c0c0",
            slyBlue: "#87ceeb",
            slateBlue: "#6a5acd",
            slateGray: "#708090",
            snow: "#fffafa",
            springGreen: "#00ff7f",
            steelBlue: "#4682b4",
            tan: "#d2b48c",
            teal: "#008080",
            thistle: "#d8bfd8",
            tomato: "#ff6347",
            turquoise: "#40e0d0",
            violet: "#ee82ee",
            wheat: "#f5deb3",
            white: "#ffffff",
            whiteSmoke: "#f5f5f5",
            yellow: "#ffff00",
            yellowGreen: "#9acd32"
        },
    
        colorList: {},

        colors: function(palette){
            var c = [];
            palette = palette || this.PALETTES.ALL;
            $.each(this[palette], function(){
                c.push(this);
            });
            return c;
        },
    }

    function Tile(options, element){
        this.init = function(options, element) {
            this.effectInterval = false;
            this.images = [];
            this.slides = [];
            this.currentSlide = -1;
            this.options = $.extend({}, TileDefaultConfig, options);
            this.element = element;
            this.hasIcon = false;
            this.hasBranding = false;

            this._fixSizeCallback = this.resize.bind(this);

            this._create();
        };
    
        this._create = function(){
            this._createTile();
            this._createEvents();
    
            this.element.trigger("tilecreate");
        };
    
        this._createTile = function(){
            function switchImage(el, img_src, i){
                $.setTimeout(function(){
                    el.fadeOut(500, function(){
                        el.css("background-image", "url(" + img_src + ")");
                        el.fadeIn();
                    });
                }, i * 300);
            }
    
            var that = this, element = this.element, o = this.options;
            var slides = element.find(".slide");
            var slides2 = element.find(".slide-front, .slide-back");
    
            element.addClass("tile-" + o.size);

            if(element.find('.icon').length > 0){
                this.hasIcon = true;
            }

            if(element.find('.branding-bar')){
                this.hasBranding = true;
            }
    
            if (o.effect.indexOf("hover-") > -1) {
                element.addClass("effect-" + o.effect);
                $.each(slides2, function(){
                    var slide = $(this);
    
                    if (slide.data("cover") !== undefined) {
                        that._setCover(slide, slide.data("cover"), slide.data("cover-position"));
                    }
                })
            }
    
            if (o.effect.indexOf("animate-") > -1 && slides.length > 1) {
                $.each(slides, function(i){
                    var slide = $(this);
    
                    that.slides.push(this);
    
                    if (slide.data("cover") !== undefined) {
                        this._setCover(slide, slide.data("cover"), slide.data("cover-position"));
                    }
    
                    if (i > 0) {
                        if (["animate-slide-up", "animate-slide-down"].indexOf(o.effect) > -1) slide.css("top", "100%");
                        if (["animate-slide-left", "animate-slide-right"].indexOf(o.effect) > -1) slide.css("left", "100%");
                        if (["animate-fade"].indexOf(o.effect) > -1) slide.css("opacity", 0);
                    }
                });
    
                this.currentSlide = 0;
    
                this._runEffects();
            }
    
            if (o.cover !== "") {
                this._setCover(element, o.cover);
            }
    
            if (o.effect === "image-set") {
                element.addClass("image-set");
    
                $.each(element.children("img"), function(){
                    that.images.push(this);
                    $(this).remove();
                });
    
                var temp = this.images.slice();
    
                for(var i = 0; i < 5; i++) {
                    var rnd_index = $.random(0, temp.length - 1);
                    var div = $("<div>").addClass("img -js-img-"+i).css("background-image", "url("+temp[rnd_index].src+")");
                    element.prepend(div);
                    temp.splice(rnd_index, 1);
                }
    
                var a = [0, 1, 4, 3, 2];
    
                $.setInterval(function(){
                    var temp = that.images.slice();
                    var colors = Colors.colors(Colors.PALETTES.ALL), bg;
                    bg = colors[$.random(0, colors.length - 1)];
    
                    element.css("background-color", bg);
    
                    for(var i = 0; i < a.length; i++) {
                        var rnd_index = $.random(0, temp.length - 1);
                        var div = element.find(".-js-img-"+a[i]);
                        switchImage(div, temp[rnd_index].src, i);
                        temp.splice(rnd_index, 1);
                    }
    
                    a = a.reverse();
                }, 5000);
            }
        };
    
        this._runEffects = function(){
            var o = this.options;
    
            if (this.effectInterval === false) this.effectInterval = $.setInterval(function(){
                var current, next;
    
                current = $(this.slides[this.currentSlide]);
    
                this.currentSlide++;
                if (this.currentSlide === this.slides.length) {
                    this.currentSlide = 0;
                }
    
                next = this.slides[this.currentSlide];
    
                if (o.effect === "animate-slide-up") FrameAnimation.slideUp($(current), $(next), o.effectDuration);
                if (o.effect === "animate-slide-down") FrameAnimation.slideDown($(current), $(next), o.effectDuration);
                if (o.effect === "animate-slide-left") FrameAnimation.slideLeft($(current), $(next), o.effectDuration);
                if (o.effect === "animate-slide-right") FrameAnimation.slideRight($(current), $(next), o.effectDuration);
                if (o.effect === "animate-fade") FrameAnimation.fade($(current), $(next), o.effectDuration);
    
            }, o.effectInterval);
        };
    
        this._stopEffects = function(){
            $.clearInterval(this.effectInterval);
            this.effectInterval = false;
        };

        this.resize = function(){
            var ratio = 1;
            var padding = 0;
            var grid = this.element.parent('.tiles-grid');
            var gridWidth = 0;
            if(grid.length > 0){
                gridWidth = grid.width();
            }

            if(this.options.size == 'wide'){
                ratio = 0.5;
            }

            //修正长宽比
            var height = this.element.width() * ratio - padding;
            //this.element.height(height);

            if(this.hasIcon){
                var fontSize = height * 0.33;
                var iconDom = this.element.find('.icon');
                iconDom.css('font-size', fontSize + 'px');

                if(this.hasBranding){ //计算与标签的重叠
                    var iconBottom = (height + fontSize) / 2;

                    var brandingTop = height - this.element.find('.branding-bar').outerHeight();
                    var overlap = iconBottom - brandingTop + (height * 0.1);
                    if(overlap > 0){
                        iconDom.css('padding-bottom', overlap + 'px');
                    }
                }
            }
        }
    
        this._setCover = function(to, src, pos){
            if (!Utils.isValue(pos)) {
                pos = this.options.coverPosition;
            }
            to.css({
                backgroundImage: "url("+src+")",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: pos
            });
        };
    
        this._createEvents = function(){
            var element = this.element, o = this.options;
    
            element.on('mousedown touchstart', function(e){
                var tile = $(this);
                var dim = {w: element.width(), h: element.height()};
                var X = Utils.pageXY(e).x - tile.offset().left,
                    Y = Utils.pageXY(e).y - tile.offset().top;
                var side;
    
                if (Utils.isRightMouse(e) === false) {
    
                    if (X < dim.w * 1 / 3 && (Y < dim.h * 1 / 2 || Y > dim.h * 1 / 2)) {
                        side = 'left';
                    } else if (X > dim.w * 2 / 3 && (Y < dim.h * 1 / 2 || Y > dim.h * 1 / 2)) {
                        side = 'right';
                    } else if (X > dim.w * 1 / 3 && X < dim.w * 2 / 3 && Y > dim.h / 2) {
                        side = 'bottom';
                    } else {
                        side = "top";
                    }
    
                    if (o.canTransform === true) tile.addClass("transform-" + side);
    
                    if (o.target !== null) {
                        setTimeout(function(){
                            document.location.href = o.target;
                        }, 100);
                    }
    
                    Utils.exec(o.onClick, [side], element[0]);
                    element.trigger("click", {
                        side: side
                    });
                }
            });
    
            element.on('mouseup touchend mouseleave', function(){
                $(this)
                    .removeClass("transform-left")
                    .removeClass("transform-right")
                    .removeClass("transform-top")
                    .removeClass("transform-bottom");
            });

            $(window).on('resize', this._fixSizeCallback);
            $(this._fixSizeCallback);
        };
    
        this.destroy = function(){
            var element = this.element;
    
            element.off('mousedown touchstart');
    
            element.off('mouseup touchend mouseleave');

            $(window).off('resize', this._fixSizeCallback);

            this._stopEffects();
        };

        this.init(options, element);
    };

    function getElementOptions(element){
        var options = {};
        $.each(element[0].attributes, function (index, attribute){
            if(attribute.name.startsWith('data-')){
                options[attribute.name.substr(5)] = attribute.value;
            }
        });

        return options;
    }

    $.fn.extend({
        tile: function(action, ...args){
            var result;
            this.each(function(){
                var element = $(this);
                if(element.attr('data-role') !== 'tile'){
                    throw new Error('This element isn\'t a tile element');
                }

                var tileObj = element.data('tile');
                if(action == 'init'){
                    if(tileObj){
                        throw new Error('Tile already inited.');
                    }

                    var options = args[0] || {};
                    options = $.extend({}, options, getElementOptions(element));
                    tileObj = new Tile(options, element);
                    element.data('tile', tileObj);
                } else {
                    if(!tileObj){
                        throw new Error('Tile not inited.');
                    }

                    if(!tileObj[action]){
                        throw new Error('Method: ' + action + ' not exists.');
                    }

                    result = tileObj[action].apply(tileObj, ...args);
                }
            });

            if(result == undefined){
                return this;
            } else {
                return result;
            }
        }
    });

    function resizeGrid(){
        $('.tiles-grid').each(function(){
            var dom = $(this);
            var width = dom.width();
            var gridSize = width / 4 - GRID_GAP;
            dom.css({
                gridTemplateColumns: 'repeat(4, ' + gridSize + 'px)',
                gridAutoRows: gridSize + 'px',
            });
        });
    }

    $('*[data-role="tile"]').tile('init');
    $(window).resize(resizeGrid);
    $(resizeGrid);

    function onCollapseDivChange(mutationsList){
        mutationsList.forEach((item) => {
            if(item.type == 'attributes' && item.attributeName == 'class'){
                $('*[data-role="tile"]').tile('resize');
                resizeGrid();
            }
        });
    }

    if($('body').hasClass('skin-minerva')){
        $('#mw-content-text .collapsible-block').each(function(){
            var dom = $(this);
            if(dom.find('*[data-role="tile"]').length > 0){ //存在tile，监听这个dom
                var observer = new MutationObserver(onCollapseDivChange);
                observer.observe(dom[0], {
                    attributes: true,
                });
            }
        });
    }
})(jQuery);