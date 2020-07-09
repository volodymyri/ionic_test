Ext.define('criterion.view.recruiting.candidate.CertificationForm', function() {

    return {
        alias : 'widget.criterion_recruiting_candidate_certification_form',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.model.candidate.Certification',
            'Ext.layout.container.Column'
        ],

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH,
                height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT
            }
        ],

        viewModel : {
            links : {
                record : {
                    type : 'criterion.model.candidate.Certification',
                    create : true
                }
            },
            formulas : {
                hideDelete : function(data) {
                    return data('hideDeleteInt') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_PROFILE, criterion.SecurityManager.DELETE, false, true));
                }
            }
        },

        closable : true,

        scrollable : true,

        title : i18n.gettext('Certification'),

        allowDelete : true,

        controller : {
            externalUpdate : false
        },

        bodyPadding : 20,

        defaults : {
            xtype : 'fieldcontainer'
        },

        fieldDefaults : {
            labelAlign : 'left',
            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDTH,
            width : '100%'
        },

        items : [
            {
                items : [
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('Name'),
                        bind : '{record.name}',
                        name : 'name'
                    },
                    {
                        layout : 'column',

                        defaults : {
                            columnWidth : 0.5
                        },

                        fieldDefaults : {
                            width : '100%'
                        },

                        items : [
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Issue Date'),
                                bind : '{record.issueDate}',
                                name : 'issueDate',
                                margin : '0 10 0 0'
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Expiry Date'),
                                bind : '{record.expiryDate}',
                                name : 'expiryDate'
                            }
                        ]
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('Issued By'),
                        bind : '{record.issuedBy}',
                        name : 'issuedBy',
                        margin : '20 0 0 0'
                    }
                ]
            },
            {

                xtype : 'container',
                flex : 1,
                layout : 'fit',
                items : [
                    {
                        xtype : 'htmleditor',
                        reference : 'description',
                        enableAlignments : false,
                        fieldLabel : i18n.gettext('Description'),
                        padding : '0 5 20 0',
                        bind : {
                            value : '{record.description}'
                        }
                    }
                ]
            }
        ]
    };
});
