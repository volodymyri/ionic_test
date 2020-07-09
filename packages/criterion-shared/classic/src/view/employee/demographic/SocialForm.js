Ext.define('criterion.view.employee.demographic.SocialForm', function() {

    var DICT = criterion.consts.Dict;

    return {
        alias : 'widget.criterion_employee_social_form',

        extend : 'criterion.view.FormView',

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        title : i18n.gettext('Social Media'),

        controller : {
            type : 'criterion_formview',
            externalUpdate : false
        },

        viewModel : {
            formulas : {
                hideSave : function(data) {
                    return !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_SOCIAL_MEDIA, criterion.SecurityManager.UPDATE, false, true));
                },

                hideDelete : function(data) {
                    return data('hideDeleteInt') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_SOCIAL_MEDIA, criterion.SecurityManager.DELETE, false, true));
                }
            }
        },

        bodyPadding : '25 10',
        defaults : criterion.Consts.UI_CONFIG.ONE_COL_FORM,

        items : [
            {
                xtype : 'criterion_code_detail_field',
                codeDataId : DICT.SOCIAL_MEDIA_TYPE,
                fieldLabel : i18n.gettext('Type'),
                name : 'socialMediaTypeCd',
                allowBlank : false
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Identifier'),
                allowBlank : false,
                name : 'identifier'
            }
        ]
    };

});

