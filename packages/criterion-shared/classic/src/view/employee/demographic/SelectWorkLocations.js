Ext.define('criterion.view.employee.demographic.SelectWorkLocations', function() {

    function linkedWorkLocationRenderer(value, metaData, record) {
        return record.getWorkLocation().get(metaData.column.dataIndex)
    }

    function linkedWorkLocationCodeDataRenderer(value, metaData, record) {
        var column = metaData.column,
            cdId = record.getWorkLocation().get(column.dataIndex),
            cdRecord = column.getStore().getById(cdId);

        return cdRecord ? cdRecord.get(column.codeDataDisplayField) : column.unselectedText;
    }

    return {
        alias : 'widget.criterion_employee_demographic_select_work_locations',

        requires : [
            'criterion.store.employee.WorkLocations',
            'criterion.store.employer.WorkLocations',
            'criterion.controller.employee.demographic.SelectWorkLocations'
        ],

        extend : 'criterion.view.GridView',
     
        plugins : {
            ptype : 'criterion_sidebar',
            width : criterion.Consts.UI_DEFAULTS.MODAL_WIDE_WIDTH,
            height : '50%',
            modal : true
        },

        title : i18n.gettext('Select Work Location'),

        tbar : null,

        viewModel : {
            data : {
                employerId : null,
                employeeId : null,
                primaryLocationId : null
            },
            stores : {
                employerWorkLocations : {
                    type : 'employer_work_locations'
                },
                employeeWorkLocations : {
                    type : 'criterion_employee_work_locations'
                }
            }
        },

        controller : {
            type : 'criterion_employee_demographic_select_work_locations'
        },

        preventStoreLoad : true,

        bind: {
            store: '{employerWorkLocations}'
        },

        listeners : {
            scope : 'controller',
            show : 'onShow'
        },

        viewConfig : {
            markDirty : false
        },

        selType : 'checkboxmodel',
        selModel : {
            selType : 'rowmodel',
            mode : 'MULTI',
            listeners : {
                scope : 'controller',
                select : 'onSelect',
                deselect : 'onDeselect'
            }
        },

        buttons : [
            {
                xtype : 'button',
                reference : 'cancel',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                listeners : {
                    click : 'onCancel'
                }
            },
            {
                xtype : 'button',
                cls : 'criterion-btn-primary',
                reference : 'submit',
                text : i18n.gettext('Confirm'),
                listeners : {
                    click : 'onSubmit'
                }
            }
        ],

        columns : [
            {
                text : i18n.gettext('Description'),
                dataIndex : 'description',
                flex : 2,
                renderer : linkedWorkLocationRenderer
            },
            {
                text : i18n.gettext('Address'),
                dataIndex : 'address1',
                flex : 2,
                renderer : linkedWorkLocationRenderer
            },
            {
                text : i18n.gettext('City'),
                dataIndex : 'city',
                flex : 1,
                renderer : linkedWorkLocationRenderer
            },
            {
                xtype : 'criterion_codedatacolumn',
                codeDataId : criterion.consts.Dict.STATE,
                text : i18n.gettext('State'),
                dataIndex : 'stateCd',
                codeDataDisplayField : 'code',
                unselectedText : '',
                flex : 1,
                renderer : linkedWorkLocationCodeDataRenderer
            },
            {
                xtype : 'widgetcolumn',
                text : i18n.gettext('Primary'),
                dataIndex : 'isPrimaryForEmployee',
                flex : 1,
                padding : 0,
                widget : {
                    xtype : 'radio',
                    name : 'isPrimaryLocation',
                    margin : 0,
                    padding : 0,
                    listeners : {
                        scope : 'controller',
                        change : 'onIsPrimaryChange'
                    }
                },
                onWidgetAttach : function(column, widget, record) {
                    record.$widget = widget;
                    widget.setValue(record.get('isPrimaryForEmployee'));
                }
            }
        ]
    };
});
