//TODO Check and remove this override after fix EXTJS-28629 by Sencha

// Warning 17.06.2020 Sencha 7.2.0.75 fix not working! the code has been left as it is since version 6. ter

Ext.define('criterion.overrides.event.Event', {

    override : 'Ext.event.Event',

    getWheelDeltas: function() {
        var me = this,
            event = me.browserEvent,
            dx = 0,
            dy = 0;
        // the deltas
        if (Ext.isDefined(event.wheelDeltaX)) {
            // WebKit and Edge have both dimensions
            dx = event.wheelDeltaX;
            dy = event.wheelDeltaY;
        } else if (event.wheelDelta) {
            // old WebKit and IE
            dy = event.wheelDelta;
        } else if ('deltaX' in event) {
            // IE11
            dx = event.deltaX;
            dy = -event.deltaY;
        }
        // backwards
        else if (event.detail) {
            // Gecko
            dy = -event.detail;
            // gecko is backwards
            // Gecko sometimes returns really big values if the user changes settings to
            // scroll a whole page per scroll
            if (dy > 100) {
                dy = 3;
            } else if (dy < -100) {
                dy = -3;
            }
            // Firefox 3.1 adds an axis field to the event to indicate direction of
            // scroll.  See https://developer.mozilla.org/en/Gecko-Specific_DOM_Events
            if (Ext.isDefined(event.axis) && event.axis === event.HORIZONTAL_AXIS) {
                dx = dy;
                dy = 0;
            }
        }
        return {
            x: me.correctWheelDelta(dx),
            y: me.correctWheelDelta(dy)
        };
    },

    correctWheelDelta: function(delta) {
        let WHEEL_SCALE = 120,
            scale_;

        if (Ext.isGecko) {
            // Firefox uses 3 on all platforms
            WHEEL_SCALE = 3;
        } else if (Ext.isMac) {
            // Continuous scrolling devices have momentum and produce much more scroll than
            // discrete devices on the same OS and browser. To make things exciting, Safari
            // (and not Chrome) changed from small values to 120 (like IE).

            if (Ext.isSafari && Ext.webKitVersion >= 532.0) {
                // Safari changed the scrolling factor to match IE (for details see
                // https://bugs.webkit.org/show_bug.cgi?id=24368). The WebKit version where this
                // change was introduced was 532.0
                //      Detailed discussion:
                //      https://bugs.webkit.org/show_bug.cgi?id=29601
                //      http://trac.webkit.org/browser/trunk/WebKit/chromium/src/mac/WebInputEventFactory.mm#L1063
                scale_ = 120;
            } else {
                // MS optical wheel mouse produces multiples of 12 which is close enough
                // to help tame the speed of the continuous mice...
                scale_ = 12;
            }

            // Momentum scrolling produces very fast scrolling, so increase the scale factor
            // to help produce similar results cross platform. This could be even larger and
            // it would help those mice, but other mice would become almost unusable as a
            // result (since we cannot tell which device type is in use).
            WHEEL_SCALE = 3 * scale_;
        }

        var scale = WHEEL_SCALE,
            ret = Math.round(delta / scale);
        if (!ret && delta) {
            ret = (delta < 0) ? -1 : 1;
        }
        // don't allow non-zero deltas to go to zero!
        return ret;
    }

});
