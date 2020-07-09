Ext.define('criterion.view.assignment.Terminate', function() {

    return {
        alias : 'widget.criterion_assignment_terminate',

        extend : 'Ext.Window',

        requires : [
            'criterion.controller.assignment.Terminate'
        ],

        title : i18n.gettext('Terminate Assignment'),

        viewModel : {
            data : {
                /**
                 * @type {criterion.model.Assignment}
                 */
                record : null,
                employeeId : null,
                effectiveDate : null
            }
        },

        controller : {
            type : 'criterion_assignment_terminate'
        },

        modal : true,
        closable : true,
        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : 'auto',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
            }
        ],

        buttons : [
            {
                xtype : 'button',
                text : i18n.gettext('Terminate'),
                cls : 'criterion-btn-remove',
                itemId : 'btnTerminate',
                listeners : {
                    click : 'onTerminate'
                }
            }
        ],

        bodyPadding : 20,

        items : [
            {
                xtype : 'form',
                reference : 'form',

                items : [
                    {
                        xtype : 'criterion_code_detail_field',
                        fieldLabel : i18n.gettext('Termination Reason'),
                        codeDataId : criterion.consts.Dict.TERMINATION,
                        allowBlank : false,
                        name : 'terminationCd'
                    },
                    {
                        xtype : 'datefield',
                        fieldLabel : i18n.gettext('Termination Date'),
                        bind : {
                            value : '{activeDetail.expirationDate}',
                            minValue : '{effectiveDate}'
                        },
                        name : 'expirationDate',
                        submitFormat : criterion.consts.Api.DATE_FORMAT,
                        allowBlank : false
                    }
                ]
            }
        ]
    };

});
