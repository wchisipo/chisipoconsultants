(function ($) {

    var PremiumLiquidGlassHandler = function ($scope, $) {
        //Check for glass class.
        var className = $scope.attr('class'),
            $glassClass1 = -1 !== className.indexOf('glass3') || $scope.find('[class*="glass3"]').length > 0,
            $glassClass2 = -1 !== className.indexOf('glass4') || $scope.find('[class*="glass4"]').length > 0,
            $glassClass3 = -1 !== className.indexOf('glass5') || $scope.find('[class*="glass5"]').length > 0,
            $glassClass4 = -1 !== className.indexOf('glass6') || $scope.find('[class*="glass6"]').length > 0,
            shouldAlwaysLoad = $scope.hasClass('elementor-widget-premium-addon-image-hotspots') || $scope.hasClass('elementor-widget-premium-search-form') || $scope.hasClass('elementor-widget-premium-addon-instagram-feed') || $scope.hasClass('elementor-widget-premium-contact-form') || $scope.hasClass('elementor-widget-premium-addon-testimonials'),
            isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent),
            isFireFox = typeof InstallTrigger !== 'undefined';

        // Get back to default on Safari/FireFox.
        if (isSafari || isFireFox) {
            // $('[class*="glass"]').each(function (index, elem) {
            $('[class*="__glass"]').each(function (index, elem) { // Fix: conflict with other plugins that add the glass class to elements.

                var $el = $(elem),
                    classes = $el.attr('class').split(/\s+/);

                classes.forEach(function (cls) {
                    if (cls.includes('glass')) {
                        $el.removeClass(cls).addClass('premium-con-lq__glass1');
                    }
                });
            });
            return;
        }

        if ((shouldAlwaysLoad || $glassClass1)) {
            renderPresetSVG(1);
        }

        if ((shouldAlwaysLoad || $glassClass2)) {
            renderPresetSVG(2);
        }

        if ((shouldAlwaysLoad || $glassClass3)) {
            renderPresetSVG(3);
        }

        if ((shouldAlwaysLoad || $glassClass4)) {
            renderPresetSVG(4);
        }

        function renderPresetSVG(presetNumber) {

            if ($('.premium-glass-svg' + presetNumber).length > 0)
                return

            var svgParams = [
                {
                    frequency: '0.004 0.004',
                    scale: 125
                },
                {
                    frequency: '0.007 0.007',
                    scale: 111
                },
                {
                    frequency: '0.02 0.02',
                    scale: 81
                },
                {
                    frequency: '0.015 0.015',
                    scale: 179
                }
            ]

            $('body').append('<svg class="premium-glass-svg' + presetNumber + '" xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute; overflow:hidden"><defs><filter id="glass-distortion' + presetNumber + '" x="0%" y="0%" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="' + svgParams[presetNumber - 1].frequency + '" numOctaves="2" seed="92" result="noise"></feTurbulence><feGaussianBlur in="noise" stdDeviation="2" result="blurred"></feGaussianBlur><feDisplacementMap in="SourceGraphic" in2="blurred" scale="' + svgParams[presetNumber - 1].scale + '" xChannelSelector="R" yChannelSelector="G"></feDisplacementMap></filter></defs></svg>');
        }

    };

    $(window).on("elementor/frontend/init", function () {

        elementorFrontend.hooks.addAction("frontend/element_ready/global", PremiumLiquidGlassHandler);

    });


})(jQuery);
