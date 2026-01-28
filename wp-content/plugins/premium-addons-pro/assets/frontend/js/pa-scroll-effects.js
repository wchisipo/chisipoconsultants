(function ($) {

    $(window).on('elementor/frontend/init', function () {

        window.paScrollEffects = function (element, settings) {

            var self = this,
                $el = $(element),
                scrolls = $el.data("scrolls"),
                elementSettings = settings,
                elType = elementSettings.elType,
                elOffset = $el.offset();

            //Check if Horizontal Scroll Widget
            var isHScrollWidget = $el.closest(".premium-hscroll-temp").length;

            self.elementRules = {};

            self.init = function () {

                if (scrolls || 'SECTION' === elType) {

                    if (!elementSettings.effects.length > 0) {
                        return;
                    }
                    self.setDefaults();
                    self.initScroll('load');
                    elementorFrontend.elements.$window.on('scroll', self.initScroll);
                } else {

                    elementorFrontend.elements.$window.off('scroll', self.initScroll);
                    return;
                }

            };

            self.setDefaults = function () {

                elementSettings.defaults = {};
                elementSettings.defaults.axis = 'y';

            };

            self.transform = function (action, percents, data) {

                if ("down" === data.direction) {
                    percents = 100 - percents;
                }

                if (data.range) {
                    if (data.range.start > percents && !isHScrollWidget) {
                        percents = data.range.start;
                    }

                    if (data.range.end < percents && !isHScrollWidget) {
                        percents = data.range.end;
                    }
                }

                if ("rotate" === action) {
                    elementSettings.defaults.unit = "deg";
                } else {
                    elementSettings.defaults.unit = "px";
                }

                self.updateElement(
                    "transform",
                    action,
                    self.getStep(percents, data) + elementSettings.defaults.unit
                );

            };

            self.getPercents = function () {
                var dimensions = self.getDimensions();

                var startOffset = innerHeight;

                if (isHScrollWidget) startOffset = 0;

                (elementTopWindowPoint = dimensions.elementTop - pageYOffset),
                    (elementEntrancePoint = elementTopWindowPoint - startOffset);

                passedRangePercents =
                    (100 / dimensions.range) * (elementEntrancePoint * -1);

                return passedRangePercents;
            };

            self.initScroll = function (event) {

                if ("load" === event) {
                    $el.css("transition", "all 1s ease");
                } else {
                    $el.css("transition", "none");
                }

                if (elementSettings.effects.includes('translateY')) {

                    self.initVScroll();

                }

                if (elementSettings.effects.includes('translateX')) {

                    self.initHScroll();

                }

                if (elementSettings.effects.includes('opacity')) {

                    self.initOScroll();

                }

                if (elementSettings.effects.includes('blur')) {

                    self.initBScroll();

                }

                if (elementSettings.effects.includes('gray')) {

                    self.initGScroll();

                }

                if (elementSettings.effects.includes('rotate')) {

                    self.initRScroll();

                }

                if (elementSettings.effects.includes('scale')) {

                    self.initScaleScroll();

                }

            };

            self.initVScroll = function () {
                var percents = self.getPercents();

                self.transform("translateY", percents, elementSettings.vscroll);
            };

            self.initHScroll = function () {
                var percents = self.getPercents();

                self.transform("translateX", percents, elementSettings.hscroll);
            };

            self.getDimensions = function () {
                //If magic scroll is on the page, then we need to get offsets on scroll, not page load.
                // Getting offset on scroll causes animations in horizontal scroll not to work.
                var elementOffset = $('.instant-mscroll').length > 0 ? $el.offset() : elOffset;

                var dimensions = {
                    elementHeight: $el.outerHeight(),
                    elementWidth: $el.outerWidth(),
                    elementTop: elementOffset.top,
                    elementLeft: elementOffset.left
                };

                dimensions.range = dimensions.elementHeight + innerHeight;

                return dimensions;
            };

            self.getStep = function (percents, options) {
                return -(percents - 50) * options.speed;
            };

            self.initOScroll = function () {
                var percents = self.getPercents(),
                    data = elementSettings.oscroll,
                    movePoint = self.getEffectMovePoint(
                        percents,
                        data.fade,
                        data.range
                    ),
                    level = data.level / 10,
                    opacity =
                        1 -
                        level +
                        self.getEffectValueFromMovePoint(level, movePoint);

                $el.css("opacity", opacity);
            };

            self.initBScroll = function () {

                var percents = self.getPercents(),
                    data = elementSettings.bscroll,
                    movePoint = self.getEffectMovePoint(percents, data.blur, data.range),
                    blur = data.level - self.getEffectValueFromMovePoint(data.level, movePoint);

                self.updateElement('filter', 'blur', blur + 'px');

            };

            self.initGScroll = function () {

                var percents = self.getPercents(),
                    data = elementSettings.gscale,
                    movePoint = self.getEffectMovePoint(percents, data.gray, data.range),
                    grayScale = 10 * (data.level - self.getEffectValueFromMovePoint(data.level, movePoint));

                self.updateElement('filter', 'grayscale', grayScale + '%');

            };

            self.initRScroll = function () {
                var percents = self.getPercents();

                self.transform("rotate", percents, elementSettings.rscroll);
            };

            self.getEffectMovePoint = function (percents, effect, range) {
                var point = 0;

                if (percents < range.start) {
                    if ("down" === effect) {
                        point = 0;
                    } else {
                        point = 100;
                    }
                } else if (percents < range.end) {
                    point = self.getPointFromPercents(
                        range.end - range.start,
                        percents - range.start
                    );

                    if ("up" === effect) {
                        point = 100 - point;
                    }
                } else if ("up" === effect) {
                    point = 0;
                } else if ("down" === effect) {
                    point = 100;
                }

                return point;
            };

            self.initScaleScroll = function () {
                var percents = self.getPercents(),
                    data = elementSettings.scale,
                    movePoint = self.getEffectMovePoint(
                        percents,
                        data.direction,
                        data.range
                    );

                this.updateElement(
                    "transform",
                    "scale",
                    1 + (data.speed * movePoint) / 1000
                );
            };

            self.getEffectValueFromMovePoint = function (level, movePoint) {
                return (level * movePoint) / 100;
            };

            self.getPointFromPercents = function (movableRange, percents) {
                var movePoint = (percents / movableRange) * 100;

                return +movePoint.toFixed(2);
            };

            self.updateElement = function (propName, key, value) {
                if (!self.elementRules[propName]) {
                    self.elementRules[propName] = {};
                }

                if (!self.elementRules[propName][key]) {
                    self.elementRules[propName][key] = true;

                    self.updateElementRule(propName);
                }

                var cssVarKey = "--" + key;

                element.style.setProperty(cssVarKey, value);
            };

            self.updateElementRule = function (rule) {
                var cssValue = "";

                $.each(self.elementRules[rule], function (variableKey) {
                    cssValue += variableKey + "(var(--" + variableKey + "))";
                });

                $el.css(rule, cssValue);
            };

        };

    });

})(jQuery);