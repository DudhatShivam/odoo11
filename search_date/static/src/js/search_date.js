odoo.define("search_date.search_date", function (require) {
    "use strict";

    var time = require('web.time');
    var core = require('web.core');
    var ListController = require('web.ListController');
    var qweb = core.qweb;
    var _t = core._t;

    ListController.include({

        init: function (parent, model, renderer, params) {
            this._super.apply(this, arguments);
            this.fields = renderer.state.fields;
            this._context = renderer.state.context;
            this._domain = renderer.state.domain; //current domain
        },

        get_data: function () {
            var l10n = _t.database.parameters;
            var datepickers = {
                showClose: true,
                locale: moment.locale(),
                // 只显示日期
                format: time.strftime_to_moment_format(l10n.date_format),
            };
            return datepickers;
        },
        search_by_range: function () {
            var self = this;
            var domains = [];
            if (self.$search_date) {
                var start_date = self.$search_date.find('.field_start_date').val(),
                    end_date = self.$search_date.find('.field_end_date').val(),
                    field = self.$search_date.find('.select_field_date').val();
                if (field) {
                    if (start_date) {
                        start_date = start_date.replace(/[年月]/ig, '-').replace('日', '');
                        domains.push([field, '>=', start_date]);
                    }
                    if (end_date) {
                        end_date = end_date.replace(/[年月]/ig, '-').replace('日', '');
                        domains.push([field, '<=', end_date]);
                    }
                    if (domains.length) {
                        domains = domains.concat(this._domain);
                        self.reload({
                            context: self._context,
                            domain: domains,
                            groupBy: self.initialState.groupedBy,
                            modelName: self.modelName,
                            offset: self.initialState.offset,
                        });
                    }
                }
            }
        },
        renderButtons: function ($node) {
            var self = this;
            this._super.apply(this, arguments);
            var datepickers_opt = this.get_data();
            var search_fields = [];
            _.each(self.fields, function (value, key, list) {
                if (value.store && value.type === "datetime" || value.type === "date") {
                    search_fields.push([key, value.string]);
                }
            });

            if (!this.noLeaf && this.hasButtons) {
                this.$search_date = $(qweb.render('buttons_for_date', {search_fields: search_fields}));
                self.$search_date.find('.field_start_date').datetimepicker(datepickers_opt);
                self.$search_date.find('.field_end_date').datetimepicker(datepickers_opt);

                // 为啥不用change，因为如果是代码赋值的话，change事件就监听不到
                // self.$search_date.find('.field_start_date').on('change', function() {
                //     self.search_by_range();
                // });
                self.$search_date.find('.field_start_date').blur(function () {
                    self.search_by_range();
                });
                self.$search_date.find('.field_end_date').blur(function () {
                    self.search_by_range();
                });
                self.$search_date.find('.select_field_date').on('change', function () {
                    self.search_by_range();
                });
                self.$search_date.appendTo($node);
            }

        },
    });
});