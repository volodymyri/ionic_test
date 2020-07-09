Ext.define('criterion.view.ess.learning.assign.Courses', function() {

    return {

        alias : 'widget.criterion_selfservice_learning_assign_courses',

        extend : 'criterion.view.RecordPicker',

        requires : [
            'criterion.ux.form.field.EmployerCombo',
            'criterion.store.learning.CourseForEnroll'
        ],

        plugins : null,
        modal : false,
        title : null,
        showHeader : false,
        closable : false,
        draggable : false,
        gridCls : 'criterion-record-picker hideOnly',
        store : Ext.create('criterion.store.learning.CourseForEnroll', {
            pageSize : criterion.Consts.PAGE_SIZE.DEFAULT
        }),
        columns : [
            {
                xtype : 'widgetcolumn',
                text : '',
                width : 20,
                align : 'center',
                sortable : false,
                resizable : false,
                menuDisabled : true,
                widget : {
                    xtype : 'component',
                    cls : 'criterion-info-component',
                    margin : '10 0 0 2',
                    tooltipEnabled : true,
                    hidden : true,
                    bind : {
                        tooltip : '{record.description}',
                        hidden : '{!record.description}'
                    }
                }
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Code'),
                flex : 1,
                dataIndex : 'code'
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Course Name'),
                flex : 2,
                dataIndex : 'name',
                filter : true
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Employer'),
                flex : 2,
                dataIndex : 'employerName'
            },
            {
                xtype : 'criterion_codedatacolumn',
                text : i18n.gettext('Delivery'),
                dataIndex : 'courseTypeCd',
                codeDataId : criterion.consts.Dict.COURSE_DELIVERY,
                flex : 1
            },
            {
                xtype : 'datecolumn',
                text : i18n.gettext('Creation Date'),
                dataIndex : 'creationDate',
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH
            },
            {
                xtype : 'gridcolumn',
                text : i18n.gettext('Open Spots'),
                width : criterion.Consts.UI_DEFAULTS.COL_NARROW_WIDTH,
                dataIndex : 'openSpots',
                encodeHtml : false,
                align : 'center',
                renderer : function(value, cell, record) {
                    if (record.get('courseTypeCode') === criterion.Consts.COURSE_DELIVERY.CLASSROOM) {
                        return '';
                    }

                    if (value === null) {
                        return i18n.gettext('Available');
                    }

                    return value;
                }
            }
        ],
        actionColumns : [
            {
                xtype : 'criterion_actioncolumn',
                width : 300,
                align : 'end',
                items : [
                    {
                        text : i18n.gettext('Assign'),
                        asButton : true,
                        action : 'assignAction',
                        ui : 'frame',
                        style : {
                            'text-transform' : 'uppercase'
                        },
                        getClass : function(v, m, record) {
                            if (
                                record &&
                                record.get('courseDeliveryCode') === criterion.Consts.COURSE_DELIVERY.ONDEMAND &&
                                record.get('openSpots') === 0
                            ) {
                                return 'hidden-el';
                            }

                            return 'always-visible';
                        }
                    },
                    {
                        text : '&#x279d;',
                        action : 'selectClassAction',
                        asButton : true,
                        getClass : function(v, m, record) {
                            if (
                                record &&
                                record.get('courseTypeCode') === criterion.Consts.COURSE_DELIVERY.CLASSROOM
                            ) {
                                return 'always-visible glyph-only';
                            }

                            return 'hidden-el';
                        }
                    }
                ]
            }
        ],

        handleSelectClick : Ext.emptyFn,

        handleSearchClick : function() {
            var mc = this.lookupController();

            if (mc && mc.checkViewIsActive()) {
                var store = this.down('grid').getStore(),
                    extraParams = store.getProxy().getExtraParams(),
                    courseType = this.down('[name=courseType]').getValue(),
                    employerId = this.down('[name=employerId]').getValue();

                if (courseType) {
                    extraParams['courseType'] = courseType;
                } else {
                    delete extraParams['courseType'];
                }

                if (employerId) {
                    extraParams['employerId'] = employerId;
                } else {
                    delete extraParams['employerId'];
                }

                this.callParent();
            }
        },

        getDockedTop : function() {
            var me = this,
                dockedTop = [];

            dockedTop.push({
                xtype : 'container',
                padding : '0 15 10 25',
                dock : 'top',
                layout : 'hbox',
                items : [
                    {
                        xtype : 'combobox',
                        name : 'courseType',
                        fieldLabel : i18n.gettext('Type'),
                        labelWidth : 60,
                        sortByDisplayField : false,
                        editable : false,
                        margin : 0,
                        store : Ext.create('Ext.data.Store', {
                            fields : ['text', 'value'],
                            data : [
                                {
                                    text : i18n.gettext('All'), value : 0
                                },
                                {
                                    text : i18n.gettext('OnDemand'), value : criterion.Consts.COURSE_TYPE.ON_DEMAND
                                },
                                {
                                    text : i18n.gettext('Classroom'), value : criterion.Consts.COURSE_TYPE.CLASSROOM
                                }
                            ]
                        }),
                        value : 0,
                        displayField : 'text',
                        valueField : 'value',
                        queryMode : 'local',
                        forceSelection : true,
                        autoSelect : true,
                        listeners : {
                            change : function() {
                                me.handleSearchClick();
                            }
                        }
                    },
                    {
                        xtype : 'tbspacer'
                    },
                    {
                        xtype : 'criterion_employer_combo',
                        fieldLabel : i18n.gettext('Employer'),
                        labelWidth : 80,
                        name : 'employerId',
                        reference : 'employerCombo',
                        allowBlank : true,
                        listeners : {
                            change : function() {
                                me.handleSearchClick();
                            }
                        }
                    }
                ]
            });

            if (this.getSearchFields().length) {
                dockedTop.push({
                    xtype : 'toolbar',
                    dock : 'top',
                    items : [
                        {
                            xtype : 'combobox',
                            itemId : 'filterName',
                            fieldLabel : i18n.gettext('Search'),
                            labelWidth : 60,
                            store : Ext.create('Ext.data.Store', {
                                fields : ['fieldName', 'displayName'],
                                data : this.getSearchFields()
                            }),
                            displayField : 'displayName',
                            valueField : 'fieldName',
                            editable : false,
                            forceSelection : true,
                            allowBlank : false,
                            value : this.getSearchFields()[0].fieldName
                        },
                        {
                            xtype : 'textfield',
                            itemId : 'query',
                            listeners : {
                                specialkey : function(field, e) {
                                    if (e.getKey() === e.ENTER) {
                                        me.handleSearchClick();
                                    }
                                }
                            },
                            flex : 1
                        },
                        {
                            xtype : 'button',
                            text : i18n.gettext('Search'),
                            cls : 'criterion-btn-feature',
                            handler : function() {
                                me.handleSearchClick();
                            }
                        }
                    ]
                });
            }

            return dockedTop;
        }
    };
});
