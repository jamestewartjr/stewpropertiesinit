# Design Document: React 19 & Gatsby 5 Upgrade

## Problem Statement

**Current State:**
- React v16.8.6 (released 2019, 5+ years old)
- Gatsby v2.3.26 (released 2019, 5+ years old)
- Multiple deprecated dependencies (react-pose, old Gatsby Image API)
- Security and maintenance concerns with outdated packages

**Desired State:**
- React v19.x (latest stable)
- Gatsby v5.x (latest stable)
- All deprecated dependencies replaced with modern alternatives
- Maintained functionality and improved performance

**Value:**
- Security updates and vulnerability patches
- Performance improvements from modern React and Gatsby
- Access to modern React features (Actions, Server Components support)
- Long-term maintainability
- Compatibility with modern tooling and ecosystem

**Requirements:**
- All existing functionality must continue to work
- No breaking changes to user-facing features
- Maintain code quality and structure
- Replace deprecated APIs (react-pose → framer-motion, gatsby-image → gatsby-plugin-image)

## Technical Analysis

### Current Dependencies Analysis

**Core Dependencies:**
- `react`: ^16.8.6 → needs upgrade to ^19.x
- `react-dom`: ^16.8.6 → needs upgrade to ^19.x
- `gatsby`: ^2.3.26 → needs upgrade to ^5.x

**Deprecated Dependencies to Replace:**
- `react-pose`: ^4.0.5 → replace with `framer-motion`
- `gatsby-image`: ^2.0.39 → replace with `gatsby-plugin-image` (new API)

**Dependencies Requiring Updates:**
- `@reach/dialog`: ^0.2.0 → update to latest (or consider @radix-ui/react-dialog)
- `@reach/router`: ^1.2.1 → Gatsby 5 uses built-in routing, may not be needed
- `@reach/visually-hidden`: ^0.1.1 → update to latest
- `gatsby-plugin-react-helmet`: ^3.0.12 → update to latest
- `gatsby-plugin-styled-components`: ^3.0.7 → update to latest
- `gatsby-plugin-sharp`: ^2.0.35 → update to latest
- `gatsby-transformer-sharp`: ^2.1.18 → update to latest
- All other Gatsby plugins need updates

**Dev Dependencies:**
- Most dev dependencies need updates for compatibility
- `eslint` and related plugins need updates
- `prettier` needs update

### Code Changes Required

#### 1. React 16 → 19 Breaking Changes

**SSR Changes:**
- `gatsby-ssr.js` uses `renderToString` from `react-dom/server` - this still works but may need updates
- React 19 has improved SSR support, but existing code should work

**Class Components:**
- Class components are still supported in React 19
- No immediate refactoring required, but can be done incrementally later

**Context API:**
- Current usage of `createContext` with Provider/Consumer pattern is still valid
- No changes required

#### 2. Gatsby 2 → 5 Breaking Changes

**Image API Migration:**
- `gatsby-image` → `gatsby-plugin-image` with new `GatsbyImage` component
- GraphQL queries need to change from `fluid`/`fixed` to new `gatsbyImageData` resolver
- Files affected:
  - `src/components/gallery/item/item.js` - uses `Img` from `gatsby-image`
  - `src/pages/index.js` - GraphQL query uses `fluid` API

**Plugin Updates:**
- `gatsby-plugin-react-helmet` → may need updates or replacement
- `gatsby-plugin-styled-components` → needs update
- `gatsby-plugin-sharp` and `gatsby-transformer-sharp` → need updates

**SSR API Changes:**
- `gatsby-ssr.js` uses `replaceRenderer` which is deprecated in Gatsby 4+
- Need to migrate to new SSR APIs or use `wrapRootElement`/`wrapPageElement`

**Webpack Configuration:**
- `gatsby-node.js` uses webpack config - may need updates for Gatsby 5

#### 3. Deprecated Dependencies Replacement

**react-pose → framer-motion:**
- `src/components/transition/transition.js` uses `react-pose`
- Need to rewrite using `framer-motion` API
- `PoseGroup` → `AnimatePresence`
- `posed.div` → `motion.div`

**@reach/router:**
- Check if actually used (Gatsby has built-in routing)
- If used, may need to migrate to Gatsby's routing or @reach/router v1.3+

## Migration Plan

### Phase 1: Dependency Updates
1. Update `package.json` with new versions
2. Update React and React-DOM to v19
3. Update Gatsby to v5
4. Update all Gatsby plugins to compatible versions
5. Update other dependencies to compatible versions

