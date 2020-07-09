Ext.define('criterion.ux.picker.Time', function() {

    function checkHoursValue(val, is12Limit) {
        var v = parseInt(val, 10),
            limit = is12Limit ? 12 : 23,
            minCheck = is12Limit ? v > 0 : v >= 0;

        return Ext.isNumber(v) && minCheck && (v <= limit);
    }

    function checkMinutesValue(val) {
        var v = parseInt(val, 10);

        return Ext.isNumber(v) && (v >= 0) && (v <= 59);
    }

    return {

        extend : 'criterion.ux.Panel',

        alias : 'widget.criterion_picker_time',

        baseCls : 'criterion-picker-time',

        minWidth : 240,
        maxWidth : 240,
        defaultListenerScope : true,

        viewModel : {
            data : {
                value : null,
                showAMPM : true
            },

            formulas : {
                hoursValue : {
                    get : function(get) {
                        return Ext.Date.format(get('value'), (get('showAMPM') ? 'h' : 'H'));
                    },

                    set : function(hoursV) {
                        var showAMPM = this.get('showAMPM'),
                            minutes = this.get('minutesValue'),
                            ampm = this.get('ampmValue'),
                            hours = Ext.String.leftPad(hoursV.substr(-2), 2, '0');

                        if (!checkHoursValue(hours, showAMPM) || !checkMinutesValue(minutes)) {
                            return;
                        }

                        this.set(
                            'value',
                            Ext.Date.parse(
                                hours + ':' + minutes + (showAMPM ? ' ' + ampm : ''),
                                (showAMPM ? 'h:i A' : 'H:i')
                            )
                        );
                    }
                },

                minutesValue : {
                    get : function(get) {
                        return Ext.Date.format(get('value'), 'i');
                    },

                    set : function(minutesV) {
                        var showAMPM = this.get('showAMPM'),
                            hours = this.get('hoursValue'),
                            ampm = this.get('ampmValue'),
                            minutes = Ext.String.leftPad(minutesV.substr(-2), 2, '0');

                        if (!checkHoursValue(hours, showAMPM) || !checkMinutesValue(minutes)) {
                            return;
                        }

                        this.set(
                            'value',
                            Ext.Date.parse(
                                hours + ':' + minutes + (showAMPM ? ' ' + ampm : ''),
                                (showAMPM ? 'h:i A' : 'H:i')
                            )
                        );
                    }
                },

                ampmValue : {
                    get : function(get) {
                        return Ext.Date.format(get('value'), 'A');
                    },

                    set : function(ampm) {
                        var hours = this.get('hoursValue'),
                            minutes = this.get('minutesValue');

                        this.set(
                            'value',
                            Ext.Date.parse(
                                hours + ':' + minutes + ' ' + ampm,
                                'h:i A'
                            )
                        );
                    }
                }
            }
        },

        buttons : [
            {
                xtype : 'button',
                text : i18n.gettext('Cancel'),
                ui : 'light',
                handler : 'onCancel'
            },
            ' ',
            {
                xtype : 'button',
                ref : 'mainBtn',
                text : i18n.gettext('Done'),
                handler : 'onDone'
            },
            ' '
        ],

        items : [
            {
                xtype : 'container',
                layout : {
                    type : 'hbox',
                    align : 'stretch'
                },
                margin : '0 0 5 0',
                items : [
                    {
                        flex : 1
                    },
                    {
                        xtype : 'container',
                        layout : {
                            type : 'vbox',
                            align : 'stretch'
                        },
                        width : 50,
                        items : [
                            {
                                xtype : 'button',
                                scale : 'small',
                                cls : ['criterion-btn-ess-new-light', 'icon-only'],
                                glyph : criterion.consts.Glyph['chevron-up'],
                                handler : 'onHoursUp'
                            },
                            {
                                xtype : 'textfield',
                                ref : 'firstField',
                                width : 50,
                                stripCharsRe : new RegExp('[^0123456789]', 'gi'),
                                bind : '{hoursValue}',
                                enableKeyEvents : true,
                                listeners : {
                                    keypress : 'onTimeFieldKeyPress'
                                }
                            },
                            {
                                xtype : 'button',
                                scale : 'small',
                                cls : ['criterion-btn-ess-new-light', 'icon-only'],
                                glyph : criterion.consts.Glyph['chevron-down'],
                                handler : 'onHoursDown'
                            }
                        ]
                    },
                    {
                        xtype : 'container',
                        layout : {
                            type : 'vbox'
                        },
                        items : [
                            {
                                height : 30
                            },
                            {
                                xtype : 'component',
                                html : ':',
                                margin : '0 5'
                            },
                            {
                                flex : 1
                            }
                        ]
                    },
                    {
                        xtype : 'container',
                        layout : {
                            type : 'vbox',
                            align : 'stretch'
                        },
                        width : 50,
                        items : [
                            {
                                xtype : 'button',
                                scale : 'small',
                                cls : ['criterion-btn-ess-new-light', 'icon-only'],
                                glyph : criterion.consts.Glyph['chevron-up'],
                                handler : 'onMinutesUp'
                            },
                            {
                                xtype : 'textfield',
                                ref : 'secondField',
                                width : 50,
                                stripCharsRe : new RegExp('[^0123456789]', 'gi'),
                                bind : '{minutesValue}',
                                enableKeyEvents : true,
                                listeners : {
                                    keypress : 'onTimeFieldKeyPress'
                                }
                            },
                            {
                                xtype : 'button',
                                scale : 'small',
                                cls : ['criterion-btn-ess-new-light', 'icon-only'],
                                glyph : criterion.consts.Glyph['chevron-down'],
                                handler : 'onMinutesDown'
                            }
                        ]
                    },
                    // AM PM
                    {
                        xtype : 'container',
                        layout : {
                            type : 'vbox',
                            align : 'stretch'
                        },
                        hidden : true,
                        bind : {
                            hidden : '{!showAMPM}'
                        },
                        width : 55,
                        margin : '0 0 0 10',
                        items : [
                            {
                                xtype : 'button',
                                scale : 'small',
                                cls : ['criterion-btn-ess-new-light', 'icon-only'],
                                glyph : criterion.consts.Glyph['chevron-up'],
                                handler : 'onAMPMSwitch'
                            },
                            {
                                xtype : 'textfield',
                                ref : 'ampmField',
                                width : 55,
                                readOnly : true,
                                bind : '{ampmValue}'
                            },
                            {
                                xtype : 'button',
                                scale : 'small',
                                cls : ['criterion-btn-ess-new-light', 'icon-only'],
                                glyph : criterion.consts.Glyph['chevron-down'],
                                handler : 'onAMPMSwitch'
                            }
                        ]
                    },
                    {
                        flex : 1
                    }
                ]
            }
        ],

        initComponent : function() {
            var me = this;

            this.callParent(arguments);

            Ext.Function.defer(me.initKeyNav, 200, me);
        },

        initKeyNav : function() {
            var me = this;

            new Ext.util.KeyNav({
                target : me.down('[ref=firstField]').getEl(),
                up : me.onHoursUp,
                down : me.onHoursDown,
                enter : me.onDone,
                tab : function() {
                    me.handleFieldFocus('secondField');
                },
                scope : me
            });

            new Ext.util.KeyNav({
                target : me.down('[ref=secondField]').getEl(),
                up : me.onMinutesUp,
                down : me.onMinutesDown,
                enter : me.onDone,
                tab : function() {
                    me.handleFieldFocus('ampmField');
                },
                scope : me
            });

            new Ext.util.KeyNav({
                target : me.down('[ref=ampmField]').getEl(),
                up : me.onAMPMSwitch,
                down : me.onAMPMSwitch,
                enter : me.onDone,
                tab : function() {
                    me.handleFieldFocus('mainBtn');
                },
                scope : me
            });
        },

        onTimeFieldKeyPress : function(cmp) {
            Ext.defer(function() {
                cmp.setValue(cmp.getValue().substr(-2));
            }, 100)
        },

        handleFieldFocus : function(ref) {
            Ext.Function.defer(function() {
                this.down('[ref=' + ref + ']').focus();
            }, 100, this);
        },

        onShow : function() {
            this.callParent(arguments);

            this.getViewModel().set('showAMPM', /[Aa]/.test(this.format));
            this.handleFieldFocus('firstField');
        },

        setValue : function(v) {
            if (Ext.isString(v)) {
                v = Ext.Date.parse(v, this.format);
            }

            this.getViewModel().set('value', v);
        },

        onHoursUp : function() {
            var vm = this.getViewModel(),
                hours = this.down('[ref=firstField]'),
                currentVal = parseInt(vm.get('hoursValue'), 10),
                is12Hours = vm.get('showAMPM'),
                limit = is12Hours ? 12 : 23,
                min = is12Hours ? 1 : 0,
                val;

            val = currentVal + 1;
            if (val > limit) {
                val = min;
            }

            hours.setValue(Ext.String.leftPad(val, 2, '0'));
        },

        onHoursDown : function() {
            var vm = this.getViewModel(),
                hours = this.down('[ref=firstField]'),
                currentVal = parseInt(vm.get('hoursValue'), 10),
                is12Hours = vm.get('showAMPM'),
                limit = is12Hours ? 12 : 23,
                val;

            val = currentVal - 1;
            if (is12Hours ? val === 0 : val < 0) {
                val = limit;
            }

            hours.setValue(Ext.String.leftPad(val, 2, '0'));
        },

        onMinutesUp : function() {
            var vm = this.getViewModel(),
                minutes = this.down('[ref=secondField]'),
                currentVal = parseInt(vm.get('minutesValue'), 10),
                val;

            val = currentVal + 1;
            if (val > 59) {
                val = 0;
            }

            minutes.setValue(Ext.String.leftPad(val, 2, '0'));
        },

        onMinutesDown : function() {
            var vm = this.getViewModel(),
                minutes = this.down('[ref=secondField]'),
                currentVal = parseInt(vm.get('minutesValue'), 10),
                val;

            val = currentVal - 1;
            if (val < 0) {
                val = 59;
            }

            minutes.setValue(Ext.String.leftPad(val, 2, '0'));
        },

        onAMPMSwitch : function() {
            var vm = this.getViewModel(),
                curValue = vm.get('ampmValue');

            vm.set('ampmValue', curValue === 'AM' ? 'PM' : 'AM')
        },

        onCancel : function() {
            this.fireEvent('tabout');
        },

        onDone : function() {
            var me = this,
                vm = this.getViewModel(),
                hours = me.down('[ref=firstField]'),
                minutes = me.down('[ref=secondField]'),
                value;

            if (!checkHoursValue(hours.getValue(), vm.get('showAMPM'))) {
                hours.markInvalid(i18n.gettext('Wrong value!'));
                return;
            }

            if (!checkMinutesValue(minutes.getValue())) {
                minutes.markInvalid(i18n.gettext('Wrong value!'));
                return;
            }

            value = vm.get('value');

            if (me.startTimeThreshold && Ext.Date.diff(value, me.startTimeThreshold, Ext.Date.MINUTE) > 0) {
                hours.markInvalid(i18n.gettext('less') + '<br/>' + Ext.Date.format(me.startTimeThreshold, me.format));
                return;
            }

            if (hours.isValid() && minutes.isValid()) {
                this.fireEvent('select', me, value);
            } else if (!hours.isValid()) {
                hours.focus();
            } else if (!minutes.isValid()) {
                minutes.focus();
            }
        }
    }
});
