<?php

/**
 * @file
 * Defines callbacks and resources needed for the 'islandora ontology autocomplete' form element.
 */
class Autocomplete {

  /**
   * Loads the required resources for displaying the Autocomplete element.
   * @param $form_state
   */
  public static function addRequiredResources(&$form_state) {
    drupal_add_js(drupal_get_path('module', 'islandora_ontology_autocomplete') . '/bower_components/typeahead.js/dist/typeahead.bundle.min.js', array(
      'group' => JS_DEFAULT,
      'every_page' => TRUE
    ));
    drupal_add_js(drupal_get_path('module', 'islandora_ontology_autocomplete') . '/bower_components/handlebars/handlebars.min.js', array(
      'group' => JS_DEFAULT,
      'every_page' => TRUE
    ));
    drupal_add_css(drupal_get_path('module', 'islandora_ontology_autocomplete') . '/css//autocomplete.css', array(
      'group' => CSS_DEFAULT,
      'every_page' => TRUE
    ));
  }

  /**
   * The '#process' callback for the Autocomplete form element.
   *
   * @param array $element
   *   The ontology_autocomplete form element.
   * @param array $form_state
   *   The Drupal form state.
   * @param array $form
   *   The complete Drupal form definition.
   *
   * @return array
   *   The ontology_autocomplete form element.
   */
  public static function process(array $element, array &$form_state, array $form = NULL) {
    self::addRequiredResources($form_state);

    // Config JS
    $element['#attached']['js'] = [
      drupal_get_path('module', 'islandora_ontology_autocomplete') . '/js/autocomplete_field_config.js'
    ];

    // Pass settings
    $element['#attached']['js'][] = [
      'data' => [
        'autocomplete' => [
          'names' => [$element['#name']],
        ]
      ],
      'type' => 'setting',
    ];


    return $element;
  }
}

/**
 * Implements theme_hook().
 *
 * @param array $variables
 *   An array of theming variables.
 * @return string
 */
function theme_ontology_autocomplete($variables) {
  $element = $variables['element'];

  $element['#type'] = 'textfield';

  $output = '<input id="' . $element['#id'] . '" class="typeahead form-text">';

  $output .= $element['#children'];

  return $output;

}