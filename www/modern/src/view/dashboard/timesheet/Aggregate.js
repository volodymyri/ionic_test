Ext.define('ess.view.dashboard.timesheet.Aggregate', function() {

    return {
        alias : 'widget.ess_modern_dashboard_timesheet_aggregate',

        extend : 'Ext.Panel',

        requires : [
            'ess.controller.dashboard.timesheet.Aggregate',

            'criterion.store.CustomData'
        ],

        controller : 'ess_modern_dashboard_timesheet_aggregate',

        viewModel : {
            data : {
                detailRecord : null
            },
            stores : {
                customdata : {
                    type : 'criterion_customdata',
                    sorters : [{
                        property : 'sequenceNumber',
                        direction : 'ASC'
                    }]
                }
            },
            formulas : {
                notes : function(vmget) {
                    var notes = vmget('workflowLog.actualData.notes');

                    return !!notes ? Ext.String.format('<tr><td class="bold">{0}</td><td>{1}</td></tr>', i18n.gettext('Notes'), notes) : '';
                }
            }
        },

        layout : 'vbox',

        items : [
            {
                cls : 'ess-dataview-two-col-table ess-inbox-timesheet-summary',

                bind : {
                    html : '<table>' +
                    '<tr><td class="bold">Request Time</td><td>{workflowLog.actionTime:date("m/d/Y H:i")}</td></tr>' +
                    '<tr><td class="bold">Start Date</td><td>{workflowLog.actualData.startDate:date("m/d/Y")}</td></tr>' +
                    '<tr><td class="bold">End Date</td><td>{workflowLog.actualData.endDate:date("m/d/Y")}</td></tr>' +
                    '{notes}' +
                    '</table>'
                }
            },
            // details
            {
                xtype : 'dataview',
                reference : 'detailDataView',
                scrollable : false,
                itemCls : 'ess-inbox-timesheet-detail-item',
                itemTpl : '' // see controller
            }
        ]
    }
});
