Ext.define('criterion.view.recruiting.candidate.Documents', function() {

    var DICT = criterion.consts.Dict;

    return {
        alias : 'widget.criterion_recruiting_candidate_documents',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.store.employer.jobPosting.candidate.Documents',
            'criterion.view.recruiting.candidate.DocumentForm',
            'criterion.controller.recruiting.candidate.Documents'
        ],

        controller : {
            type : 'criterion_recruiting_candidate_documents',
            connectParentView : false,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            editor : {
                xtype : 'criterion_recruiting_candidate_document_form',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        height : 'auto',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
                    }
                ]
            }
        },

        viewModel : {
            stores : {
                documents : {
                    type : 'employer_jobposting_candidate_documents'
                }
            }
        },

        bind : {
            store : '{documents}'
        },

        tbar : null,

        columns : [
            {
                xtype : 'criterion_codedatacolumn',
                text : i18n.gettext('Type'),
                dataIndex : 'documentTypeCd',
                codeDataId : DICT.DOCUMENT_RECORD_TYPE,
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
            },
            {
                xtype : 'gridcolumn',
                dataIndex : 'description',
                text : i18n.gettext('Description'),
                flex : 1,
                width : criterion.Consts.UI_DEFAULTS.COL_ITEM_WIDTH
            },
            {
                xtype : 'datecolumn',
                dataIndex : 'uploadDate',
                text : i18n.gettext('Upload Date'),
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Size'),
                dataIndex : 'size',
                align : 'right',
                formatter : 'criterionFileSize',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
            },
            {
                xtype : 'booleancolumn',
                text : i18n.gettext('Status'),
                dataIndex : 'isResponded',
                trueText : i18n.gettext('Filled'),
                falseText : i18n.gettext('-')
            }
        ]
    };

});
