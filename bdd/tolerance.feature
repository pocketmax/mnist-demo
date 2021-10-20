Feature: Adjustable accuracy tolerance

  Scenario: Canvas is clear
    Given A new tolerance value
    And a drawing has been submitted
    When the data model is inferred
    Then new tolerance value is used
