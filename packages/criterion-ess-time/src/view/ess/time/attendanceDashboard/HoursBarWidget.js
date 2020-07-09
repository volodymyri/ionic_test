Ext.define('criterion.view.ess.time.attendanceDashboard.HoursBarWidget', function() {

    const WIDTH = 190;

    return {

        alias : 'widget.criterion_selfservice_time_attendance_dashboard_hours_bar_widget',

        extend : 'Ext.container.Container',

        cls : 'criterion-selfservice-time-attendance-dashboard-period-hours-bar-widget',

        viewModel : {
            data : {
                /**
                 * @type criterion.model.employee.attendance.Overtime
                 */
                rec : null
            }
        },

        layout : {
            type : 'hbox',
            align : 'stretch'
        },

        items : [
            {
                xtype : 'container',
                cls : 'bar-block',
                barBlock : 1,
                layout : {
                    type : 'hbox',
                    align : 'stretch'
                },
                items : [
                    {
                        xtype : 'component',
                        regular : 1,
                        cls : 'regular'
                    },
                    {
                        xtype : 'component',
                        overtime : 1,
                        cls : 'overtime'
                    },
                    {
                        xtype : 'component',
                        additional : 1,
                        cls : 'additional'
                    }
                ]
            }
        ],

        initComponent() {
            this.callParent(arguments);

            this.getViewModel().bind('{rec}', function(adRecord) {
                if (adRecord) {
                    this.renderBar(adRecord);
                }
            }, this);
        },

        setRec(record) {
            this.getViewModel().set('rec', record);
        },

        renderBar(record) {
            let sum,
                regularHours = record.get('regularHours'),
                overtime = record.get('overtime'),
                additionalHours = record.get('additionalHours'),
                regVal, overVal, addVal;

            sum = (regularHours + overtime + additionalHours);

            if (sum !== 0) {
                regVal = WIDTH * regularHours / sum;
                overVal = WIDTH * overtime / sum;
                addVal = WIDTH * additionalHours / sum;
            } else {
                regVal = 0;
                overVal = 0;
                addVal = 0;
            }

            this.down('[regular]').setStyle({
                'left' : 0 + 'px',
                'width' : regVal + 'px'
            });
            this.down('[overtime]').setStyle({
                'left' : regVal + 'px',
                'width' : overVal + 'px'
            });
            this.down('[additional]').setStyle({
                'left' : (regVal + overVal) + 'px',
                'width' : addVal + 'px'
            });

            Ext.defer(function() {
                this.initTip(record);
            }, 100, this);
        },

        initTip(record) {
            let regularHours = record.get('regularHours'),
                overtime = record.get('overtime'),
                additionalHours = record.get('additionalHours');

            if (this.tip) {
                this.tip = Ext.destroy(this.tip);
            }

            if (!regularHours) {
                return;
            }

            this.tip = new Ext.tip.ToolTip({
                target : this.down('[barBlock]'),
                anchor : 'top',
                trackMouse : true,
                showOnTap : true,
                html : '<div class="hours-bar-info-tip">' +
                    '<div class="param regular">' +
                        '<span class="mark"></span>' +
                        '<span class="title">' + i18n._('Regular hours') + '</span>' +
                        '<span class="time">' + regularHours + '</span>' +
                    '</div>' +
                    (overtime ? '<div class="param overtime">' +
                        '<span class="mark"></span>' +
                        '<span class="title">' + i18n._('Overtime') + '</span>' +
                        '<span class="time">' + overtime + '</span>' +
                    '</div>' : '') +
                    (additionalHours ? '<div class="param additional">' +
                        '<span class="mark"></span>' +
                        '<span class="title">' + i18n._('Additional hours') + '</span>' +
                        '<span class="time">' + additionalHours + '</span>' +
                    '</div>' : '') +
                '</div>'
            });
        },

        destroy() {
            this.tip = Ext.destroy(this.tip);

            this.callParent();
        }
    }

});
