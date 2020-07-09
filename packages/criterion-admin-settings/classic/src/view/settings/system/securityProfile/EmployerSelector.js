Ext.define('criterion.view.settings.system.securityProfile.EmployerSelector', function() {

    var inactiveText = Ext.String.format(' ({0})', i18n.gettext('Inactive'));

    return {

        alias : 'widget.criterion_settings_security_profile_employer_selector',

        extend : 'criterion.ux.Panel',

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : '40%',
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
            }
        ],

        config : {
            employers : null
        },
        employerIds : [],

        modal : true,
        closable : false,
        draggable : true,

        viewModel : {
            stores : {
                localStore : {
                    type : 'store',
                    fields : [
                        {
                            name : 'id',
                            type : 'integer'
                        },
                        {
                            name : 'isActive',
                            type : 'boolean'
                        },
                        {
                            name : 'legalName',
                            type : 'string'
                        }
                    ],
                    proxy : {
                        type : 'memory'
                    }
                }
            }
        },

        layout : 'fit',

        bbar : [
            '->',
            {
                xtype : 'button',
                reference : 'cancelBtn',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                scale : 'small',
                handler : function() {
                    this.up('criterion_settings_security_profile_employer_selector').fireEvent('close');
                }
            },
            {
                xtype : 'button',
                reference : 'selectButton',
                text : i18n.gettext('Done'),
                cls : 'criterion-btn-primary',
                scale : 'small',
                disabled : true,
                bind : {
                    disabled : '{!grid.selection}'
                },
                handler : function() {
                    var mainView = this.up('criterion_settings_security_profile_employer_selector'),
                        vm = mainView.getViewModel();

                    mainView.fireEvent('select', vm.get('grid.selection'));
                }
            }
        ],

        title : i18n.gettext('Select Employer'),

        initComponent : function() {
            this.items = [
                {
                    xtype : 'criterion_gridpanel',
                    reference : 'grid',
                    width : '100%',
                    scrollable : 'y',

                    bind : {
                        store : '{localStore}'
                    },

                    selType : 'checkboxmodel',
                    selModel : {
                        checkOnly : true,
                        mode : 'SINGLE'
                    },

                    columns : [
                        {
                            xtype : 'gridcolumn',
                            text : i18n.gettext('Employer'),
                            dataIndex : 'legalName',
                            flex : 1,
                            renderer : function(value, metaData, record) {
                                return value + (record.get('isActive') ? '' : inactiveText);
                            }
                        }
                    ]
                }
            ];

            this.callParent(arguments);
        },

        setEmployers : function(employers) {
            var localStore = this.getViewModel().getStore('localStore'),
                employerIds = this.employerIds;

            localStore.suspendEvents();
            Ext.Array.each(employers, function(employer) {
                var employerId = employer.getId();

                if (Ext.Array.indexOf(employerIds, employerId) !== -1) {
                    return;
                }

                localStore.add({
                    id : employerId,
                    isActive : employer.get('isActive'),
                    legalName : employer.get('legalName')
                });
            });
            localStore.resumeEvents();
        },

        show : function() {
            this.callParent(arguments);
            this.down('button[reference=cancelBtn]').focus();
        }
    }

});
