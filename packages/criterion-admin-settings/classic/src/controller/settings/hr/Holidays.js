Ext.define('criterion.controller.settings.hr.Holidays', function() {

    return {

        extend : 'criterion.controller.employer.GridView',

        requires : [
            'criterion.ux.form.CloneForm'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.controller.mixin.Cloning'
        ],

        alias : 'controller.criterion_settings_holidays',

        load(opts = {}) {
            this.getView().getSelectionModel().deselectAll();

            return Ext.promise.Promise.all([
                this.getViewModel().getStore('incomes').loadWithPromise(),
                this.callParent(arguments)
            ]);
        },

        handleSelectionChange(g, selection) {
            this.getViewModel().set('selectionCount', selection.length);
        },

        handleClone() {
            let picker,
                me = this,
                view = this.getView(),
                vm = this.getViewModel(),
                selection = view.getSelection(),
                employerId = selection[0].get('employerId'),
                selectedHolidays = Ext.Array.map(selection, select => ({
                    id : select.getId(),
                    year : select.get('year'),
                    name : select.get('name') + criterion.Consts.CLONE_PREFIX,
                    code : select.get('code') + criterion.Consts.CLONE_PREFIX,
                    incomeListId : select.get('incomeListId')
                })),
                holidayItems = [];

            Ext.Array.each(selectedHolidays, (hol, index) => {
                let holidayId = hol.id;

                holidayItems.push({
                    xtype : 'container',
                    layout : 'hbox',
                    margin : '0 0 5 0',
                    items : [
                        {
                            xtype : 'numberfield',
                            width : 65,
                            margin : '0 5 0 0',
                            value : hol.year,
                            bind : {
                                value : '{itemsToClone.' + holidayId + '.year}'
                            }
                        },
                        {
                            xtype : 'textfield',
                            flex : 1,
                            margin : '0 5 0 0',
                            value : hol.name,
                            bind : {
                                value : '{itemsToClone.' + holidayId + '.name}'
                            }
                        },
                        {
                            xtype : 'textfield',
                            flex : 1,
                            margin : '0 5 0 0',
                            value : hol.code,
                            bind : {
                                value : '{itemsToClone.' + holidayId + '.code}'
                            }
                        },
                        {
                            xtype : 'combobox',
                            flex : 1,
                            valueField : 'id',
                            displayField : 'description',
                            allowBlank : false,
                            editable : false,
                            value : hol.incomeListId,
                            bind : {
                                store : '{incomes}',
                                value : '{itemsToClone.' + holidayId + '.incomeListId}'
                            },
                            queryMode : 'local'
                        }
                    ]
                })
            });

            picker = Ext.create('criterion.ux.form.CloneForm', {
                viewModel : {
                    data : {
                        employerId : employerId
                    },
                    stores : {
                        incomes : {
                            type : 'employer_income_lists',
                            data : vm.getStore('incomes').getRange(),
                            filters : [{
                                property : 'employerId',
                                value : '{employerId}'
                            }]
                        }
                    },
                    formulas : {
                        disableCloneBtn : data => !data('employerId')
                    }
                },

                title : i18n.gettext('Clone Holidays to Employer'),

                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        height : 'auto',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
                    }
                ],

                items : [
                    {
                        xtype : 'criterion_employer_combo',
                        fieldLabel : i18n.gettext('Employer'),
                        allowBlank : false,
                        bind : {
                            value : '{employerId}'
                        }
                    },

                    {
                        xtype : 'container',
                        layout : {
                            type : 'vbox',
                            align : 'stretch'
                        },
                        items : [
                            {
                                xtype : 'container',
                                layout : 'hbox',
                                margin : '0 0 5 0',
                                border : '0 0 1 0',
                                style : {
                                    borderColor : '#CCC',
                                    borderStyle : 'dotted'
                                },
                                items : [
                                    {
                                        xtype : 'label',
                                        cls : 'x-form-item-label x-form-item-label-default x-unselectable',
                                        text : i18n.gettext('Year'),
                                        width : 65,
                                        margin : '0 5 0 0'
                                    },
                                    {
                                        xtype : 'label',
                                        cls : 'x-form-item-label x-form-item-label-default x-unselectable',
                                        text : i18n.gettext('Name'),
                                        flex : 1,
                                        margin : '0 5 0 0'
                                    },
                                    {
                                        xtype : 'label',
                                        cls : 'x-form-item-label x-form-item-label-default x-unselectable',
                                        text : i18n.gettext('Code'),
                                        flex : 1,
                                        margin : '0 5 0 0'
                                    },
                                    {
                                        xtype : 'label',
                                        cls : 'x-form-item-label x-form-item-label-default x-unselectable',
                                        text : i18n.gettext('Income'),
                                        flex : 1
                                    }
                                ]
                            },

                            ...holidayItems
                        ]
                    }

                ]
            });

            picker.show();
            picker.on({
                cancel : () => {
                    me.setCorrectMaskZIndex(false);
                    picker.destroy();
                },
                clone : data => {
                    me.setCorrectMaskZIndex(false);
                    picker.destroy();
                    me.cloneHolidays(data, employerId, selectedHolidays);
                }
            });

            this.setCorrectMaskZIndex(true);
        },

        getParamsForCloning(data, item) {
            let itemId = item.id,
                holiday = data.itemsToClone[itemId],
                name = holiday && holiday.name,
                code = holiday && holiday.code,
                year = holiday && holiday.year,
                incomeListId = holiday && holiday.incomeListId;

            return {
                employerId : data.employerId,
                name : name || item.name,
                code : code || item.code,
                year : year || item.year,
                incomeListId : incomeListId || item.incomeListId
            }
        },

        cloneHolidays(data, employerId, selectedHolidays) {
            this.actCloneItems(
                i18n.gettext('Clone holidays'),
                criterion.consts.Api.API.EMPLOYER_HOLIDAY_CLONE,
                data,
                employerId,
                selectedHolidays
            );
        }
    };
});
