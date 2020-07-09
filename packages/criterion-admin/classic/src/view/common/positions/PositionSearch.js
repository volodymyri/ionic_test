Ext.define('criterion.view.common.positions.PositionSearch', function() {

    return {
        alias : 'widget.criterion_positions_position_search',

        extend : 'Ext.Panel',

        requires : [
            'criterion.controller.common.positions.PositionSearch'
        ],

        viewModel : {},

        controller : {
            type : 'criterion_positions_position_search'
        },

        cls : 'criterion-side-panel',

        layout : {
            type : 'vbox',
            align : 'stretch'
        },
        scrollable : true,

        items : [
            {
                layout : 'hbox',
                cls : 'criterion-side-field',
                padding : '26 20',
                items : [
                    {
                        xtype : 'splitbutton',
                        width : '100%',
                        text : i18n.gettext('Add Position'),
                        textAlign : 'left',
                        listeners : {
                            click : 'onPositionAdd'
                        },
                        hidden : true,
                        bind : {
                            hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.POSITION, criterion.SecurityManager.CREATE, true)
                        },
                        menu : new Ext.menu.Menu({
                            plain : true,
                            shadow : false,
                            items : [
                                {
                                    text : i18n.gettext('Copy Existing'),
                                    listeners : {
                                        click : 'handleCopyExisting'
                                    }
                                }
                            ],
                            listeners : {
                                beforerender : function() {
                                    this.setWidth(this.up('button').getWidth());
                                }
                            },
                            cls : 'criterion-side-field-menu criterion-side-add-field-menu'
                        }),
                        cls : 'criterion-btn-side-add'
                    }
                ]
            },
            {
                xtype : 'form',
                reference : 'searchForm',

                defaults : {
                    labelAlign : 'top',
                    width : '100%',
                    cls : 'criterion-side-field'
                },

                items : [
                    {
                        xtype : 'criterion_employer_combo',
                        fieldLabel : i18n.gettext('Employer'),
                        name : 'employerId',
                        reference : 'employerCombo',
                        allowBlank : true,
                        listeners : {
                            employersLoaded : 'handleSearchComboLoaded',
                            change : 'handleSearchComboChange'
                        },
                        listConfig : {
                            cls : 'criterion-side-list',
                            shadow : false
                        }
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('Code'),
                        name : 'code',
                        enableKeyEvents : true,
                        listeners : {
                            keypress : 'onKeyPress'
                        }
                    },
                    {
                        xtype : 'textfield',
                        fieldLabel : i18n.gettext('Title'),
                        name : 'title',
                        enableKeyEvents : true,
                        listeners : {
                            keypress : 'onKeyPress'
                        }
                    },
                    {
                        xtype : 'combobox',
                        fieldLabel : i18n.gettext('Status'),
                        store : Ext.create('Ext.data.Store', {
                            fields : ['text', 'value'],
                            data : [
                                {
                                    text : i18n.gettext('Active'),
                                    value : 'true'
                                },
                                {
                                    text : i18n.gettext('Inactive'),
                                    value : 'false'
                                },
                                {
                                    text : i18n.gettext('All'),
                                    value : null
                                }
                            ]
                        }),
                        name : 'isActive',
                        valueField : 'value',
                        emptyText : i18n.gettext('Active'),
                        value : 'true',
                        editable : false,
                        sortByDisplayField : false,
                        listeners : {
                            change : 'handleSearchComboChange'
                        },
                        listConfig : {
                            cls : 'criterion-side-list',
                            shadow : false
                        }
                    }
                ]
            },
            {
                layout : 'hbox',
                padding : 20,
                items : [
                    {
                        flex : 1
                    },
                    {
                        xtype : 'button',
                        text : i18n.gettext('Search'),
                        cls : 'criterion-btn-primary',
                        listeners : {
                            click : 'onSearch'
                        }
                    }
                ]
            }
        ],

        getSearchCriteria : function() {
            var criteria = {},
                searchForm = this.down('form');

            if (searchForm) {
                Ext.Object.each(searchForm.getValues(), function(key, value) {
                    Ext.isString(value) && (value = value.trim());
                    if (value) {
                        criteria[key] = value;
                    }
                });
            }

            return criteria;
        }
    };

});
