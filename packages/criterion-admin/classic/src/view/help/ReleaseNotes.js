Ext.define('criterion.view.help.ReleaseNotes', function() {

    return {
        alias : 'widget.criterion_help_release_notes',

        extend : 'criterion.ux.Panel',

        requires : [
            'Ext.grid.plugin.RowExpander'
        ],

        layout : 'fit',

        titleAlign : 'right',

        header : {
            title : i18n.gettext('Release Notes'),

            items : [
                {
                    xtype : 'button',
                    cls : 'criterion-btn-transparent',
                    glyph : criterion.consts.Glyph['android-open'],
                    margin : '0 0 0 5',
                    scale : 'small',
                    handler : function() {
                        window.open(criterion.Api.getSecureResourceUrl(criterion.consts.Api.API.ZENDESK_GO_TO_EXTERNAL_URL + '?' + Ext.Object.toQueryString({url : criterion.consts.Help.HELP_CENTER_URL})), '_blank')
                    }
                }
            ]
        },

        dockedItems : [
            {
                xtype : 'container',
                cls : 'criterion-help-contact-container',
                dock : 'bottom',
                height : 40,
                layout : {
                    type : 'hbox',
                    align : 'stretch'
                },
                items : [
                    {
                        xtype : 'button',
                        cls : 'criterion-btn-transparent',
                        glyph : criterion.consts.Glyph['email'],
                        bind : {
                            text : '{helpCenterEmail}',
                            href: 'mailto:{helpCenterEmail}'
                        }
                    },

                    {
                        xtype : 'button',
                        cls : 'criterion-btn-transparent',
                        glyph : criterion.consts.Glyph['ios7-telephone'],
                        bind : {
                            text : '{helpCenterPhone}',
                            href: 'tel:{helpCenterPhone}'
                        }
                    }
                ]
            }
        ],

        items : [
            {
                xtype : 'grid',

                plugins : [
                    {
                        ptype : 'rowexpander',

                        headerWidth : 40,

                        rowBodyTpl : new Ext.XTemplate(
                            '<p>{detail}</p>',
                            '<a href="{blogUrl}" target="_blank" class="read-full">' + i18n.gettext('Read full release')
                        ),

                        addExpander : function(expanderGrid) {
                            this.expanderColumn = expanderGrid.headerCt.insert(2, this.getHeaderConfig());
                        }
                    }
                ],

                bind : {
                    store : '{releaseNotes}'
                },

                hideHeaders : true,

                columns : [
                    {
                        xtype : 'templatecolumn',

                        dataIndex : 'heading',

                        flex : 1,

                        tpl : Ext.create('Ext.XTemplate',
                            '<div><strong>{heading}</strong></div>' +
                            '<span class="release-date">{releaseDate:date(criterion.consts.Api.SHOW_DATE_FORMAT)}</span>'
                        )

                    }
                ]

            }
        ]
    };

});
