Ext.define('criterion.view.ess.dashboard.infoActionPanel.Tasks', function() {

    const WORKFLOW_TYPE_CODE = criterion.Consts.WORKFLOW_TYPE_CODE,
        WORKFLOW_STATUSES = criterion.Consts.WORKFLOW_STATUSES;

    return {

        extend : 'criterion.ux.grid.Panel',

        alias : 'widget.criterion_selfservice_dashboard_info_action_panel_tasks',

        requires : [
            'Ext.grid.feature.Grouping'
        ],

        title : i18n.gettext('My Tasks'),

        iconCls : 'icon-tasks',

        layout : 'fit',

        width : '100%',

        scrollable : false,

        cls : [
            'logGrid',
            'criterion-ess-dashboard-grid',
            'info-panel-element'
        ],

        hideHeaders : true,

        collapsible : true,

        titleCollapse : true,

        features : [
            {
                ftype : 'grouping',
                id : 'grouping',
                startCollapsed : true,
                groupHeaderTpl : Ext.create('Ext.XTemplate',
                    '<span class="count">{children.length}</span>',
                    '<div class="text">{name}</div>'
                )
            }
        ],

        listeners : {
            groupcollapse : 'handleTasksGroupCollapse'
        },
        
        bind : {
            store : '{workflowLogs}'
        },

        emptyText : i18n.gettext('You have no tasks'),

        columns : [
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : '',
                dataIndex : 'employeeName',
                encodeHtml : false,
                renderer : function(value, cell, record) {
                    let dueDate = record.get('dueDate'),
                        dueDateDiff = dueDate ? Ext.Date.diff(Date.now(), dueDate, Ext.Date.DAY) : Number.MAX_VALUE,
                        iconCls = 'dueIcon-',
                        assignedToEmployeeName = record.get('assignedToEmployeeName'),
                        url = (
                            record.get('isOnboarding') && !record.get('isOnboardingForm') ?
                            criterion.consts.Route.SELF_SERVICE.DASHBOARD_TASK :
                            criterion.consts.Route.SELF_SERVICE.DASHBOARD_INBOX
                        ) + '/' + record.getId();

                    if (dueDateDiff > 8) {
                        iconCls += 'green';
                    } else if (dueDateDiff > 3) {
                        iconCls += 'yellow';
                    } else {
                        iconCls += 'red';
                    }

                    if (record.get('workflowTypeCode') === WORKFLOW_TYPE_CODE.FORM) {
                        if (Ext.Array.contains([WORKFLOW_STATUSES.NOT_SUBMITTED, WORKFLOW_STATUSES.REJECTED, WORKFLOW_STATUSES.SAVED], record.get('statusCode'))) {
                            value = record.get('description') || i18n.gettext('Company Form');
                        }
                    }

                    if (assignedToEmployeeName) {
                        value = value + ' (' + assignedToEmployeeName + ')';
                    }

                    let rejectedText = record.get('isRejected') ? Ext.String.format(' ({0})', i18n.gettext('Rejected')) : '';

                    return Ext.util.Format.format(
                        '<span class="{0}"></span><a class="taskLink" href="#{2}">{1}{3}</a><span class="due-date {6}">{5}: {4:date(criterion.consts.Api.SHORT_DATE_FORMAT)}</span>', iconCls, value, url, rejectedText, dueDate || '', i18n.gettext('due'), !!dueDate ? '' : 'hidden-el'
                    );
                }
            }
        ],

        selectDashboardWorkflow : function(workflowLogId) {
            let me = this,
                view = this.getView(),
                parentVM = this.up().getViewModel(),
                workflowLogs = parentVM.get('workflowLogs'),
                workflowLog = workflowLogs.getById(workflowLogId);

            if (workflowLog) {
                Ext.defer(() => {
                    view.getFeature('grouping').expand(workflowLog.get('workflowTypeDesc'));
                    me.getSelectionModel().select(workflowLog);
                }, 1000);
            }
        },

        deselectAllWorkflow : function() {
            this.getSelectionModel().deselectAll();
        }

    }
});

