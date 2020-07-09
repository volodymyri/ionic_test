Ext.define('criterion.view.settings.hr.WorkLocationTask', function() {

    return {
        alias : 'widget.criterion_settings_work_location_task',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.store.employer.Tasks'
        ],

        plugins : [
            {
                ptype : 'criterion_sidebar',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                height : 'auto',
                modal : true
            }
        ],

        viewModel : {
            data : {
                taskName : null,
                employerId : null,
                workAreasStore : null
            },
            stores : {
                employerTasks : {
                    type : 'criterion_employer_tasks'
                }
            }
        },

        title : i18n.gettext('Work Location Task'),

        allowDelete : true,

        modal : true,

        items : [
            {
                xtype : 'combobox',

                fieldLabel : i18n.gettext('Work Area'),
                bind : {
                    store : '{workAreasStore}',
                    value : '{record.workLocationAreaId}'
                },
                name : 'workAreaId',
                displayField : 'name',

                valueField : 'id',
                queryMode : 'local',
                allowBlank : false,
                editable : true,
                listeners : {
                    change : function(cmp, value) {
                        var selection = cmp.getSelection();

                        cmp.up('criterion_settings_work_location_task').getRecord().set({
                            workLocationAreaId : value ? selection.get('id') : null,
                            workLocationAreaName : value ? selection.get('name') : null
                        });
                    }
                }
            },
            {
                xtype : 'combobox',

                fieldLabel : i18n.gettext('Task'),
                bind : {
                    store : '{employerTasks}',
                    value : '{record.taskId}',
                    disabled : '{!employerId}'
                },
                name : 'taskId',
                displayField : 'name',

                valueField : 'id',
                queryMode : 'local',
                allowBlank : false,
                editable : true,
                listeners : {
                    change : function(cmp, value) {
                        cmp.up('criterion_settings_work_location_task').getRecord().set('taskName', value ? cmp.getSelection().get('name') : null);
                    }
                }
            }
        ],

        setWorkAreasStore : function(value) {
            this.getViewModel().set('workAreasStore', value)
        },

        loadRecord : function(record) {
            var me = this,
                employerTasks = this.getViewModel().getStore('employerTasks');

            me.callParent(arguments);

            if (record.phantom) {
                me.insert(0,
                    {
                        xtype : 'criterion_employer_combo',
                        fieldLabel : i18n.gettext('Employer'),
                        name : 'employerId',
                        allowBlank : false,
                        bind : {
                            value : '{employerId}'
                        },
                        listeners : {
                            change : function(cmp, value) {
                                var employerTasks = cmp.up('criterion_settings_work_location_task').getViewModel().getStore('employerTasks');

                                employerTasks.clearFilter();

                                value && employerTasks.load({
                                    params : {
                                        employerId : value
                                    }
                                });
                            }
                        }
                    }
                );
            } else {
                me.setLoading(true);

                employerTasks.loadWithPromise().then(function() {
                    me.setLoading(false);

                    if (!record.phantom) {
                        me.getViewModel().set('employerId', employerTasks.getById(record.get('taskId')).get('employerId'));
                    }
                });
            }
        }
    }
});