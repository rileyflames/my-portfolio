# Design Document

## Overview

This design document outlines the implementation approach for enhancing the project contributor selection interface. The current implementation uses a checkbox list which becomes unwieldy with many contributors. The new design will use a dropdown selector with a selected contributors display area and a quick action button to add new contributors.

The enhancement will be implemented entirely in the frontend React component `ProjectFormWithImages.tsx`, with no backend changes required since the many-to-many relationship between projects and contributors already exists.

## Architecture

### Component Structure

The contributor selection will be refactored into a self-contained section within the `ProjectFormWithImages` component with the following sub-components:

1. **ContributorSelector** - Main container for the contributor selection UI
2. **ContributorDropdown** - Dropdown/select element for choosing contributors
3. **SelectedContributorsList** - Display area showing selected contributors with remove buttons
4. **AddContributorButton** - Quick action button to navigate to contributor management

### Data Flow

```
User selects contributor from dropdown
  ↓
Contributor added to selectedContributors state array
  ↓
Dropdown filters out selected contributors
  ↓
Selected contributor appears in SelectedContributorsList
  ↓
User can remove contributor (returns to dropdown options)
  ↓
On form submit, selectedContributors array sent to backend
```

## Components and Interfaces

### State Management

The existing state in `ProjectFormWithImages` will be enhanced:

```typescript
// Existing state (keep as-is)
const [contributors, setContributors] = useState<Contributor[]>([])
const [selectedContributors, setSelectedContributors] = useState<string[]>([])

// No new state needed - reuse existing
```

### Helper Functions

```typescript
// Get contributors available for selection (not already selected)
const availableContributors = contributors.filter(
  c => !selectedContributors.includes(c.id)
)

// Add contributor to selection
const handleAddContributor = (contributorId: string) => {
  setSelectedContributors([...selectedContributors, contributorId])
}

// Remove contributor from selection
const handleRemoveContributor = (contributorId: string) => {
  setSelectedContributors(selectedContributors.filter(id => id !== contributorId))
}

// Navigate to contributors tab with unsaved changes warning
const handleNavigateToAddContributor = () => {
  const hasUnsavedChanges = // Check if form is dirty
  if (hasUnsavedChanges) {
    if (confirm('You have unsaved changes. Navigate to add contributor?')) {
      navigate('/admin/projects?tab=contributors')
    }
  } else {
    navigate('/admin/projects?tab=contributors')
  }
}
```

### UI Component Structure

```jsx
<div className="contributor-selection-section">
  {/* Section Header */}
  <div className="flex justify-between items-center mb-2">
    <label>Contributors (Optional)</label>
    <button 
      type="button"
      onClick={handleNavigateToAddContributor}
      className="text-sm text-blue-600 hover:text-blue-800"
    >
      + Add Contributor
    </button>
  </div>

  {/* Dropdown Selector */}
  <select 
    value=""
    onChange={(e) => handleAddContributor(e.target.value)}
    disabled={availableContributors.length === 0}
  >
    <option value="">Select a contributor...</option>
    {availableContributors.map(contributor => (
      <option key={contributor.id} value={contributor.id}>
        {contributor.name} ({contributor.email})
      </option>
    ))}
  </select>

  {/* Selected Contributors Display */}
  {selectedContributors.length > 0 && (
    <div className="selected-contributors-list">
      {selectedContributors.map(contributorId => {
        const contributor = contributors.find(c => c.id === contributorId)
        return (
          <div key={contributorId} className="contributor-chip">
            <div>
              <p>{contributor.name}</p>
              <p className="text-sm text-gray-500">{contributor.email}</p>
            </div>
            <button onClick={() => handleRemoveContributor(contributorId)}>
              ×
            </button>
          </div>
        )
      })}
    </div>
  )}

  {/* Empty State */}
  {contributors.length === 0 && (
    <p className="text-sm text-gray-500">
      No contributors available. Click "+ Add Contributor" to create one.
    </p>
  )}
</div>
```

## Data Models

No changes to existing data models. The component will continue to use:

```typescript
interface Contributor {
  id: string
  name: string
  email: string
}

interface ProjectFormData {
  // ... existing fields
  contributorIds?: string[]  // Already exists
}
```

## Error Handling

### Scenarios and Handling

1. **No contributors exist**
   - Display: "No contributors available. Click '+ Add Contributor' to create one."
   - Disable dropdown
   - Show "+ Add Contributor" button prominently

2. **All contributors already selected**
   - Display: "All available contributors have been added."
   - Disable dropdown
   - Keep "+ Add Contributor" button visible

3. **Navigation with unsaved changes**
   - Show browser confirm dialog: "You have unsaved changes. Navigate to add contributor?"
   - If user confirms, navigate to contributors tab
   - If user cancels, stay on current form

4. **Failed to fetch contributors**
   - Already handled by existing error handling
   - Display error toast
   - Show empty state with "+ Add Contributor" button

## Testing Strategy

### Manual Testing Checklist

1. **Dropdown Functionality**
   - Verify dropdown shows all available contributors
   - Verify selected contributors are removed from dropdown
   - Verify contributor name and email display correctly in options

2. **Selection and Removal**
   - Select contributor from dropdown
   - Verify contributor appears in selected list
   - Verify contributor removed from dropdown options
   - Click remove button on selected contributor
   - Verify contributor returns to dropdown options

3. **Add Contributor Navigation**
   - Click "+ Add Contributor" button with clean form
   - Verify navigation to contributors tab
   - Enter data in form (make it dirty)
   - Click "+ Add Contributor" button
   - Verify confirmation dialog appears
   - Test both confirm and cancel paths

4. **Empty States**
   - Test with no contributors in system
   - Test with all contributors selected
   - Verify appropriate messages display

5. **Edit Mode**
   - Edit existing project with contributors
   - Verify existing contributors pre-populate
   - Add new contributor
   - Remove existing contributor
   - Save and verify changes persist

6. **Form Submission**
   - Create project with contributors
   - Verify contributors saved correctly
   - Edit project and change contributors
   - Verify updates saved correctly

### Integration Testing

1. **End-to-End Flow**
   - Start creating a project
   - Realize needed contributor doesn't exist
   - Click "+ Add Contributor"
   - Add new contributor in Contributors tab
   - Return to Projects tab
   - Verify new contributor appears in dropdown
   - Select and save project

## Implementation Notes

### Styling Approach

- Use existing Tailwind CSS classes for consistency
- Match the styling of other form elements in the project form
- Use purple theme color (#3B0270) for the "+ Add Contributor" button hover state
- Selected contributors should have a card/chip appearance with remove button

### Accessibility Considerations

- Dropdown should be keyboard navigable
- Remove buttons should have aria-labels
- Empty states should be announced to screen readers
- Confirmation dialog should be accessible

### Performance Considerations

- Contributors list is already fetched once on mount
- Filtering available contributors is O(n) but n is small (typically < 100)
- No additional API calls needed for this feature
- State updates are minimal and localized

### Browser Compatibility

- Standard HTML select element for maximum compatibility
- Fallback to native browser confirm dialog
- No special browser features required
