I will implement a **2D "Tech Network" Background** using the native HTML5 Canvas API (Context 2D). This avoids 3D rendering overhead while providing a sophisticated, minimalist "Constellation" effect that fits the "XRak" tech team identity.

**Design Concept: "Neural Constellation"**

* **Visuals**: A dynamic network of nodes (dots) and synapses (lines). The background will be the deep theme color.

* **Minimalism**: Subtle grey/white opacity, thin lines, smooth motion. No flashy colors or 3D perspective.

* **Interaction**: Nodes will gently react to mouse movement (hover effect), creating a "living" system feel.

* **Performance**: Optimized 2D rendering loop using `requestAnimationFrame`.

**Implementation Details:**

1. **Component**: `components/features/ThreeBackground.tsx` (Will reuse this file path as requested, but implement 2D logic).
2. **Tech**: React `useRef` and `useEffect` to manage the `<canvas>` element and animation loop. No `three.js` usage for this version.
3. **Logic**:

   * Initialize a set of particles with position and velocity.

   * On each frame: update positions, bounce off edges.

   * Draw lines between particles that are within a certain distance.

   * Adjust particle opacity based on proximity to create a "breathing" network.
4. **Styling**: Absolute positioning, z-index -1, responsive to window resize.

**File Changes:**

* Overwrite `f:\share\hub\Xra\components\features\ThreeBackground.tsx` with the new 2D implementation.

