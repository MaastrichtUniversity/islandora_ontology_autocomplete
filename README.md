# Islandora Ontology Autocomplete

Provides an ontology autocomplete for [Islandora](http://islandora.ca/) XML forms 
using [EBI's Ontology Lookup Service (OLS)](http://www.ebi.ac.uk/ols/index). Islandora XML forms
is a Drupal based extension to Fedora Core.

## Screenshots

Search for ontology terms
![ols-1](https://cloud.githubusercontent.com/assets/6281107/22595403/aaab1a9a-ea27-11e6-8607-43a79fe3107e.png)

Both the preferred label and the ontology URI is shown. Both are available to be inserted in the XML 
output of Islandora XML forms.
![ols-2](https://cloud.githubusercontent.com/assets/6281107/22595404/aaab6afe-ea27-11e6-9227-1f0d01497efa.png)


## Installation

* Download the zip file from the [release page](https://github.com/MaastrichtUniversity/islandora_ontology_autocomplete/releases).
* Unpack it in the `sites/all/modules/contrib` directory.
* Enable the module on the Administration -> Module page of Drupal.

Alternatively, you can download directly from the source repository. You need to use
[bower](http://bower.io/) to get all Javascript dependencies. Like this:

 ```
 cd sites/all/modules/contrib
 git clone https://github.com/MaastrichtUniversity/islandora_ontology_autocomplete.git
 cd islandora_ontology_autocomplete
 bower install
 ```

## Configuration

By default the public version of OLS is used. You can set your own by 
setting the `OLS_URL` environment variable in PHP. You can for example run
this [Dockerized version of OLS](https://github.com/MaastrichtUniversity/ols-docker) with your own ontologies.

### Basic

Make a field with type `ontology_autocomplete`. Add a field under it with type `hidden`
called ontologyLabel. And add a field with type `textfield` called ontologyId. The ontologyId field 
you can best set to `readonly=readonly` in the HTML options. The field names 
ontologyLabel and ontologyId are fixed.

![ols-3](https://cloud.githubusercontent.com/assets/6281107/22595882/971e5594-ea29-11e6-8d10-2dc4f554ac9b.png)

The field ontologyLabel will contain the preferred label of the ontology class. It is
available to the XML output by setting the CRUD fields.

The field ontologyId will contain the ontology class URI. It is also available to the XML. 

![ols-4](https://cloud.githubusercontent.com/assets/6281107/22595881/97182f70-ea29-11e6-9053-79e3b5c08f44.png)

### Limit to specific ontology or super class of ontology

You can limit to a specific ontology or even a super class of an ontology by setting the `childrenOf`
or `ontology` option on the User Data options of the `ontology_autocomplete` field type.

![ols-5](https://cloud.githubusercontent.com/assets/6281107/22595880/9704bb70-ea29-11e6-85d5-ff3bf9961f26.png)