### Phase 2: Replace Deprecated Dependencies
1. Replace `react-pose` with `framer-motion`
2. Replace `gatsby-image` with `gatsby-plugin-image`
3. Update `gatsby-config.js` to include `gatsby-plugin-image`

### Phase 3: Code Migration
1. Update `gatsby-ssr.js` to remove deprecated `replaceRenderer`
2. Update GraphQL queries to use new image API
3. Update `src/components/gallery/item/item.js` to use new `GatsbyImage`
4. Update `src/components/transition/transition.js` to use `framer-motion`
5. Update any other components using deprecated APIs

### Phase 4: Configuration Updates
1. Update `gatsby-config.js` for new plugin APIs
2. Update `gatsby-node.js` if webpack config needs changes
3. Update any other configuration files

### Phase 5: Cleanup
1. Remove unused dependencies
2. Update scripts if needed
3. Verify all functionality works

## Implementation Details

### Image API Migration

**Old API (gatsby-image):**
```javascript
import Img from 'gatsby-image';

<Img fluid={image.childImageSharp.fluid} />
```

**GraphQL Query (old):**
```graphql
image {
  childImageSharp {
    fluid(maxHeight: 500, quality: 90) {
      ...GatsbyImageSharpFluid_withWebp
    }
  }
}
```

**New API (gatsby-plugin-image):**
```javascript
import { GatsbyImage } from 'gatsby-plugin-image';

<GatsbyImage image={image.childImageSharp.gatsbyImageData} alt={title} />
```

**GraphQL Query (new):**
```graphql
image {
  childImageSharp {
    gatsbyImageData(
      height: 500
      quality: 90
      layout: CONSTRAINED
    )
  }
}
```

### Animation Migration (react-pose → framer-motion)

**Old API (react-pose):**
```javascript
import posed, { PoseGroup } from 'react-pose';

const RoutesContainer = posed.div({
  enter: { opacity: 1, delay: timeout, delayChildren: timeout },
  exit: { opacity: 0 },
});

<PoseGroup>
  <RoutesContainer key={location.pathname}>{children}</RoutesContainer>
</PoseGroup>
```

**New API (framer-motion):**
```javascript
import { motion, AnimatePresence } from 'framer-motion';

<AnimatePresence mode="wait">
  <motion.div
    key={location.pathname}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ delay: timeout, delayChildren: timeout }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

### SSR Migration

**Old API (Gatsby 2):**
```javascript
export const replaceRenderer = ({ bodyComponent, replaceBodyHTMLString, setHeadComponents }) => {
  const ConnectedBody = () => <AppProvider>{bodyComponent}</AppProvider>;
  replaceBodyHTMLString(renderToString(<ConnectedBody />));
  // ...
};
```

**New API (Gatsby 5):**
```javascript
// Use wrapRootElement instead
export const wrapRootElement = ({ element }) => {
  return <AppProvider>{element}</AppProvider>;
};

// Styled-components SSR is handled automatically by gatsby-plugin-styled-components
```

## Risk Assessment

**Low Risk:**
- React class components (still supported)
- Context API usage (no changes needed)
- Most component code (minimal changes)

**Medium Risk:**
- Image API migration (requires GraphQL query updates)
- Animation library migration (API differences)
- SSR migration (different approach)

**High Risk:**
- Plugin compatibility issues
- Build process changes
- Potential runtime errors from breaking changes

## Rollback Plan

1. Keep current branch as backup
2. All changes in separate branch
3. Can revert to original branch if issues arise
4. Incremental commits for easy rollback of specific changes

## Success Criteria

- ✅ Application builds successfully
- ✅ All pages render correctly
- ✅ Images display properly
- ✅ Animations/transitions work
- ✅ Modal functionality works
- ✅ No console errors
- ✅ All dependencies updated to target versions
- ✅ Deprecated dependencies removed

## Timeline Estimate

- Phase 1 (Dependencies): ~30 minutes
- Phase 2 (Replace Deprecated): ~15 minutes
- Phase 3 (Code Migration): ~1-2 hours
- Phase 4 (Configuration): ~30 minutes
- Phase 5 (Cleanup): ~15 minutes

**Total: ~3-4 hours**

## Notes

- No testing required per requirements
- Will work in separate branch for review
- Will create PR for review before merge
- Can address issues incrementally
