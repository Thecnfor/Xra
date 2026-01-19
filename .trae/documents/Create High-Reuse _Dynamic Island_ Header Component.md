I will create a highly reusable, high-design `SiteHeader` component and integrate it into your application layout.

**Design Philosophy:**

* **Decoupled Layout**: I will use a **3-layer stacking strategy** instead of a standard Flexbox `space-between`. The "Center" will be absolutely positioned relative to the viewport to ensure it is mathematically centered regardless of the Left/Right content width.

* **"Dynamic Island" Aesthetics**: The center element will feature a "black glass" or "deep neural" aesthetic (matching your `RakLink` theme), with a pill shape, subtle blur, and smooth transitions.

* **Interaction-Ready**: The header container will be `pointer-events-none` (allowing clicks to pass through empty areas), while the actual interactive elements (Logo, Menu, Island) will be `pointer-events-auto`.

**Technical Implementation:**

1. **Create** **`components/layout/site-header.tsx`**:

   * **Architecture**:

     * `SiteHeader` (Main Container): Fixed to top, handles Z-index and safe areas.

     * `HeaderLeft` / `HeaderRight`: Slots for customization. Defaults to Logo and Menu.

     * `DynamicIsland`: The center piece using `motion` (from your installed `motion` package) for fluid animations.

   * **Styling**: Tailwind CSS v4 + `clsx/tailwind-merge`.

2. **Update** **`app/layout.tsx`**:

   * Import and mount `<SiteHeader />` globally so it persists across pages.

**Component Interface (Draft):**

```tsx
<SiteHeader 
  left={<BrandLogo size="sm" />} 
  center={<DynamicIslandState />} 
  right={<MenuButton />} 
/>
```

**Steps:**

1. Create `components/layout/site-header.tsx`.
2. Integrate into `app/layout.tsx`.

