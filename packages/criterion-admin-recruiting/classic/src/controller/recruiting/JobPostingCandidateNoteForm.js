Ext.define('criterion.controller.recruiting.JobPostingCandidateNoteForm', function() {

    return {

        alias : 'controller.criterion_recruiting_job_posting_candidate_note_form',

        extend : 'criterion.controller.FormView',

        changeNotesDateDate(field, newValue) {
            let vm = this.getViewModel(),
                time = Ext.Date.format(vm.get('record.notesDateTime'), 'H:i:s'),
                date = Ext.Date.format(newValue, 'Y-m-d');

            vm.set('record.notesDate', Ext.Date.parse(date + ' ' + time, 'Y-m-d H:i:s'))
        },

        changeNotesDateTime(field, newValue) {
            let vm = this.getViewModel(),
                date = Ext.Date.format(vm.get('record.notesDateDate'), 'Y-m-d'),
                time = Ext.Date.format(newValue, 'H:i:s');

            vm.set('record.notesDate', Ext.Date.parse(date + ' ' + time, 'Y-m-d H:i:s'))
        }
    };

});
