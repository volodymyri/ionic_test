Ext.define('criterion.view.settings.recruiting.PublishingSite', function() {

    return {

        alias : 'widget.criterion_settings_recruiting_publishing_site',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.recruiting.PublishingSite',
            'criterion.model.PublishSite',
            'criterion.model.PublishSiteSetting',
            'Ext.ux.colorpick.Field'
        ],

        title : i18n.gettext('Publishing Site'),

        controller : {
            type : 'criterion_settings_recruiting_publishing_site',
            externalUpdate : true
        },

        listeners : {
            save : 'onSave',
            cancel : 'onCancel'
        },

        viewModel : {
            data : {
                hideCancel : false
            },
            stores : {
                jobListingFormats : {
                    data : [
                        {
                            text : i18n.gettext('By Department'),
                            value : criterion.Consts.JOB_LISTING_FORMATS.BY_DEPARTMENT
                        },
                        {
                            text : i18n.gettext('By Work Location'),
                            value : criterion.Consts.JOB_LISTING_FORMATS.BY_WORK_LOCATION
                        },
                        {
                            text : i18n.gettext('By Department > Work Location'),
                            value : criterion.Consts.JOB_LISTING_FORMATS.BY_DEPARTMENT_WORK_LOCATION
                        },
                        {
                            text : i18n.gettext('By Work Location > Department'),
                            value : criterion.Consts.JOB_LISTING_FORMATS.BY_WORK_LOCATION_DEPARTMENT
                        },
                        {
                            text : i18n.gettext('Grid'),
                            value : criterion.Consts.JOB_LISTING_FORMATS.GRID
                        }
                    ],
                    proxy : 'memory'
                }
            },
            formulas : {
                frameCode : {
                    bind : {
                        bindTo : '{record}',
                        deep : true
                    },
                    get : function(record) {
                        if (record && !record.get('phantom')) {
                            var publishSiteSetting = Ext.isFunction(record['getPublishSiteSetting']) && record.getPublishSiteSetting();

                            return publishSiteSetting && Ext.util.Format.format(
                                '<iframe id="jobsIframe" style="width: {0};" scrolling="no" frameborder="0" src="{3}/jobs/{1}/{2}"></iframe>' +
                                '<script type="text/javascript" src="{3}/assets/jobs/production/jobsiframe.js"></script>',
                                publishSiteSetting.get('width') ? publishSiteSetting.get('width') + 'px' : '100%',
                                criterion.Api.getTenantId(),
                                record.get('id'),
                                record.get('jobPortalUrl')
                            );
                        }

                        return '';
                    }
                }
            }
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        bodyPadding : '25 10',

        items : [
            {
                xtype : 'container',

                plugins : [
                    'criterion_responsive_column'
                ],

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                layout : 'hbox',

                items : [
                    {
                        xtype : 'container',
                        reference : 'attributesHolder',
                        items : [
                            {
                                xtype : 'displayfield',
                                fieldLabel : i18n.gettext('Publishing Site'),
                                bind : {
                                    value : '{record.name}'
                                }
                            }
                        ]
                    },

                    {
                        xtype : 'container',
                        items : [
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Enabled'),
                                bind : {
                                    value : '{record.isEnabled}'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Default'),
                                bind : {
                                    value : '{record.isDefault}'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Portal'),
                                bind : {
                                    value : '{record.isPortal}'
                                }
                            }
                        ]
                    }
                ]
            },

            {
                xtype : 'panel',
                title : i18n.gettext('Job Listing'),

                plugins : [
                    'criterion_responsive_column'
                ],

                bind : {
                    hidden : '{!record.isPortal}',
                    disabled : '{!record.isPortal}'
                },

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                layout : 'hbox',

                items : [
                    {
                        xtype : 'container',
                        items : [
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Job Listing Format'),
                                reference : 'jobListingFormat',
                                bind : {
                                    store : '{jobListingFormats}',
                                    value : '{record.publishSiteSetting.listGrouping}'
                                },
                                displayField : 'text',
                                valueField : 'value',
                                queryMode : 'local'
                            }
                        ]
                    },
                    {
                        xtype : 'container',
                        items : [
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Show City and State'),
                                name : 'isListShowCityState',
                                bind : {
                                    value : '{record.publishSiteSetting.isListShowCityState}'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Show Position Type'),
                                name : 'isListShowPositionType',
                                bind : {
                                    value : '{record.publishSiteSetting.isListShowPositionType}'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Show Department'),
                                name : 'isListShowDepartment',
                                bind : {
                                    value : '{record.publishSiteSetting.isListShowDepartment}'
                                },
                                listeners : {
                                    change : 'onIsListShowDepartmentChange'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Show Requisition Code'),
                                name : 'isListShowRequisitionCode',
                                bind : {
                                    value : '{record.publishSiteSetting.isListShowRequisitionCode}'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Show Posting Date'),
                                name : 'isListShowPositingDate',
                                bind : {
                                    value : '{record.publishSiteSetting.isListShowPostingDate}'
                                }
                            }
                        ]
                    }
                ]
            },

            {
                xtype : 'panel',
                title : i18n.gettext('Job View'),

                plugins : [
                    'criterion_responsive_column'
                ],

                bind : {
                    hidden : '{!record.isPortal}',
                    disabled : '{!record.isPortal}'
                },

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                layout : 'hbox',

                items : [
                    {
                        xtype : 'container'
                    },
                    {
                        xtype : 'container',
                        items : [
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Show City and State'),
                                name : 'isListShowCityState',
                                bind : {
                                    value : '{record.publishSiteSetting.isViewShowCityState}'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Show Position Type'),
                                name : 'isListShowPositionType',
                                bind : {
                                    value : '{record.publishSiteSetting.isViewShowPositionType}'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Show Department'),
                                name : 'isViewShowDepartment',
                                bind : {
                                    value : '{record.publishSiteSetting.isViewShowDepartment}'
                                }
                            }
                        ]
                    }
                ]
            },

            {
                xtype : 'panel',
                title : i18n.gettext('Portal Options'),
                bind : {
                    hidden : '{!record.isPortal}',
                    disabled : '{!record.isPortal}'
                },
                plugins : [
                    'criterion_responsive_column'
                ],

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                layout : 'hbox',

                items : [
                    {
                        xtype : 'container',
                        items : [
                            {
                                xtype : 'colorfield',
                                fieldLabel : i18n.gettext('Background Color'),
                                name : 'bgColor',
                                bind : {
                                    value : '{record.publishSiteSetting.bgColor}'
                                }
                            },
                            {
                                xtype : 'colorfield',
                                fieldLabel : i18n.gettext('Text Color'),
                                name : 'textColor',
                                bind : {
                                    value : '{record.publishSiteSetting.textColor}'
                                }
                            },
                            {
                                xtype : 'numberfield',
                                decimalPrecision : 0,
                                minValue : 0,
                                maxValue : 700,
                                maxLength : 3,
                                enforceMaxLength : true,
                                fieldLabel : i18n.gettext('Widget Width'),
                                bind : {
                                    value : '{record.publishSiteSetting.width}'
                                }
                            }
                        ]
                    },
                    {
                        xtype : 'container',
                        items : [
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Show Apply With Indeed'),
                                name : 'isApplyWithIndeed',
                                bind : {
                                    value : '{record.publishSiteSetting.isApplyWithIndeed}'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Ask questions'),
                                name : 'isAskQuestions',
                                bind : {
                                    value : '{record.publishSiteSetting.isAskQuestions}'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Is Internal'),
                                name : 'isInternal',
                                bind : {
                                    value : '{record.publishSiteSetting.isInternal}'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'panel',
                title : i18n.gettext('Frame Code'),

                plugins : [
                    'criterion_responsive_column'
                ],

                hidden : true,
                bind : {
                    hidden : '{!record.isPortal}'
                },

                layout : 'hbox',
                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                items : [
                    {
                        xtype : 'container',
                        layout : 'vbox',
                        flex : 2,
                        items : [
                            {
                                xtype : 'textarea',
                                reference : 'frameCode',
                                width : '100%',
                                bind : {
                                    value : '{frameCode}'
                                },

                                readOnly : true
                            },
                            {
                                xtype : 'button',
                                text : i18n.gettext('Copy to Clipboard'),
                                handler : 'onCopy'
                            }
                        ]
                    }
                ]
            }
        ],

        loadRecord : function(record) {
            var view = this,
                holder = this.lookup('attributesHolder');

            if (!record.getPublishSiteSetting()) {
                var publishSiteSetting = Ext.create('criterion.model.PublishSiteSetting');
                record.setPublishSiteSetting(publishSiteSetting);
            }

            Ext.Array.each(holder.query('[isAttributeField]'), function(cmp) {
                view.remove(cmp, false);
                Ext.Function.defer(function() {
                    cmp.destroy();
                }, 500);
            });

            this.callParent(arguments);

            Ext.Function.defer(function() {
                Ext.each([1, 2], function(index) {
                    holder.add({
                        xtype : 'textfield',
                        isAttributeField : true,
                        fieldLabel : record.get('attribute' + index + 'Label'),
                        name : 'attribute' + index,
                        value : record.get('attribute' + index)
                    });
                });
            }, 1);
        }
    }

});

