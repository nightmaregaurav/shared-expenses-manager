# Shared Expenses

This is a Google Apps Script project for managing shared expenses. It processes raw expense data, splits the expenses among participants, calculates the contributions, and provides transaction recommendations to settle debts.

## Installation

1. Clone the repository to your local machine.
2. Go to [Google Apps Script Settings Page](https://script.google.com/home/usersettings).
3. Click `Google Apps Script API` and enable it.
4. Install [clasp](https://github.com/google/clasp) globally using npm:
   ```sh
   npm install -g @google/clasp
   ```
5. Log in to your Google account using clasp:
   ```sh
   clasp login
   ```
6. Create a Google Sheets document.
7. Open the script editor by navigating to `Extensions > Apps Script`.
8. Save the script project and copy the script ID from settings.
9. Create a new folder with a name of your choice and navigate to it.
10. Run the following command to clone the script project to your local machine:
   ```sh
   clasp clone <SCRIPT_ID>
   ```
11. Copy the contents of the files from this repository into the newly created folder.
12. Run the following command to push the script to your app script workspace:
   ```sh
   clasp push
   ```
13. Open [Google Appa Script](https://script.google.com/) and navigate to the project.
14. Go to triggers and create a new trigger for the `UpdateSheets` function to run on sheet change and Save.
15. Add another trigger for the `UpdateSheets` function to run on form submit and Save.
16. Add another trigger for the `UpdateForm` function to run on sheet change and Save.
17. Go to the script editor and click on `Code.gs`.
18. Run `CreateForm` function to create the form for the sheet and prepare the sheet for the script.
19. Open the sheet document, navigate to `Participants` sheet, and add the names of the participants.
      - These names will be displayed in the form and the sheet.
      - These names can not contain commas otherwise the script will not work as expected.
      - The names must be unique.
      - The names will be added from `A` to `A<Number of Participants>` cells.
      - `A1` cell from `Participants` sheet will not be read by the script. So you can add a title or a description to the participants.
20. Open the sheet document, navigate to `Raw` sheet.
21. Click on `Tools` and Click on `Manage Form` and Click on `Go to live form`.
22. Copy the URL of the form and share it with the participants.
23. Congrats! You have successfully installed the script. You can now start using the form accessible from the Form URL to add expenses.

## Next steps
1. All of your sheets are automatically generated and updated by the script. Except for the `Participants` sheet. And `Raw` sheet.
2. `Participants` sheet is where you add the names of the participants. The script will read the names from this sheet.
3. Until you add the names of the participants to the `Participants` sheet, the options in the form will show as "please", "add", "participants name", "in the", "participants", "sheet".
4. `Raw` sheet is where you add the raw data of the expenses using the form. The script will read the data from this sheet.
5. You can protect the `Participants` and `Raw` sheets to show a warning messages when the user tries to edit them to ensure the change is intentional.
6. Once you settle the debts, you can check the "Settled?" column in the `Raw` sheet to mark the transaction as settled. The script will not consider the settled transactions in the calculations.


## What Will the Script Do?
- The script will process the raw data and group the expenses by month.
   - Note that it will group by the month the expense was reported, not the date the user chose (This is to prevent changes in the monthly summary once a month is over)
- Then the script will calculate the contributions of each participant for each month.
- Finally, the script will provide transaction recommendations to settle debts.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
