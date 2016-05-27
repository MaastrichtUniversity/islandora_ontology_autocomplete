Drupal.behaviors.islandora_ontology_autocomplete = {
    attach: function (context, settings) {

        // Initiate autocomplete and add constructor options.
        jQuery.each(settings.autocomplete, function (i, name) {
            var container = '#edit-' + name;

            var relativePath = 'http://www.ebi.ac.uk/ols/';
            var ontology = 'ncbitaxon';
            var type = '';

            jQuery(container, context).once('processed', function () {
                jQuery(container).typeahead({
                        minLength: 3,
                        highlight: true
                    },
                    {
                        name: 'selection',
                        source: getSelectHound(relativePath, ontology, type),
                        display: 'value',
                        limit: 20,
                        templates: getSuggestTemplate()
                    });

            })
        });

        function getSelectHound (relativePath, ontology, type) {

            var ontologyParam ='';
            if (ontology) {
                ontologyParam = '&ontology=' + ontology;
            }
            if (type) {
                ontologyParam += '&type=' + type;
            }
            return new Bloodhound({
                datumTokenizer: Bloodhound.tokenizers.whitespace,
                queryTokenizer: Bloodhound.tokenizers.whitespace,
                identify: function(obj) { return obj.id; },
                remote: {
                    url: relativePath + 'api/select?rows=21&q=%QUERY' + ontologyParam,
                    wildcard: "%QUERY",
                    transform: function (response) {
                        return selectResponse(response)
                    }
                }
            });

        }

        function getSuggestTemplate () {

            return {
                suggestion: function(suggestion) {

                    var label = suggestion.data.label ;

                    var extra = "";
                    if (suggestion.data.synonym != "") {
                        label =  suggestion.data.synonym;
                        extra = "<div class='sub-text'>synonym for " + suggestion.value + "</div>"
                    }

                    var objectTypeHtml = "<div class='ontology-source'>" + suggestion.data.prefix + "</div>"
                    var type = getUrlType(suggestion.data.type);

                    if (type != 'ontology') {
                        objectTypeHtml+="&nbsp;<div class='term-source'>" + suggestion.data.shortForm + "</div>";

                    }

                    return "<div style='width: 95%; display: table;'> <div style='display: table-row'><div  style='display: table-cell;' class='ontology-suggest'><div class='suggestion-value'>" + label + "</div>" + extra + "</div><div style='vertical-align:middle; text-align: right; width:60px; display: table-cell;'>" + objectTypeHtml + "</div></div></div>";

                    //Handlebars.compile('<div><strong>{{value}}</strong> – {{data.ontology}}</div>');

                }
            };
        }

        function selectResponse (response) {
            // Map the remote source JSON array to a JavaScript object array
            var query = response.responseHeader.params.q;
            return jQuery.map(response.response.docs, function (dataItem) {

                var id =   dataItem.id;

                var label = dataItem.label;

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
                    value: dataItem.label,
                    data: {ontology: dataItem.ontology_name, prefix: dataItem.ontology_prefix, iri : dataItem.iri, label: label,synonym: synonym, shortForm: shortId, type: dataItem.type},
                    query: query
                };
            });
        }

        function getUrlType (type) {
            var urlType = 'terms';
            if (type == 'property') {
                urlType = 'properties';
            }
            else if (type == 'individual') {
                urlType= 'individuals';
            }
            else if (type == 'ontology') {
                urlType= 'ontology';
            }
            return urlType;
        }



    }
};
