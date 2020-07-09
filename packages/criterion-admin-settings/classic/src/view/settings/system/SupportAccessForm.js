Ext.define('criterion.view.settings.system.SupportAccessForm', function() {

    let EXPIRATION_TYPES = criterion.Consts.EXPIRATION_TYPES;

    return {

        alias : 'widget.criterion_settings_system_support_access_form',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.system.SupportAccessForm'
        ],

        controller : {
            type : 'criterion_settings_system_support_access_form',
            externalUpdate : false
        },

        title : i18n.gettext('Expiration Time'),

        noButtons : true,

        buttons : [
            '->',
            {
                xtype : 'button',

                text : i18n.gettext('Cancel'),

                cls : 'criterion-btn-light',

                listeners : {
                    click : 'handleCancelClick'
                }
            },
            {
                xtype : 'button',

                text : i18n.gettext('Save'),

                cls : 'criterion-btn-primary',

                listeners : {
                    click : 'handleSaveClick'
                }
            }
        ],

        allowDelete : true,

        bodyPadding : '25 10',

        items : [
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Name'),
                name : 'name',
                readOnly : true
            },
            {
                xtype : 'combobox',
                reference : 'expireIn',
                fieldLabel : i18n.gettext('Expire In'),
                queryMode : 'local',
                editable : false,
                sortByDisplayField : false,
                valueField : 'id',
                displayField : 'text',
                allowBlank : false,
                store : new Ext.data.Store({
                    proxy : {
                        type : 'memory'
                    },
                    data : [
                        {
                            id : EXPIRATION_TYPES.NEXT_DAY.id,
                            text : EXPIRATION_TYPES.NEXT_DAY.text
                        },
                        {
                            id : EXPIRATION_TYPES.NEXT_WEEK.id,
                            text : EXPIRATION_TYPES.NEXT_WEEK.text
                        },
                        {
                            id : EXPIRATION_TYPES.DOES_NOT_EXPIRE.id,
                            text : EXPIRATION_TYPES.DOES_NOT_EXPIRE.text
                        }
                    ]
                })
            }
        ]
    };

});
