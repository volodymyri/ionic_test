Ext.define('criterion.view.scheduling.shiftGroup.ShiftSchedule', function() {

    return {
        alias : 'widget.criterion_scheduling_shift_group_shift_schedule',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.scheduling.shiftGroup.ShiftSchedule'
        ],

        mixins : [
            'Ext.util.StoreHolder'
        ],

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : 'auto',

                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
            }
        ],

        controller : {
            type : 'criterion_scheduling_shift_group_shift_schedule'
        },

        listeners : {
            show : 'onShow'
        },

        bind : {
            title : '{title}',
            store : '{shiftSchedule}'
        },

        getStoreListeners : function() {
            return {
                add : this.reconstruct,
                remove : this.reconstruct
            }
        },

        dockedItems : [
            {
                xtype : 'container',
                layout : 'hbox',
                dock : 'top',
                margin : '5 0 0 5',
                items : [
                    {
                        xtype : 'button',
                        cls : 'criterion-btn-feature',
                        glyph : criterion.consts.Glyph['android-add'],
                        handler : 'handleAddSchedule',
                        hidden : true,
                        bind : {
                            hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.SCHEDULING_ASSIGNMENT, criterion.SecurityManager.CREATE, true)
                        }
                    },
                    {
                        xtype : 'component',
                        html : '<span class="criterion-darken-gray">' + i18n.gettext('Add an interval') + '</span>',
                        margin : '10 0 0 10',
                        bind : {
                            hidden : '{shiftSchedule.count}'
                        }
                    }
                ]
            }
        ],

        items : [
            {
                xtype : 'container',
                height : 300,
                scrollable : 'vertical',
                reference : 'shContainer',

                items : [
                    // dynamic
                ]
            }
        ],

        initComponent : function() {
            let me = this;

            this.callParent(arguments);
            Ext.defer(_ => me.reconstruct(), 100);
        },

        createItems() {
            let items = [];

            this.getStore().each(rec => {
                let id = rec.getId();

                items.push(rec.get('title') ? {
                    xtype : 'container',
                    layout : {
                        type : 'hbox',
                        align : 'stretch'
                    },

                    viewModel : {
                        data : {
                            schedule : rec
                        },
                        formulas : {
                            scheduleTitle : (get) => {
                                let schedule = get('schedule'),
                                    title = schedule && schedule.get('title'),
                                    startTime = schedule && schedule.get('startTime'),
                                    endTime = schedule && schedule.get('endTime'),
                                    timeText = (startTime && endTime) ? Ext.String.format('{0} {1} {2}',
                                        Ext.Date.format(startTime, criterion.consts.Api.SHOW_TIME_FORMAT),
                                        i18n.gettext('to'),
                                        Ext.Date.format(endTime, criterion.consts.Api.SHOW_TIME_FORMAT)) : i18n.gettext('All Day');

                                return `${title} (${timeText})`;
                            }
                        }
                    },

                    margin : '0 0 5 0',

                    items : [
                        {
                            xtype : 'component',

                            bind : {
                                html : '{scheduleTitle}'
                            }
                        }
                    ]
                } : {
                    xtype : 'container',
                    layout : {
                        type : 'hbox',
                        align : 'stretch'
                    },

                    viewModel : {
                        data : {
                            schedule : rec
                        }
                    },

                    margin : '0 0 5 0',

                    items : [
                        {
                            xtype : 'timefield',
                            allowBlank : false,
                            formatText : null,
                            flex : 1,
                            reference : `start_${id}`,
                            bind : {
                                value : '{schedule.startTime}'
                            }
                        },
                        {
                            xtype : 'component',
                            html : i18n.gettext('to'),
                            margin : '10 10 0 10'
                        },
                        {
                            xtype : 'timefield',
                            allowBlank : false,
                            formatText : null,
                            flex : 1,
                            reference : `end_${id}`,
                            bind : {
                                value : '{schedule.endTime}'
                            }
                        },
                        {
                            xtype : 'button',
                            cls : 'criterion-btn-transparent',
                            glyph : criterion.consts.Glyph['ios7-trash-outline'],
                            scale : 'small',
                            padding : '0 5 0 5',
                            margin : '0 10 0 0',
                            handler : 'handleRemoveSchedule',
                            hidden : true,
                            bind : {
                                hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.SCHEDULING_ASSIGNMENT, criterion.SecurityManager.DELETE, true)
                            },
                            $record : rec
                        }
                    ]
                })
            });

            return items;
        },

        reconstruct() {
            let shContainer = this.down('[reference=shContainer]'),
                items, height,
                maxHeight = Ext.getBody().getHeight() / 2;

            Ext.suspendLayouts();
            shContainer.removeAll();
            items = this.createItems();
            shContainer.add(items);
            Ext.resumeLayouts(true);
            height = items.length * 42;
            shContainer.setHeight(height > maxHeight ? maxHeight : height);
            this.getPlugin('criterionSidebar').reCenter()
        },

        buttons : [
            '->',
            {
                xtype : 'button',
                cls : 'criterion-btn-light',
                reference : 'cancelBtn',
                handler : 'handleCancel',
                text : i18n.gettext('Cancel')
            },
            {
                xtype : 'button',
                cls : 'criterion-btn-primary',
                text : i18n.gettext('Change'),
                handler : 'handleChange',
                hidden : true,
                bind : {
                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.SCHEDULING_ASSIGNMENT, criterion.SecurityManager.UPDATE, true)
                }
            }
        ]
    }
});
