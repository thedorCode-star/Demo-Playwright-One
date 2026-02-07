# Test Result Collection and Reporting

This document explains how Playwright test results are collected and reported back to your team when integrated with GitHub Actions CI.

---

## 1. How Results Are Collected

### During the Test Run

- **Playwright** executes tests in headless Chromium and records:
  - **Pass/fail status** for each test
  - **Trace files** (on first retry or failure) for debugging
  - **Screenshots** (only on failure)
  - **Videos** (retained on failure)

### Reporters Used

| Reporter | Output | Purpose |
|----------|--------|---------|
| `list` | Console | Live summary in the workflow log |
| `github` | GitHub Actions annotations | Inline failure messages in the PR |
| `html` | `playwright-report/` | Interactive HTML report |
| `junit` | `test-results/junit.xml` | Machine-readable results for dashboards |

---

## 2. How Results Are Reported to the Team

### In the Pull Request

1. **Workflow status**  
   The check appears in the PR: ✅ green if all tests pass, ❌ red if any fail.

2. **GitHub Actions annotations**  
   Failed tests show file/line links and error messages directly in the "Files changed" or "Checks" tab.

3. **Artifacts**  
   After each run, two artifacts are uploaded:
   - **playwright-report** — Download and open `index.html` to see the full report, traces, screenshots, and videos.
   - **test-results** — Contains JUnit XML and raw Playwright output for other tools.

### Accessing the HTML Report

1. Open the workflow run → **Summary** tab.
2. Find the **Artifacts** section.
3. Download **playwright-report**.
4. Unzip and open `index.html` in a browser to view pass/fail, traces, and screenshots.

---

## 3. Best Practices for Teams

- **Check PR status before merging** — Block merging if the check fails.
- **Use Branch Protection** — Require the Playwright workflow to pass before merging.
- **Review artifacts** — Use the HTML report for failures; traces help debug flaky tests.
- **Retention** — Reports are kept for 7 days; extend if needed for compliance.

---

## 4. Quick Reference: Demo Credentials

For manual or automated testing:

| Scenario | Username | Password |
|----------|----------|----------|
| Valid login | `testuser` | `Test123!` |
| Invalid login | Any other | Any other |
| Locked account | `locked` | `Locked123!` |
