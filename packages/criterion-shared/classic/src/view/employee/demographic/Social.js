Ext.define('criterion.view.employee.demographic.Social', function() {

    function detailsRenderer(value) {
        var html;

        if (Ext.form.VTypes.email(value)) {
            html = '<a target="_blank" href="mailto:{0}">{0}</a>';
        } else if (Ext.form.VTypes.url(value)) {
            html = '<a target="_blank" href="{0}">{0}</a>';
        } else {
            html = '<span>{0}</span>';
        }

        return Ext.String.format(html, value);
    }

    return {

        alias : 'widget.criterion_employee_demographic_social',

        extend : 'criterion.view.GridView',

        requires : [
            'criterion.store.person.Communications',
            'criterion.view.employee.demographic.SocialForm',
            'criterion.controller.person.GridView'
        ],

        title : i18n.gettext('Social Media'),

        store : {
            type : 'criterion_person_communications'
        },

        controller : {
            type : 'criterion_person_gridview',
            connectParentView : false,
            editor : {
                xtype : 'criterion_employee_social_form',
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

        tbar : [
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                listeners : {
                    click : 'handleAddClick'
                },
                hidden : true,
                bind : {
                    hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.EMPLOYEE_SOCIAL_MEDIA, criterion.SecurityManager.CREATE, true)
                }
            },
            '->',
            {
                xtype : 'button',
                reference : 'refreshButton',
                cls : 'criterion-btn-transparent',
                glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                scale : 'medium',
                listeners : {
                    click : 'handleRefreshClick'
                }
            }
        ],

        initComponent : function() {
            var me = this;

            me.columns = [
                {
                    xtype : 'criterion_codedatacolumn',
                    text : i18n.gettext('Type'),
                    dataIndex : 'socialMediaTypeCd',
                    codeDataId : criterion.consts.Dict.SOCIAL_MEDIA_TYPE,
                    flex : 1
                },
                {
                    text : i18n.gettext('Identifier'),
                    dataIndex : 'identifier',
                    flex : 1,
                    encodeHtml : false,
                    renderer : detailsRenderer
                }
            ];

            me.callParent(arguments);
        }
    };

});
