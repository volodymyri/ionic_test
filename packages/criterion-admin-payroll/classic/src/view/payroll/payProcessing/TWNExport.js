Ext.define('criterion.view.payroll.payProcessing.TWNExport', function() {

    return {

        alias : 'widget.criterion_payroll_pay_processing_twn_export',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.store.employer.payroll.Batches',
            'criterion.controller.payroll.payProcessing.TWNExport'
        ],

        controller : {
            type : 'criterion_payroll_pay_processing_twn_export'
        },

        viewModel : {
            data : {
                employerId : null,
                allowExport : true
            },
            stores : {
                batches : {
                    type : 'criterion_employer_payroll_batches',
                    autoLoad : true,
                    sorters : [{
                        property : 'payDate',
                        direction : 'DESC'
                    }]
                }
            },
            formulas : {
                enableExport : function(data) {
                    return data('allowExport') && data('employerId') && data('batchId');
                }
            }
        },

        bodyPadding : '10 25',

        plugins : [
            'criterion_responsive_column'
        ],

        defaultType : 'container',
        layout : {
            type : 'hbox',
            align : 'stretch'
        },

        items : [
            {
                flex : 1,
                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },
                defaults : {
                    labelWidth : 135
                },
                items : [
                    {
                        xtype : 'criterion_employer_combo',
                        fieldLabel : i18n.gettext('Employer'),
                        name : 'employerId',
                        bind : {
                            value : '{employerId}'
                        },
                        allowBlank : false
                    },
                    {
                        xtype : 'combobox',
                        fieldLabel : i18n.gettext('Payroll Batch'),
                        name : 'batchId',
                        bind : {
                            store : '{batches}',
                            value : '{batchId}',
                            disabled : '{!employerId}',
                            filters : {
                                property : 'employerId',
                                value : '{employerId}',
                                exactMatch : true
                            }
                        },
                        displayField : 'name',
                        valueField : 'id',
                        editable : false,
                        allowBlank : false,
                        forceSelection : true,
                        queryMode : 'local',
                        emptyText : i18n.gettext('Not Selected')
                    }
                ]
            }
        ],

        buttons : [
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Export'),
                cls : 'criterion-btn-primary',
                disabled : true,
                bind : {
                    disabled : '{!enableExport}'
                },
                handler : 'handleExport'
            }
        ]
    };

});
