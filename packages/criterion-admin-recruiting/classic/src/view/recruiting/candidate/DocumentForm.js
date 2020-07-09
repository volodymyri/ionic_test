Ext.define('criterion.view.recruiting.candidate.DocumentForm', function() {

    return {
        alias : 'widget.criterion_recruiting_candidate_document_form',

        extend : 'criterion.view.FormView',

        title : i18n.gettext('Document'),

        allowDelete : true,

        requires : [
            'criterion.store.WebForms'
        ],

        controller : {
            externalUpdate : false
        },

        viewModel : {
            formulas : {
                hideSave : function(data) {
                    return !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_FORM, criterion.SecurityManager.UPDATE, false, true));
                },

                hideDelete : function(data) {
                    return data('hideDeleteInt') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_FORM, criterion.SecurityManager.DELETE, false, true));
                }
            }
        },

        bodyPadding : 10,

        defaults : criterion.Consts.UI_CONFIG.ONE_COL_FORM,

        items : [
            {
                xtype : 'combobox',
                fieldLabel : i18n.gettext('Job'),
                name : 'jobPostingCandidateId',
                editable : false,
                autoSelect : true,
                valueField : 'id',
                displayField : 'jobPostingTitle',
                queryMode : 'local',
                allowBlank : false,
                bind : {
                    store : '{jobPostingCandidates}',
                    disabled : '{!isPhantom}'
                }
            },
            {
                xtype : 'criterion_code_detail_field',
                fieldLabel : i18n.gettext('Document Type'),
                codeDataId : criterion.consts.Dict.DOCUMENT_RECORD_TYPE,
                name : 'documentTypeCd',
                bind : {
                    disabled : '{!isPhantom}'
                }
            },
            {
                xtype : 'combobox',
                fieldLabel : i18n.gettext('Form Name'),
                reference : 'formName',
                name : 'webformId',
                editable : false,
                autoSelect : true,
                valueField : 'id',
                displayField : 'name',
                queryMode : 'local',
                allowBlank : false,
                store : {
                    type : 'criterion_web_forms',
                    autoLoad : true
                },
                bind : {
                    disabled : '{!isPhantom}'
                }
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Description'),
                allowBlank : false,
                name : 'description',
                bind : {
                    disabled : '{!isPhantom}'
                }
            }
        ]
    }
});
