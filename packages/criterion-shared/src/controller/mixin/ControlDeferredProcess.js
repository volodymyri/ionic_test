Ext.define('criterion.controller.mixin.ControlDeferredProcess', function() {

    const CHECK_INTERVAL = criterion.Consts.CONTROL_DEFERRED_PROCESS_CHECK_INTERVALS.DEFAULT,
          DELAYED_RESPONSE_STATUS = 202;

    return {

        mixinId : 'criterion_control_deferred_process',

        checkProcessInterval : CHECK_INTERVAL,
        taskRunCount : 0,

        destroy() {
            this.stopCheckProcess();
            this.callParent();
        },

        isDelayedResponse(res) {
            return res && res.responseStatus === DELAYED_RESPONSE_STATUS;
        },

        controlDeferredProcess(progressTitle, progressText, processId) {
            if (!processId) {
                console && console.error(i18n.gettext('processId didn\'t set!'));
                return;
            }

            this._processId = processId;
            this._progress = this.createProgressIndicator(progressTitle, progressText);

            this.checkDeferredProcess();
        },

        createProgressIndicator(progressTitle, progressText) {
            return criterion.Msg.progress(progressTitle, progressText, i18n.gettext('Processing...'))
        },

        checkDeferredProcess() {
            let me = this;

            if (!this._processId) {
                console && console.error(i18n.gettext('processId didn\'t set!'));
                return;
            }

            me._seqTask = Ext.TaskManager.newTask({
                run : me.runCheckProcess,
                interval : me.checkProcessInterval,
                scope : me
            });

            me._seqTask.start();
        },

        runCheckProcess() {
            let me = this;

            criterion.Api.requestWithPromise({
                url : Ext.urlAppend(criterion.consts.Api.API.DELAYED_TASK_CHECK, Ext.Object.toQueryString({
                    processId : this._processId,
                    _rc : ++this.taskRunCount
                })),
                method : 'GET'
            }).then(checkResult => {
                me._processingCheckResult(checkResult);
            }, () => {
                me.stopCheckProcess();
            });

            this._seqTask.stop(true);
        },

        stopCheckProcess(withoutIndicator) {
            this.taskRunCount = 0;
            !withoutIndicator && this._progress && this._progress.progressBar.isVisible() && this._progress.close();
            this._seqTask && this._seqTask.stop(true);
        },

        _processingCheckResult(res) {
            if (res.ready) {
                this.stopCheckProcess();
                Ext.isFunction(this.processingCheckResult) && this.processingCheckResult(res);
            } else {
                res.progress && this._progress && this._progress.updateProgress(res.progress, Ext.util.Format.format('{0}({1})...',
                    i18n.gettext('Processing'),
                    Ext.util.Format.percent(res.progress, '0.##'))
                );
                this._seqTask.start();
            }
        }

    }
});
