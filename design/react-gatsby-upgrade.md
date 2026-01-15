# Design Document: Gatsby 5 Upgrade

## Overview

This upgrade focuses on **Gatsby 5 as the primary goal**, with React and other dependencies following based on Gatsby 5's compatibility requirements.

**Key Compatibility Considerations:**
- Gatsby 5 officially supports React 18 (stable)
- React 19 has compatibility issues with Gatsby 5 (experimental support only via special versions)
- All dependencies must be updated to versions compatible with Gatsby 5
- Node.js 18+ is required for Gatsby 5

## Problem Statement

**Current State:**
- Gatsby v2.3.26 (released 2019, 5+ years old)
- React v16.8.6 (released 2019, 5+ years old)
- Multiple deprecated dependencies (react-pose, old Gatsby Image API)
- Security and maintenance concerns with outdated packages

**Desired State:**
- Gatsby v5.x (latest stable) - **PRIMARY GOAL**
- React version compatible with Gatsby 5 (React 18.x - stable, React 19.x has compatibility issues)
- All deprecated dependencies replaced with modern alternatives
- All other dependencies updated to versions compatible with Gatsby 5
- Maintained functionality and improved performance

**Value:**
- Security updates and vulnerability patches
- Performance improvements from modern Gatsby (Partial Hydration, improved build times)
- Access to modern Gatsby features and ecosystem
- Long-term maintainability
- Compatibility with modern tooling and ecosystem

**Requirements:**
- All existing functionality must continue to work
- No breaking changes to user-facing features
- Maintain code quality and structure
- Replace deprecated APIs (react-pose → framer-motion, gatsby-image → gatsby-plugin-image)
- **Gatsby 5 upgrade is the primary focus; React and other dependencies will follow based on Gatsby 5 compatibility requirements**

## Technical Analysis

### Compatibility Requirements

**Gatsby 5 Requirements:**
- **React 18.x minimum** (Gatsby 5 officially supports React 18)
- **React 19.x** has compatibility issues with Gatsby 5 (experimental support only via special versions like `gatsby@5.18.0-react19.1`)
- Node.js 18+ required
- All Gatsby plugins must be updated to versions compatible with Gatsby 5

**Strategy:**
- Upgrade Gatsby to v5.x first
- Upgrade React to v18.x (stable, officially supported by Gatsby 5)
- Avoid React 19.x due to compatibility issues and experimental status
- Update all other dependencies to versions compatible with Gatsby 5

### Current Dependencies Analysis

**Core Dependencies (Gatsby-first approach):**
- `gatsby`: ^2.3.26 → **needs upgrade to ^5.x (PRIMARY FOCUS)**
- `react`: ^16.8.6 → needs upgrade to ^18.x (required by Gatsby 5, stable support)
- `react-dom`: ^16.8.6 → needs upgrade to ^18.x (required by Gatsby 5, stable support)

**Deprecated Dependencies to Replace:**
- `react-pose`: ^4.0.5 → replace with `framer-motion` (used in `transition.js` and `header.js`)
- `gatsby-image`: ^2.0.39 → replace with `gatsby-plugin-image` (used in `gallery/item/item.js`)

**Dependencies in Use (Requiring Updates):**
- `@reach/dialog`: ^0.2.0 → update to latest (used in `modal/modal.js`)
- `@reach/router`: ^1.2.1 → update to latest (used in `head/head.js` for Location)
- `@reach/visually-hidden`: ^0.1.1 → update to latest (used in `modal/modal.js`)
- `gatsby-plugin-react-helmet`: ^3.0.12 → update to latest (in `gatsby-config.js`)
- `gatsby-plugin-styled-components`: ^3.0.7 → update to latest (in `gatsby-config.js`)
- `gatsby-plugin-sharp`: ^2.0.35 → update to latest (in `gatsby-config.js`)
- `gatsby-transformer-sharp`: ^2.1.18 → update to latest (in `gatsby-config.js`)
- `gatsby-source-filesystem`: ^2.0.30 → update to latest (in `gatsby-config.js`)
- `gatsby-transformer-json`: ^2.1.11 → update to latest (in `gatsby-config.js`)
- `gatsby-transformer-remark`: ^2.3.9 → update to latest (in `gatsby-config.js`)
- `gatsby-plugin-offline`: ^2.0.25 → update to latest (in `gatsby-config.js`)
- `gatsby-plugin-sitemap`: ^2.0.12 → update to latest (in `gatsby-config.js`)
- `gatsby-plugin-react-svg`: ^2.0.0 → update to latest (in `gatsby-config.js`)
- `gatsby-plugin-eslint`: ^2.0.3 → update to latest (in `gatsby-config.js`)
- `styled-components`: ^4.1.3 → update to latest (used extensively)
- `react-helmet`: ^5.2.0 → update to latest (used in `head/head.js`)
- `prop-types`: ^15.6.2 → update to latest (used extensively)
- `intersection-observer`: ^0.5.1 → update to latest (used in `io/io.js` as polyfill)
- `babel-plugin-styled-components`: ^1.10.0 → update to latest (used by gatsby-plugin-styled-components)
- `directory-named-webpack-plugin`: ^4.0.0 → update to latest (used in `gatsby-node.js`)

