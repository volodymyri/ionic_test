Ext.define('criterion.view.settings.employeeEngagement.Communities', function() {

    return {
        alias : 'widget.criterion_settings_communities',

        extend : 'criterion.view.settings.GridView',

        requires : [
            'criterion.controller.settings.employeeEngagement.Communities',
            'criterion.store.Communities',
            'criterion.view.settings.employeeEngagement.Community'
        ],

        title : i18n.gettext('Communities'),

        layout : 'fit',

        controller : {
            type : 'criterion_settings_communities',
            showTitleInConnectedViewMode : true,
            connectParentView : {
                parentForSpecified : true
            },
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_settings_community',
                allowDelete : true
            }
        },

        store : {
            type : 'criterion_communities'
        },

        initComponent : function() {
            this.columns = [
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('Community'),
                    dataIndex : 'name',
                    width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
                },
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('Employer(s)'),
                    dataIndex : 'employers',
                    encodeHtml : false,
                    flex : 1,
                    renderer : function(value, metaData) {
                        var output = value.replace(',', '<br />');

                        metaData.tdAttr = 'data-qtip="' + output + '"';

                        return output;
                    }
                },
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('Employee Count'),
                    dataIndex : 'totalEmployees',
                    width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
                },
                {
                    xtype : 'booleancolumn',
                    text : i18n.gettext('Active'),
                    dataIndex : 'isActive',
                    trueText : '✓',
                    falseText : i18n.gettext('-'),
                    width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
                }
            ];

            this.callParent(arguments);
        }
    };

});
