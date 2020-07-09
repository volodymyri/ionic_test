Ext.define('criterion.view.settings.general.EmployerDataForm', function() {

    return {

        alias : 'widget.criterion_settings_general_employer_dataform',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.store.Forms',
            'criterion.ux.form.FillableDataForm',
            'criterion.controller.settings.general.EmployerDataForm'
        ],

        bodyPadding : 20,

        title : i18n.gettext('Company Form'),

        controller : {
            type : 'criterion_settings_general_employer_data_form',
            externalUpdate : false
        },

        viewModel : {
            stores : {
                dataForms : {
                    type : 'criterion_forms',
                    autoLoad : true,
                    filters : [
                        {
                            property : 'isWebForm',
                            value : false
                        }
                    ]
                }
            }
        },

        items : [
            {
                xtype : 'container',
                layout : 'hbox',

                plugins : [
                    'criterion_responsive_column'
                ],

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                items : [
                    {
                        xtype : 'container',
                        items : [
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Form'),
                                allowBlank : false,
                                editable : false,
                                forceSelection : true,
                                autoSelect : true,
                                valueField : 'formId',
                                displayField : 'name',
                                queryMode : 'local',
                                bind : {
                                    store : '{dataForms}',
                                    value : '{record.dataformId}',
                                    readOnly : '{!isPhantom}'
                                },
                                listeners : {
                                    change : 'handleChangeForm'
                                }
                            }
                        ]
                    },
                    {
                        xtype : 'container',
                        items : [
                            {
                                xtype : 'textfield',
                                allowBlank : false,
                                fieldLabel : i18n.gettext('Description'),
                                bind : '{employerForm.name}'
                            }
                        ]
                    }
                ]
            },

            {
                xtype : 'criterion_fillable_dataform',
                border : 1,
                style : {
                    borderColor : '#EEE',
                    borderStyle : 'solid',
                    borderWidth : 0
                },
                reference : 'dataform',
                baseDocUrl : criterion.consts.Api.API.EMPLOYER_DATAFORM_ID,
                flex : 1,
                scrollable : true,
                editable : true,
                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH
            }

        ]

    };
});
