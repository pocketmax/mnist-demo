Feature: Matches english characters

  Scenario: Canvas is clear
    Given The site is fully loaded
    And the canvas is clear
    When an english character is drawn
    Then the matching character is found