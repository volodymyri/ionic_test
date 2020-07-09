Ext.define('criterion.ux.picker.Date', function() {

    return {
        extend : 'Ext.picker.Date',

        alias : 'widget.criterion_picker_date',

        config : {
            fixedMonth : false,
            highlightedDates : [],
            highlightedHolidays : [],
            /**
             * Picker cannot live without "active" date, but sometimes it may not be needed.
             * This option is to visually hide currently selected date.
             */
            hideSelectedDay: false
        },

        initComponent : function() {
            this.fixedMonthCls = this.baseCls + '-fixed-month';
            this.tips = {};
            this.callParent(arguments);
        },

        afterRender : function() {
            this.callParent(arguments);
            this.updateFixedMonth(this.fixedMonth);
        },

        update : function() {
            this.callParent(arguments);
            this.selectedUpdate();
            this.highlightedDaysUpdate(this.getHighlightedDates(), this.getHighlightedHolidays());
        },

        updateFixedMonth : function(value) {
            if (this.rendered) {
                if (value) {
                    this.el.addCls(this.fixedMonthCls);
                    this.monthBtn.disable();
                } else {
                    this.el.removeCls(this.fixedMonthCls);
                    this.monthBtn.enable();
                }
            }

            this.fixedMonth = value;
        },

        showPrevMonth : function(e) {
            if (!this.getFixedMonth()) {
                this.callParent(arguments);
            }
        },

        selectedUpdate: function(date) {
            if (!this.getHideSelectedDay()) {
                this.callParent(arguments);
            } else {
                if (this.activeCell) {
                    Ext.fly(this.activeCell).removeCls(this.selectedCls);
                    this.activeCell.setAttribute('aria-selected', false);
                }
            }
        },

        showNextMonth : function(e) {
            if (!this.getFixedMonth()) {
                this.callParent(arguments);
            }
        },

        handleMouseWheel: function(e) {
            var delta;

            if (!this.getFixedMonth()) {
                e.stopEvent();
            }

            if (!this.disabled) {
                delta = e.getWheelDelta();

                if (delta > 0) {
                    this.showPrevMonth();
                }
                else if (delta < 0) {
                    this.showNextMonth();
                }
            }
        },

        highlightedDaysUpdate : function(days, holidays) {
            var me = this,
                cells = me.cells,
                tips = me.tips;

            me.resetCells();

            for (var i = 0; i < days.length; i++) {
                this.highlightDate(days[i]);
            }

            for (var i = 0; i < holidays.length; i++) {
                this.highlightHoliday(holidays[i]);
            }

            Ext.Object.each(tips, function(time, tipCfg) {
                var cell = cells.item(tipCfg.cellIndex);

                if (!cell.hasCls('tipped') && tipCfg.tip) {
                    cell.addCls('tipped');
                    tipCfg.tipCl = Ext.create('Ext.tip.ToolTip', {
                        target : cell,
                        html : tipCfg.tip
                    });
                }
            });
        },

        resetCells : function() {
            var me = this,
                cells = me.cells,
                tips = me.tips;

            for (var c = 0; c < cells.getCount(); c++) {
                var cell = cells.item(c).down('.x-datepicker-date'),
                    marker = cell.down('.multy-marker');

                cell.removeCls('isSetted multiDates');
                marker ? marker.destroy() : null;
            }

            Ext.Object.each(tips, function(tipCfg) {
                tipCfg.tipCl ? tipCfg.tipCl.destroy() : null;
            });
        },

        getCellByDate : function(date) {
            var me = this,
                vdate = +date;

            return Ext.Array.findBy(me.textNodes, function(val) {
                return val.dateValue == vdate;
            });
        },

        /**
         *
         * @param {Object} params
         * @param {Object} params.date
         * @param {Object} params.color
         * @param {Object} params.cls
         */
        highlightDate : function(params) {
            var me = this,
                time = (Ext.Date.clearTime(params.date, true)).getTime(),
                cls = params.cls || me.selectedCls,
                cells = me.cells,
                pic,
                tips = this.tips;

            for (var c = 0; c < cells.getCount(); c++) {
                var cell = cells.item(c);

                if (me.textNodes[c].dateValue == time) {
                    cell.addCls(cls);

                    if (params.color) {
                        pic = cell.down('.x-datepicker-date');

                        if (!pic.hasCls('isSetted')) {
                            pic.addCls('isSetted');
                            pic.setStyle('background-color', params.color);
                        } else if (!pic.hasCls('multiDates')) {
                            pic.addCls('multiDates');
                            pic.createChild({
                                cls : 'multy-marker',
                                html : '<span class="c-blue">&bull;</span><span class="c-green">&bull;</span><span class="c-red">&bull;</span>'
                            });
                        }
                    }
                    if (params.tooltip) {
                        if (!tips[time]) {
                            tips[time] = {
                                cellIndex : c,
                                tip : params.tooltip
                            };
                        } else {
                            tips[time]['tip'] = null; //tips[time]['tip'] + '<br />' + params.tooltip;
                        }
                    }
                }
            }
        },

        highlightHoliday : function(params) {
            var me = this,
                time = (Ext.Date.clearTime(params.date, true)).getTime(),
                cells = me.cells,
                tips = this.tips;

            for (var c = 0; c < cells.getCount(); c++) {
                var cell = cells.item(c);

                if (me.textNodes[c].dateValue == time) {
                    var pic = cell.down('.x-datepicker-date');

                    pic.setStyle('font-weight', 'bold');

                    if (params.tooltip) {
                        if (!tips[time]) {
                            tips[time] = {
                                cellIndex : c,
                                tip : params.tooltip
                            };
                        }
                    }
                }
            }
        }
    }
});
