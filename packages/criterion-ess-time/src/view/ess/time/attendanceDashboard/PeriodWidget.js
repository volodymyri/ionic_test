Ext.define('criterion.view.ess.time.attendanceDashboard.PeriodWidget', function() {

    return {

        alias : 'widget.criterion_selfservice_time_attendance_dashboard_period_widget',

        extend : 'Ext.container.Container',

        cls : 'criterion-selfservice-time-attendance-dashboard-period-widget',

        viewModel : {
            data : {
                /**
                 * @type criterion.model.employee.attendance.Dashboard
                 */
                adRecord : null
            },

            formulas : {
                btnCls : function(data) {
                    let adRecord = data('adRecord');

                    return adRecord && adRecord.get('hasExceptions') ? 'hasExceptions' : ''
                },

                hasActual : {
                    bind : {
                        bindTo : '{adRecord}',
                        deep : true
                    },
                    get : function(adRecord) {
                        return !!adRecord && !!adRecord.actual().count();
                    }
                }
            }
        },

        layout : {
            type : 'hbox',
            align : 'stretch'
        },

        listeners : {
            resize : 'onResizeWidget',
            scope : 'this'
        },

        items : [
            {
                xtype : 'button',
                iconCls : 'x-fa fa-pencil-square-o',
                cls : 'criterion-btn-only-icon',
                handler : function() {
                    let view = this.up('criterion_selfservice_time_attendance_dashboard_period_widget');

                    view.fireEvent('editException', view.getViewModel().get('adRecord'));
                }
            },
            {
                xtype : 'container',
                flex : 1,
                items : [
                    // Scheduled block
                    {
                        xtype : 'container',
                        cls : 'scheduled-block',
                        layout : {
                            type : 'hbox',
                            align : 'stretch'
                        },
                        items : [
                            {
                                xtype : 'component',
                                cls : 'period-title',
                                html : i18n.gettext('Scheduled')
                            },

                            {
                                xtype : 'container',
                                contId : 'scheduledContainer',
                                cls : 'scheduled-period',
                                flex : 1,
                                padding : '0 37 0 0',
                                items : [
                                    // in renderPeriods
                                ]
                            }
                        ]
                    },
                    // Actual block
                    {
                        xtype : 'container',
                        cls : 'actual-block',
                        layout : {
                            type : 'hbox',
                            align : 'stretch'
                        },
                        hidden : true,
                        bind : {
                            hidden : '{!hasActual}'
                        },
                        items : [
                            {
                                xtype : 'component',
                                cls : 'period-title',
                                html : i18n.gettext('Actual')
                            },

                            {
                                xtype : 'container',
                                contId : 'actualContainer',
                                cls : 'actual-period',
                                flex : 1,
                                padding : '0 37 0 0',
                                items : [
                                    // in renderPeriods
                                ]
                            }

                        ]
                    }
                ]
            }
        ],

        initComponent : function() {
            this.callParent(arguments);

            this.getViewModel().bind('{adRecord}', function(adRecord) {
                if (adRecord) {
                    this.down('button')[adRecord.get('hasExceptions') ? 'addCls' : 'removeCls']('hasExceptions');
                    this.renderPeriods(adRecord);
                }
            }, this);
        },

        setAdRecord : function(record) {
            let vm = this.getViewModel();

            vm.set('adRecord', record);
        },

        onResizeWidget : function() {
            let record = this.getViewModel().get('adRecord');

            if (record) {
                this.renderPeriods(record);
            }
        },

        renderPeriods : function(record) {
            let me = this,
                actials = record.actual(),
                scheduled = record.getScheduled(),
                timeOffs = record.timeOffs(),
                scheduledContainer = this.down('[contId=scheduledContainer]'),
                width = scheduledContainer.getWidth(),
                actualContainer = this.down('[contId=actualContainer]'),
                isFullDayOff,
                scheduledStart,
                scheduledEnd,
                fullDayStart = Ext.Date.parseDate('00:00', 'H:i'),
                fullDayEnd = Ext.Date.parseDate('23:59', 'H:i');

            scheduledContainer.removeAll();
            actualContainer.removeAll();

            if (!scheduled) {
                return;
            }

            // scheduled
            isFullDayOff = scheduled.get('isFullDayOff');
            scheduledStart = scheduled.get('start');
            scheduledEnd = scheduled.get('end');

            // timeOffs
            timeOffs.each(function(timeOff) {
                scheduledContainer.add({
                    xtype : 'component',
                    cls : 'bar isTimeOff',
                    style : me.calculateStyle(width, timeOff.get('start'), timeOff.get('end'))
                })
            });

            scheduledContainer.add({
                xtype : 'component',
                cls : 'bar' + (isFullDayOff ? ' isFullDayOff' : ''),
                style : (isFullDayOff ?
                    me.calculateStyle(width, fullDayStart, fullDayEnd) :
                    me.calculateStyle(width, scheduledStart, scheduledEnd)
                )
            });

            // actual
            actials.each(function(actial) {
                let noPunchOrOutForDay = actial.get('noPunchOrOutForDay'),
                    start, end;

                if (noPunchOrOutForDay) {
                    start = scheduledStart;
                    end = scheduledEnd;
                } else {
                    start = actial.get('start');
                    end = actial.get('end');
                }

                actualContainer.add({
                    xtype : 'component',
                    cls : 'bar' + (actial.get('violation') ? ' violation' : '') + (noPunchOrOutForDay ? ' noPunchOrOutForDay' : ''),
                    style : me.calculateStyle(width, start, end)
                })
            });

            Ext.defer(function() {
                this.initTips(scheduledContainer, actualContainer);
            }, 100, this);
        },

        initTips : function(scheduledContainer, actualContainer) {
            let me = this,
                sTips,
                aTips,
                scheduledContainerEl = scheduledContainer.getEl(),
                actualContainerEl = actualContainer.getEl();

            if (this.tips) {
                this.tips = Ext.destroy(this.tips);
            }

            if (!scheduledContainerEl || !actualContainerEl) {
                return;
            }

            sTips = Ext.Array.map(scheduledContainerEl.query('.bar', false), function(el) {
                return new Ext.tip.ToolTip({
                    target : el,
                    anchor : 'top',
                    trackMouse : true,
                    showOnTap : true,
                    html : me.createInfoHtml()
                });
            });

            aTips = Ext.Array.map(actualContainerEl.query('.bar', false), function(el) {
                return new Ext.tip.ToolTip({
                    target : el,
                    anchor : 'top',
                    trackMouse : true,
                    showOnTap : true,
                    html : me.createInfoHtml()
                });
            });

            this.tips = Ext.Array.merge(sTips, aTips);
        },

        createInfoHtml : function() {
            let vm = this.getViewModel(),
                actual = vm.get('adRecord.actual'),
                aCount = actual.count(),
                scheduled = vm.get('adRecord.scheduled'),
                scheduledStart = Ext.Date.format(scheduled.get('start'), criterion.consts.Api.SHOW_TIME_FORMAT),
                scheduledEnd = Ext.Date.format(scheduled.get('end'), criterion.consts.Api.SHOW_TIME_FORMAT),
                isFullDayOff = scheduled.get('isFullDayOff'),
                actualStart = aCount ? Ext.Date.format(actual.first().get('start'), criterion.consts.Api.SHOW_TIME_FORMAT) : '',
                actualEnd = aCount ? Ext.Date.format(actual.last().get('end'), criterion.consts.Api.SHOW_TIME_FORMAT) : '',
                violation = aCount ? (actual.first().get('violation') ? 'violation' : '') : '';

            return '<div class="period-info-tip">' +
                (!isFullDayOff ? '<div class="param">' +
                        '<span class="title">Scheduled</span>' +
                        '<span class="time">' + scheduledStart +  ' &mdash; ' + scheduledEnd + '</span>' +
                '</div>' : '') +
                '<div class="param">' +
                    '<span class="title">Actual</span>' +
                    '<span class="time normal ' + violation + '">' + actualStart + ' &mdash; ' + actualEnd + '</span>' +
                '</div>' +
            '</div>';
        },

        calculateStyle : function(width, start, end) {
            let iWidth = width - 36, // correction
                startDayTimestamp = +Ext.Date.clearTime(new Date()),
                startTimestamp = +start,
                endTimestamp = +end,
                leftOffset = (startTimestamp - startDayTimestamp) * iWidth / 86399000,
                rightOffset = (endTimestamp - startDayTimestamp) * iWidth / 86399000;

            return {
                left : leftOffset + 'px',
                width : (rightOffset - leftOffset) + 'px'
            }
        },

        destroy : function() {
            this.tips = Ext.destroy(this.tips);
            
            this.callParent();
        }
    }

});
