Ext.define('criterion.view.ess.calendar.event.Form', function() {

    return {
        alias : 'widget.criterion_selfservice_calendar_event_form',

        extend : 'criterion.view.FormView',

        plugins : [
            {
                ptype : 'criterion_sidebar',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                height : 'auto',
                modal : true
            }
        ],

        controller : {
            type : 'criterion_formview',
            externalUpdate : false
        },

        viewModel : {
            formulas : {
                hideSave : data => !data('isPhantom') && !data('record.canPostEss'),
                hideDelete : data => data('hideDeleteInt') || !data('record.canPostEss'),
                allowEdit : data => data('isPhantom') || data('record.canPostEss'),
                cancelBtnText : data => data('allowEdit') ? i18n.gettext('Cancel') : i18n.gettext('Close'),
            }
        },

        title : i18n.gettext('an Event'),

        allowDelete : true,
        modal : true,

        items : [
            {
                xtype : 'combobox',
                fieldLabel : i18n.gettext('Event Calendar'),
                disabled : true,
                hidden : true,
                bind : {
                    store : '{compEvents}',
                    hidden : '{!isPhantom}',
                    disabled : '{!isPhantom}'
                },
                allowBlank : false,
                name : 'companyEventId',

                valueField : 'id',
                displayField : 'name',

                forceSelection : true,
                autoSelect : true,
                editable : false,
                queryMode : 'local'
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Event Calendar'),
                name : 'companyEventName',
                disabled : true,
                hidden : true,
                bind : {
                    hidden : '{isPhantom}',
                    disabled : '{!isPhantom}'
                }
            },

            {
                xtype : 'datefield',
                fieldLabel : i18n.gettext('Date'),
                name : 'date',
                allowBlank : false,
                disabled : true,
                bind : {
                    disabled : '{!allowEdit}'
                }
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Description'),
                name : 'description',
                allowBlank : false,
                disabled : true,
                bind : {
                    disabled : '{!allowEdit}'
                }
            }
        ],

        loadRecord : function(record) {
            record.getProxy().setUrl(criterion.consts.Api.API.EMPLOYER_COMPANY_EVENT_DETAIL);

            this.callParent(arguments);
        }
    }
});
