Ext.define('criterion.ThemeManager', function() {

    /**
     * via http://stackoverflow.com/a/5624139
     *
     * @param hex
     * @returns {*}
     */
    function hexToRgb(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        return result ? {
            r : parseInt(result[1], 16),
            g : parseInt(result[2], 16),
            b : parseInt(result[3], 16)
        } : null;
    }

    function rgbToString(rgb) {
        return Ext.String.format('rgb({0}, {1}, {2})', rgb.r, rgb.g, rgb.b)
    }

    /**
     * via https://stackoverflow.com/questions/11867545/change-text-color-based-on-brightness-of-the-covered-background-area
     *
     * @param color
     * @returns {string}
     */
    function contrastColor(color) {
        var rgb = hexToRgb(color),
            o = Math.round(((parseInt(rgb['r'], 10) * 299) +
                (parseInt(rgb['g'], 10) * 587) +
                (parseInt(rgb['b'], 10) * 114)) / 1000);

        return (o > 140) ? '#282E3A' : '#ffffff';
    }

    /**
     * via http://stackoverflow.com/a/13542669
     *
     * @param color
     * @param percent
     * @returns {string}
     */
    function shadeColor2(color, percent) {
        var f = parseInt(color.slice(1), 16),
            t = percent < 0 ? 0 : 255,
            p = percent < 0 ? percent * -1 : percent,
            R = f >> 16,
            G = f >> 8 & 0x00FF,
            B = f & 0x0000FF;

        return '#' + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
    }

    function appendStylesheet(css) {
        var head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

        style.type = 'text/css';

        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }

        head.appendChild(style);

        return style;
    }

    var stylesheet;

    /* eslint-disable no-multi-str */
    var cssTemplate = '.criterion-ess-navigation {\
        background-color: #color2;\
    }\
    .highlighted-button.criterion-view-ess-navigation-dynamic-button {\
        background-color: #color5 !important;\
    }\
    .highlighted-button.criterion-view-ess-navigation-dynamic-button .x-btn-icon-el:before,\
    .highlighted-button.criterion-view-ess-navigation-dynamic-button .x-btn-inner-default-small:before {\
        color: #color5-contrast !important;\
    }\
    .criterion-view-ess-navigation-static-button, .criterion-view-ess-navigation-dynamic-button {\
        border-top-color: #color2-darken !important;\
    }\
    .criterion-view-ess-navigation-static-button.highlighted-button .ess-navigation-static-menu-button {\
        background-color:#color5 !important;\
    }\
    .criterion-view-ess-navigation-static-button.highlighted-button .ess-navigation-static-menu-button .x-btn-inner-default-small,\
    .criterion-view-ess-navigation-static-button.highlighted-button .ess-navigation-static-menu-button .x-btn-icon-el:before {\
        color: #color5-contrast !important;\
    }\
    .ess-navigation-menu .x-menu-header-title,\
    .ess-navigation-menu .x-menu-body-default {\
        background-color: #color2-opacity;\
    }\
    .criterion-view-ess-navigation-static-button:not(.criterion-view-ess-navigation-toggle) .ess-navigation-static-menu-button:hover,\
    .criterion-view-ess-navigation-dynamic-button .ess-navigation-static-menu-button:hover {\
        background-color: #color4;\
    }\
    .criterion-view-ess-navigation-static-button:not(.criterion-view-ess-navigation-toggle) .ess-navigation-static-menu-button:hover .x-btn-icon-el:before,\
    .criterion-view-ess-navigation-static-button:not(.criterion-view-ess-navigation-toggle) .ess-navigation-static-menu-button:hover .x-btn-inner-default-small,\
    .criterion-view-ess-navigation-dynamic-button .ess-navigation-static-menu-button:hover .x-btn-icon-el:before {\
        color: #color4-contrast !important;\
    }\
    .criterion-view-ess-navigation-dynamic-button:not(.criterion-view-ess-navigation-toggle).x-btn-over {\
        background-color: #color4 !important;\
    }\
    .criterion-view-ess-navigation-dynamic-button:not(.criterion-view-ess-navigation-toggle).x-btn-over .x-btn-icon-el:before,\
    .criterion-view-ess-navigation-dynamic-button:not(.criterion-view-ess-navigation-toggle).x-btn-over .x-btn-inner-default-small {\
        color: #color4-contrast !important;\
    }\
    .highlighted-button.criterion-view-ess-navigation-static-button:not(.criterion-view-ess-navigation-toggle) .ess-navigation-static-menu-button:hover {\
        background-color: #color4 !important;\
    }\
    .highlighted-button.criterion-view-ess-navigation-static-button:not(.criterion-view-ess-navigation-toggle) .ess-navigation-static-menu-button:hover .x-btn-icon-el:before {\
        color: #color4-contrast !important;\
    }\
    .criterion-view-ess-navigation-toggle .criterion-view-ess-navigation-dynamic-glyph-button-trigger:hover .x-btn-icon-el,\
    .criterion-view-ess-navigation-toggle .criterion-view-ess-navigation-static-glyph-button-trigger:hover .x-btn-icon-el {\
        color: #color2-contrast !important;\
    }\
    .highlighted-button.criterion-view-ess-navigation-static-button:not(.criterion-view-ess-navigation-toggle) .criterion-view-ess-navigation-static-glyph-button-trigger .x-btn-icon-el {\
        color: #color5-contrast !important;\
    }\
    .criterion-view-ess-navigation-static-button:hover:not(.criterion-view-ess-navigation-toggle) .criterion-view-ess-navigation-static-glyph-button-trigger .x-btn-icon-el {\
        color: #color4-contrast !important;\
    }\
    .criterion-view-ess-navigation-dynamic-button .x-btn-glyph,\
    .criterion-view-ess-navigation-dynamic-button .x-btn-icon-el:before,\
    .criterion-view-ess-navigation-dynamic-button .x-btn-icon-el-default-toolbar-small,\
    .criterion-view-ess-navigation-dynamic-button .x-btn-icon-el-default-small,\
    .criterion-view-ess-navigation-static-glyph-button .x-btn-glyph,\
    .criterion-view-ess-navigation-static-glyph-button .x-btn-icon-el:before,\
    .criterion-view-ess-navigation-static-glyph-button .x-btn-icon-el-default-toolbar-small,\
    .criterion-view-ess-navigation-static-glyph-button .x-btn-icon-el-default-small,\
    .criterion-view-ess-navigation-static-glyph-button .x-btn-inner-default-small,\
    .criterion-view-ess-navigation-static-glyph-button-trigger .x-btn-glyph,\
    .criterion-view-ess-navigation-dynamic-button .x-btn-inner-default-small,\
    .ess-navigation-menu .criterion-ess-navigation-menu-btn .x-btn-inner,\
    .ess-navigation-menu .criterion-ess-navigation-menu-btn .x-btn-glyph,\
    .ess-navigation-menu .criterion-ess-navigation-menu-heading,\
    .ess-navigation-menu .criterion-ess-navigation-menu-btn.x-btn-over .x-btn-inner, \
    .criterion-selfservice .x-box-scroller.x-box-scroller-top::after,\
    .criterion-selfservice .x-box-scroller.x-box-scroller-bottom::after\
    {\
        color: #color2-contrast;\
    }\
    .ess-navigation-menu .criterion-ess-navigation-menu-btn.highlighted-button:before {\
        background-color: #color1-darken !important;\
    }\
    .ess-navigation-menu .criterion-ess-navigation-menu-btn.highlighted-button .x-btn-inner-default-small {\
        color: #color2-contrast;\
    }\
    .ess-navigation-menu .criterion-ess-navigation-menu-btn.x-btn-over,\
    .ess-navigation-menu .criterion-ess-navigation-menu-btn.highlighted-button\
    {\
        background-color: #color4-lighten !important;\
    }\
    .ess-navigation-menu .criterion-ess-navigation-menu-btn.x-btn-over .x-btn-inner {\
        color: #color4-contrast;\
    }\
    .ess-navigation-menu .criterion-ess-navigation-menu-btn.highlighted-button.x-btn-over .x-btn-inner {\
        color: red;\
    }\
    .criterion-ess-navigation-dynamic-menu .x-menu-header-title {\
        color: #color2-contrast !important;\
    }\
    .criterion-selfservice .criterion-moduletoolbar {\
        background-color: #color1;\
    }\
    .criterion-selfservice .criterion-moduletoolbar .criterion-moduletoolbar-btn-primary .x-btn-glyph,\
    .criterion-selfservice .criterion-moduletoolbar .criterion-moduletoolbar-btn-primary .x-btn-inner,\
    .criterion-selfservice .criterion-moduletoolbar .criterion-moduletoolbar-btn-primary.x-btn-over .x-btn-glyph,\
    .criterion-selfservice .criterion-moduletoolbar .criterion-moduletoolbar-btn-primary.x-btn-over .x-btn-inner,\
    .criterion-selfservice .criterion-moduletoolbar .criterion-moduletoolbar-btn-primary.x-btn-menu-active .x-btn-glyph,\
    .criterion-selfservice .criterion-moduletoolbar .criterion-moduletoolbar-btn-primary.x-btn-menu-active .x-btn-inner,\
    .criterion-selfservice .criterion-moduletoolbar .criterion-moduletoolbar-btn-primary.x-btn-pressed .x-btn-glyph,\
    .criterion-selfservice .criterion-moduletoolbar .criterion-moduletoolbar-btn-primary.x-btn-pressed .x-btn-inner,\
    .criterion-selfservice .criterion-moduletoolbar .criterion-moduletoolbar-btn-primary .x-btn-arrow-right:after,\
    .criterion-selfservice .criterion-moduletoolbar .criterion-moduletoolbar-btn-primary .x-btn.x-btn-disabled .x-btn-glyph,\
    .criterion-selfservice .criterion-moduletoolbar .criterion-moduletoolbar-btn-primary .x-btn.x-btn-disabled .x-btn-inner,\
    .criterion-selfservice .criterion-moduletoolbar .criterion-moduletoolbar-btn-secondary .x-btn-glyph,\
    .criterion-selfservice .criterion-moduletoolbar .criterion-moduletoolbar-btn-secondary .x-btn-inner,\
    .criterion-selfservice .criterion-moduletoolbar .criterion-moduletoolbar-btn-secondary.x-btn-over .x-btn-glyph,\
    .criterion-selfservice .criterion-moduletoolbar .criterion-moduletoolbar-btn-secondary.x-btn-over .x-btn-inner,\
    .criterion-selfservice .criterion-moduletoolbar .criterion-moduletoolbar-btn-secondary.x-btn-menu-active .x-btn-glyph,\
    .criterion-selfservice .criterion-moduletoolbar .criterion-moduletoolbar-btn-secondary.x-btn-menu-active .x-btn-inner,\
    .criterion-selfservice .criterion-moduletoolbar .criterion-moduletoolbar-btn-secondary.x-btn-pressed .x-btn-glyph,\
    .criterion-selfservice .criterion-moduletoolbar .criterion-moduletoolbar-btn-secondary.x-btn-pressed .x-btn-inner,\
    .criterion-selfservice .criterion-moduletoolbar .criterion-moduletoolbar-btn-secondary .x-btn-arrow-right:after,\
    .criterion-selfservice .criterion-moduletoolbar .criterion-moduletoolbar-btn-secondary .x-btn.x-btn-disabled .x-btn-glyph,\
    .criterion-selfservice .criterion-moduletoolbar .criterion-moduletoolbar-btn-secondary .x-btn.x-btn-disabled .x-btn-inner,\
    .criterion-moduletoolbar .criterion-selfservice-moduletoolbar-employer-name,\
    .criterion-moduletoolbar .criterion-selfservice-moduletoolbar-title,\
    .criterion-moduletoolbar .criterion-selfservice-moduletoolbar-organization-name\
    {\
        color: #color1-contrast;\
    }\
    .criterion-selfservice .criterion-moduletoolbar-modules .x-btn-glyph, .criterion-selfservice .criterion-moduletoolbar-modules .x-btn-inner,\
    .criterion-selfservice .criterion-moduletoolbar .criterion-moduletoolbar-btn-secondary.criterion-inbox-button .x-btn-inner-default-toolbar-large {\
        color: #color1 !important;\
    }\
    .criterion-selfservice-moduletoolbar-title {\
        border-color: #color2-border !important;\
    }\
    .criterion-selfservice .criterion-moduletoolbar .criterion-moduletoolbar-btn-secondary.criterion-inbox-button .x-btn-inner-default-toolbar-large {\
        background-color: #color3;\
    }\
    .criterion-selfservice .criterion-moduletoolbar-modules,\
    .criterion-selfservice .criterion-moduletoolbar-modules.x-btn-over,\
    .criterion-selfservice .criterion-moduletoolbar-modules.x-btn-focus,\
    .criterion-selfservice .criterion-moduletoolbar-modules.x-btn-pressed {\
        background-color: #color3 !important;\
    }\
    .x-form-item-default .x-form-trigger-wrap-focus {\
        border: 1px solid #color6 !important;\
    }\
    .x-btn.x-btn-menu-active.x-btn-default-toolbar-small,\
    .x-btn.x-btn-pressed.x-btn-default-toolbar-small {\
        background-color: #color6;\
    }\
    .criterion-splitbutton-menu .x-menu-body-default {\
        background: #color6 !important;\
    }\
    .criterion-splitbutton-menu.criterion-side-add-field-menu .x-menu-item-active {\
        background: #color6 !important;\
    }\
    .criterion-splitbutton-menu .x-menu-item-active {\
        background: #color6 !important;\
    }\
    .x-btn-feature-small {\
        background: #color6 !important;\
    }\
    .x-form-dirty .x-form-trigger-wrap.x-form-trigger-wrap-default {\
        background-color: rgba(#color6-rgb, 0.06);\
    }\
    ';

    /* eslint-enable no-multi-str */

    /**
     * @type Ext.util.LocalStorage
     */
    var essColors;

    var COLOR_CODES = ['essColor1', 'essColor2', 'essColor3', 'essColor4', 'essColor5', 'essColor6'];

    return {

        singleton : true,

        requires : [
            'Ext.util.LocalStorage'
        ],

        constructor : function() {
            this.callParent(arguments);

            essColors = new Ext.util.LocalStorage({
                id : 'essColors'
            });

            this.hasCachedColor() && this.decorate(this.getCachedColor);

            Ext.on('employeeChanged', function() {
                this.decorate(this.getColor);
            }, this);
        },

        getColor : function(name) {
            var employer = criterion.Application.getEmployer(),
                color = employer.get(name),
                re = new RegExp('^([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$');

            if (Ext.isString(color) && color.match(re)) {
                return '#' + color
            }

            return color
        },

        hasCachedColor : function() {
            return Ext.Array.filter(COLOR_CODES, function(color) {
                return !this.getCachedColor(color)
            }, this).length === 0
        },

        getCachedColor : function(colorName) {
            return essColors.getItem(colorName)
        },

        /**
         * @param {Function} fnColorGetter
         */
        decorate : function(fnColorGetter) {
            var result = cssTemplate, colors = {};

            // get colors
            Ext.Array.each(COLOR_CODES, function(color) {
                colors[color] = fnColorGetter.call(this, color)
            }, this);

            var color2rgb = hexToRgb(colors.essColor2),
                color6rgb = hexToRgb(colors.essColor6);

            this.replaceBaseColor(colors.essColor6);

            result = result.replace(/#color1-darken/g, shadeColor2(colors.essColor1, -0.4));
            result = result.replace(/#color1-contrast/g, contrastColor(colors.essColor1));
            result = result.replace(/#color2-contrast/g, contrastColor(colors.essColor2));
            result = result.replace(/#color4-contrast/g, contrastColor(colors.essColor4));
            result = result.replace(/#color5-contrast/g, contrastColor(colors.essColor5));
            result = result.replace(/#color2-darken/g, shadeColor2(colors.essColor2, -0.1));
            result = result.replace(/#color4-lighten/g, shadeColor2(colors.essColor4, 0.05));
            result = result.replace(/#color2-opacity/g, Ext.String.format('rgba({0},{1},{2},0.95)', color2rgb.r, color2rgb.g, color2rgb.b));
            result = result.replace(/#color2-border/g, Ext.String.format('rgba({0},{1},{2},0.5)', color2rgb.r, color2rgb.g, color2rgb.b));
            result = result.replace(/#color1/g, colors.essColor1);
            result = result.replace(/#color2/g, colors.essColor2);
            result = result.replace(/#color3/g, colors.essColor3);
            result = result.replace(/#color4/g, colors.essColor4);
            result = result.replace(/#color5/g, colors.essColor5);
            result = result.replace(/#color6-rgb/g, Ext.String.format('{0},{1},{2}', color6rgb.r, color6rgb.g, color6rgb.b));
            result = result.replace(/#color6/g, colors.essColor6);

            if (stylesheet) {
                var head = stylesheet.parentNode;

                head.removeChild(stylesheet);
            }

            stylesheet = appendStylesheet(result);

            // store in cache
            Ext.Array.each(COLOR_CODES, function(color) {
                essColors.setItem(color, colors[color]);
            });
        },

        ess6Color : '#13b078', // color from SCSS variable
        ess6ColorD : shadeColor2('#13b078', -0.13),

        /**
         * For CRITERION-6504
         *
         * @experimental
         * @param color
         */
        replaceBaseColor : function(color) {
            this.replaceColor(this.ess6Color, color);
            this.replaceColor(this.ess6ColorD, shadeColor2(color, -0.13));
            this.ess6Color = color;
            this.ess6ColorD = shadeColor2(color, -0.13);
        },

        replaceColor : function(baseColor, targetColor) {
            if (!hexToRgb(baseColor) || !hexToRgb(targetColor)) {
                console && console.error('Some of arguments is not in HEX format');

                return;
            }

            var baseColorRgbString = rgbToString(hexToRgb(baseColor)),
                isIE11 = Ext.isIE11;

            function replace(rule, prop) {
                var stylesList = rule.style,
                    propertyValue, propertyPriority;

                if (!stylesList) {
                    return;
                }

                if (isIE11 && stylesList.getAttribute) {
                    propertyValue = stylesList.getAttribute(prop) || stylesList.getPropertyValue(prop);
                } else {
                    propertyValue = stylesList.getPropertyValue(prop);
                }

                if (propertyValue && propertyValue === baseColorRgbString) {
                    propertyPriority = stylesList.getPropertyPriority(prop);
                    rule.style.setProperty(prop, targetColor, propertyPriority);
                }
            }

            var precessSheet = function(sheet) {
                var rules;

                try {
                    rules = sheet.cssRules;
                } catch (e) {
                    // skip if no access
                    return;
                }

                Ext.Array.each(rules || [], function applyStyle(rule) {
                    Ext.Array.each([
                        'color',
                        'background-color',
                        'border-color',
                        'border-top-color',
                        'border-right-color',
                        'border-bottom-color',
                        'border-left-color'
                    ], function(property) {
                        replace(rule, property);
                    });

                    if (rule instanceof CSSImportRule && rule.styleSheet) {
                        precessSheet(rule.styleSheet)
                    }

                    return true;
                })
            };

            Ext.Array.each(document.styleSheets, precessSheet);
        }
    }
});
