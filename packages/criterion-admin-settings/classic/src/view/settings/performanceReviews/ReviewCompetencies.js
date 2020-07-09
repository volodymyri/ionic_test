Ext.define('criterion.view.settings.performanceReviews.ReviewCompetencies', function() {

    var DICT = criterion.consts.Dict;

    return {

        alias : 'widget.criterion_settings_performance_reviews_review_competencies',

        extend : 'criterion.view.settings.GridView',

        requires : [
            'criterion.store.ReviewScales',
            'criterion.store.ReviewCompetencies',
            'criterion.view.settings.performanceReviews.ReviewCompetency',
            'criterion.controller.settings.performanceReviews.ReviewCompetencies'
        ],

        title : i18n.gettext('Review Competency'),

        layout : 'fit',

        controller : {
            type : 'criterion_settings_performance_reviews_review_competencies',
            showTitleInConnectedViewMode : true,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_settings_performance_reviews_review_competency',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        height : 'auto',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HTMLEDITOR_WIDTH
                    }
                ]
            }
        },

        viewModel : {
            stores : {
                reviewCompetencies : {
                    type : 'criterion_review_competencies',
                    sorters : [
                        {
                            sorterFn : function(record1, record2) {
                                var asInt = function(s) {
                                        var val = parseInt(String(s).replace(/,/g, ''), 10);

                                        return isNaN(val) ? 0 : val;
                                    },
                                    name1 = asInt(record1.data.reviewCompetencyGroupSequence),
                                    name2 = asInt(record2.data.reviewCompetencyGroupSequence);

                                return name1 > name2 ? 1 : name1 === name2 ? 0 : -1;
                            }
                        }
                    ]
                },
                reviewScales : {
                    type : 'criterion_review_scales'
                }
            }
        },

        bind : {
            store : '{reviewCompetencies}'
        },

        columns : [
            {
                xtype : 'criterion_codedatacolumn',
                flex : 1,
                text : i18n.gettext('Group'),
                dataIndex : 'reviewCompetencyGroupCd',
                codeDataId : DICT.REVIEW_COMPETENCY_GROUP,
                sortable : false
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Name'),
                flex : 1,
                dataIndex : 'name'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Rating Scale'),
                flex : 1,
                dataIndex : 'reviewScaleId',
                renderer : function(value, meta, record) {
                    var reviewScale = this.getViewModel().get('reviewScales').getById(value);

                    return reviewScale ? reviewScale.get('name') : '';
                }
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Description'),
                flex : 2,
                dataIndex : 'description'
            }
        ]
    };

});
