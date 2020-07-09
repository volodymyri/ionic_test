Ext.define('criterion.view.employee.SubmitConfirm', function() {

    return {

        alias : 'widget.ess_modern_employee_submit_confirm',

        extend : 'Ext.MessageBox',

        requires : [
            'criterion.ux.SignaturePad'
        ],

        applyPrompt : function(prompt) {
            if (prompt) {
                var config = {
                    label : false,
                    height : 250
                };

                if (Ext.isObject(prompt)) {
                    Ext.apply(config, prompt);
                }

                return Ext.factory(config, 'criterion.ux.SignaturePad', this.getPrompt());
            }

            return prompt;
        }

    }
});
