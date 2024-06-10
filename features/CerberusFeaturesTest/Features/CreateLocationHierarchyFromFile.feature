Feature: Load location hierarchy from file

As a system admin
I want to be able to define a hiearchy location in an spreed sheet and push it to the system to create the hierarcy
So I can easily setup the system

    Scenario: Create a top level root hierarchy
        Given I'm an logged in as an admin
        And I have a file with the following location hierarchy
          | id | name           | parent       | description               |
          | 1  | CAT            |              | Catalunya                 |
          | 2  | AND            |              | Andalusia                 |
          | 3  | BAR            | CAT          | Comarques de Barcelona    |
          | 4  | GIR            | CAT          | Comarques de Girona       |
          | 5  | SEV            | AND          | Província de Sevilla      |
          | 6  | MAL            | AND          | Província de Málaga       |
          | 7  | BARC           | BAR          | Barcelonès                |
          | 8  | GIRN           | GIR          | Gironès                   |
          | 9  | BCN            | BARC         | Barclona                  |
          | 10 | BCNSANTS       | BCN          | Barcelona Sants           |
          | 11 | BCNSANTS-AND   | BCN          | Barcelona Sants  Andanes  |
          | 12 | BCNSANTS-AND-1 | BCNSANTS-AND | Barcelona Sants  Andana 1 |
        When I push the file to the system
        Then the system should create the location hierarchy