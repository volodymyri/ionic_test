Ext.define('criterion.controller.reports.DataTransferOptions', function() {

    const ORDER_BY_TOKEN = ';sort:';

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_reports_data_transfer_options',

        requires : [
            'criterion.model.reports.options.Parameter',
            'criterion.ux.form.ReportParameter'
        ],

        loadTransferOptions : function(transferId, optionValues) {
            var me = this,
                view = this.getView();

            if (transferId) {
                view.fireEvent('setDownloadableResult', false);

                view.setLoading(true);
                criterion.Api.requestWithPromise({
                    url : Ext.util.Format.format(criterion.consts.Api.API.TRANSFER_OBJECT_PARAMETERS, transferId),
                    method : 'GET'
                }).then({
                    scope : me,
                    success : function(response) {
                        me.createPanelItems(response);
                        // delay for prepare
                        Ext.defer(function() {
                            me.setOptionValues(optionValues);
                        }, 100);
                    }
                }).always(function() {
                    view.setLoading(false);
                })
            }
        },

        createPanelItems : function(data) {
            var view = this.getView(),
                pane1 = this.lookup('pane1'),
                pane2 = this.lookup('pane2'),
                hiddenItems = [];

            pane1.removeAll(true);
            pane2.removeAll(true);

            data.sort(function(a, b) {
                if (!a.dataType || !b.dataType) {
                    return
                }
                var aPos = a.dataType.split('|'),
                    bPos = b.dataType.split('|');

                if (aPos.length > 1 && bPos.length > 1) {
                    return parseInt(aPos[1].replace(/;.*/, ''), 10) - parseInt(bPos[1].replace(/;.*/, ''), 10);
                }
            });

            Ext.Array.each(data, function(itemData, idx) {
                var sorterPos = itemData.dataType && itemData.dataType.indexOf('|'),
                    orderByPos = itemData.dataType && itemData.dataType.indexOf(ORDER_BY_TOKEN);

                if (orderByPos && orderByPos > -1) {
                    itemData.orderBy = itemData.dataType.slice(orderByPos + ORDER_BY_TOKEN.length)
                }

                if (sorterPos && sorterPos > -1) {
                    itemData.dataType = itemData.dataType.slice(0, sorterPos);
                }

                var dataType = itemData.dataType,
                    cmp = {
                        name : itemData.name,
                        isParameter : true,
                        fieldLabel : itemData.name.replace(/_/g, ' ').replace(/\w\S*/g, function(txt) {
                                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                            }
                        ),
                        value : itemData.defaultValue,
                        allowBlank : false
                    };

                if (dataType) {
                    if (dataType.indexOf(';') === -1) {
                        switch (dataType) {
                            case 'er':
                                Ext.apply(cmp, {
                                    xtype : 'criterion_employer_combo',
                                    fieldLabel : i18n.gettext('Employer')
                                });
                                break;

                            case 'i':
                                Ext.apply(cmp, {
                                    xtype : 'numberfield',
                                    allowDecimals : false
                                });
                                break;

                            case 'n':
                                Ext.apply(cmp, {
                                    xtype : 'numberfield'
                                });
                                break;

                            case 'f':
                                Ext.apply(cmp, {
                                    xtype : 'filefield',
                                    buttonText : i18n.gettext('Browse'),
                                    buttonConfig : {
                                        cls : 'criterion-btn-feature'
                                    },
                                    listeners : {
                                        change : function(fld, value) {
                                            var newValue = value.replace(/C:\\fakepath\\/g, '');
                                            fld.setRawValue(newValue);
                                        }
                                    }
                                });
                                break;

                            case 'of':
                                view.fireEvent('setDownloadableResult', true);
                                Ext.apply(cmp, {
                                    xtype : 'textfield',
                                    fieldLabel : i18n.gettext('Output File Name')
                                });
                                break;

                            case 'hof':
                                view.fireEvent('setDownloadableResult', true);
                                Ext.apply(cmp, {
                                    xtype : 'hiddenfield',
                                    value : itemData.defaultValue
                                });
                                break;

                            case 'd':
                                Ext.apply(cmp, {
                                    xtype : 'datefield',
                                    emptyText : i18n.gettext('Select Date'),
                                    submitFormat : 'Y-m-d'
                                });
                                break;

                            case 'h':
                                Ext.apply(cmp, {
                                    xtype : 'hiddenfield',
                                    value : itemData.defaultValue
                                });
                                break;

                            case 's':
                                Ext.apply(cmp, {
                                    xtype : 'textfield',
                                    value : itemData.defaultValue
                                });
                                break;

                            default:
                                Ext.apply(cmp, {
                                    xtype : 'textfield',
                                    emptyText : i18n.gettext('Field type is undefined!')
                                });
                        }
                    } else {
                        var itemConfig = dataType.split(';');

                        if (itemConfig.length < 2) {
                            Ext.apply(cmp, {
                                xtype : 'textfield',
                                emptyText : i18n.gettext('Field config is inconsistent!')
                            })
                        } else {
                            var remoteOrderBy = itemData.orderBy && itemData.orderBy.split(':'),
                                parameter = Ext.create('criterion.model.reports.options.Parameter', {
                                    name : itemData.name,
                                    label : itemData.name.replace(/_/g, ' ').replace(/\w\S*/g, function(txt) {
                                        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
                                    }),
                                    mandatory : true,
                                    value : itemData.defaultValue,
                                    valueType : itemConfig[0],
                                    isTransferParameter : true,
                                    parameterConfig : itemConfig[1],
                                    remoteOrderByProp : remoteOrderBy && remoteOrderBy.length && remoteOrderBy[0],
                                    remoteOrderByDir : remoteOrderBy && remoteOrderBy.length > 1 && remoteOrderBy[1]
                                });

                            Ext.apply(cmp, {
                                xtype : 'criterion_report_parameter',
                                layout : 'fit',
                                fieldLabel : parameter.get('label'),
                                flex : 1,
                                parameterRecord : parameter,
                                parentView : view,
                                excludeForm : true
                            })
                        }
                    }
                } else {
                    Ext.apply(cmp, {
                        xtype : 'hiddenfield',
                        value : itemData.defaultValue
                    })
                }
                if (cmp.xtype !== 'hiddenfield') {
                    if ((idx - hiddenItems.length) % 2) {
                        pane2.add(cmp)
                    } else {
                        pane1.add(cmp)
                    }
                } else {
                    hiddenItems.push(cmp);
                }
            });

            pane1.add(hiddenItems);
        },

        setOptionValues : function(optionValues) {
            var view = this.getView();

            if (Ext.isArray(optionValues)) {
                Ext.Array.each(optionValues, function(optionValue) {
                    var item = view.down('[name="' + optionValue['name'] + '"]'),
                        paramRec;

                    if (item && item.xtype === 'criterion_report_parameter') {
                        paramRec = item.getParameterRecord();
                        paramRec.set('value', optionValue['value']);

                        item.updateParameterRecord(paramRec);
                    } else if (item && item.setValue) {
                        item.setValue(optionValue['value']);
                    }
                });
            }
        }
    }
});
