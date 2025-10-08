# Minimalist Design System

## Color Palette

### Primary Colors
```
Primary (Deep Purple): #3E1E68
- Used for: Buttons, links, accents, brand elements
- Hover: #5A3A8A (lighter)
- Active: #2A1448 (darker)
```

### Neutral Colors
```
White:      #FFFFFF - Pure white backgrounds
Cream:      #F9F5F0 - Warm off-white, subtle backgrounds
Beige:      #F5EFE6 - Cream tones, cards
Light Gray: #EEEEEE - Borders, dividers
```

### Usage Guide
- **Backgrounds**: Use #F9F5F0 or #FFFFFF
- **Cards**: White (#FFFFFF) with subtle borders
- **Text**: Dark gray (#212121) for body, #616161 for secondary
- **Accents**: Primary purple (#3E1E68)
- **Borders**: Light gray (#EEEEEE) or neutral-300

## Typography

### Font Family
- **Primary**: Montserrat (sans-serif)
- **Weights**: 300 (light), 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Scale
```
Headings:
- H1: text-6xl md:text-8xl (96px desktop)
- H2: text-4xl md:text-5xl (48px desktop)
- H3: text-2xl md:text-3xl (30px desktop)
- H4: text-xl md:text-2xl (24px desktop)

Body:
- Large: text-lg md:text-xl (20px desktop)
- Regular: text-base (16px)
- Small: text-sm (14px)
- Tiny: text-xs (12px)
```

### Text Colors
```
Primary Text: text-neutral-900
Secondary Text: text-neutral-600
Muted Text: text-neutral-500
Brand Text: text-primary
```

## Spacing

### Consistent Scale
```
xs:  0.25rem (4px)
sm:  0.5rem  (8px)
md:  1rem    (16px)
lg:  1.5rem  (24px)
xl:  2rem    (32px)
2xl: 3rem    (48px)
3xl: 4rem    (64px)
```

### Component Spacing
- **Cards**: p-6 (24px padding)
- **Sections**: py-12 (48px vertical)
- **Grid gaps**: gap-4 to gap-8
- **Button padding**: px-6 py-3 or px-8 py-4

## Components

### Buttons

#### Primary Button
```tsx
<button className="bg-primary text-white px-8 py-4 rounded-lg text-base font-medium hover:bg-primary-light transition-all duration-200">
  Button Text
</button>
```

#### Secondary Button
```tsx
<button className="border-2 border-primary text-primary px-8 py-4 rounded-lg text-base font-medium hover:bg-primary hover:text-white transition-all duration-200">
  Button Text
</button>
```

#### Ghost Button
```tsx
<button className="text-primary px-6 py-3 rounded-lg text-base font-medium hover:bg-accent-cream transition-all duration-200">
  Button Text
</button>
```

### Cards

#### Basic Card
```tsx
<div className="bg-white p-6 rounded-xl border border-neutral-300 hover:border-primary transition-colors duration-200">
  {/* Content */}
</div>
```

#### Elevated Card
```tsx
<div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200">
  {/* Content */}
</div>
```

### Inputs

#### Text Input
```tsx
<input 
  type="text"
  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
  placeholder="Enter text"
/>
```

#### Textarea
```tsx
<textarea 
  rows={6}
  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-vertical"
  placeholder="Enter message"
/>
```

### Badges

#### Status Badge
```tsx
<span className="px-3 py-1 text-xs font-medium rounded-full bg-accent-cream text-primary border border-neutral-300">
  Badge Text
</span>
```

#### Skill Badge
```tsx
<span className="px-4 py-2 bg-white border border-neutral-300 text-neutral-700 rounded-full text-sm font-medium hover:border-primary hover:text-primary transition-all">
  Skill Name
</span>
```

## Layout

### Container
```tsx
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  {/* Content */}
</div>
```

### Section
```tsx
<section className="py-12 md:py-16 lg:py-20">
  {/* Content */}
</section>
```

### Grid
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Items */}
</div>
```

## Effects

### Shadows
```
Small:  shadow-sm
Medium: shadow-md
Large:  shadow-lg
XLarge: shadow-xl
2XL:    shadow-2xl
```

### Hover Effects
```tsx
// Scale up
hover:scale-105 transform transition-transform

// Shadow increase
hover:shadow-xl transition-shadow

// Border color change
hover:border-primary transition-colors

// Background change
hover:bg-primary hover:text-white transition-all
```

### Transitions
```
Fast:   duration-150
Normal: duration-200
Slow:   duration-300
```

## Patterns

### Hero Section
- Background: neutral-100 with subtle gradient
- Large typography with tracking-tight
- Minimal decorative elements
- Clear hierarchy

### Navigation
- Sticky with backdrop blur
- Border bottom instead of shadow
- Underline for active state
- Minimal padding

### Cards
- White background
- Subtle borders
- Hover effects (border color or shadow)
- Rounded corners (rounded-xl)

### Forms
- Clean inputs with focus states
- Consistent spacing
- Clear labels
- Inline validation

## Accessibility

### Color Contrast
- All text meets WCAG AA standards
- Primary purple (#3E1E68) on white: 8.5:1 ratio ✅
- Neutral-600 on white: 7:1 ratio ✅

### Focus States
- All interactive elements have visible focus rings
- Use focus:ring-2 focus:ring-primary

### Keyboard Navigation
- All buttons and links are keyboard accessible
- Logical tab order

## Responsive Design

### Breakpoints
```
sm:  640px  (mobile landscape)
md:  768px  (tablet)
lg:  1024px (desktop)
xl:  1280px (large desktop)
2xl: 1536px (extra large)
```

### Mobile-First Approach
```tsx
// Base styles for mobile
className="text-base"

// Tablet and up
className="text-base md:text-lg"

// Desktop and up
className="text-base md:text-lg lg:text-xl"
```

## Animation

### Subtle Animations
```tsx
// Fade in
className="animate-fade-in"

// Slide up
className="animate-slide-up"

// Hover translate
className="hover:translate-x-1 transition-transform"
```

### Loading States
```tsx
<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
```

## Best Practices

### Do's ✅
- Use consistent spacing scale
- Maintain visual hierarchy
- Keep animations subtle
- Use white space generously
- Stick to the color palette
- Ensure high contrast
- Test on multiple devices

### Don'ts ❌
- Don't use too many colors
- Avoid heavy shadows
- Don't overcrowd layouts
- Avoid complex animations
- Don't mix border styles
- Avoid inconsistent spacing

## Examples

### Page Header
```tsx
<div className="text-center mb-12">
  <h1 className="text-4xl font-bold text-neutral-900 mb-4">
    Page Title
  </h1>
  <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
    Subtitle or description text
  </p>
</div>
```

### Feature Card
```tsx
<div className="bg-white p-6 rounded-xl border border-neutral-300 hover:border-primary transition-colors">
  <div className="w-12 h-12 bg-accent-cream rounded-lg flex items-center justify-center mb-4">
    <Icon className="w-6 h-6 text-primary" />
  </div>
  <h3 className="text-lg font-semibold text-neutral-900 mb-2">
    Feature Title
  </h3>
  <p className="text-sm text-neutral-600">
    Feature description text
  </p>
</div>
```

### Section Divider
```tsx
<div className="flex items-center justify-center gap-3 my-12">
  <div className="h-px w-12 bg-primary"></div>
  <span className="text-sm text-primary font-medium tracking-wide">
    SECTION TITLE
  </span>
  <div className="h-px w-12 bg-primary"></div>
</div>
```

## Summary

This minimalist design system emphasizes:
- **Clarity**: Clean, uncluttered layouts
- **Consistency**: Reusable patterns and components
- **Elegance**: Subtle animations and transitions
- **Professionalism**: Sophisticated color palette
- **Accessibility**: High contrast and keyboard navigation
- **Responsiveness**: Mobile-first approach

Use this guide to maintain consistency across all pages and components.