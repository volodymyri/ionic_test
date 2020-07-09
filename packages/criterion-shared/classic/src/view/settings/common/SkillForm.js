Ext.define('criterion.view.settings.common.SkillForm', function() {

    var DICT = criterion.consts.Dict;

    return {
        alias : 'widget.criterion_settings_common_skill_form',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.common.SkillForm',
            'criterion.store.Skills'
        ],

        controller : {
            type : 'criterion_settings_common_skill_form'
        },

        modal : true,
        cls : 'criterion-modal',
        draggable : true,

        plugins : [
            {
                ptype : 'criterion_sidebar',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                height : 'auto',
                modal : true
            }
        ],

        viewModel : {
            formulas : {
                submitBtnText : function(get) {
                    return get('blockedState') ? 'Please wait...' : (get('isPhantom') ? 'Add' : 'Update')
                }
            }
        },

        title : i18n.gettext('Job Skill'),

        items : [
            {
                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },

                items : [
                    {
                        defaults : {
                            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                            width : '100%'
                        },

                        items : [
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Category'),
                                name : 'skillCategoryCd',
                                allowBlank : false,
                                codeDataId : DICT.SKILL_CATEGORY,
                                bind : {
                                    value : '{record.skillCategoryCd}'
                                },
                                listeners : {
                                    change : 'handleCategoryChange'
                                }
                            },
                            {
                                xtype : 'combo',
                                fieldLabel : i18n.gettext('Skill'),
                                allowBlank : false,
                                resetOnDataChanged : true,
                                emptyText : i18n.gettext('Select Category first'),
                                name : 'skillId',
                                reference : 'skillCombo',
                                store : {
                                    type : 'criterion_skills',
                                    autoLoad : true
                                },
                                bind : {
                                    value : '{record.skillId}',
                                    disabled : '{!record.skillCategoryCd}'
                                },
                                displayField : 'name',
                                valueField : 'id',
                                queryMode : 'local'
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Level'),
                                allowBlank : false,
                                emptyText : i18n.gettext('Select Skill first'),
                                name : 'skillLevelCd',
                                codeDataId : DICT.SKILL_LEVEL,
                                bind : {
                                    value : '{record.skillLevelCd}',
                                    disabled : '{!record.skillId}'
                                }
                            }
                        ]
                    }
                ]
            }
        ]
    };
});
