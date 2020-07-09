Ext.define('criterion.view.employee.demographic.AdditionalAddress', function() {

    var DICT = criterion.consts.Dict;

    return {

        alias : 'widget.criterion_employee_demographic_additional_address',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.store.person.Addresses',
            'criterion.controller.employee.demographic.AdditionalAddress',
            'criterion.view.employee.demographic.AdditionalAddressForm'
        ],

        title : i18n.gettext('Additional Address'),

        store : {
            type : 'criterion_person_addresses',
            proxy : {
                extraParams : {
                    isPrimary : 0
                }
            }
        },

        controller : {
            type : 'criterion_employee_demographic_additional_address',
            editor : {
                xtype : 'criterion_employee_demographic_additional_address_form',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar'
                    }
                ],
                listeners : {
                    afterSave : function() {
                        criterion.Utils.toast(i18n.gettext('Address saved'));
                    }
                }
            }
        },

        tbar : [
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
                },
                hidden : true,
                bind : {
                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_ADDITIONAL_ADDRESS, criterion.SecurityManager.CREATE, true)
                }
            },
            '->',
            {
                xtype : 'button',
                reference : 'refreshButton',
                cls : 'criterion-btn-transparent',
                glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                scale : 'medium',
                listeners : {
                    click : 'handleRefreshClick'
                }
            }
        ],

        columns : [
            {
                xtype : 'criterion_codedatacolumn',
                text : i18n.gettext('Location'),
                dataIndex : 'addressLocationCd',
                codeDataId : DICT.ADDRESS_LOCATION,
                flex : 1
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('City'),
                dataIndex : 'city',
                flex : 1
            },
            {
                xtype : 'criterion_codedatacolumn',
                text : i18n.gettext('State'),
                dataIndex : 'stateCd',
                codeDataId : DICT.STATE,
                flex : 1
            },
            {
                xtype : 'criterion_codedatacolumn',
                text : i18n.gettext('Country'),
                dataIndex : 'countryCd',
                codeDataId : DICT.COUNTRY,
                flex : 1
            },
            {
                xtype : 'booleancolumn',
                header : i18n.gettext('Mailing'),
                align : 'center',
                dataIndex : 'isMailingAddress',
                trueText : '✓',
                falseText : '-',
                width : 100
            }
        ]
    };

});
