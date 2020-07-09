Ext.define('criterion.view.settings.performanceReviews.ReviewCompetency', function() {

    return {

        alias : 'widget.criterion_settings_performance_reviews_review_competency',

        extend : 'criterion.view.FormView',

        title : i18n.gettext('Review Competency'),

        controller : {
            externalUpdate : false
        },

        bodyPadding : 20,

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        items : [
            {
                xtype : 'criterion_code_detail_field',
                sortByDisplayField : false,
                codeDataId : criterion.consts.Dict.REVIEW_COMPETENCY_GROUP,
                fieldLabel : i18n.gettext('Group'),
                name : 'reviewCompetencyGroupCd',
                allowBlank : false
            },
            {
                xtype : 'textfield',
                fieldLabel : i18n.gettext('Name'),
                name : 'name',
                allowBlank : false
            },
            {
                xtype : 'combobox',
                fieldLabel : i18n.gettext('Review Scale'),
                queryMode : 'local',
                name : 'reviewScaleId',
                displayField : 'name',
                valueField : 'id',
                bind : {
                    store : '{reviewScales}'
                },
                triggers : {
                    clear : {
                        type : 'clear',
                        cls : 'criterion-clear-trigger',
                        hideWhenEmpty : true
                    }
                }
            },
            {
                xtype : 'textarea',
                fieldLabel : i18n.gettext('Description'),
                name : 'description',
                height : 300,
                flex : 1
            }
        ]
    };

});
