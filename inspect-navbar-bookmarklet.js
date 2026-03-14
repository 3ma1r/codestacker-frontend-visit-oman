// Copy this entire code and paste it into the browser console on http://localhost:3000
// Or create a bookmarklet with: javascript:(function(){...paste code here...})();

(function() {
    console.clear();
    console.log('%c=== NAVBAR POSITION INSPECTOR ===', 'color: #4ec9b0; font-size: 16px; font-weight: bold;');
    
    // Find the header element
    const header = document.querySelector('header');
    
    if (!header) {
        console.error('❌ No header element found on the page');
        return;
    }
    
    console.log('%c✅ Header element found:', 'color: #4ec9b0; font-weight: bold;', header);
    
    // Get computed styles
    const computedStyle = window.getComputedStyle(header);
    const rect = header.getBoundingClientRect();
    
    console.log('%c\n📊 HEADER COMPUTED STYLES:', 'color: #9cdcfe; font-size: 14px; font-weight: bold;');
    console.log('  position:', computedStyle.position);
    console.log('  top:', computedStyle.top);
    console.log('  left:', computedStyle.left);
    console.log('  right:', computedStyle.right);
    console.log('  z-index:', computedStyle.zIndex);
    console.log('  transform:', computedStyle.transform);
    
    console.log('%c\n📐 BOUNDING RECT:', 'color: #9cdcfe; font-size: 14px; font-weight: bold;');
    console.log('  top:', rect.top + 'px');
    console.log('  left:', rect.left + 'px');
    console.log('  width:', rect.width + 'px');
    console.log('  height:', rect.height + 'px');
    
    // Check all parent elements
    console.log('%c\n🔍 CHECKING PARENT ELEMENTS FOR CULPRITS:', 'color: #ce9178; font-size: 14px; font-weight: bold;');
    
    let parent = header.parentElement;
    let level = 1;
    const culprits = [];
    
    while (parent && parent !== document.documentElement) {
        const parentStyle = window.getComputedStyle(parent);
        const hasTransform = parentStyle.transform !== 'none';
        const hasOverflow = parentStyle.overflow !== 'visible' || 
                           parentStyle.overflowX !== 'visible' || 
                           parentStyle.overflowY !== 'visible';
        const hasWillChange = parentStyle.willChange !== 'auto';
        const hasFilter = parentStyle.filter !== 'none';
        const hasPerspective = parentStyle.perspective !== 'none';
        const hasContain = parentStyle.contain !== 'none';
        
        const isCulprit = hasTransform || hasOverflow || hasWillChange || hasFilter || hasPerspective || hasContain;
        
        if (isCulprit) {
            const culpritInfo = {
                element: parent,
                level,
                tag: parent.tagName.toLowerCase(),
                classes: parent.className,
                id: parent.id,
                position: parentStyle.position,
                issues: []
            };
            
            if (hasTransform) {
                culpritInfo.issues.push({
                    property: 'transform',
                    value: parentStyle.transform,
                    impact: 'Creates a new containing block for fixed elements'
                });
            }
            if (hasOverflow) {
                culpritInfo.issues.push({
                    property: 'overflow',
                    value: `overflow: ${parentStyle.overflow}, overflow-x: ${parentStyle.overflowX}, overflow-y: ${parentStyle.overflowY}`,
                    impact: 'Creates a new containing block for fixed elements'
                });
            }
            if (hasWillChange) {
                culpritInfo.issues.push({
                    property: 'will-change',
                    value: parentStyle.willChange,
                    impact: 'May create a new stacking context'
                });
            }
            if (hasFilter) {
                culpritInfo.issues.push({
                    property: 'filter',
                    value: parentStyle.filter,
                    impact: 'Creates a new containing block for fixed elements'
                });
            }
            if (hasPerspective) {
                culpritInfo.issues.push({
                    property: 'perspective',
                    value: parentStyle.perspective,
                    impact: 'Creates a new containing block for fixed elements'
                });
            }
            if (hasContain) {
                culpritInfo.issues.push({
                    property: 'contain',
                    value: parentStyle.contain,
                    impact: 'May affect positioning context'
                });
            }
            
            culprits.push(culpritInfo);
        }
        
        parent = parent.parentElement;
        level++;
    }
    
    if (culprits.length > 0) {
        console.log('%c\n⚠️  CULPRITS FOUND!', 'color: #f48771; font-size: 16px; font-weight: bold;');
        console.log('%cThe following parent elements are affecting the fixed positioning:', 'color: #f48771;');
        
        culprits.forEach((culprit, index) => {
            console.log(`\n%c🔴 Culprit #${index + 1} (Parent Level ${culprit.level}):`, 'color: #f48771; font-weight: bold;');
            console.log('  Element:', culprit.element);
            console.log('  Tag:', `<${culprit.tag}>`);
            if (culprit.id) console.log('  ID:', culprit.id);
            if (culprit.classes) console.log('  Classes:', culprit.classes);
            console.log('  Position:', culprit.position);
            
            console.log('%c  Issues:', 'color: #f48771; font-weight: bold;');
            culprit.issues.forEach(issue => {
                console.log(`    • ${issue.property}: ${issue.value}`);
                console.log(`      Impact: ${issue.impact}`);
            });
        });
        
        console.log('%c\n💡 SUGGESTED FIXES:', 'color: #4ec9b0; font-size: 16px; font-weight: bold;');
        culprits.forEach((culprit) => {
            const selector = culprit.id 
                ? `#${culprit.id}` 
                : culprit.classes 
                    ? `.${culprit.classes.split(' ').filter(c => c).join('.')}` 
                    : culprit.tag;
            
            console.log(`\n%cFor element: ${selector}`, 'color: #4ec9b0; font-weight: bold;');
            
            culprit.issues.forEach(issue => {
                if (issue.property === 'transform') {
                    console.log(`  1. Remove the transform property`);
                    console.log(`  2. Or move the fixed header outside this element`);
                    console.log(`  3. Or change header position from 'fixed' to 'sticky'`);
                }
                if (issue.property === 'overflow') {
                    console.log(`  1. Change overflow to 'visible'`);
                    console.log(`  2. Or move the fixed header outside this element`);
                }
                if (issue.property === 'filter') {
                    console.log(`  1. Remove the filter property`);
                    console.log(`  2. Or move the fixed header outside this element`);
                }
                if (issue.property === 'will-change') {
                    console.log(`  1. Remove will-change or set it to 'auto'`);
                }
                if (issue.property === 'perspective') {
                    console.log(`  1. Remove the perspective property`);
                    console.log(`  2. Or move the fixed header outside this element`);
                }
            });
        });
        
        // Create visual overlay
        console.log('%c\n📍 Creating visual overlay on culprits...', 'color: #ce9178;');
        culprits.forEach((culprit, index) => {
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border: 3px solid red;
                pointer-events: none;
                z-index: 999999;
                background: rgba(255, 0, 0, 0.1);
            `;
            
            const label = document.createElement('div');
            label.textContent = `Culprit #${index + 1}: ${culprit.tag}`;
            label.style.cssText = `
                position: absolute;
                top: 5px;
                left: 5px;
                background: red;
                color: white;
                padding: 4px 8px;
                font-size: 12px;
                font-family: monospace;
                border-radius: 3px;
                z-index: 1000000;
            `;
            
            culprit.element.style.position = 'relative';
            culprit.element.appendChild(overlay);
            culprit.element.appendChild(label);
            
            setTimeout(() => {
                overlay.remove();
                label.remove();
            }, 5000);
        });
        
    } else {
        console.log('%c\n✅ NO CULPRITS FOUND', 'color: #4ec9b0; font-size: 16px; font-weight: bold;');
        console.log('No parent elements with transform, overflow, filter, or other properties that would affect fixed positioning.');
        console.log('The header should be positioning correctly relative to the viewport.');
    }
    
    console.log('%c\n=== INSPECTION COMPLETE ===', 'color: #4ec9b0; font-size: 16px; font-weight: bold;');
    
    return {
        header,
        computedStyle: {
            position: computedStyle.position,
            top: computedStyle.top,
            left: computedStyle.left,
            right: computedStyle.right,
            zIndex: computedStyle.zIndex,
            transform: computedStyle.transform
        },
        rect: {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height
        },
        culprits
    };
})();