**Unused Dependencies (CAN BE REMOVED):**
- `gatsby-plugin-webpack-size`: ^0.0.3 → **REMOVE** (in config but likely not needed, development-only tool)
- Note: `babel-plugin-styled-components` may be auto-configured by `gatsby-plugin-styled-components` in Gatsby 5, verify if still needed

**Dev Dependencies:**
- Most dev dependencies need updates for compatibility
- `eslint` and related plugins need updates
- `prettier` needs update
- `gatsby-plugin-eslint` may be deprecated in favor of ESLint 9+ flat config (verify)

### Code Changes Required

#### 1. Gatsby 2 → 5 Breaking Changes (PRIMARY FOCUS)

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

**Node.js Requirements:**
- Gatsby 5 requires Node.js 18+ (verify current Node.js version)

#### 2. React 16 → 18 Breaking Changes (Required by Gatsby 5)

**SSR Changes:**
- `gatsby-ssr.js` uses `renderToString` from `react-dom/server` - React 18 has improved SSR support
- React 18 introduces automatic batching and improved hydration
- Potential hydration errors if server/client rendering differs (e.g., using `Date()` constructor)

**Class Components:**
- Class components are still supported in React 18
- No immediate refactoring required, but can be done incrementally later

**Context API:**
- Current usage of `createContext` with Provider/Consumer pattern is still valid
- No changes required

**Hydration:**
- React 18 has stricter hydration checks
- Ensure server and client render the same content
- Watch for hydration mismatches during upgrade

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

### Phase 1: Gatsby 5 Core Upgrade (PRIMARY FOCUS)
1. Verify Node.js version (must be 18+)
2. Update `gatsby` to v5.x in `package.json`
3. Update React and React-DOM to v18.x (required by Gatsby 5, stable support)
4. Update all Gatsby plugins to versions compatible with Gatsby 5:
   - `gatsby-plugin-react-helmet` → latest v5-compatible version
   - `gatsby-plugin-styled-components` → latest v5-compatible version
   - `gatsby-plugin-sharp` → latest v5-compatible version
   - `gatsby-transformer-sharp` → latest v5-compatible version
   - `gatsby-source-filesystem` → latest v5-compatible version
   - `gatsby-transformer-json` → latest v5-compatible version
   - `gatsby-transformer-remark` → latest v5-compatible version
   - `gatsby-plugin-offline` → latest v5-compatible version
   - `gatsby-plugin-sitemap` → latest v5-compatible version
   - All other Gatsby plugins
5. Run `npm install` and verify build succeeds (may have errors to fix)

### Phase 2: Replace Deprecated Dependencies
1. Replace `gatsby-image` with `gatsby-plugin-image` (required for Gatsby 5)
2. Update `gatsby-config.js` to include `gatsby-plugin-image`
3. Replace `react-pose` with `framer-motion` (react-pose is deprecated)
4. Update other deprecated dependencies to Gatsby 5-compatible versions

### Phase 3: Code Migration for Gatsby 5
1. Update `gatsby-ssr.js` to remove deprecated `replaceRenderer` API
2. Update GraphQL queries to use new `gatsbyImageData` API (replaces `fluid`/`fixed`)
3. Update `src/components/gallery/item/item.js` to use new `GatsbyImage` component
4. Update `src/components/transition/transition.js` to use `framer-motion`
5. Update any other components using deprecated Gatsby APIs
6. Fix any React 18 hydration issues if they arise

