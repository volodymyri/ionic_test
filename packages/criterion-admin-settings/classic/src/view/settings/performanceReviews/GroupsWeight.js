Ext.define('criterion.view.settings.performanceReviews.GroupsWeight', function() {

    return {

        alias : 'widget.criterion_settings_performance_reviews_groups_weight',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.settings.performanceReviews.GroupsWeight'
        ],

        viewModel : {
            data : {
                totalCompetencyWeights : 0
            },

            formulas : {
                disableSave : function(data) {
                    return data('totalCompetencyWeights') !== 100;
                },

                validationTotal : function(data) {
                    return data('totalCompetencyWeights') !== 100 ? '<br><span class="fs-07">' + i18n.gettext('should be 100%') + '</span>' : '';
                }
            }
        },

        title : i18n.gettext('Manage Groups Weight'),

        controller : {
            type : 'criterion_settings_performance_reviews_groups_weight'
        },

        listeners : {
            scope : 'controller',
            show : 'onShow'
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : true,
                height : '50%',
                width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
            }
        ],

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        bbar : [
            '->',
            {
                xtype : 'button',
                reference : 'cancelBtn',
                text : i18n.gettext('Cancel'),
                cls : 'criterion-btn-light',
                scale : 'small',
                handler : 'onCancelHandler'
            },
            {
                xtype : 'button',
                text : i18n.gettext('Save'),
                cls : 'criterion-btn-primary',
                scale : 'small',
                disabled : true,
                bind : {
                    disabled : '{disableSave}'
                },
                handler : 'onSaveButtonHandler'
            }
        ],

        items : [
            {
                xtype : 'criterion_gridpanel',
                scrollable : 'vertical',
                sortableColumns : false,
                border : 1,
                tbar : null,
                bind : {
                    store : '{record.weights}'
                },
                flex : 1,
                dockedItems : [
                    {
                        xtype : 'container',
                        layout : 'hbox',
                        dock : 'bottom',
                        margin : '10 5 0 0',
                        items : [
                            {
                                flex : 1
                            },
                            {
                                bind : {
                                    html : 'Total: {totalCompetencyWeights:round(2)}%{validationTotal}'
                                }
                            }
                        ]
                    }
                ],
                columns : {
                    items : [
                        {
                            xtype : 'criterion_codedatacolumn',
                            dataIndex : 'competencyGroupCd',
                            codeDataId : criterion.consts.Dict.REVIEW_COMPETENCY_GROUP,
                            flex : 1,
                            text : i18n.gettext('Competency Group')
                        },
                        {
                            xtype : 'criterion_widgetcolumn',
                            widget : {
                                xtype : 'numberfield',
                                listeners : {
                                    change : 'handleChangeCompetencyWeight'
                                }
                            },
                            text : i18n.gettext('Weight'),
                            width : 100,
                            dataIndex : 'weightInPercent'
                        },
                        {
                            text : '',
                            width : 50,
                            renderer : function() {
                                return '%';
                            }
                        }
                    ]
                }
            }

        ]

    };

});
