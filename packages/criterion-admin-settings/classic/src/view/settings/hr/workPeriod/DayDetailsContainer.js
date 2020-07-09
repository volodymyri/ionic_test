Ext.define('criterion.view.settings.hr.workPeriod.DayDetailsContainer', function() {

    return {

        alias : 'widget.criterion_settings_work_period_day_details_container',

        extend : 'Ext.Container',

        mixins : [
            'Ext.util.StoreHolder'
        ],

        items : [],

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        viewModel : true,

        defaultListenerScope : true,

        getStoreListeners : function() {
            return {
                add : this.reconstruct,
                remove : this.reconstruct
            }
        },

        initComponent : function() {
            let me = this;

            this.callParent(arguments);
            Ext.defer(_ => me.reconstruct(), 100);
        },

        createItems() {
            let items = [],
                store = this.getStore(),
                i = 0,
                count = store.count();

            store.each(rec => {
                i++;

                let id = rec.getId(),
                    first = i === 1,
                    last = i === count,
                    btns = [];

                if (last) {
                    btns.push({
                        xtype : 'button',
                        cls : 'criterion-btn-transparent btn-glyph-bold',
                        glyph : criterion.consts.Glyph['ios7-plus-outline'],
                        tooltip : i18n.gettext('Add Period'),
                        scale : 'small',
                        width : 16,
                        handler : 'handleAddDetail'
                    });
                } else {
                    btns.push({
                        xtype : 'component',
                        width : 16
                    });
                }

                if (!first) {
                    btns.push({
                        xtype : 'button',
                        cls : 'criterion-btn-transparent btn-glyph-bold gray-btn-glyph',
                        glyph : criterion.consts.Glyph['ios7-trash-outline'],
                        tooltip : i18n.gettext('Delete'),
                        scale : 'small',
                        width : 16,
                        margin : '0 0 0 7',
                        handler : 'handleRemoveDetail',
                        $rec : rec
                    });
                }

                items.push({
                    xtype : 'container',
                    layout : {
                        type : 'hbox',
                        align : 'stretch'
                    },

                    margin : !last ? '0 0 10 0' : 0,

                    viewModel : {
                        data : {
                            dayDetail : rec
                        }
                    },

                    items : [
                        {
                            xtype : 'timefield',
                            formatText : null,
                            reference : `start_${id}`,
                            triggerCls : Ext.baseCSSPrefix + 'form-trigger-clock',
                            allowBlank : false,
                            width : 120,
                            margin : '0 10 0 0',
                            value : rec.get('scheduledStart'),
                            disabled : true,
                            bind : {
                                value : '{dayDetail.scheduledStart}',
                                disabled : '{!day.isActive}'
                            }
                        },
                        {
                            xtype : 'timefield',
                            formatText : null,
                            reference : `end_${id}`,
                            triggerCls : Ext.baseCSSPrefix + 'form-trigger-clock',
                            allowBlank : false,
                            width : 120,
                            value : rec.get('scheduledEnd'),
                            disabled : true,
                            bind : {
                                value : '{dayDetail.scheduledEnd}',
                                minValue : '{dayDetail.scheduledStart}',
                                disabled : '{!day.isActive}'
                            }
                        },
                        {
                            xtype : 'component',
                            flex : 1
                        },
                        {
                            xtype : 'container',
                            layout : {
                                type : 'hbox',
                                align : 'stretch'
                            },
                            width : 40,
                            items : btns
                        }
                    ]
                })
            });

            return items;
        },

        reconstruct() {
            let items;

            Ext.suspendLayouts();

            this.removeAll();
            items = this.createItems();
            this.add(items);

            Ext.resumeLayouts(true);
        },

        handleAddDetail(btn) {
            let vm = this.getViewModel(),
                day = vm.get('day'),
                store = this.getStore();

            store.add({
                workPeriodDayId : day.getId()
            });
        },

        handleRemoveDetail(btn) {
            this.getStore().remove(btn.$rec);
        },

        validateIntervals() {
            let me = this,
                store = this.getStore(),
                res = true;

            store.each(rec => {
                let sId = rec.getId(),
                    start = me.convertTimeToCurrentDate(rec.get('scheduledStart')),
                    end = me.convertTimeToCurrentDate(rec.get('scheduledEnd')),
                    endIsMidnight = end ? end.getHours() === 0 && end.getMinutes() === 0 : true;

                if (Ext.Date.isEqual(start, end) && !endIsMidnight) {
                    me.down(`[reference=start_${sId}]`).markInvalid(i18n.gettext('Dates of interval should be different'));
                    res = false;

                    return;
                }

                if (end < start && !endIsMidnight) {
                    me.down(`[reference=start_${sId}]`).markInvalid(i18n.gettext('Start time should be less than end time'));
                    res = false;

                    return;
                }

                store.each(inSchedule => {
                    if (inSchedule.getId() === sId) {
                        return;
                    }

                    let inStart = me.convertTimeToCurrentDate(inSchedule.get('scheduledStart')),
                        inEnd = me.convertTimeToCurrentDate(inSchedule.get('scheduledEnd'));

                    if (!inStart || !inEnd) {
                        return;
                    }

                    if (start && Ext.Date.between(start, inStart, inEnd)) {
                        me.down(`[reference=start_${sId}]`).markInvalid(i18n.gettext('Value crosses an existing interval'));
                        res = false;
                    }

                    if (end && (end !== inStart && !endIsMidnight ) && Ext.Date.between(end, inStart, inEnd)) {
                        me.down(`[reference=end_${sId}]`).markInvalid(i18n.gettext('Value crosses an existing interval'));
                        res = false;
                    }
                });
            });

            return res;
        },

        convertTimeToCurrentDate(value) {
            return Ext.Date.parse(Ext.Date.format(value, criterion.consts.Api.TIME_FORMAT), criterion.consts.Api.TIME_FORMAT);
        }
    }
});
