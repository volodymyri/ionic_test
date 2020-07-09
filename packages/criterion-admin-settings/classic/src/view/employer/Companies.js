Ext.define('criterion.view.employer.Companies', function() {

    var inactiveText = i18n.gettext('Inactive');

    return {

        alias : 'widget.criterion_employer_companies',

        extend : 'criterion.view.settings.GridView',

        requires : [
            'criterion.store.Employers',
            'criterion.view.employer.CompanyForm',
            'criterion.controller.employer.Companies'
        ],

        controller : {
            type : 'criterion_employer_companies',
            showTitleInConnectedViewMode : true,
            reloadAfterEditorSave : true,
            reloadAfterEditorDelete : true,
            loadRecordOnEdit : false,
            editor : {
                xtype : 'criterion_employer_company_form',
                allowDelete : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        width : '90%'
                    }
                ]
            }
        },

        title : i18n.gettext('Company Details'),

        tbar : [
            '->',
            {
                xtype : 'button',
                text : i18n.gettext('Geocode Validation'),
                cls : 'criterion-btn-feature',
                handler : 'handleRunGeocodeValidation'
            },
            '|',
            {
                xtype : 'button',
                reference : 'addButton',
                text : i18n.gettext('Add'),
                cls : 'criterion-btn-feature',
                handler : 'handleAddClick'
            },
            {
                xtype : 'button',
                reference : 'refreshButton',
                cls : 'criterion-btn-transparent',
                glyph : criterion.consts.Glyph['ios7-refresh-empty'],
                scale : 'medium',
                handler : 'handleRefreshClick'
            }
        ],

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Logo'),
                dataIndex : 'id',
                width : 100,
                encodeHtml : false,
                renderer : function(value, metaData, record) {
                    var src = criterion.Api.getSecureResourceUrl(criterion.Api.getEmployerLogo(value));

                    return !record.phantom ? '<img height="40" src="' + src + '" />' : '';
                }
            },
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Company Name'),
                dataIndex : 'legalName',
                renderer : function(value, metaData, record) {
                    if (!record.get('isActive')) {
                        return Ext.String.format('{0} ({1})', value, inactiveText);
                    }

                    return value;
                }
            },
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Alternate Name'),
                dataIndex : 'alternativeName'
            },
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('National Identifier'),
                dataIndex : 'nationalIdentifier'
            },
            {
                xtype : 'gridcolumn',
                flex : 1,
                text : i18n.gettext('Website'),
                dataIndex : 'website'
            }
        ],

        initComponent : function() {
            this.callParent(arguments);
            this.setStore(Ext.StoreManager.lookup('Employers'));
        }
    };
});

