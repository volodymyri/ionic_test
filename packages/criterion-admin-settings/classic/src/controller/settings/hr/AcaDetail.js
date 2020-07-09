Ext.define('criterion.controller.settings.hr.AcaDetail', function() {

    return {
        alias : 'controller.criterion_settings_aca_detail',

        extend : 'criterion.controller.FormView',

        externalUpdate : false,

        loadRecord : function(record) {
            var me = this,
                vm = this.getViewModel(),
                transmissions = vm.get('transmissions'),
                months = vm.get('months'),
                members = vm.get('members');

            months.getProxy().setExtraParam('acaId', record.getId());
            members.getProxy().setExtraParam('acaId', record.getId());
            transmissions.getProxy().setExtraParam('acaId', record.getId());

            Ext.promise.Promise.all([
                months.loadWithPromise(),
                members.loadWithPromise(),
                transmissions.loadWithPromise()
            ]).then(function() {
                me.addAllMonthsRecord();
                vm.set('hasActiveTransmission', !!transmissions.count());
            })
        },

        addAllMonthsRecord : function() {
            var vm = this.getViewModel(),
                aca = vm.get('record');

            vm.get('months').insert(0, {
                isAllMonth : true,
                mecIndicator : aca.get('mecIndicator'),
                ftEmployeeCount : aca.get('ftEmployeeCount'),
                totalEmployeeCount : aca.get('totalEmployeeCount'),
                groupIndicator : aca.get('groupIndicator'),
                reliefIndicator : aca.get('reliefIndicator')
            })
        },

        processAlMonths : function(clear) {
            var vm = this.getViewModel(),
                aca = vm.get('record'),
                months = this.getStore('months'),
                allMonths = months.findRecord('isAllMonth', true);

            aca.set({
                mecIndicator : allMonths.get('mecIndicator'),
                ftEmployeeCount : allMonths.get('ftEmployeeCount'),
                totalEmployeeCount : allMonths.get('totalEmployeeCount'),
                groupIndicator : allMonths.get('groupIndicator'),
                reliefIndicator : allMonths.get('reliefIndicator')
            });

            clear && months.remove(allMonths);
        },

        handleRecordUpdate : function() {
            this.getStore('members').each(function(member) {
                member.set('acaId', this.getViewModel().get('record').getId());
            }, this);

            this.processAlMonths(true);

            Ext.promise.Promise.all([
                this.getStore('months').syncWithPromise(),
                this.getStore('members').syncWithPromise()
            ]);

            this.callParent(arguments);
        },

        onCreateForms : function() {
            var vm = this.getViewModel();

            window.open(criterion.Api.getSecureResourceUrl(criterion.consts.Api.API.EMPLOYER_ACA_GENERATE_PDF + '?id=' + vm.get('record').getId()));
        },

        onTransmit : function() {
            var view = this.getView(),
                me = this;

            if (view.hasDirty()) {
                criterion.Msg.confirm(i18n.gettext('Unsaved changes'), i18n.gettext('You have some unsaved changes, continue transmission without saving?'),
                    function(btn) {
                        if (btn === 'yes') {
                            me.transmit();
                        }
                    });
            } else {
                this.transmit();
            }
        },

        transmit : function() {
            var view = this.getView(),
                vm = this.getViewModel();

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.EMPLOYER_ACA_TRANSMISSION_SEND,
                method : 'POST',
                urlParams : {
                    acaId : vm.get('record').getId()
                }
            }).then(function() {
                this.loadRecord(vm.get('record'));
            }).always(function() {
                view.setLoading(false);
            })
        },

        onStatusUpdate : function(cmp) {
            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.EMPLOYER_ACA_TRANSMISSION_SEND_ACK,
                method : 'POST',
                urlParams : {
                    id : cmp.getWidgetRecord().getId()
                },
                scope : this
            }).then(function() {
                this.getStore('transmissions').reload();
            })
        }

    };

});
