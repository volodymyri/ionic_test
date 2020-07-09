Ext.define('criterion.view.settings.employeeEngagement.Badges', function() {

    return {
        alias : 'widget.criterion_settings_badges',

        extend : 'criterion.view.settings.GridView',

        requires : [
            'criterion.store.community.Badges',
            'criterion.controller.settings.employeeEngagement.Badges',
            'criterion.view.settings.employeeEngagement.Badge'
        ],

        title : i18n.gettext('Badges'),

        layout : 'fit',

        rowEditing : false,

        controller : {
            type : 'criterion_settings_badges',
            connectParentView : false,
            reloadAfterEditorSave : true,
            editor : {
                xtype : 'criterion_settings_badge',
                allowDelete : false
            }
        },

        store : {
            type : 'criterion_community_badges'
        },

        initComponent : function() {
            this.columns = [
                {
                    xtype : 'gridcolumn',
                    dataIndex : 'imageUrl',
                    width : 60,
                    encodeHtml : false,
                    renderer : function(url, metaData) {
                        metaData.style = 'padding: 3px 10px;';

                        return Ext.util.Format.format('<img height="38" src="{0}?_dc={1}" alt=""/>', url, new Date().getTime());
                    }
                },
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('Achievement'),
                    dataIndex : 'description',
                    flex : 1
                }
            ];

            this.callParent(arguments);
        }
    };

});
