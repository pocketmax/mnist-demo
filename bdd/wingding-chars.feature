Feature: Matches wingding characters

  Scenario: Canvas is clear
    Given The site is fully loaded
    And the canvas is clear
    When an wingding character is drawn
    Then the matching character is found