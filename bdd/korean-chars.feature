Feature: Matches korean characters

  Scenario: Canvas is clear
    Given The site is fully loaded
    And the canvas is clear
    When an korean character is drawn
    Then the matching character is found