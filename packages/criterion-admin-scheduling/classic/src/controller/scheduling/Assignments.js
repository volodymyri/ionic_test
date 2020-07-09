Ext.define('criterion.controller.scheduling.Assignments', function() {

    return {

        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_scheduling_assignments',

        requires : [
            'criterion.view.scheduling.AssignmentForm',
            'criterion.store.employer.shift.occurrence.StartData',
            'criterion.model.employer.ShiftOccurrence'
        ],

        mixins : [
            'criterion.controller.mixin.ControlMaskZIndex'
        ],

        handleSearchComboChange() {
            this.loadData();
        },

        handleSearchButtonClick() {
            this.loadData();
        },

        onKeyPress : function(cmp, e) {
            if (e.keyCode === e.RETURN) {
                this.handleSearchButtonClick();
            }
        },

        load() {
            this.loadData();
        },

        loadData() {
            let vm = this.getViewModel(),
                dfd = Ext.create('Ext.Deferred'),
                shiftOccurrences = vm.get('shiftOccurrences'),
                searchForm = this.lookup('searchForm'),
                criteria = {};

            if (!this.checkViewIsActive()) {
                dfd.resolve();

                return dfd.promise;
            }

            if (searchForm) {
                Ext.Object.each(searchForm.getValues(), function(key, value) {
                    Ext.isString(value) && (value = value.trim());

                    if (value) {
                        criteria[key] = value;
                    }
                });
            }

            return shiftOccurrences.loadWithPromise({
                params : criteria
            });
        },

        handleAddAssignmentClick() {
            let me = this,
                vm = this.getViewModel(),
                employerId = vm.get('employerId') || vm.get('employerCombo.selection.id'),
                addAssignmentForm = Ext.create('criterion.view.scheduling.AssignmentForm', {
                    viewModel : {
                        data : {
                            record : Ext.create('criterion.model.employer.ShiftOccurrence', {
                                employerId : employerId
                            })
                        }
                    }
                });

            addAssignmentForm.on({
                afterLoad : () => {
                    me.setCorrectMaskZIndex(true);
                },
                added : recordId => {
                    addAssignmentForm.destroy();

                    me.loadData().then(() => {
                        me.redirectTo(criterion.consts.Route.SCHEDULING.ASSIGNMENT + '/' + recordId, null);
                    });
                },
                destroy : () => {
                    me.setCorrectMaskZIndex(false);
                }
            });

            addAssignmentForm.show();
        }
    };
});
