# Requirements Document

## Introduction

This feature enhances the project form to provide a better user experience for adding contributors to projects. Currently, contributors are displayed as a list of checkboxes, which works but doesn't scale well and doesn't provide an easy way to add new contributors when needed. The enhancement will replace the checkbox list with a dropdown selector and add a quick action button to navigate to the contributor management section when a needed contributor doesn't exist.

## Requirements

### Requirement 1: Dropdown Contributor Selection

**User Story:** As a portfolio admin, I want to select contributors from a dropdown menu, so that I can easily find and add contributors to my projects without scrolling through a long list.

#### Acceptance Criteria

1. WHEN the user views the project form THEN the system SHALL display a dropdown/select component for choosing contributors
2. WHEN the dropdown is opened THEN the system SHALL display all available contributors with their name and email
3. WHEN a contributor is selected from the dropdown THEN the system SHALL add them to the selected contributors list
4. WHEN a contributor is already selected THEN the system SHALL not display them in the dropdown options
5. IF no contributors exist in the system THEN the system SHALL display a message indicating no contributors are available

### Requirement 2: Selected Contributors Display

**User Story:** As a portfolio admin, I want to see which contributors I've selected for a project, so that I can review and manage the contributor list before saving.

#### Acceptance Criteria

1. WHEN a contributor is selected THEN the system SHALL display them in a visible list below the dropdown
2. WHEN viewing the selected contributors list THEN the system SHALL display each contributor's name and email
3. WHEN a user clicks a remove button on a selected contributor THEN the system SHALL remove them from the selection
4. WHEN a contributor is removed THEN the system SHALL make them available again in the dropdown

### Requirement 3: Add New Contributor Quick Action

**User Story:** As a portfolio admin, I want to quickly navigate to add a new contributor when the one I need doesn't exist, so that I don't have to abandon my current work and manually navigate through the admin dashboard.

#### Acceptance Criteria

1. WHEN the user views the contributor selection section THEN the system SHALL display a "+ Add Contributor" button
2. WHEN the user clicks the "+ Add Contributor" button THEN the system SHALL navigate to the admin dashboard Contributors tab
3. WHEN navigating to the Contributors tab THEN the system SHALL preserve the current project form state (if technically feasible)
4. IF preserving form state is not feasible THEN the system SHALL warn the user before navigation that unsaved changes will be lost

### Requirement 4: Multi-Select Support

**User Story:** As a portfolio admin, I want to add multiple contributors to a single project, so that I can properly credit all team members who worked on the project.

#### Acceptance Criteria

1. WHEN selecting contributors THEN the system SHALL allow multiple contributors to be selected
2. WHEN multiple contributors are selected THEN the system SHALL display all of them in the selected list
3. WHEN the form is submitted THEN the system SHALL save all selected contributor associations to the project

### Requirement 5: Edit Mode Compatibility

**User Story:** As a portfolio admin, I want the contributor selector to work correctly when editing existing projects, so that I can update contributor lists for projects I've already created.

#### Acceptance Criteria

1. WHEN editing an existing project THEN the system SHALL pre-populate the selected contributors list with existing contributors
2. WHEN viewing pre-populated contributors THEN the system SHALL not display them in the dropdown options
3. WHEN adding or removing contributors in edit mode THEN the system SHALL update the project's contributor associations on save
