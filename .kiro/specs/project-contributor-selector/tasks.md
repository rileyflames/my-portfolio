# Implementation Plan

- [x] 1. Create helper functions for contributor management


  - Add `availableContributors` computed value that filters out already selected contributors
  - Implement `handleAddContributor` function to add contributor to selection
  - Implement `handleRemoveContributor` function to remove contributor from selection
  - Implement `handleNavigateToAddContributor` function with unsaved changes detection
  - _Requirements: 1.3, 1.4, 2.3, 2.4, 3.2, 3.3_



- [ ] 2. Replace checkbox list with dropdown selector
  - Remove existing checkbox-based contributor selection UI
  - Implement dropdown/select element with "Select a contributor..." placeholder
  - Populate dropdown options with available contributors showing name and email
  - Wire up onChange handler to call `handleAddContributor`


  - Disable dropdown when no contributors are available
  - _Requirements: 1.1, 1.2, 1.3, 1.5_

- [ ] 3. Implement selected contributors display
  - Create selected contributors list section below dropdown
  - Display each selected contributor with name and email in card/chip style

  - Add remove button (×) to each selected contributor card
  - Wire up remove button to call `handleRemoveContributor`
  - Apply purple theme styling consistent with rest of application
  - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [x] 4. Add "+ Add Contributor" quick action button

  - Create "+ Add Contributor" button in section header
  - Style button with blue text and purple hover state
  - Wire up button to call `handleNavigateToAddContributor`
  - Position button next to the "Contributors (Optional)" label
  - _Requirements: 3.1, 3.2_


- [ ] 5. Implement empty state messaging
  - Add conditional rendering for when no contributors exist
  - Display message: "No contributors available. Click '+ Add Contributor' to create one."
  - Add conditional rendering for when all contributors are selected
  - Display message: "All available contributors have been added."
  - _Requirements: 1.5_



- [ ] 6. Add unsaved changes detection and warning
  - Implement form dirty state detection (check if any field has been modified)
  - Add confirmation dialog before navigation when form has unsaved changes
  - Use browser native confirm dialog with message: "You have unsaved changes. Navigate to add contributor?"
  - Allow navigation without warning if form is clean



  - _Requirements: 3.3, 3.4_

- [ ] 7. Verify edit mode compatibility
  - Test that existing contributors pre-populate correctly in edit mode
  - Verify pre-populated contributors don't appear in dropdown options
  - Test adding new contributors to existing project
  - Test removing existing contributors from project
  - Verify form submission updates contributor associations correctly
  - _Requirements: 5.1, 5.2, 5.3_

- [ ] 8. Apply consistent styling and accessibility
  - Apply Tailwind CSS classes matching existing form elements
  - Use purple theme color (#3B0270) for hover states
  - Add aria-labels to remove buttons for screen readers
  - Ensure dropdown is keyboard navigable
  - Test with keyboard-only navigation
  - _Requirements: All requirements (cross-cutting concern)_
