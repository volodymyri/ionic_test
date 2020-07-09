Ext.define('criterion.view.settings.system.ClassificationCodes', {

    alias : 'widget.criterion_settings_classification_codes',

    extend : 'criterion.view.settings.employer.GridView',

    requires : [
        'criterion.store.employer.Classifications',
        'criterion.store.codeData.Types',
        'criterion.controller.settings.system.ClassificationCodes',
        'criterion.view.settings.system.ClassificationCode'
    ],

    controller : {
        type : 'criterion_settings_classification_codes',
        connectParentView : false,
        reloadAfterEditorSave : true,
        reloadAfterEditorDelete : true,
        editor : {
            xtype : 'criterion_settings_classification_code',
            allowDelete : true,
            plugins : [
                {
                    ptype : 'criterion_sidebar',
                    width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH,
                    height : 'auto',
                    modal : true
                }
            ],
            modal : true,
            draggable : true
        }
    },

    title : i18n.gettext('Classification Codes'),

    viewModel : {
        stores : {
            employerClassifications : {
                type : 'criterion_employer_classifications'
            }
        }
    },

    bind : {
        store : '{employerClassifications}'
    },

    codedataTypeStore : null,

    orderField : 'sequence',

    initComponent : function() {
        var me = this;

        this.codedataTypeStore = Ext.create('criterion.store.codeData.Types');

        this.columns = [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Level'),
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                dataIndex : 'sequence',
                sortable : false
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Code Data Type'),
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH,
                dataIndex : 'codeDataTypeId',
                renderer : function(value) {
                    return value && me.codedataTypeStore ? me.codedataTypeStore.getById(value).get('description') : '';
                },
                sortable : false
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Name'),
                flex : 1,
                dataIndex : 'caption',
                editor : {
                    allowBlank : true
                },
                sortable : false
            },

            {
                xtype : 'criterion_actioncolumn',
                width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH * 2,
                items : [
                    {
                        glyph : criterion.consts.Glyph['ios7-arrow-thin-up'],
                        tooltip : i18n.gettext('Move Up'),
                        text : '',
                        action : 'moveupaction'
                    },
                    {
                        glyph : criterion.consts.Glyph['ios7-arrow-thin-down'],
                        tooltip : i18n.gettext('Move Down'),
                        text : '',
                        action : 'movedownaction'
                    }
                ]
            }
        ];

        this.callParent(arguments);
    }

});
