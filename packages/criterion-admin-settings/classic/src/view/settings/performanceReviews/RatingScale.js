Ext.define('criterion.view.settings.performanceReviews.RatingScale', function() {

    return {

        alias : 'widget.criterion_settings_performance_reviews_rating_scale',

        extend : 'criterion.view.FormView',

        title : i18n.gettext('Rating Scale'),

        requires : [
            'criterion.view.settings.performanceReviews.RatingScaleInnerForm',
            'criterion.controller.settings.performanceReviews.RatingScaleGridView'
        ],

        defaults : {
            labelWidth : 200
        },

        controller : {
            externalUpdate : false
        },

        bodyPadding : 0,

        items : [
            {
                xtype : 'criterion_panel',

                layout : {
                    type : 'vbox',
                    align : 'stretch'
                },

                bodyPadding : '25 10 10',

                defaults : criterion.Consts.UI_CONFIG.ONE_COL_FORM,

                items : [
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('Scale Name'),
                        name : 'name',
                        allowBlank : false,
                        bind : '{record.name}'
                    },
                    {
                        xtype : 'numberfield',
                        fieldLabel : i18n.gettext('Rating Limit'),
                        name : 'ratingLimit',
                        allowBlank : false,
                        border : '0 0 1 0',
                        bind : '{record.ratingLimit}'
                    }
                ]
            },
            {
                xtype : 'criterion_gridview',
                margin : '10 0 0 0',
                flex : 1,
                bind : {
                    store : '{record.details}'
                },

                controller : {
                    type : 'criterion_settings_performance_reviews_rating_scale_gridview',
                    connectParentView : false,
                    loadRecordOnEdit : false,
                    editor : {
                        xtype : 'criterion_settings_performance_reviews_rating_scale_inner_form',
                        allowDelete : true,
                        plugins : [
                            {
                                ptype : 'criterion_sidebar',
                                modal : true,
                                height : 500,
                                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
                            }
                        ],
                        draggable : true
                    }
                },

                tbar : [
                    {
                        xtype : 'button',
                        reference : 'addButton',
                        text : i18n.gettext('Add'),
                        cls : 'criterion-btn-feature',
                        listeners : {
                            click : 'handleAddClick'
                        }
                    }
                ],

                columns : {
                    items : [
                        {
                            text : i18n.gettext('Rating'),
                            width : 150,
                            dataIndex : 'rating'
                        },
                        {
                            text : i18n.gettext('Name'),
                            flex : 1,
                            dataIndex : 'name'
                        },
                        {
                            text : i18n.gettext('Description'),
                            flex : 2,
                            dataIndex : 'description'
                        }
                    ]
                }
            }
        ]
    };

});