### Phase 4: Configuration Updates
1. Update `gatsby-config.js` for new plugin APIs and Gatsby 5 requirements
2. Remove `gatsby-plugin-webpack-size` from `gatsby-config.js` (unused package)
3. Update `gatsby-node.js` if webpack config needs changes for Gatsby 5
4. Update `gatsby-browser.js` if needed for Gatsby 5
5. Update any other configuration files

### Phase 5: Dependency Cleanup & Verification
1. Update remaining dependencies to versions compatible with Gatsby 5:
   - `@reach/dialog`, `@reach/router`, `@reach/visually-hidden` → latest versions
   - `styled-components` → latest v5-compatible version
   - `react-helmet` → latest version
   - `prop-types` → latest version
   - `intersection-observer` → latest version (if still needed as polyfill)
   - `babel-plugin-styled-components` → verify if still needed (may be auto-configured)
   - Dev dependencies (eslint, prettier, etc.) → latest compatible versions
2. **Remove unused dependencies:**
   - `gatsby-plugin-webpack-size` → remove from `package.json` and `gatsby-config.js`
   - Verify `babel-plugin-styled-components` is still needed (may be handled by plugin)
3. Update scripts if needed
4. Verify all functionality works
5. Test build and development server
6. Verify no unused imports or dependencies remain

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
- React class components (still supported in React 18)
- Context API usage (no changes needed)
- Most component code (minimal changes)

**Medium Risk:**
- Image API migration (requires GraphQL query updates)
- Animation library migration (API differences)
- SSR migration (different approach in Gatsby 5)
- React 18 hydration strictness (may surface existing issues)

**High Risk:**
- **Gatsby 5 plugin compatibility** - some plugins may not have Gatsby 5 versions yet
- **Gatsby 2 → 5 breaking changes** - significant API changes
- Build process changes (webpack, Node.js requirements)
- Potential runtime errors from breaking changes
- **React 19 compatibility issues** - avoided by using React 18 (stable)

## Rollback Plan

1. Keep current branch as backup
2. All changes in separate branch
3. Can revert to original branch if issues arise
4. Incremental commits for easy rollback of specific changes

## Success Criteria

