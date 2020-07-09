Ext.define('criterion.view.common.DocumentFolder', function() {

    return {
        alias : 'widget.criterion_common_document_folder',

        extend : 'criterion.view.FormView',

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        controller : {
            externalUpdate : false
        },

        title : i18n.gettext('Folder'),

        bodyPadding : '20 10',
        defaults : criterion.Consts.UI_CONFIG.ONE_COL_FORM,

        items : [
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Name'),
                allowBlank : false,
                name : 'description'
            }
        ]
    };

});
