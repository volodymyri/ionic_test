Ext.define('criterion.view.scheduling.ShiftGroup', function() {

    const DAYS_OF_WEEK_ARRAY = criterion.Consts.DAYS_OF_WEEK_ARRAY,
        getWeekTemplate = dataIndex => new Ext.XTemplate([
            '<tpl for=".">',
            '<tpl if="' + dataIndex + '">',
            '<div data-qtip="' + i18n.gettext('Edit') + '"><span class="criterion-darken-gray">&#8986;</span>&nbsp;{' + dataIndex + '}</div>',
            '<tpl else><span class="criterion-darken-gray showOnGridItemHover" data-qtip="' + i18n.gettext('Add Schedule') + '">+</span>',
            '</tpl>',
            '</tpl>'
        ]);

    return {
        alias : 'widget.criterion_scheduling_shift_group',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.scheduling.ShiftGroup',
            'criterion.store.Skills',
            'criterion.store.employer.Certifications',
            'criterion.view.scheduling.Shift',
            'criterion.controller.scheduling.shiftGroup.Shifts'
        ],

        controller : {
            type : 'criterion_scheduling_shift_group',
            externalUpdate : false
        },

        plugins : [
            {
                ptype : 'criterion_sidebar',
                modal : false
            }
        ],

        bodyPadding : 0,

        header : {
            title : i18n.gettext('Shift Group'),

            defaults : {
                margin : '0 10 0 0'
            },

            items : [
                {
                    xtype : 'button',
                    cls : 'criterion-btn-feature',
                    glyph : criterion.consts.Glyph['settings'],
                    handler : 'handleGroupSettings'
                }
            ]
        },

        defaults : {
            labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH
        },

        viewModel : {
            stores : {
                skills : {
                    type : 'criterion_skills'
                },
                certifications : {
                    type : 'criterion_employer_certifications'
                }
            },
            formulas : {
                columns : data => {
                    let scheduleWeek = [];

                    Ext.Array.each(criterion.Utils.range(1, 6), i => {
                        let dataIndex = `day_${i}`;

                        scheduleWeek.push({
                            xtype : 'templatecolumn',
                            dataIndex : dataIndex,
                            text : DAYS_OF_WEEK_ARRAY[i],
                            flex : 1,
                            minWidth : 170,
                            sortable : false,
                            draggable : false,
                            menuDisabled : true,
                            tpl : getWeekTemplate(dataIndex)
                        })
                    });

                    let dataIndex = 'day_0';

                    scheduleWeek.push({
                        xtype : 'templatecolumn',
                        dataIndex : dataIndex,
                        text : DAYS_OF_WEEK_ARRAY[0],
                        flex : 1,
                        minWidth : 170,
                        sortable : false,
                        draggable : false,
                        menuDisabled : true,
                        tpl : getWeekTemplate(dataIndex)
                    });

                    return [
                        {
                            dataIndex : 'name',
                            text : i18n.gettext('Name'),
                            flex : 1,
                            minWidth : 170
                        },
                        {
                            dataIndex : 'sequence',
                            text : i18n.gettext('Sequence'),
                            width : 150
                        },
                        ...scheduleWeek
                    ];
                },
                hideSave : function(data) {
                    return !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.SCHEDULING_SHIFT, criterion.SecurityManager.UPDATE, false, true));
                },
                hideDelete : function(data) {
                    return data('hideDeleteInt') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.SCHEDULING_SHIFT, criterion.SecurityManager.DELETE, false, true));
                }
            }
        },

        items : [
            {
                layout : 'hbox',

                plugins : [
                    'criterion_responsive_column'
                ],

                bodyPadding : '0 10',

                defaults : criterion.Consts.UI_CONFIG.TWO_COL_FORM_WIDER,

                items : [
                    {
                        items : [
                            {
                                xtype : 'criterion_employer_combo',
                                fieldLabel : i18n.gettext('Employer'),
                                name : 'employerId',
                                disabled : true,
                                hideTrigger : true,
                                bind : '{record.employerId}'
                            },
                            {
                                xtype : 'textfield',
                                fieldLabel : i18n.gettext('Group Name'),
                                name : 'name',
                                bind : '{record.name}'
                            },
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Start Day'),
                                name : 'startingDay',
                                valueField : 'value',
                                sortByDisplayField : false,
                                allowBlank : false,
                                editable : false,
                                store : Ext.create('Ext.data.Store', {
                                    fields : ['value', 'text'],
                                    data : Ext.Array.map(DAYS_OF_WEEK_ARRAY, (item, index) => ({
                                        value : index + 1,
                                        text : item
                                    }))
                                }),
                                bind : {
                                    value : '{record.startingDay}'
                                }
                            },
                            {
                                xtype : 'numberfield',
                                fieldLabel : i18n.gettext('Required Number'),
                                name : 'requiredNumber',
                                bind : '{record.requiredNumber}'
                            }
                        ]
                    },
                    {
                        items : [
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Work Location'),
                                displayField : 'description',
                                valueField : 'id',
                                queryMode : 'local',
                                name : 'employerWorkLocationId',
                                allowBlank : true,
                                reference : 'workLocation',
                                bind : {
                                    store : '{employerWorkLocations}',
                                    value : '{record.employerWorkLocationId}'
                                },
                                listeners : {
                                    change : 'handleChangeLocation'
                                }
                            },
                            {
                                xtype : 'combobox',
                                fieldLabel : i18n.gettext('Work Area'),
                                displayField : 'name',
                                valueField : 'id',
                                queryMode : 'local',
                                name : 'workLocationAreaId',
                                allowBlank : true,
                                forceSelection : true,
                                bind : {
                                    store : '{workLocationAreas}',
                                    value : '{record.workLocationAreaId}',
                                    disabled : '{!record.employerWorkLocationId}',
                                    filters : {
                                        property : 'workLocationId',
                                        value : '{workLocation.selection.workLocationId}',
                                        exactMatch : true
                                    }
                                }
                            },
                            {
                                xtype : 'criterion_code_detail_field',
                                fieldLabel : i18n.gettext('Timezone'),
                                codeDataId : criterion.consts.Dict.TIME_ZONE,
                                readOnly : true,
                                bind : {
                                    value : '{timezoneCd}'
                                }
                            },
                            {
                                xtype : 'toggleslidefield',
                                fieldLabel : i18n.gettext('Rotating Shift'),
                                name : 'isRotating',
                                bind : {
                                    value : '{record.isRotating}'
                                }
                            }
                        ]
                    }
                ]
            },
            {
                xtype : 'criterion_gridview',

                margin : '5 0 0 0',
                flex : 2,

                viewConfig : {
                    markDirty : false
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
                            hidden : criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.SCHEDULING_SHIFT, criterion.SecurityManager.CREATE, true)
                        }
                    }
                ],

                bind : {
                    store : '{record.shifts}',
                    columns : '{columns}'
                },

                controller : {
                    type : 'criterion_scheduling_shift_group_shifts',
                    connectParentView : false,
                    loadRecordOnEdit : false,
                    editor : {
                        xtype : 'criterion_scheduling_shift',
                        allowDelete : true
                    }
                },

                columns : []
            }
        ],

        loadRecord : function(record) {
            this.callParent(arguments);

            this.getController() && this.getController().loadRecord(record);
        }
    };

});
