Ext.define('criterion.view.ess.preferences.LookAndFeel', function() {

    var DICT = criterion.consts.Dict;

    return {
        alias : 'widget.criterion_ess_preferences_look_and_feel',

        extend : 'criterion.ux.form.Panel',

        requires : [
            'criterion.controller.ess.preferences.LookAndFeel'
        ],

        title : i18n.gettext('Look & Feel'),

        frame : true,

        viewModel : {
            data : {
                /**
                 * @link {criterion.model.person.Settings}
                 */
                record : null
            }
        },

        listeners : {
            scope : 'controller',
            activateByRoute : 'onActivateByRoute'
        },

        controller : {
            type : 'criterion_ess_preferences_look_and_feel'
        },

        bbar : [
            '->',
            {
                xtype : 'button',
                action : 'save-settings',
                text : i18n.gettext('Save'),
                listeners : {
                    click : 'onSave'
                }
            }
        ],

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        defaults : {
            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDE_WIDTH,
            maxWidth : criterion.Consts.UI_DEFAULTS.FORM_ITEM_WIDTH
        },

        bodyPadding : criterion.Consts.UI_DEFAULTS.PADDING.SIMPLE_FORM,

        items : [
            {
                xtype : 'criterion_code_detail_field',
                codeDataId : DICT.LOCALIZATION_LANGUAGE,
                reference : 'localeCombo',
                fieldLabel : i18n.gettext('Language'),
                name : 'localizationLanguageCd',
                allowBlank : false,
                bind : {
                    value : '{record.localizationLanguageCd}'
                }
            },
            {
                xtype : 'toggleslidefield',
                fieldLabel : i18n.gettext('Send me an email when there\'s a posting in any of my communities'),
                labelWidth : 400,
                name : 'emailOnPosting',
                reference : 'emailOnPosting',
                inputValue : true,
                bind : '{record.emailOnPosting}'
            },
            {
                xtype : 'toggleslidefield',
                fieldLabel : i18n.gettext('Send me an email when there\'s a reference to me in a new posting'),
                labelWidth : 400,
                name : 'emailOnReference',
                reference : 'emailOnReference',
                inputValue : true,
                bind : '{record.emailOnReference}'
            }
        ]
    };
});
