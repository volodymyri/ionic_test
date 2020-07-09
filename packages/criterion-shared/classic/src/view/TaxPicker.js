Ext.define('criterion.view.TaxPicker', {

    extend : 'criterion.view.MultiRecordPickerRemote',

    requires : [
        'criterion.controller.TaxPicker',
        'criterion.store.Taxes'
    ],

    alias : 'widget.criterion_view_tax_picker',

    multiSelect : true,

    config : {
        allowTaxNameFilter : true
    },

    viewModel : {
        data : {
            title : i18n.gettext('Select taxes'),
            showClearButton : false
        },
        stores : {
            inputStore : Ext.create('criterion.store.Taxes')
        }
    },

    controller : {
        type : 'criterion_tax_picker'
    },

    plugins : [
        {
            ptype : 'criterion_sidebar',
            modal : true,
            height : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_HEIGHT,
            width : criterion.Consts.UI_DEFAULTS.MODAL_WIDE_WIDTH
        }
    ],

    draggable : false,

    initComponent : function() {
        var gridColumns = [
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Work/Home Locations'),
                dataIndex : 'geoCode',
                hidden : true,
                flex : 1,
                filter : 'string',
                filterType : 'employeeId',
                filterCfg : {
                    xtype : 'textfield',
                    disabled : true,
                    hidden : true
                }
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Tax Name'),
                dataIndex : 'description',
                flex : 1,
                filter : 'string'
            },
            {
                text : i18n.gettext('City'),
                dataIndex : 'cityName',
                flex : 1,
                excludeFromFilters : true
            },
            {
                text : i18n.gettext('County'),
                dataIndex : 'countyName',
                flex : 1,
                excludeFromFilters : true
            },
            {
                text : i18n.gettext('School District'),
                dataIndex : 'schdistName',
                flex : 1,
                excludeFromFilters : true
            },
            {
                text : i18n.gettext('Geo Code'),
                dataIndex : 'geocode',
                flex : 1,
                excludeFromFilters : true
            },
            {
                text : i18n.gettext('School Code'),
                dataIndex : 'schdist',
                flex : 1,
                excludeFromFilters : true
            }
        ];

        this.getViewModel().set({
            gridColumns : gridColumns,
            hideFilters : !this.getAllowTaxNameFilter()
        });

        this.callParent(arguments);
    }

});