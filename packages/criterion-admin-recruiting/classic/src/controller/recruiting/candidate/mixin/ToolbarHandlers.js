Ext.define('criterion.controller.recruiting.candidate.mixin.ToolbarHandlers', {

    mixinId : 'candinateToolbarHandlers',

    requires : [
        'criterion.view.recruiting.candidate.UploadResumeForm'
    ],

    onEmailSend() {
        window.open('mailto:' + this.getViewModel().get('candidate.email'));
    },

    onAddResume() {
        let vm = this.getViewModel(),
            candidate = vm.get('candidate'),
            options = {
                candidateId : candidate.getId()
            };

        options.callback = function() {
            candidate.load();
        };

        Ext.create('criterion.view.recruiting.candidate.UploadResumeForm', options).show();
    }
});
