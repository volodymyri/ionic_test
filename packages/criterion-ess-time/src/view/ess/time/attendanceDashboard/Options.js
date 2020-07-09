Ext.define('criterion.view.ess.time.attendanceDashboard.Options', function() {

    return {

        extend : 'Ext.form.Panel',

        alias : 'widget.criterion_selfservice_time_attendance_dashboard_options',

        plugins : [
            {
                ptype : 'criterion_sidebar',
                height : criterion.Consts.UI_DEFAULTS.MODAL_HALF_HEIGHT,
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH,
                modal : true
            }
        ],

        viewModel : {
            data : {
                employeeGroupIds : null,
                date : null
            }
        },

        title : i18n.gettext('Options'),

        draggable : false,
        scrollable : 'vertical',

        bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.SIMPLE_FORM,

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        defaultListenerScope : true,

        items : [
            {
                xtype : 'criterion_tagfield',
                fieldLabel : i18n.gettext('Employee Groups'),
                bind : {
                    store : '{employeeGroups}',
                    value : '{employeeGroupIds}'
                },
                queryMode : 'local',
                valueField : 'id',
                displayField : 'nameWithEmployer'
            },
            {
                xtype : 'datefield',
                reference : 'datefield',
                fieldLabel : i18n.gettext('Date'),
                bind : {
                    value : '{date}'
                },
                allowBlank : false,
                maxWidth : criterion.Consts.UI_DEFAULTS.DATE_ITEM_WIDTH
            }
        ],

        buttons : [
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Cancel'),
                ui : 'light',
                handler : 'handleCancel'
            },
            {
                xtype : 'button',
                text : i18n.gettext('Apply'),
                handler : 'handleApply'
            }
        ],

        handleCancel() {
            this.fireEvent('cancel');
        },

        handleApply() {
            let vm = this.getViewModel(),
                datefield = this.down('datefield');

            this.fireEvent('applyOptions', {
                employeeGroupIds : vm.get('employeeGroupIds'),
                date : datefield.getValue()
            });
        }
    }
});
