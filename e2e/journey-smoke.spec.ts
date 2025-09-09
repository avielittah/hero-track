import { test, expect } from '@playwright/test';

test.describe('Learning Journey Smoke Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    
    // Clear any existing data
    await page.evaluate(() => {
      localStorage.clear();
    });
    
    await page.reload();
  });

  test('complete a unit and see XP increase', async ({ page }) => {
    // Wait for the page to load
    await expect(page.locator('[data-testid="stage-header"]')).toBeVisible();
    
    // Check initial XP
    const initialXP = await page.locator('[data-testid="xp-display"]').textContent();
    expect(initialXP).toContain('75'); // Initial XP
    
    // Find and complete a unit
    const firstUnit = page.locator('[data-testid="unit-card"]').first();
    await firstUnit.click();
    
    // Look for task completion UI
    const taskSection = page.locator('[data-testid="unit-task"]');
    await expect(taskSection).toBeVisible();
    
    // Complete the task based on type
    const multipleChoice = page.locator('input[type="checkbox"]').first();
    if (await multipleChoice.isVisible()) {
      await multipleChoice.check();
    }
    
    const openQuestion = page.locator('textarea');
    if (await openQuestion.isVisible()) {
      await openQuestion.fill('This is my test response for the open question.');
    }
    
    // Submit the unit
    const submitButton = page.locator('button:has-text("Submit"), button:has-text("Complete")');
    await submitButton.click();
    
    // Wait for success feedback
    await expect(page.locator('text=/completed|success/i')).toBeVisible();
    
    // Check that XP has increased
    const newXP = await page.locator('[data-testid="xp-display"]').textContent();
    expect(newXP).not.toBe(initialXP);
  });

  test('unit locks after submission', async ({ page }) => {
    // Complete a unit first
    await page.locator('[data-testid="unit-card"]').first().click();
    
    // Complete the task
    const multipleChoice = page.locator('input[type="checkbox"]').first();
    if (await multipleChoice.isVisible()) {
      await multipleChoice.check();
    }
    
    const openQuestion = page.locator('textarea');
    if (await openQuestion.isVisible()) {
      await openQuestion.fill('Test response');
    }
    
    // Submit
    await page.locator('button:has-text("Submit"), button:has-text("Complete")').click();
    
    // Wait for completion
    await expect(page.locator('text=/completed|success/i')).toBeVisible();
    
    // Go back to unit list
    await page.locator('button:has-text("Back"), button:has-text("Close")').click();
    
    // Check that the unit is now marked as completed and locked
    const completedUnit = page.locator('[data-testid="unit-card"]').first();
    await expect(completedUnit).toContainText(/completed|✓/i);
    
    // Try to click on it - should not allow editing
    await completedUnit.click();
    
    // Should show read-only view or completion status
    await expect(page.locator('text=/read.?only|completed|view/i')).toBeVisible();
  });

  test('preview mode works correctly', async ({ page }) => {
    // First, complete stage 1 to enable preview
    await page.locator('[data-testid="stage-header"]').waitFor();
    
    // Complete all units in stage 1
    const units = page.locator('[data-testid="unit-card"]');
    const unitCount = await units.count();
    
    for (let i = 0; i < unitCount; i++) {
      await units.nth(i).click();
      
      // Complete the task
      const multipleChoice = page.locator('input[type="checkbox"]').first();
      if (await multipleChoice.isVisible()) {
        await multipleChoice.check();
      }
      
      const openQuestion = page.locator('textarea');
      if (await openQuestion.isVisible()) {
        await openQuestion.fill('Test response');
      }
      
      const checkbox = page.locator('input[type="checkbox"]:not([data-testid])');
      if (await checkbox.isVisible()) {
        await checkbox.check();
      }
      
      // Submit
      await page.locator('button:has-text("Submit"), button:has-text("Complete")').click();
      await page.waitForTimeout(500);
      
      // Go back to unit list
      const backButton = page.locator('button:has-text("Back"), button:has-text("Close")');
      if (await backButton.isVisible()) {
        await backButton.click();
      }
    }
    
    // Mark stage complete
    const completeButton = page.locator('button:has-text("Mark Stage Complete")');
    if (await completeButton.isVisible()) {
      await completeButton.click();
      
      // Handle completion modal
      await page.locator('button:has-text("Continue")').click();
    }
    
    // Now try to preview previous stage
    const stageNav = page.locator('[data-testid="stage-navigation"]');
    if (await stageNav.isVisible()) {
      await page.locator('button:has-text("Stage 1"), text=/stage.?1/i').click();
    }
    
    // Should be in preview mode
    await expect(page.locator('text=/preview|read.?only/i')).toBeVisible();
    
    // Should not be able to edit
    const editButton = page.locator('button:has-text("Edit"), button:has-text("Submit")');
    await expect(editButton).not.toBeVisible();
  });

  test('cannot skip more than one stage ahead', async ({ page }) => {
    // Try to navigate directly to stage 3
    const url = page.url();
    
    // If there's stage navigation, try to click stage 3
    const stage3Button = page.locator('button:has-text("Stage 3"), text=/stage.?3/i');
    if (await stage3Button.isVisible()) {
      await stage3Button.click();
      
      // Should either stay on current stage or show error
      await expect(page.locator('text=/stage.?1|current/i')).toBeVisible();
    }
    
    // Try URL manipulation if applicable
    await page.goto(url.replace(/\/$/, '') + '?stage=3');
    
    // Should redirect back to current stage or show appropriate state
    await expect(page.locator('[data-testid="stage-header"]')).toBeVisible();
    
    // Verify we're not on stage 3 content
    await expect(page.locator('text=/stage.?1|welcome/i')).toBeVisible();
  });

  test('stage progress indicator updates correctly', async ({ page }) => {
    // Check initial progress
    const progressIndicator = page.locator('[data-testid="journey-progress"], [data-testid="stage-progress"]');
    await expect(progressIndicator).toBeVisible();
    
    // Should show stage 1 as current
    await expect(page.locator('text=/stage.?1.*current|current.*stage/i')).toBeVisible();
    
    // Complete a unit and check progress
    await page.locator('[data-testid="unit-card"]').first().click();
    
    const multipleChoice = page.locator('input[type="checkbox"]').first();
    if (await multipleChoice.isVisible()) {
      await multipleChoice.check();
    }
    
    const openQuestion = page.locator('textarea');
    if (await openQuestion.isVisible()) {
      await openQuestion.fill('Test response');
    }
    
    await page.locator('button:has-text("Submit"), button:has-text("Complete")').click();
    
    // Progress should update
    await expect(page.locator('text=/progress|completed/i')).toBeVisible();
  });

  test('level progression works correctly', async ({ page }) => {
    // Check initial level
    const levelDisplay = page.locator('[data-testid="level-display"]');
    await expect(levelDisplay).toContainText(/rookie|explorer/i);
    
    // Complete multiple units to gain XP
    const units = page.locator('[data-testid="unit-card"]');
    const unitCount = Math.min(await units.count(), 3); // Complete up to 3 units
    
    for (let i = 0; i < unitCount; i++) {
      await units.nth(i).click();
      
      // Complete the task
      const multipleChoice = page.locator('input[type="checkbox"]').first();
      if (await multipleChoice.isVisible()) {
        await multipleChoice.check();
      }
      
      const openQuestion = page.locator('textarea');
      if (await openQuestion.isVisible()) {
        await openQuestion.fill('Test response');
      }
      
      const checkbox = page.locator('input[type="checkbox"]:not([data-testid])');
      if (await checkbox.isVisible()) {
        await checkbox.check();
      }
      
      await page.locator('button:has-text("Submit"), button:has-text("Complete")').click();
      await page.waitForTimeout(500);
      
      const backButton = page.locator('button:has-text("Back"), button:has-text("Close")');
      if (await backButton.isVisible()) {
        await backButton.click();
      }
    }
    
    // Check if level has progressed or XP has increased
    const xpDisplay = page.locator('[data-testid="xp-display"]');
    const currentXP = await xpDisplay.textContent();
    
    // XP should be higher than initial 75
    expect(currentXP).toMatch(/\d+/);
    const xpNumber = parseInt(currentXP?.match(/\d+/)?.[0] || '0');
    expect(xpNumber).toBeGreaterThan(75);
  });

  test('buddy button is accessible and functional', async ({ page }) => {
    // Check that buddy button is visible
    const buddyButton = page.locator('[data-testid="buddy-button"], button:has-text("Ask Buddy")');
    await expect(buddyButton).toBeVisible();
    
    // Click buddy button
    await buddyButton.click();
    
    // Should open external link or show functionality
    // Since it opens in new window, we check for new window/popup or URL change
    const popup = page.waitForEvent('popup', { timeout: 5000 }).catch(() => null);
    if (await popup) {
      const newPage = await popup;
      expect(newPage.url()).toBeTruthy();
    }
  });

  test('support button and report issue modal work', async ({ page }) => {
    // Find and click support button in top bar
    const supportButton = page.locator('button:has-text("Support"), [data-testid="support-button"]');
    
    // If support is in a menu, open the menu first
    const menuButton = page.locator('[data-testid="menu-button"], button[aria-haspopup="menu"]');
    if (await menuButton.isVisible()) {
      await menuButton.click();
    }
    
    await expect(supportButton).toBeVisible();
    await supportButton.click();
    
    // Report issue modal should open
    await expect(page.locator('text=/report.*issue|issue.*report/i')).toBeVisible();
    
    // Fill out the form
    const descriptionField = page.locator('textarea, input[type="text"]').first();
    await descriptionField.fill('This is a test issue report for e2e testing');
    
    // Submit the report
    const submitButton = page.locator('button:has-text("Submit"), button:has-text("Send")');
    await submitButton.click();
    
    // Should show success message
    await expect(page.locator('text=/success|submitted|sent/i')).toBeVisible();
  });
});