Ext.define('criterion.view.settings.learning.Skill', function() {

    var DICT = criterion.consts.Dict;

    return {

        alias : 'widget.criterion_settings_learning_skill',

        extend : 'criterion.view.FormView',

        bodyPadding : 0,

        title : i18n.gettext('Skill Details'),

        controller : {
            externalUpdate : false
        },

        initComponent : function() {
            var me = this;

            me.items = [
                {
                    layout : {
                        type : 'vbox',
                        align : 'stretch'
                    },

                    plugins : [
                        'criterion_responsive_column'
                    ],

                    bodyPadding : '15 10',

                    defaults : criterion.Consts.UI_CONFIG.ONE_COL_FORM,

                    items : [
                        {
                            xtype : 'criterion_code_detail_field',
                            fieldLabel : i18n.gettext('Category'),
                            name : 'skillCategoryCd',
                            codeDataId : DICT.SKILL_CATEGORY,
                            allowBlank : false
                        },
                        {
                            xtype : 'textfield',
                            fieldLabel : i18n.gettext('Name'),
                            name : 'name',
                            allowBlank : false
                        },
                        {
                            xtype : 'textarea',
                            fieldLabel : i18n.gettext('Description'),
                            name : 'description',
                            allowBlank : false
                        }
                    ]
                }
            ];

            me.callParent(arguments);
        }
    };

});
