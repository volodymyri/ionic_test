Ext.define('criterion.controller.settings.benefits.openEnrollment.Announcements', function() {

        return {
            extend : 'criterion.controller.GridView',

            alias : 'controller.criterion_settings_open_enrollment_announcements',

            handleActivate: Ext.emptyFn, // delegate to parent controller

            getEmptyRecord : function() {
                var vm = this.getViewModel();

                return {
                    openEnrollmentId : vm.get('openEnrollment').getId(),
                    announcementDate : vm.get('openEnrollment').get('startDate')
                }
            },

            load : function(openEnrollment) {
                var view = this.getView(),
                    vm = this.getViewModel(),
                    store =  this.getStore('announcementsStore');

                vm.set('openEnrollment', openEnrollment);

                if (!openEnrollment.phantom) {
                    store.load({
                        params : {
                            openEnrollmentId : openEnrollment.getId()
                        }
                    })
                } else {
                    store.removeAll()
                }
            },

            handleNextClick : function() {
                this.getView().fireEvent('save');
            },

            syncAnnouncements : function() {
                var store = this.getStore('announcementsStore'),
                    vm = this.getViewModel();

                if (store.getModifiedRecords().length || store.getRemovedRecords().length) {
                    store.each(function(record) {
                        record.set('openEnrollmentId', vm.get('openEnrollment').getId());
                    });

                    return store.syncWithPromise();
                }
            },

            handlePrevClick : function() {
                this.getView().fireEvent('prev');
            },

            handleCancelClick : function() {
                this.getView().fireEvent('cancel');
            }
        }

    }
);