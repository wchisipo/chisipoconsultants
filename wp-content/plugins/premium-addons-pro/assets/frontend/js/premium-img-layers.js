(function ($) {

    if ('undefined' == typeof window.paCheckSafari) {
        window.paCheckSafari = checkSafariBrowser();

        function checkSafariBrowser() {

            var iOS = /iP(hone|ad|od)/i.test(navigator.userAgent) && !window.MSStream;

            if (iOS) {
                var allowedBrowser = /(Chrome|CriOS|OPiOS|FxiOS)/.test(navigator.userAgent);

                if (!allowedBrowser) {
                    var isFireFox = '' === navigator.vendor;
                    allowedBrowser = allowedBrowser || isFireFox;
                }

                var isSafari = /WebKit/i.test(navigator.userAgent) && !allowedBrowser;

            } else {
                var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
            }

            if (isSafari) {
                return true;
            }

            return false;
        }
    }

    $(window).on('elementor/frontend/init', function () {

        // Image Layers Handler
        var PremiumImageLayersHandler = function ($scope, $) {

            var $imgLayers = $scope.find(".premium-img-layers-wrapper"),
                currentDevice = elementorFrontend.getCurrentDeviceMode(),
                layers = $imgLayers.find(".premium-img-layers-list-item"),
                applyOn = $imgLayers.data("devices"),
                disableFEOnSafari = $scope.hasClass("pa-imglayers-disable-fe-yes");

            var eleObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {

                        var element = $(entry.target),
                            animationSettings = element.data('settings');

                        if (element.hasClass('premium-mask-yes')) {
                            element.find('.premium-img-layers-text').addClass('premium-mask-active');
                        } else {

                            element.addClass("animated " + animationSettings.animation + ' ' + animationSettings.duration);

                            //Opacity should sync animation delay before setting it to 1.
                            var animationDelay = element.css("animation-delay") ? parseFloat(element.css("animation-delay").replace("s", "")) : 0;

                            setTimeout(function () {
                                element.css("opacity", 1);
                            }, animationDelay * 1000);
                        }

                        eleObserver.unobserve(entry.target); // to only excecute the callback func once.
                    }
                });
            }, {
                threshold: 0.75 // this works almost the same as the offset.
                // rootMargin: "0px 0px " + ( window.innerHeight - 250 ) + "px 0px"
            });

            layers.each(function (index, layer) {
                var $layer = $(layer),
                    data = $layer.data(),
                    hideOn = data.layerHide,
                    isRemoved = false;

                if ('object' == typeof hideOn && hideOn.length > 0) {

                    hideOn.map(function (device) {

                        if ('desktop' === device && -1 == currentDevice.indexOf('mobile') && -1 == currentDevice.indexOf('tablet')) {
                            $layer.remove();
                            isRemoved = true;
                        } else if (-1 !== currentDevice.indexOf(device)) {
                            $layer.remove();
                            isRemoved = true;
                        }

                    });
                }

                if (isRemoved)
                    return;

                if (data.scrolls) {
                    if (-1 !== applyOn.indexOf(currentDevice)) {

                        var instance = null,
                            effects = [],
                            vScrollSettings = {},
                            hScrollSettings = {},
                            oScrollSettings = {},
                            bScrollSettings = {},
                            rScrollSettings = {},
                            scaleSettings = {},
                            grayScaleSettings = {},
                            settings = {};

                        if (data.scrolls) {

                            if (data.vscroll) {
                                effects.push('translateY');
                                vScrollSettings = {
                                    speed: data.vscrollSpeed,
                                    direction: data.vscrollDir,
                                    range: {
                                        start: data.vscrollStart,
                                        end: data.vscrollEnd
                                    }
                                };
                            }
                            if (data.hscroll) {
                                effects.push('translateX');
                                hScrollSettings = {
                                    speed: data.hscrollSpeed,
                                    direction: data.hscrollDir,
                                    range: {
                                        start: data.hscrollStart,
                                        end: data.hscrollEnd
                                    }
                                };
                            }
                            if (data.oscroll) {
                                effects.push('opacity');
                                oScrollSettings = {
                                    level: data.oscrollLevel,
                                    fade: data.oscrollEffect,
                                    range: {
                                        start: data.oscrollStart,
                                        end: data.oscrollEnd
                                    }
                                };
                            }
                            if (data.bscroll) {
                                effects.push('blur');
                                bScrollSettings = {
                                    level: data.bscrollLevel,
                                    blur: data.bscrollEffect,
                                    range: {
                                        start: data.bscrollStart,
                                        end: data.bscrollEnd
                                    }
                                };
                            }
                            if (data.rscroll) {
                                effects.push('rotate');
                                rScrollSettings = {
                                    speed: data.rscrollSpeed,
                                    direction: data.rscrollDir,
                                    range: {
                                        start: data.rscrollStart,
                                        end: data.rscrollEnd
                                    }
                                };
                            }
                            if (data.scale) {
                                effects.push('scale');
                                scaleSettings = {
                                    speed: data.scaleSpeed,
                                    direction: data.scaleDir,
                                    range: {
                                        start: data.scaleStart,
                                        end: data.scaleEnd
                                    }
                                };
                            }
                            if (data.gscale) {
                                effects.push('gray');
                                grayScaleSettings = {
                                    level: data.gscaleLevel,
                                    gray: data.gscaleEffect,
                                    range: {
                                        start: data.gscaleStart,
                                        end: data.gscaleEnd
                                    }
                                };
                            }

                        }

                        settings = {
                            elType: 'Widget',
                            vscroll: vScrollSettings,
                            hscroll: hScrollSettings,
                            oscroll: oScrollSettings,
                            bscroll: bScrollSettings,
                            rscroll: rScrollSettings,
                            scale: scaleSettings,
                            gscale: grayScaleSettings,
                            effects: effects
                        };

                        instance = new paScrollEffects(layer, settings);
                        instance.init();

                    }

                } else if (data.float) {

                    if (disableFEOnSafari) {
                        if (window.paCheckSafari)
                            return;
                    }

                    var floatXSettings = null,
                        floatYSettings = null,
                        floatRotateXSettings = null,
                        floatRotateYSettings = null,
                        floatRotateZSettings = null;

                    var animeSettings = {
                        targets: $layer[0],
                        loop: true,
                        direction: 'alternate',
                        easing: 'easeInOutSine'
                    };

                    if (data.floatTranslate) {

                        floatXSettings = {
                            duration: data.floatTranslateSpeed * 1000,
                            value: [data.floatxStart || 0, data.floatxEnd || 0]
                        };

                        animeSettings.translateX = floatXSettings;

                        floatYSettings = {
                            duration: data.floatTranslateSpeed * 1000,
                            value: [data.floatyStart || 0, data.floatyEnd || 0]
                        };

                        animeSettings.translateY = floatYSettings;

                    }

                    if (data.floatRotate) {

                        floatRotateXSettings = {
                            duration: data.floatRotateSpeed * 1000,
                            value: [data.rotatexStart || 0, data.rotatexEnd || 0]
                        };

                        animeSettings.rotateX = floatRotateXSettings;

                        floatRotateYSettings = {
                            duration: data.floatRotateSpeed * 1000,
                            value: [data.rotateyStart || 0, data.rotateyEnd || 0]
                        };

                        animeSettings.rotateY = floatRotateYSettings;

                        floatRotateZSettings = {
                            duration: data.floatRotateSpeed * 1000,
                            value: [data.rotatezStart || 0, data.rotatezEnd || 0]
                        };

                        animeSettings.rotateZ = floatRotateZSettings;

                    }

                    if (data.floatOpacity) {
                        animeSettings.opacity = {
                            duration: data.floatOpacitySpeed * 1000,
                            value: data.floatOpacityValue || 0
                        };
                    }

                    anime(animeSettings);
                }

                if ($layer.hasClass('premium-mask-yes')) {
                    var html = '';
                    $layer.find('.premium-img-layers-text').text().split(' ').forEach(function (word) {
                        html += ' <span class="premium-mask-span">' + word + '</span>';
                    });

                    $layer.find('.premium-img-layers-text').text('').append(html);
                }

                // Observer layers once if they have entrance animation settings or mask enabled.
                if ($layer.data("settings") || $layer.hasClass('premium-mask-yes')) {
                    eleObserver.observe($($layer)[0]);
                }
            });

            $imgLayers.find('.premium-img-layers-list-item[data-parallax="true"]').each(function () {

                var $this = $(this),
                    resistance = $(this).data("rate"),
                    reverse = -1;

                if ($this.data("mparallax-reverse"))
                    reverse = 1;

                $imgLayers.mousemove(function (e) {
                    TweenLite.to($this, 0.2, {
                        x: reverse * ((e.clientX - window.innerWidth / 2) / resistance),
                        y: reverse * ((e.clientY - window.innerHeight / 2) / resistance)
                    });
                });

                if ($this.data("mparallax-init")) {
                    $imgLayers.mouseleave(function () {
                        TweenLite.to($this, 0.4, {
                            x: 0,
                            y: 0
                        });
                    });
                }

            });

            var tilts = $imgLayers.find('.premium-img-layers-list-item[data-tilt="true"]');

            if (tilts.length > 0) {
                tilt = UniversalTilt.init({
                    elements: tilts,
                    callbacks: {
                        onMouseLeave: function (el) {
                            el.style.boxShadow = "0 45px 100px rgba(255, 255, 255, 0)";
                        },
                        onDeviceMove: function (el) {
                            el.style.boxShadow = "0 45px 100px rgba(255, 255, 255, 0.3)";
                        }
                    }
                });
            }
        };

        elementorFrontend.hooks.addAction('frontend/element_ready/premium-img-layers-addon.default', PremiumImageLayersHandler);
    });
})(jQuery);