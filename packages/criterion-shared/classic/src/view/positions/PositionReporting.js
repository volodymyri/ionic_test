Ext.define('criterion.view.positions.PositionReporting', function() {

    function getIdField(recordName, idx) {
        return Ext.String.format('{0}{1}wf{2}EmployeeId', recordName, recordName ? '.' : '', idx + 1)
    }

    function getDisplayField(recordName, idx) {
        return Ext.String.format('{0}{1}wf{2}EmployeeName', recordName, recordName ? '.' : '', idx + 1)
    }

    return {

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.view.employee.EmployeePicker'
        ],

        alias : 'widget.criterion_positions_position_reporting',

        viewModel : {
            data : {
                displayOnly : false
            }
        },

        config : {
            employerId : null,
            recordName : null,
            displayOnly : false,
            /**
             * When set to true, component will init responsive column plugin.
             * Only used with 2-col layout.
             */
            responsive : true,
            oneColumn : false,

            containerPadding : '0 10'
        },

        layout : 'hbox',

        items : [
            // dynamic
        ],

        title : i18n.gettext('Position Reporting'),

        setDisplayOnly : function(value) {
            this.getViewModel().set('displayOnly', value);

            this.callParent(arguments);
        },

        setEmployerId : function(employerId) {
            if (employerId) {
                this.init();
            }

            this.callParent(arguments);
        },

        init : function() {
            return Ext.promise.Promise.all([
                criterion.CodeDataManager.load([criterion.consts.Dict.WF_STRUCTURE])
            ])
                .then({
                    scope : this,
                    success : this.createItems
                });
        },

        initComponent : function() {
            var me = this;
            if (me.getOneColumn()) {
                me.layout = 'fit';
            }
            me.callParent();
        },

        createWfStructureComponent : function(codeDetail, idx) {
            var displayField = getDisplayField(this.getRecordName(), idx),
                hasRecord = !!this.getRecordName();

            return {
                xtype : 'container',
                layout : 'hbox',
                margin : '0 0 18 0',
                padding : this.getOneColumn() ? null : this.getContainerPadding(),
                width : '100%',
                items : [
                    {
                        xtype : 'textfield',
                        flex : 1,
                        fieldLabel : codeDetail.get('description'),
                        disabled : !codeDetail.get('isActive'),
                        readOnly : true,
                        bind : hasRecord ? {
                            value : Ext.String.format('{{0}}', displayField)
                        } : {},
                        labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                        name : displayField
                    },
                    {
                        xtype : 'container',
                        layout : 'hbox',
                        bind : {
                            hidden : '{displayOnly}'
                        },
                        hidden : true,
                        items : [
                            {
                                xtype : 'button',
                                scale : 'small',
                                margin : '0 0 0 3',
                                cls : 'criterion-btn-light',
                                glyph : criterion.consts.Glyph['ios7-close-empty'],
                                listeners : {
                                    scope : this,
                                    click : this.onEmployeeClear
                                },
                                bind : hasRecord ? {
                                    hidden : Ext.String.format('{!{0}}', displayField),
                                    disabled : '{isDisabled}'
                                } : {},
                                hidden : true,
                                wfStructureIdx : idx
                            },
                            {
                                xtype : 'button',
                                scale : 'small',
                                margin : '0 0 0 3',
                                cls : 'criterion-btn-primary',
                                glyph : criterion.consts.Glyph['ios7-search'],
                                listeners : {
                                    scope : this,
                                    click : this.onEmployeeSearch
                                },
                                disabled : !codeDetail.get('isActive'),
                                wfStructureIdx : idx
                            }
                        ]
                    }
                ]
            }
        },

        /**
         * Set reporting data from object. Can be used when no model available.
         *
         * @param data
         */
        setReportingData : function(data) {
            Ext.Object.each(data, function(field, value) {
                var cmp = this.down(Ext.String.format('[name={0}]', field));
                cmp && cmp.setValue(value);
            }, this);
        },

        onEmployeeSearch : function(cmp) {
            var recordName = this.getRecordName(),
                picker = Ext.create('criterion.view.employee.EmployeePicker', {
                isActive : true,
                employerId : this.getEmployerId()
            });

            picker.show();
            picker.on('select', function(employeeRecord) {
                this.getViewModel().set(getIdField(recordName, cmp.wfStructureIdx), employeeRecord.get('employeeId'));
                this.getViewModel().set(getDisplayField(recordName, cmp.wfStructureIdx), employeeRecord.get('fullName'));
            }, this)
        },

        onEmployeeClear : function(cmp) {
            var vm = this.getViewModel();

            vm.set(getIdField(this.getRecordName(), cmp.wfStructureIdx), null);
            vm.set(getDisplayField(this.getRecordName(), cmp.wfStructureIdx), '');
        },

        createItems : function() {
            var view = this,
                leftCol = [],
                rightCol = [],
                isOneCol = this.getOneColumn();

            view.removeAll();

            criterion.CodeDataManager.getStore(criterion.consts.Dict.WF_STRUCTURE).each(function(codeDetail, idx) {
                var cmp = view.createWfStructureComponent(codeDetail, idx);

                if (cmp) {
                    if (isOneCol) {
                        leftCol.push(cmp);
                    } else {
                        idx % 2 === 0 ? leftCol.push(cmp) : rightCol.push(cmp);
                    }

                }
            });

            if (isOneCol) {
                view.add({ items : leftCol });
            } else {
                view.add([
                        { items : leftCol },
                        { items : rightCol }
                    ]
                );

                this.getResponsive() && view.getPlugins('criterion_responsive_column')[0].init(view);
            }
        }

    };
});
