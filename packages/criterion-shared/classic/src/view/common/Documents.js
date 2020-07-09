Ext.define('criterion.view.common.Documents', function() {

    var DICT = criterion.consts.Dict;

    return {

        alias : 'widget.criterion_common_documents',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.store.employee.Documents',
            'criterion.store.employer.Documents',
            'criterion.view.common.DocumentAttachForm'
        ],

        title : i18n.gettext('Documents'),

        viewModel : {},

        config : {
            mode : '',
            isEss : false
        },

        listeners : {
            viewaction : 'onAttachmentView'
        },

        initComponent : function() {

            var isEss = this.getIsEss();

            this.columns = [
                {
                    xtype : 'gridcolumn',
                    dataIndex : 'description',
                    text : i18n.gettext('Description'),
                    flex : 3
                },
                {
                    xtype : 'criterion_codedatacolumn',
                    text : i18n.gettext('Type'),
                    dataIndex : 'documentTypeCd',
                    codeDataId : DICT.DOCUMENT_RECORD_TYPE,
                    flex : 2
                },
                {
                    xtype : 'datecolumn',
                    dataIndex : 'dueDate',
                    text : i18n.gettext('Due Date'),
                    width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
                },
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('File Name'),
                    dataIndex : 'fileName',
                    hidden : isEss,
                    flex : 3
                },
                {
                    xtype : 'gridcolumn',
                    text : i18n.gettext('Size'),
                    dataIndex : 'size',
                    align : 'right',
                    formatter : 'criterionFileSize',
                    flex : 1
                },
                {
                    xtype : 'datecolumn',
                    dataIndex : 'uploadDate',
                    text : i18n.gettext('Upload Date'),
                    hidden : isEss,
                    flex : 1
                },
                {
                    xtype : 'gridcolumn',
                    dataIndex : 'isShare',
                    width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                    hidden : isEss,
                    encodeHtml : false,
                    renderer : function(value) {
                        return ' <span style="font-family:Ionicons">'
                            + '&#' + criterion.consts.Glyph[value ? 'ios7-person-outline' : 'ios7-locked-outline']
                            + '</span>';
                    }
                },
                {
                    xtype : 'criterion_actioncolumn',
                    width : criterion.Consts.UI_DEFAULTS.ACTION_COL_ITEM_WIDTH,
                    items : [
                        {
                            glyph : criterion.consts.Glyph['ios7-download-outline'],
                            tooltip : i18n.gettext('Download'),
                            action : 'viewaction'
                        }
                    ]
                }
            ];
            this.callParent(arguments);
            this.getViewModel().setStores({
                documentsStore : {
                    type : this.getMode() === 'person' ? 'criterion_employee_documents' : 'criterion_employer_documents'
                }
            });

            this.setBind({
                store : '{documentsStore}'
            });
        }
    };

});
