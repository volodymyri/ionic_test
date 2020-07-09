Ext.define('criterion.view.person.Skill', function() {

    const DICT = criterion.consts.Dict;

    return {

        alias : 'widget.criterion_person_skill',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.store.Skills'
        ],

        viewModel : {
            formulas : {
                hideSave : function(data) {
                    return !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_SKILLS, criterion.SecurityManager.UPDATE, false, true));
                },

                hideDelete : function(data) {
                    return data('hideDeleteInt') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_SKILLS, criterion.SecurityManager.DELETE, false, true));
                }
            }
        },

        title : i18n.gettext('Skill'),

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
                                xtype : 'criterion_code_detail_field',
                                codeDataId : DICT.SKILL_CATEGORY,
                                fieldLabel : i18n.gettext('Category'),
                                allowBlank : false,
                                reference : 'categoryCd',
                                bind : {
                                    value : '{record.skillCategoryCd}',
                                    readOnly : '{readOnly}'
                                }
                            },
                            {
                                xtype : 'combobox',
                                store : {
                                    type : 'criterion_skills',
                                    autoSync : false,
                                    autoLoad : true
                                },
                                displayField : 'name',
                                valueField : 'id',
                                reference : 'skillField',
                                fieldLabel : i18n.gettext('Skill'),
                                name : 'skillId',
                                allowBlank : false,
                                forceSelection : true,
                                editable : false,
                                bind : {
                                    value : '{record.skillId}',
                                    filters : {
                                        property : 'skillCategoryCd',
                                        value : '{record.skillCategoryCd}',
                                        exactMatch : true
                                    },
                                    disabled : '{!record.skillCategoryCd}',
                                    readOnly : '{readOnly}'
                                }
                            }
                        ]
                    },
                    {
                        ui : 'clean',
                        items : [
                            {
                                xtype : 'criterion_code_detail_field',
                                codeDataId : DICT.SKILL_LEVEL,
                                fieldLabel : i18n.gettext('Level'),
                                name : 'skillLevelCd',
                                allowBlank : false,
                                bind : {
                                    value : '{record.skillLevelCd}',
                                    readOnly : '{readOnly}'
                                }
                            },
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('Date Acquired'),
                                name : 'dateAcquired',
                                allowBlank : false,
                                bind : {
                                    value : '{record.dateAcquired}',
                                    readOnly : '{readOnly}'
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    };

});
