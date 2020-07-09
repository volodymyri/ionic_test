Ext.define('criterion.view.ess.dashboard.workflow.EmployeeBenefit', function() {

    return {

        alias : 'widget.criterion_selfservice_workflow_employee_benefit',

        extend : 'criterion.view.ess.dashboard.workflow.EmployeeBenefitBase',

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        items : [
            // options
            {
                xtype : 'container',
                margin : '0 0 0 25',
                hidden : true,
                bind : {
                    hidden : '{!hasChangedOptions}'
                },
                items : [
                    {
                        xtype : 'component',
                        cls : 'bold',
                        html : i18n.gettext('Changed Options'),
                        margin : '0 0 5 0'
                    },
                    {
                        xtype : 'dataview',
                        bind : {
                            store : '{options}'
                        },
                        componentCls : 'criterion-item-container',
                        itemSelector : 'div.item_',
                        emptyText : '',

                        tpl : Ext.create('Ext.XTemplate',
                            '<tpl for=".">',
                            '<div class="item">',
                            '{text}',
                            '</div>',
                            '</tpl>'
                        )
                    }
                ]
            },

            {
                xtype : 'container',
                layout : 'hbox',
                items : [
                    // dependents
                    {
                        xtype : 'container',
                        margin : '10 0 0 25',
                        flex : 1,
                        hidden : true,
                        bind : {
                            hidden : '{!hasChangedDependents}'
                        },
                        items : [
                            {
                                xtype : 'component',
                                cls : 'bold',
                                html : i18n.gettext('Dependents'),
                                margin : '0 0 5 0'
                            },
                            {
                                xtype : 'dataview',
                                bind : {
                                    store : '{dependents}'
                                },
                                componentCls : 'criterion-item-container',
                                itemSelector : 'div.item_',
                                emptyText : '',

                                tpl : Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '<div class="item">',
                                    '{text}',
                                    '</div>',
                                    '</tpl>'
                                )
                            }
                        ]
                    },

                    // beneficiaries
                    {
                        xtype : 'container',
                        margin : '10 0 0 25',
                        flex : 1,
                        hidden : true,
                        bind : {
                            hidden : '{!hasChangedBeneficiaries}'
                        },
                        items : [
                            {
                                xtype : 'component',
                                cls : 'bold',
                                html : i18n.gettext('Beneficiaries'),
                                margin : '0 0 5 0'
                            },
                            {
                                xtype : 'dataview',
                                bind : {
                                    store : '{beneficiaries}'
                                },
                                componentCls : 'criterion-item-container',
                                itemSelector : 'div.item_',
                                emptyText : '',

                                tpl : Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '<div class="item">',
                                    '{text}',
                                    '</div>',
                                    '</tpl>'
                                )
                            }
                        ]
                    },

                    // contingent beneficiaries
                    {
                        xtype : 'container',
                        margin : '10 0 0 25',
                        flex : 1,
                        hidden : true,
                        bind : {
                            hidden : '{!hasChangedContingentBeneficiaries}'
                        },
                        items : [
                            {
                                xtype : 'component',
                                cls : 'bold',
                                html : i18n.gettext('Contingent Beneficiaries'),
                                margin : '0 0 5 0'
                            },
                            {
                                xtype : 'dataview',
                                bind : {
                                    store : '{contingentBeneficiaries}'
                                },
                                componentCls : 'criterion-item-container',
                                itemSelector : 'div.item_',
                                emptyText : '',

                                tpl : Ext.create('Ext.XTemplate',
                                    '<tpl for=".">',
                                    '<div class="item">',
                                    '{text}',
                                    '</div>',
                                    '</tpl>'
                                )
                            }
                        ]
                    }
                ]
            }
        ]
    };
});
