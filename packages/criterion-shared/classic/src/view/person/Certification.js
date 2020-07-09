Ext.define('criterion.view.person.Certification', function() {

    return {
        alias : 'widget.criterion_person_certification',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.person.Certification'
        ],

        controller : {
            type : 'criterion_person_certification'
        },

        title : i18n.gettext('Certification'),

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        viewModel : {
            formulas : {
                hideSave : function(data) {
                    return !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_CERTIFICATIONS, criterion.SecurityManager.UPDATE, false, true));
                },

                hideDelete : function(data) {
                    return data('hideDeleteInt') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_CERTIFICATIONS, criterion.SecurityManager.DELETE, false, true));
                }
            }
        },

        items : [
            {
                xtype : 'criterion_panel',

                layout : 'hbox',
                ui : 'clean',

                plugins : [
                    'criterion_responsive_column'
                ],

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDE,

                items : [
                    {
                        ui : 'clean',
                        items : [
                            {
                                xtype : 'fieldcontainer',
                                fieldLabel : i18n.gettext('Name'),
                                layout : 'hbox',
                                requiredMark : true,
                                items : [
                                    {
                                        xtype : 'textfield',
                                        flex : 1,
                                        name : 'certificationName',
                                        allowBlank : false,
                                        readOnly : true,
                                        bind : {
                                            value : '{record.certificationName}'
                                        }
                                    },
                                    {
                                        xtype : 'button',
                                        scale : 'small',
                                        margin : '0 0 0 3',
                                        cls : 'criterion-btn-light',
                                        glyph : criterion.consts.Glyph['ios7-search'],
                                        handler : 'handleCertificationSearch',
                                        bind : {
                                            hidden : '{readOnly}'
                                        }
                                    }
                                ]
                            },
                            {
                                xtype : 'textfield',
                                name : 'issuedBy',
                                bind : {
                                    value : '{record.issuedBy}',
                                    readOnly : '{readOnly}'
                                },
                                fieldLabel : i18n.gettext('Issued By'),
                                allowBlank : false
                            },
                            {
                                xtype : 'textfield',
                                name : 'description',
                                bind : {
                                    value : '{record.description}',
                                    readOnly : '{readOnly}'
                                },
                                fieldLabel : i18n.gettext('Description'),
                                allowBlank : false
                            }
                        ]
                    },
                    {
                        ui : 'clean',
                        items : [
                            {
                                xtype : 'datefield',
                                name : 'issueDate',
                                bind : {
                                    value : '{record.issueDate}',
                                    readOnly : '{readOnly}'
                                },
                                fieldLabel : i18n.gettext('Issue Date'),
                                allowBlank : false
                            },
                            {
                                xtype : 'datefield',
                                name : 'expiryDate',
                                bind : {
                                    value : '{record.expiryDate}',
                                    readOnly : '{readOnly}'
                                },
                                fieldLabel : i18n.gettext('Expiry Date')
                            }
                        ]
                    }
                ]
            }
        ]
    };

});