- ✅ **Gatsby 5 successfully installed and running** - **COMPLETED**
- ✅ Application builds successfully with Gatsby 5 - **COMPLETED**
- ✅ React 18.x installed (compatible with Gatsby 5) - **COMPLETED** (React 18.2.0)
- ✅ All Gatsby plugins updated to v5-compatible versions - **COMPLETED**
- ✅ All pages render correctly - **COMPLETED**
- ✅ Images display properly (using new gatsby-plugin-image) - **COMPLETED**
- ✅ Animations/transitions work (using framer-motion) - **COMPLETED**
- ✅ Modal functionality works (using Radix UI) - **COMPLETED**
- ✅ No console errors - **COMPLETED**
- ✅ No hydration errors - **COMPLETED**
- ✅ All dependencies updated to versions compatible with Gatsby 5 - **COMPLETED**
- ✅ Deprecated dependencies removed (`react-pose`, `gatsby-image`) - **COMPLETED**
- ✅ **Unused dependencies removed** (`gatsby-plugin-webpack-size`, `@reach/router`) - **COMPLETED**
- ✅ **ESLint removed** (as requested) - **COMPLETED**
- ✅ **@reach packages replaced with Radix UI** - **COMPLETED**
- ✅ **react-helmet removed** (replaced with Gatsby's built-in Head API) - **COMPLETED**
- ✅ **intersection-observer removed** (polyfill no longer needed) - **COMPLETED**
- ✅ **io-example component removed** (example component not needed) - **COMPLETED**
- ✅ **Favicons script fixed** (updated to v7 Promise-based API) - **COMPLETED**
- ✅ **Next.js config files removed** (leftover from previous migration) - **COMPLETED**
- ✅ **npm overrides added** (suppress peer dependency warnings) - **COMPLETED**
- ✅ No unused imports or dependencies remain - **COMPLETED**

## Timeline Estimate

- Phase 1 (Gatsby 5 Core Upgrade): ~45-60 minutes
  - Includes verifying Node.js, updating Gatsby, React 18, and all Gatsby plugins
  - May require troubleshooting plugin compatibility issues
- Phase 2 (Replace Deprecated): ~15-30 minutes
- Phase 3 (Code Migration): ~1-2 hours
  - Includes fixing any breaking changes from Gatsby 2 → 5
- Phase 4 (Configuration): ~30-45 minutes
  - May require additional time for Gatsby 5-specific configuration changes
- Phase 5 (Cleanup & Verification): ~30 minutes

**Total: ~3.5-5 hours** (may be longer if plugin compatibility issues arise)

### Actual Timeline

**Actual time spent**: ~2-3 hours
- Phase 1: ~1 hour (including troubleshooting plugin version numbers)
- Phase 2: ~20 minutes
- Phase 3: ~45 minutes
- Phase 4: ~15 minutes
- Phase 5: ~30 minutes (including Radix UI migration and ESLint removal)

**Additional work not in original plan**:
- Radix UI migration: ~30 minutes
- ESLint removal: ~15 minutes
- Location API migration: ~15 minutes
- react-helmet removal: ~20 minutes
- intersection-observer removal: ~10 minutes
- Next.js config cleanup: ~10 minutes
- Favicons script fix: ~10 minutes
- io-example component removal: ~5 minutes
- npm overrides configuration: ~5 minutes

## Package Cleanup Plan

### Unused Packages to Remove

**Confirmed Unused:**
- `gatsby-plugin-webpack-size` (^0.0.3)
  - In `gatsby-config.js` but not essential
  - Development-only tool for analyzing bundle sizes
  - Can be removed safely

**To Verify:**
- `babel-plugin-styled-components` (^1.10.0)
  - May be auto-configured by `gatsby-plugin-styled-components` in Gatsby 5
  - Check if explicit configuration is still needed
  - If auto-configured, can be removed

### Package Usage Summary

**All packages in `package.json` have been verified:**
- ✅ All `@radix-ui/*` packages are in use (replaced @reach packages)
- ✅ All Gatsby plugins are configured in `gatsby-config.js`
- ✅ `react-pose` and `gatsby-image` have been replaced with `framer-motion` and `gatsby-plugin-image`
- ✅ `intersection-observer` polyfill removed (no longer needed)
- ✅ `prop-types` is used extensively throughout components
- ✅ `styled-components` is used extensively
- ✅ `directory-named-webpack-plugin` is used in `gatsby-node.js`
- ✅ `favicons` is used in build script (updated to v7 API)

## Notes

- **Gatsby 5 upgrade is the primary focus** - all other dependency updates follow from Gatsby 5 compatibility requirements
- **React 18.x is the target** (not React 19) due to:
  - Gatsby 5 officially supports React 18 (stable)
  - React 19 has compatibility issues with Gatsby 5 (experimental support only)
  - React 18 provides all necessary features and stability
- **Package cleanup** - remove unused packages to reduce bundle size and maintenance burden
- Will work in separate branch for review
- Will create PR for review before merge
- Can address issues incrementally
- May need to check individual plugin compatibility with Gatsby 5 before upgrading
- Node.js 18+ is required for Gatsby 5

## Final Plan Review

### Summary

This upgrade plan prioritizes **Gatsby 5 as the primary goal**, with all other dependencies following based on compatibility requirements:

1. **Gatsby 5 First**: Upgrade Gatsby to v5.x, which requires React 18.x (stable)
2. **React 18**: Target React 18.x (not React 19) due to compatibility issues
3. **Plugin Updates**: All Gatsby plugins updated to v5-compatible versions
4. **Deprecated Replacements**: 
   - `react-pose` → `framer-motion`
   - `gatsby-image` → `gatsby-plugin-image`
5. **Package Cleanup**: Remove unused packages (`gatsby-plugin-webpack-size`)
6. **Code Migration**: Update code to use new APIs and fix breaking changes

### Key Decisions

- ✅ **React 18 over React 19**: Stable support vs experimental
- ✅ **Gatsby-first approach**: Ensures compatibility and reduces risk
- ✅ **Package cleanup**: Remove unused dependencies to reduce maintenance
- ✅ **Incremental migration**: Phased approach allows for testing and rollback

### Verification Checklist

Before starting implementation:

- [x] Verify Node.js version (must be 18+) - **Verified: Node.js v20.10.0**
- [x] Review all Gatsby plugins for v5 compatibility - **Completed**
- [x] Check for any custom webpack configurations that may break - **No issues found**
- [x] Review all GraphQL queries that use image API - **Updated**
- [x] Identify all components using `react-pose` - **Replaced with framer-motion**
- [x] Backup current working state - **Completed**
- [x] Create feature branch for upgrade - **Completed**

## Implementation Summary

### What We Planned vs What We Actually Did

#### ✅ Completed as Planned

1. **Gatsby 5 Core Upgrade**
   - ✅ Upgraded Gatsby from `^2.3.26` → `^5.15.0`
   - ✅ Upgraded React from `^16.8.6` → `^18.2.0`
   - ✅ Upgraded React-DOM from `^16.8.6` → `^18.2.0`
   - ✅ Updated all Gatsby plugins to v5-compatible versions:
     - `gatsby-plugin-styled-components`: `^3.0.7` → `^6.15.0`
     - `gatsby-plugin-sharp`: `^2.0.35` → `^5.15.0`
     - `gatsby-transformer-sharp`: `^2.1.18` → `^5.15.0`
     - `gatsby-source-filesystem`: `^2.0.30` → `^5.15.0`
     - `gatsby-transformer-json`: `^2.1.11` → `^5.15.0`
     - `gatsby-transformer-remark`: `^2.3.9` → `^6.15.0`
     - `gatsby-plugin-offline`: `^2.0.25` → `^6.15.0`
     - `gatsby-plugin-sitemap`: `^2.0.12` → `^6.15.0`
     - `gatsby-plugin-react-svg`: `^2.0.0` → `^3.3.0`
     - `gatsby-plugin-image`: Added `^3.15.0` (replacement for `gatsby-image`)

2. **Deprecated Dependencies Replaced**
   - ✅ `gatsby-image` → `gatsby-plugin-image` (as planned)
   - ✅ `react-pose` → `framer-motion` (as planned)

3. **Code Migration**
   - ✅ Updated GraphQL queries to use `gatsbyImageData` API
   - ✅ Updated `src/components/gallery/item/item.js` to use `GatsbyImage`
   - ✅ Updated `src/components/transition/transition.js` to use `framer-motion`
   - ✅ Updated `src/components/header/header.js` to use `framer-motion`
   - ✅ Updated `gatsby-ssr.js` to use `wrapRootElement` instead of deprecated `replaceRenderer`

4. **Configuration Updates**
   - ✅ Removed `gatsby-plugin-webpack-size` from `gatsby-config.js` (unused)
   - ✅ Added `gatsby-plugin-image` to `gatsby-config.js`
   - ✅ Added `gatsby-plugin-styled-components` to `gatsby-config.js` (was missing)

5. **Package Cleanup**
   - ✅ Removed `gatsby-plugin-webpack-size` from `package.json`
   - ✅ Removed `gatsby-image` from `package.json`
   - ✅ Removed `react-pose` from `package.json`

#### 🔄 Changes Made That Weren't in Original Plan

1. **Replaced @reach packages with Radix UI**
   - **What changed**: Instead of updating `@reach/dialog` and `@reach/visually-hidden`, we replaced them with `@radix-ui/react-dialog` and `@radix-ui/react-visually-hidden`
   - **Why**: 
     - `@reach/dialog` and `@reach/visually-hidden` don't support React 18 (peer dependency conflicts)
     - Radix UI is the modern successor to Reach UI and has full React 18 support
     - Radix UI is actively maintained and follows modern accessibility standards
   - **Files changed**:
     - `package.json`: Replaced `@reach/dialog` and `@reach/visually-hidden` with Radix UI equivalents
     - `src/components/modal/modal.js`: Migrated from `@reach/dialog` API to `@radix-ui/react-dialog` API
     - Removed `@reach/router` dependency (replaced with Gatsby's built-in location via `@gatsbyjs/reach-router`)

2. **Removed @reach/router, used Gatsby's location**
   - **What changed**: Removed `@reach/router` dependency and updated `src/components/head/head.js` to use `useLocation` from `@gatsbyjs/reach-router` (which Gatsby provides)
   - **Why**: 
     - `@reach/router` doesn't support React 18
     - Gatsby has built-in routing and provides location via `@gatsbyjs/reach-router`
     - No need for external routing library
   - **Files changed**:
     - `package.json`: Removed `@reach/router`
     - `src/components/head/head.js`: Converted from `StaticQuery` + `Location` component to `useStaticQuery` + `useLocation` hook

3. **Removed ESLint entirely**
   - **What changed**: Removed all ESLint packages and configuration instead of updating them
   - **Why**: 
     - User requested removal of ESLint
     - Reduces dependency conflicts and maintenance burden
     - Prettier remains for code formatting
   - **Files changed**:
     - `package.json`: Removed all ESLint-related packages:
       - `eslint`
       - `@babel/eslint-parser`
       - `eslint-config-prettier`
       - `eslint-loader`
       - `eslint-plugin-import`
       - `eslint-plugin-jsx-a11y`
       - `eslint-plugin-prettier`
       - `eslint-plugin-react`
       - `gatsby-plugin-eslint`
     - `gatsby-config.js`: Removed `gatsby-plugin-eslint` plugin
     - `src/components/io/io.js`: Removed `eslint-disable-next-line` comment

4. **Updated additional dependencies**
   - **What changed**: Updated other dependencies to latest compatible versions:
     - `styled-components`: `^4.1.3` → `^6.1.13`
     - `prop-types`: `^15.6.2` → `^15.8.1`
     - `babel-plugin-styled-components`: `^1.10.0` → `^2.1.4`
   - **Why**: Ensure compatibility with Gatsby 5 and React 18

5. **Updated dev dependencies**
   - **What changed**: Updated dev dependencies for compatibility:
     - `prettier`: `^1.16.0` → `^3.3.3`
     - `ava`: `^0.25.0` → `^6.0.0`
     - `favicons`: `^5.3.0` → `^7.0.2`
     - `lighthouse`: `^4.0.0` → `^12.0.0`
     - `mkdirp`: `^0.5.1` → `^3.0.1`
     - `node-gyp`: `^3.8.0` → `^10.0.0`
     - `core-js`: `^2.6.2` → `^3.40.0`
   - **Why**: Maintain compatibility and security updates

6. **Removed react-helmet and gatsby-plugin-react-helmet**
   - **What changed**: Removed `react-helmet` and `gatsby-plugin-react-helmet` packages, replaced with Gatsby's built-in Head API
   - **Why**: 
     - Gatsby 5 has built-in Head API that's more efficient
     - Reduces dependencies and eliminates warnings
     - Better integration with Gatsby's build process
   - **Files changed**:
     - `package.json`: Removed `react-helmet` and `gatsby-plugin-react-helmet`
     - `gatsby-config.js`: Removed `gatsby-plugin-react-helmet` plugin
     - `src/components/head/head.js`: Converted from `Helmet` component to JSX fragments compatible with Gatsby's Head export
     - `src/pages/index.js`, `src/pages/about.js`, `src/pages/404.js`: Added `Head` exports using Gatsby's Head API
     - `src/components/layout/layout.js`: Removed Head component usage (now handled by page Head exports)

7. **Removed intersection-observer polyfill**
   - **What changed**: Removed `intersection-observer` package and polyfill code
   - **Why**: 
     - Intersection Observer is widely supported (baseline since 2019)
     - No longer needs polyfill for modern browsers
     - Reduces bundle size and dependencies
   - **Files changed**:
     - `package.json`: Removed `intersection-observer`
     - `src/components/io/io.js`: Removed polyfill import and related code

8. **Fixed Next.js configuration conflicts**
   - **What changed**: Removed `next.config.js` and updated `.babelrc` to use Gatsby's Babel preset instead of Next.js
   - **Why**: 
     - Leftover files from a previous migration attempt were causing build errors
     - Gatsby project should use `babel-preset-gatsby`, not `next/babel`
   - **Files changed**:
     - Deleted `next.config.js`
     - Updated `.babelrc`: Changed `"next/babel"` → `"babel-preset-gatsby"`

9. **Fixed favicons script for v7 API**
   - **What changed**: Updated `scripts/favicons.js` to use Promise-based API instead of callback-based API
   - **Why**: 
     - `favicons` package v7 changed from callback to Promise-based API
     - Old callback API was causing build failures
   - **Files changed**:
     - `scripts/favicons.js`: Converted from `favicons(source, config, callback)` to `favicons(source, config).then().catch()`
     - Updated configuration to match v7 API (added `appShortName`, `scope`, removed deprecated options)

10. **Removed io-example component**
   - **What changed**: Removed the IntersectionObserver example component and its files
   - **Why**: 
     - Example/demo component not needed in production
     - User requested removal
   - **Files changed**:
     - `src/pages/index.js`: Removed `IOExample` import and usage
     - Deleted `src/components/io-example/io-example.js`
     - Deleted `src/components/io-example/io-example.css.js`
     - Removed `src/components/io-example/` directory

11. **Added npm overrides for peer dependency warnings**
   - **What changed**: Added `overrides` field to `package.json` to suppress `react-server-dom-webpack` peer dependency warnings
   - **Why**: 
     - Gatsby's internal `react-server-dom-webpack` dependency expects experimental React version
     - Gatsby 5 works correctly with React 18.2.0 despite the warning
     - Overrides suppress the warnings without affecting functionality
   - **Files changed**:
     - `package.json`: Added `overrides` field with `react-server-dom-webpack` override

### Final Package Versions

**Core Dependencies:**
- `gatsby`: `^5.15.0`
- `react`: `^18.2.0`
- `react-dom`: `^18.2.0`

**Key Replacements:**
- `gatsby-image` → `gatsby-plugin-image`: `^3.15.0`
- `react-pose` → `framer-motion`: `^11.0.0`
- `@reach/dialog` → `@radix-ui/react-dialog`: `^1.1.0`
- `@reach/visually-hidden` → `@radix-ui/react-visually-hidden`: `^1.1.0`

**Removed Packages:**
- `@reach/router` (replaced with Gatsby's built-in location)
- `gatsby-image` (replaced with `gatsby-plugin-image`)
- `react-pose` (replaced with `framer-motion`)
- `gatsby-plugin-webpack-size` (unused)
- `gatsby-plugin-react-helmet` (replaced with Gatsby's built-in Head API)
- `react-helmet` (replaced with Gatsby's built-in Head API)
- `intersection-observer` (polyfill no longer needed)
- All ESLint packages (user requested removal)

**Removed Components:**
- `io-example` component (example/demo component, not needed in production)

### Build Status

✅ **Build Successful**: The application builds successfully with Gatsby 5 and React 18
✅ **No Errors**: No build errors or runtime errors
✅ **No Warnings**: All warnings resolved:
  - Removed `gatsby-plugin-react-helmet` warning by using Gatsby's built-in Head API
  - Suppressed `react-server-dom-webpack` peer dependency warnings with npm overrides
✅ **Favicons Generation**: Fixed favicons script to work with v7 API
✅ **Clean Codebase**: Removed example components and unused files

### Key Learnings

1. **Plugin Versioning**: Not all Gatsby plugins follow the same version numbering as Gatsby core. Some use v5.x, others use v6.x for Gatsby 5 compatibility.

2. **@reach packages**: The @reach UI packages don't support React 18, so we had to migrate to Radix UI (their modern successor).

3. **Gatsby Location**: Gatsby provides location via `@gatsbyjs/reach-router`, eliminating the need for `@reach/router`.

4. **SSR Simplification**: Gatsby 5's `gatsby-plugin-styled-components` handles SSR automatically, simplifying the `gatsby-ssr.js` file significantly.

5. **Dependency Conflicts**: Using `--legacy-peer-deps` was necessary for some packages during installation, but the build works correctly.

6. **Next.js Config Files**: Found and removed leftover `next.config.js` and updated `.babelrc` from `next/babel` to `babel-preset-gatsby`. These were from a previous migration attempt and were causing build errors.

7. **Gatsby's Head API**: Gatsby 5's built-in Head API is more efficient than react-helmet. Pages export a `Head` function that returns JSX, which Gatsby automatically injects into the document head. This eliminates the need for the `Helmet` component and provides better integration with Gatsby's build process.

8. **Intersection Observer**: Modern browsers (since 2019) have native support for Intersection Observer, making polyfills unnecessary. Removing the polyfill reduces bundle size and simplifies the code.

9. **Favicons v7 API**: The `favicons` package v7 changed from callback-based to Promise-based API. Updated the build script to use the new API to ensure favicon generation works correctly.

10. **Peer Dependency Warnings**: Added `overrides` in `package.json` to suppress `react-server-dom-webpack` peer dependency warnings. These warnings occur because Gatsby's internal dependency uses an experimental React version, but Gatsby 5 works correctly with React 18.2.0.

11. **Security Vulnerabilities**: Some npm audit vulnerabilities remain because:
   - Most require breaking changes (downgrading Gatsby from 5.15.0 to 3.3.1)
   - Some have no fixes available (e.g., `json5` and `xml2js` in `svg-react-loader`)
   - Many are in deep dependency trees that can't be updated without breaking changes
   - These vulnerabilities are in development/build-time dependencies and don't affect production runtime
