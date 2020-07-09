Ext.define('criterion.controller.settings.system.SandboxSettings', function() {

    const SANDBOX_SYNC_STATUS = criterion.Consts.SANDBOX_SYNC_STATUS;

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_settings_sandbox',

        mixins : [
            'criterion.controller.mixin.ControlDeferredProcess'
        ],

        listen : {
            global : {
                beforeHideForm : 'onBeforeLeavePage'
            }
        },

        init() {
            this.onBeforeLeavePage = Ext.Function.createBuffered(this.onBeforeLeavePage, 100, this);
            this.getStatus = Ext.Function.createDelayed(this.getStatus, 500, this);
            this.callParent(arguments);
        },

        onBeforeLeavePage() {
            this.stopCheckProcess(true);
        },

        onSync() {
            let vm = this.getViewModel(),
                canSync = vm.get('canSync'),
                syncStatus = vm.get('syncStatus');

            if (canSync) {
                vm.set('syncButtonDisabled', true);

                this.startSync();
            } else {
                if (syncStatus === SANDBOX_SYNC_STATUS.SYNCHRONIZED.value) {
                    criterion.Msg.error(i18n.gettext('You can only sync one time in 24 hours. Please try later.'));
                }
            }
        },

        getStatus() {
            let vm = this.getViewModel();

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.SANDBOX_STATUS,
                method : 'GET'
            }).then({
                scope : this,
                success : this.applyStatusState,
                failure : () => {
                    vm.set({
                        canSync : false,
                        syncButtonDisabled : true,
                        lastSyncedOn : i18n.gettext('Unknown'),
                        syncStatus : SANDBOX_SYNC_STATUS.UNKNOWN.value,
                        syncStatusText : SANDBOX_SYNC_STATUS.UNKNOWN.text
                    });
                }
            });
        },

        applyStatusState(response) {
            let me = this,
                vm = this.getViewModel(),
                progressBar = this.lookup('progressbar'),
                syncStatus = response.status,
                syncStatusText,
                canSync = response.canSync,
                syncButtonDisabled,
                lastSyncedOn,
                processId = response.processId;

            switch (syncStatus) {
                case SANDBOX_SYNC_STATUS.NOT_SYNCHRONIZED.value :
                    syncStatusText = SANDBOX_SYNC_STATUS.NOT_SYNCHRONIZED.text;
                    syncButtonDisabled = !canSync;
                    break;

                case SANDBOX_SYNC_STATUS.IN_PROGRESS.value :
                    syncStatusText = SANDBOX_SYNC_STATUS.IN_PROGRESS.text;
                    syncButtonDisabled = true;

                    progressBar.updateProgress(response.progress || 0);

                    processId && me.controlDeferredProcess(
                        i18n.gettext('Sync In Progress'),
                        i18n.gettext('Sync In Progress'),
                        processId
                    );
                    break;

                case SANDBOX_SYNC_STATUS.SYNCHRONIZED.value :
                    syncStatusText = SANDBOX_SYNC_STATUS.SYNCHRONIZED.text;
                    syncButtonDisabled = false;
                    break;

                case SANDBOX_SYNC_STATUS.FAILED.value :
                    syncStatusText = SANDBOX_SYNC_STATUS.FAILED.text;
                    syncButtonDisabled = !canSync;
                    break;

                default:
                    syncStatusText = SANDBOX_SYNC_STATUS.UNKNOWN.text;
                    syncButtonDisabled = true;
            }

            lastSyncedOn = Ext.isEmpty(response.syncDateTime) ? i18n.gettext('Never') : Ext.Date.format(Ext.Date.parse(response.syncDateTime, criterion.consts.Api.DATE_TIME_FORMAT), criterion.consts.Api.DATE_AND_TIME_FORMAT);

            vm.set({
                canSync : canSync,
                syncButtonDisabled : syncButtonDisabled,
                lastSyncedOn : lastSyncedOn,
                syncDateTime : response.syncDateTime,
                syncStatusText : syncStatusText,
                syncStatus : syncStatus
            });
        },

        createProgressIndicator(progressTitle, progressText) {
            let progressBar = this.lookup('progressbar');

            return {
                progressBar : progressBar,
                close : function() {
                    progressBar.updateProgress(1);
                },
                updateProgress : function(value) {
                    progressBar.updateProgress(value)
                }
            }
        },

        checkProcessInterval : criterion.Consts.CONTROL_DEFERRED_PROCESS_CHECK_INTERVALS.SANDBOX_SYNC,

        processingCheckResult(res) {
            if (res.errors && res.errors.length) {
                criterion.Msg.error({
                    title : i18n.gettext('There were errors during the synchronization process.'),
                    message : Ext.Array.map(res.errors, error => criterion.consts.Error.getErrorInfo(error).description).join('<br>')
                });
            }

            this.getStatus();
        },

        startSync() {
            let me = this,
                vm = this.getViewModel();

            vm.set({
                syncButtonDisabled : true,
                syncStatusText : SANDBOX_SYNC_STATUS.IN_PROGRESS.text,
                syncStatus : SANDBOX_SYNC_STATUS.IN_PROGRESS.value
            });

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.SANDBOX_SYNC,
                method : 'PUT'
            }).then({
                scope : this,
                success : function(res) {
                    criterion.Utils.toast(i18n.gettext('Synchronization started.'));

                    if (me.isDelayedResponse(res)) {
                        me.applyStatusState({
                            status : SANDBOX_SYNC_STATUS.IN_PROGRESS.value,
                            canSync : false,
                            processId : res.processId,
                            syncDateTime : vm.get('syncDateTime')
                        });
                    } else {
                        me.processingCheckResult(res);
                    }
                }
            });
        }
    };
});
