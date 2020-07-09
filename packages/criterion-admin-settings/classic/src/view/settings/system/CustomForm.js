// @deprecated
Ext.define('criterion.view.settings.system.CustomForm', function () {

    return {

        alias : 'widget.criterion_settings_system_customform',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.system.CustomForm',
            'criterion.view.customData.GridView'
        ],

        controller : {
            type : 'criterion_settings_system_customform',
            externalUpdate : false
        },

        allowDelete : true,

        bodyPadding : 0,

        title : i18n.gettext('Custom Form Details'),

        items : [
            {
                items : [
                    {
                        xtype : 'textfield',
                        padding : '20 25',
                        fieldLabel : i18n.gettext('Name'),
                        name : 'name',
                        allowBlank : false,
                        labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDTH,
                        maxWidth : criterion.Consts.UI_DEFAULTS.FORM_ITEM_WIDTH
                    },
                    {
                        xtype : 'criterion_customdata_gridview',
                        reference : 'customdataGrid',
                        flex : 1,
                        bind : {
                            hidden : '{isPhantom}'
                        },
                        controller : {
                            type : 'criterion_customdata_gridview',
                            connectParentView : false,
                            editor : {
                                xtype : 'criterion_customdata_editor',
                                modal : true,
                                plugins : [
                                    {
                                        ptype : 'criterion_sidebar',
                                        height : 'auto',
                                        width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                                        modal : true
                                    }
                                ],
                                draggable : true
                            }
                        },

                        viewModel : {
                            data : {
                                showEntitySelector : false
                            }
                        }
                    }
                ]
            }
        ]
    };

});
