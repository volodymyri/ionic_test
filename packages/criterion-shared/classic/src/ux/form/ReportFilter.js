Ext.define('criterion.ux.form.ReportFilter', function() {
    return {
        extend : 'Ext.form.FieldContainer',

        alias : 'widget.criterion_report_filter',

        config : {
            /**
             * @see {criterion.model.reports.options.Filter}
             */
            filterRecord : null
        },

        layout : 'hbox',

        afterRender : function() {
            this.callParent(arguments);
        },

        updateFilterRecord : function(filter) {
            var value = filter.get('value'),
                field,
                date;

            this.filter = filter;

            if (!filter) {
                return;
            }

            switch (filter.get('type')) {
                case criterion.Consts.REPORT_FILTER_TYPE.FILTER_STRING:
                    field = {
                        xtype : 'textfield',
                        value : value,
                        allowBlank : false,
                        listeners : {
                            change : function(field, newValue) {
                                filter.set('value', newValue);
                            }
                        },
                        flex : 1
                    };
                    break;

                case criterion.Consts.REPORT_FILTER_TYPE.FILTER_INTEGER:
                    field = {
                        xtype : 'numberfield',
                        value : value,
                        allowDecimals : false,
                        allowBlank : false,
                        listeners : {
                            change : function(field, newValue) {
                                filter.set('value', newValue);
                            }
                        },
                        flex : 1
                    };
                    break;

                case criterion.Consts.REPORT_FILTER_TYPE.FILTER_DOUBLE:
                    field = {
                        xtype : 'numberfield',
                        value : value,
                        hideTrigger : true,
                        allowBlank : false,
                        listeners : {
                            change : function(field, newValue) {
                                filter.set('value', newValue);
                            }
                        },
                        flex : 1
                    };
                    break;

                case criterion.Consts.REPORT_FILTER_TYPE.FILTER_TIMESTAMP:
                case criterion.Consts.REPORT_FILTER_TYPE.FILTER_DATE_TIME:
                    date = filter.get('date');
                    field = {
                        xtype : 'container',
                        layout : 'hbox',
                        flex : 1,
                        items : [
                            {
                                xtype : 'datefield',
                                value : date,
                                allowBlank : false,
                                listeners : {
                                    change : function(field, newValue) {
                                        filter.set('date', newValue);
                                    }
                                },
                                margin : '0 10 0 0',
                                flex : 2
                            },
                            {
                                xtype : 'timefield',
                                value : date,
                                allowBlank : false,
                                listeners : {
                                    change : function(field, newValue) {
                                        filter.set('date', newValue);
                                    }
                                },
                                flex : 1
                            }
                        ]
                    };
                    break;

                case criterion.Consts.REPORT_FILTER_TYPE.FILTER_DATE:
                case criterion.Consts.REPORT_FILTER_TYPE.FILTER_LOCAL_DATE:
                    var from = filter.get('from'),
                        to = filter.get('to');

                    field = {
                        xtype : 'container',
                        layout : 'hbox',
                        flex : 1,
                        items : [
                            {
                                xtype : 'datefield',
                                fieldLabel : i18n.gettext('From'),
                                labelWidth : 60,
                                value : from,
                                allowBlank : false,
                                listeners : {
                                    change : function(field, newValue) {
                                        filter.set('from', newValue);
                                    }
                                },
                                flex : 1
                            },
                            {
                                xtype : 'datefield',
                                labelWidth : 40,
                                value : to,
                                allowBlank : false,
                                margin : '0 0 0 20',
                                fieldLabel : i18n.gettext('To'),
                                listeners : {
                                    change : function(field, newValue) {
                                        filter.set('to', newValue);
                                    }
                                },
                                flex : 1
                            }
                        ]
                    };
                    break;

                case criterion.Consts.REPORT_FILTER_TYPE.FILTER_TIME:
                    date = filter.get('date');
                    field = {
                        xtype : 'timefield',
                        sortByDisplayField : false,
                        value : date,
                        allowBlank : false,
                        listeners : {
                            change : function(field, newValue) {
                                filter.set('date', newValue);
                            }
                        },
                        flex : 1
                    };
                    break;

                case criterion.Consts.REPORT_FILTER_TYPE.FILTER_CD:
                    field = {
                        xtype : 'criterion_code_detail_field',
                        codeDataId : criterion.CodeDataManager.getCodeTableNameById(filter.get('codeTableId')),
                        value : parseInt(value, 10),
                        allowBlank : false,
                        flex : 1,
                        listeners : {
                            change : function(field, newValue) {
                                filter.set('value', newValue);
                            }
                        }
                    };
                    break;

                case criterion.Consts.REPORT_FILTER_TYPE.FILTER_BOOLEAN:
                    field = {
                        xtype : 'checkbox',
                        value : value || false,
                        listeners : {
                            change : function(field, newValue) {
                                filter.set('value', newValue);
                            }
                        }
                    };
                    break;
            }

            if (this.rendered) {
                this.removeAll();

                this.add(field);
            } else {
                this.items = [field];
            }

        }
    }
});
