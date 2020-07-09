Ext.define('criterion.view.employee.position.FieldValueSelector', function() {

    return {

        alias : 'widget.criterion_employee_position_field_value_selector',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.employee.position.FieldValueSelector',
            'criterion.store.CustomData',
            'criterion.store.customField.Values'
        ],

        viewModel : {
            stores : {
                positionCustomFields : {
                    type : 'criterion_customdata'
                },
                assignmentCustomFields : {
                    type : 'criterion_customdata'
                },
                positionCustomFieldValues : {
                    type : 'criterion_customdata_values'
                },
                assignmentCustomFieldValues : {
                    type : 'criterion_customdata_values'
                }
            }
        },

        title : i18n.gettext('Select Position Values'),

        controller : {
            type : 'criterion_employee_position_field_value_selector'
        },

        listeners : {
            scope : 'controller',
            show : 'handleShow'
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : '50%',
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
            }
        ],

        modal : true,
        draggable : true,

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        bbar : [
            '->',
            {
                xtype : 'button',
                reference : 'cancelBtn',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                scale : 'small',
                handler : 'handleCancel'
            },
            {
                xtype : 'button',
                text : i18n.gettext('Apply'),
                cls : 'criterion-btn-primary',
                scale : 'small',
                handler : 'handleApply'
            }
        ],

        items : [
            {
                xtype : 'container',
                layout : {
                    type : 'hbox',
                    align : 'center'
                },
                border : '0 0 1 0',
                style : {
                    borderColor : '#CCC',
                    borderStyle : 'dotted'
                },
                height : 30,
                items : [
                    {
                        xtype : 'component',
                        html : 'Value',
                        padding : '5 10',
                        cls : 'bold',
                        width : 200
                    },
                    {
                        xtype : 'component',
                        html : 'Old',
                        padding : '5 10 5 25',
                        cls : 'bold',
                        flex : 1
                    },
                    {
                        xtype : 'component',
                        html : 'New',
                        padding : '5 10 5 20',
                        cls : 'bold',
                        flex : 1
                    }
                ]
            },

            {
                xtype : 'container',
                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },
                flex : 1,
                scrollable : 'y',
                reference : 'fieldValueItemsContainer',
                padding : '0 0 20 0',
                items : [
                    // dynamic
                ]
            }

        ]

    };

});
