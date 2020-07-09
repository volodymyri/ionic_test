Ext.define('criterion.view.common.ChangeEmployeeForm', function() {

    var TXT_CONF = {
        HiringManager : {
            desc1 : i18n.gettext('This employee is the hiring manager for one or more job postings.'),
            desc2 : i18n.gettext('Please choose an alternate employee to take over as hiring manager on these job postings.'),
            label : i18n.gettext('Hiring Manager')
        },
        Supervisor : {
            desc1 : i18n.gettext('This employee is the supervisor for one or more employees.'),
            desc2 : i18n.gettext('Please choose an alternate employee to take over as supervisor on these employees.'),
            label : i18n.gettext('Supervisor')
        }
    };

    return {
        alias : 'widget.criterion_common_change_employee_form',

        extend : 'criterion.ux.Panel',

        closable : false,

        title : i18n.gettext('Warning'),

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        bodyPadding : 20,

        requires : [
            'criterion.view.employee.EmployeePicker'
        ],

        viewModel : {
            data : {
                currentEmployeeId : null,
                employeeId : null,
                employeeFullName : null
            }
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                height : 'auto',
                width : criterion.Consts.UI_CONFIG.MODAL_NARROWER_WIDTH,
                modal : true
            }
        ],

        draggable : true,

        constructor : function(conf) {
            var vm;

            this.items = [
                {
                    xtype : 'component',
                    padding : '10 0',
                    html : TXT_CONF[conf.textConfIdent].desc1
                },
                {
                    xtype : 'component',
                    padding : '10 0',
                    html : TXT_CONF[conf.textConfIdent].desc2
                },
                {
                    xtype : 'fieldcontainer',
                    fieldLabel : TXT_CONF[conf.textConfIdent].label,
                    layout : 'hbox',
                    margin : '10 0 0 0',
                    items : [
                        {
                            xtype : 'textfield',
                            flex : 1,
                            bind : {
                                value : '{employeeFullName}'
                            },
                            allowBlank : false,
                            readOnly : true
                        },
                        {
                            xtype : 'button',
                            scale : 'small',
                            margin : '0 0 0 3',
                            cls : 'criterion-btn-light',
                            glyph : criterion.consts.Glyph['ios7-search'],
                            listeners : {
                                scope : this,
                                click : 'onEmployeeSearch'
                            }
                        }
                    ]
                }
            ];

            this.bbar = [
                '->',
                {
                    xtype : 'button',
                    text : i18n.gettext('Cancel'),
                    cls : 'criterion-btn-light',
                    listeners : {
                        scope : this,
                        click : 'onClose'
                    }
                },
                {
                    xtype : 'button',
                    cls : 'criterion-btn-primary',
                    text : i18n.gettext('Save'),
                    listeners : {
                        scope : this,
                        click : 'onSave'
                    }
                }
            ];

            this.callParent(arguments);

            vm = this.getViewModel();

            this.down('textfield').validator = function() {
                if (vm.get('currentEmployeeId') == vm.get('employeeId')) {
                    return i18n.gettext('Please choose another employee');
                }

                return true;
            }
        },

        onEmployeeSearch : function() {
            var vm = this.getViewModel(),
                picker = Ext.create('criterion.view.employee.EmployeePicker', {
                    isActive : true
                });

            picker.show();
            picker.on('select', function(searchRecord) {
                vm.set('employeeFullName', searchRecord.get('fullName'));
                vm.set('employeeId', searchRecord.get('employeeId'));
            }, this);
            picker.on('destroy', function() {
                Ext.getBody().mask();
            });
        },

        onClose : function() {
            this.fireEvent('close');
            Ext.Function.defer(function() {
                this.destroy();
            }, 100, this);
        },

        onSave : function() {
            var vm = this.getViewModel(),
                employeeFullNameField = this.down('textfield');

            if (employeeFullNameField.isValid()) {
                this.fireEvent('save', vm.get('employeeId'));
                this.destroy();
            } else {
                employeeFullNameField.focus();
            }
        }
    }
});
