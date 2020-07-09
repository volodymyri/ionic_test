Ext.define('criterion.view.ess.time.teamTimeOffs.Options', function() {

    return {

        extend : 'Ext.form.Panel',

        alias : 'widget.criterion_selfservice_time_team_time_offs_options',

        plugins : [
            {
                ptype : 'criterion_sidebar',
                height : 'auto',
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH,
                modal : true
            }
        ],

        viewModel : {
            data : {
                employeeGroupIds : null
            }
        },

        title : i18n.gettext('Options'),

        draggable : false,

        bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.SIMPLE_FORM,

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

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
                displayField : 'nameWithEmployer',
                flex : 1,
                growMax : 200
            }
        ],

        buttons : [
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Cancel'),
                ui : 'light',
                listeners : {
                    click : function() {
                        var view = this.up('criterion_selfservice_time_team_time_offs_options');

                        view.fireEvent('cancel');
                    }
                }
            },
            {
                xtype : 'button',
                text : i18n.gettext('Apply'),
                listeners : {
                    click : function() {
                        var view = this.up('criterion_selfservice_time_team_time_offs_options'),
                            vm = view.getViewModel();

                        view.fireEvent('applyOptions', {
                            employeeGroupIds : vm.get('employeeGroupIds')
                        });
                    }
                }
            }
        ],

        onShow() {
            this.callParent(arguments);

            this.down('criterion_tagfield').focus();
        }
    }
});
