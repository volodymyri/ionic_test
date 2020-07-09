Ext.define('criterion.view.settings.payroll.GLTaxAddForm', function() {

    return {

        alias : 'widget.criterion_settings_payroll_gl_tax_add_form',

        extend : 'criterion.view.RecordPicker',

        requires : [
            'criterion.store.Taxes'
        ],

        defaultListenerScope : true,

        extraItems: [{
            xtype : 'toggleslidefield',
            fieldLabel : i18n.gettext('Show only taxes in employer\'s payroll'),
            labelWidth : 250,
            listeners : {
                change : 'handleSearchClick'
            }
        }],

        searchFields : [
            {
                fieldName : 'description', displayName : 'Tax Name'
            }
        ],

        columns : [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Tax Name'),
                dataIndex : 'description',
                flex : 1,
                filter : 'string'
            }
        ],

        title : i18n.gettext('Select Tax'),

        constructor : function(config) {
            var extraParams = {};

            if (config && config.employerId) {
                extraParams['employerId'] = config.employerId;
            }

            this.store = Ext.create('criterion.store.Taxes', {
                proxy : {
                    extraParams : extraParams,
                    url : criterion.consts.Api.API.TAX_SEARCH
                }
            });

            this.callParent(arguments);
        },

        handleSearchClick : function() {
            var store = this.down('grid').getStore(),
                extraParams = store.getProxy().getExtraParams();

            extraParams['usedInEmployerPayroll'] = this.down('toggleslidefield').getValue();

            this.callParent();
        }
    };
});
