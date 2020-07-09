Ext.define('criterion.view.payroll.GenerateForm', function() {

    const TAX_FILING_TYPES = criterion.Consts.TAX_FILING_TYPES,
        T4_FILE_TYPES = criterion.Consts.T4_FILE_TYPES,
        PTSC = criterion.Consts.PTSC;

    return {

        alias : 'widget.criterion_payroll_generate_form',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.payroll.GenerateForm'
        ],

        title : i18n.gettext('Generate'),

        controller : {
            type : 'criterion_payroll_generate_form'
        },

        viewModel : {
            data : {
                isSingleEmployer : true
            },
            formulas : {
                isQuarter : {
                    bind : {
                        bindTo : '{generateType}',
                        deep : true
                    },
                    get : function(generateType) {
                        let selection = generateType.selection;

                        return selection && selection.get('value') === TAX_FILING_TYPES.QUARTER;
                    }
                },
                isT4 : {
                    bind : {
                        bindTo : '{generateType}',
                        deep : true
                    },
                    get : function(generateType) {
                        let selection = generateType.selection;

                        return selection && selection.get('value') === TAX_FILING_TYPES.T4;
                    }
                }
            }
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                height : 'auto'
            }
        ],

        listeners : {},

        buttons : [
            {
                xtype : 'button',
                cls : 'criterion-btn-light',
                scale : 'small',
                text : i18n.gettext('Cancel'),
                handler : 'handleCancel'
            },
            {
                xtype : 'button',
                scale : 'small',
                text : i18n.gettext('Generate'),
                handler : 'handleGenerate'
            }
        ],

        initComponent : function() {
            let quarter = i18n.gettext('Quarter');

            this.items = [
                {
                    xtype : 'criterion_employer_combo',
                    fieldLabel : i18n.gettext('Employer'),
                    name : 'employerId',
                    allowBlank : false,
                    listeners : {
                        change : 'handleEmployerChange'
                    }
                },
                {
                    xtype : 'combobox',
                    fieldLabel : i18n.gettext('Type'),
                    reference : 'generateType',
                    name : 'generateType',
                    sortByDisplayField : false,
                    editable : false,
                    store : Ext.create('Ext.data.Store', {
                        fields : ['text', 'value', 'ptsc'],
                        data : [
                            {
                                text : i18n.gettext('Quarter'), value : TAX_FILING_TYPES.QUARTER, ptsc : PTSC.CLIENT
                            },
                            {
                                text : i18n.gettext('Year'), value : TAX_FILING_TYPES.ANNUAL, ptsc : PTSC.CLIENT
                            },
                            {
                                text : i18n.gettext('Ceridian Quarter'),
                                value : TAX_FILING_TYPES.QUARTER,
                                ptsc : PTSC.CERIDIAN
                            },
                            {
                                text : i18n.gettext('Ceridian Year'),
                                value : TAX_FILING_TYPES.ANNUAL,
                                ptsc : PTSC.CERIDIAN
                            },
                            {
                                text : i18n.gettext('T4'), value : TAX_FILING_TYPES.T4, ptsc : PTSC.CANADIAN_CLIENT
                            }

                        ],
                        filters : [{
                            property : 'ptsc',
                            value : null
                        }]
                    }),
                    value : TAX_FILING_TYPES.QUARTER,
                    displayField : 'text',
                    valueField : 'value',
                    queryMode : 'local',
                    forceSelection : true,
                    autoSelect : true
                },
                {
                    xtype : 'combo',
                    fieldLabel : i18n.gettext('Year'),
                    name : 'year',
                    displayField : 'year',
                    valueField : 'year',
                    allowBlank : false,
                    bind : {
                        store : '{years}'
                    },
                    queryMode : 'local'
                },
                {
                    xtype : 'combo',
                    fieldLabel : i18n.gettext('Quarter'),
                    name : 'quarter',
                    displayField : 'title',
                    valueField : 'value',
                    allowBlank : false,
                    store : {
                        type : 'store',
                        proxy : {
                            type : 'memory'
                        },
                        fields : [
                            {
                                name : 'value',
                                type : 'string'
                            },
                            {
                                name : 'title',
                                type : 'string'
                            }
                        ],
                        data : [
                            {
                                value : '1',
                                title : quarter + ' 1'
                            },
                            {
                                value : '2',
                                title : quarter + ' 2'
                            },
                            {
                                value : '3',
                                title : quarter + ' 3'
                            },
                            {
                                value : '4',
                                title : quarter + ' 4'
                            }
                        ]
                    },
                    hidden : true,
                    bind : {
                        hidden : '{!isQuarter}',
                        disabled : '{!isQuarter}'
                    }
                },
                {
                    xtype : 'combo',
                    fieldLabel : i18n.gettext('File Type'),
                    name : 'fileType',
                    store : Ext.create('Ext.data.Store', {
                        fields : ['value', 'text'],
                        data : Ext.Object.getValues(T4_FILE_TYPES)
                    }),
                    hidden : true,
                    bind : {
                        hidden : '{!isT4}'
                    },
                    value : T4_FILE_TYPES.XML.value,
                    valueField : 'value',
                    displayField : 'text',
                    queryMode : 'local',
                    forceSelection : true,
                    editable : false,
                    autoSelect : true,
                    allowBlank : false
                }
            ];

            this.callParent(arguments);
        }
    }
});
