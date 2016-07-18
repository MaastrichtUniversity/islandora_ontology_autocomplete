Drupal.behaviors.islandora_ontology_autocomplete = {
    attach: function (context, settings) {

        // Initiate autocomplete and add constructor options.
        jQuery.each(settings.autocomplete.names, function (i, name) {
            var container = '#edit-' + name;

            var relativePath = settings.autocomplete.olsURL[i];
            var ontology = settings.autocomplete.ontology[i];
            var childrenOf = settings.autocomplete.childrenOf[i];
            var overridable = settings.autocomplete.overridable[i];

            jQuery(container, context).once('processed', function () {
                jQuery(container).select2({
                    placeholder: 'Select an ontology term',
                    ajax: {
                        url: relativePath + '/api/select',
                        dataType: 'json',
                        delay: 250,
                        data: function (params) {
                            return {
                                q: params.term === undefined ? '*' : params.term, // search term
                                start: params.page === undefined ? 0 : params.page * 10,
                                ontology: ontology,
                                childrenOf: childrenOf != '' ? childrenOf : undefined
                            };
                        },
                        processResults: selectResponse,
                        cache: true
                    },
                    templateResult: getSuggestTemplate,
                    // This nextSearchTerm does not work:
                    // http://stackoverflow.com/questions/35976322/whats-the-select2-v4-equivalent-of-v3-5s-nextsearchterm
                    nextSearchTerm: function (selectedObject, currentSearchTerm) {
                        return currentSearchTerm;
                    },
                    createTag: createOverride,
                    tags: overridable

                }).on('select2:select', {'name': name}, termSelected);
                
                // Select an already selected value, not entirely pretty this
                jQuery(container).val('default_value').trigger('change')
            })
        });

        function termSelected(eventObject) {
            var obj = jQuery(eventObject.currentTarget).select2("data")[0];
            jQuery("input[name='" + eventObject.data.name + "[ontologyLabel]']").val(obj.text);
            jQuery("input[name='" + eventObject.data.name + "[ontologyId]']").val(obj.data.iri);
        }

        function getSuggestTemplate(suggestion) {
            if (!suggestion.id) {
                return suggestion.text;
            }

            var label = suggestion.data.label;

            var extra = "";
            if (suggestion.data.synonym != "") {
                label = suggestion.data.synonym;
                extra = "<div class='sub-text'>synonym for " + suggestion.text + "</div>"
            }

            var objectTypeHtml = "<div class='ontology-source'>" + suggestion.data.prefix + "</div>";
            objectTypeHtml += "&nbsp;<div class='term-source'>" + suggestion.data.shortForm + "</div>";


            return jQuery("" +
                "<div style='width: 100%; display: table;'> <div style='display: table-row'><div  style='display: table-cell;' class='ontology-suggest'><div class='suggestion-value'>" + label + "</div>" + extra + "</div><div style='vertical-align:middle; text-align: right; display: table-cell;'>" + objectTypeHtml + "</div></div></div>"
            );
        }

        function selectResponse(response, params) {

            // Map the remote source JSON array to a JavaScript object array
            var items = jQuery.map(response.response.docs, function (dataItem) {

                var id = dataItem.id;

                var label = dataItem.label;

                if (dataItem.type == 'ontology') {
                    return null;
                }

                var synonym = "";
                var cantHighlight = true;
                if (response.highlighting[id].label_autosuggest != undefined) {
                    label = response.highlighting[id].label_autosuggest[0];
                    cantHighlight = false;

                }
                else if (response.highlighting[id].label != undefined) {
                    label = response.highlighting[id].label[0];
                    cantHighlight = false;

                }

                if (cantHighlight) {
                    if (response.highlighting[id].synonym_autosuggest != undefined) {
                        synonym = response.highlighting[id].synonym_autosuggest[0];
                    }
                    else if (response.highlighting[id].synonym != undefined) {
                        synonym = response.highlighting[id].synonym[0];
                    }
                }

                var shortId = dataItem.obo_id;
                if (shortId == undefined) {
                    shortId = dataItem.short_form;
                }
                return {
                    id: id,
                    text: dataItem.label,
                    data: {
                        ontology: dataItem.ontology_name,
                        prefix: dataItem.ontology_prefix,
                        iri: dataItem.iri,
                        label: label,
                        synonym: synonym,
                        shortForm: shortId,
                        type: dataItem.type
                    }
                };
            });

            params.page = params.page || 0;

            return {
                results: items,
                pagination: {
                    more: (params.page * 10) < response.response.numFound
                }
            }
        }

        function createOverride(term) {
            var text = term.term + "";
            return {
                id: term.term, text: text, data: {
                    ontology: 'override',
                    prefix: 'override',
                    iri: '',
                    label: text,
                    synonym: '',
                    shortForm: 'none',
                    type: ''
                }
            }
        }
    }
};
