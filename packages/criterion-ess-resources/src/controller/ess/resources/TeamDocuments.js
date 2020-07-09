Ext.define('criterion.controller.ess.resources.TeamDocuments', function() {

    return {
        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_selfservice_resources_team_documents',

        requires : [
            'criterion.view.employee.EmployeePicker'
        ],

        mixins : [
            'criterion.controller.mixin.identity.EmployeeGlobal',
            'criterion.controller.mixin.ControlMaskZIndex',
            'criterion.store.employee.subordinate.TeamMembers'
        ],

        onEmployeeChange() {
            let vm = this.getViewModel();

            vm.getStore('employeeDocumentTree').removeAll();

            vm.set({
                currentEmployeeId : null,
                currentEmployeeName : i18n.gettext('- select employee -')
            });

            this.load();
        },

        load(opts) {
            let vm = this.getViewModel(),
                documentLocation = vm.get('documentLocation'),
                documentLocations = vm.getStore('documentLocations'),
                employeeId = vm.get('currentEmployeeId'),
                store = vm.getStore('employeeDocumentTree');

            if (!documentLocation || !employeeId) {
                if (documentLocations.count()) {
                    vm.set('documentLocation', documentLocations.first().getId())
                }
                return;
            }

            if (store && !store.getRoot()) {
                // if no root -> default root is expanded -> forces load ignoring load parameters, so avoiding this
                // root may be deleted by removeAll in employer change etc, so has check every time before load
                store.setRoot({
                    expanded : false
                });
            }

            employeeId && this.callParent([
                {
                    params : Ext.apply({
                        documentLocationCd : documentLocation,
                        employeeId : employeeId,
                        isShare : true
                    }, opts || {})
                }
            ]);
        },

        handleCellClick(grid, td, cellIndex, record, tr, rowIndex, e) {
            let column = e.position && e.position.column,
                dataIndex = column && column.dataIndex,
                isExpanderClick = !!e.getTarget('.' + Ext.baseCSSPrefix + 'grid-row-expander'),
                xtype = column && e.position.column.xtype;

            if (
                !xtype ||
                xtype === 'criterion_actioncolumn' ||
                !dataIndex || isExpanderClick ||
                !record.get('leaf')
            ) {
                return;
            }

            this.onAttachmentView(record);
        },

        onAttachmentView(record) {
            window.open(criterion.Api.getSecureResourceUrl(criterion.consts.Api.API.EMPLOYEE_DOCUMENT_DOWNLOAD + record.getId()));
        },

        handleChangeDocumentLocation() {
            this.load();
        },

        handleEmployeeSearch() {
            let me = this,
                vm = me.getViewModel(),
                picker = Ext.create('criterion.view.employee.EmployeePicker', {
                    isActive : true,
                    employerId : this.getEmployerId(),
                    columns : [
                        {
                            text : i18n.gettext('Last Name'),
                            dataIndex : 'lastName',
                            flex : 1,
                            filter : true
                        },
                        {
                            text : i18n.gettext('First Name'),
                            dataIndex : 'firstName',
                            flex : 1,
                            filter : true
                        },
                        {
                            text : i18n.gettext('Employee Number'),
                            dataIndex : 'employeeNumber',
                            flex : 1
                        },
                        {
                            text : i18n.gettext('Hire Date'),
                            dataIndex : 'hireDate',
                            renderer : Ext.util.Format.dateRenderer(criterion.consts.Api.DATE_FORMAT),
                            flex : 1
                        },
                        {
                            text : i18n.gettext('Title'),
                            dataIndex : 'positionTitle',
                            flex : 1,
                            filter : true
                        }
                    ],
                    storeClass : 'criterion.store.employee.subordinate.TeamMembers'
                });

            picker.on('select', employee => {
                vm.set({
                    currentEmployeeId : employee.get('employeeId'),
                    currentEmployeeName : employee.get('fullName')
                });

                me.load();
            });

            picker.on('destroy', () => {
                me.setCorrectMaskZIndex(false);
            });

            picker.show();
            this.setCorrectMaskZIndex(true);
        }
    };

});
