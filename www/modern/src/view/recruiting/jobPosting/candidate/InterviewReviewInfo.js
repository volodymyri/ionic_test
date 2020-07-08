Ext.define('ess.view.recruiting.jobPosting.candidate.InterviewReviewInfo', function() {

    return {

        alias : 'widget.ess_modern_recruiting_job_postings_candidate_interview_review_info',

        extend : 'Ext.MessageBox',

        cls : 'criterion-interview-review-info',

        applyPrompt : function(prompt) {
            if (prompt) {

                let config = {

                    label : false,

                    height : 300,
                    width : 300,

                    viewModel : {
                        data : {
                            competency : this.competency,
                            scales : this.scales
                        }
                    },

                    items : [
                        {
                            xtype : 'component',
                            cls : 'description',
                            bind : {
                                html : '{competency.description}'
                            }
                        },

                        {
                            xtype : 'dataview',
                            cls : 'scales',
                            bind : {
                                store : '{scales}'
                            },
                            componentCls : 'criterion-item-container',
                            itemSelector : 'div.item_',
                            emptyText : '',
                            itemTpl : new Ext.XTemplate(
                                    '<tpl for=".">',
                                        '<div class="scale-item">',
                                            '<span class="name">{name}</span>',
                                            '<span class="rating"><span class="label">', i18n.gettext('Value'), '</span>: {rating}</span>',
                                            '<br/>',
                                            '<span class="description">{description}</span>',
                                        '</div>',
                                    '</tpl>'
                                )
                        }
                    ],

                    setValue : function(value) {},
                    getValue : function() {
                        return true;
                    }
                };

                if (Ext.isObject(prompt)) {
                    Ext.apply(config, prompt);
                }

                return Ext.create('Ext.form.Panel', config);
            }

            return prompt;
        }
    }
});
