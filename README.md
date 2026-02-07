# Login E2E Test Example

A professional end-to-end testing setup for a Node.js login page using **Playwright** and **GitHub Actions** CI.

## Quick Start

```bash
# Install dependencies
npm install

# Install Playwright browsers (required once)
npx playwright install chromium

# Run tests (starts the server automatically)
npm test
```

## Project Structure

```
example-case/
├── server.js              # Express server (login, logout, registration)
├── public/
│   ├── login.html         # Login page
│   ├── register.html      # Registration page
│   └── dashboard.html     # Post-login dashboard
├── tests/
│   ├── login.spec.js      # Login E2E tests
│   ├── logout.spec.js     # Logout E2E tests
│   └── registration.spec.js  # Registration E2E tests
├── playwright.config.js   # Playwright configuration
├── .github/workflows/
│   └── playwright.yml     # GitHub Actions CI
└── TEST-REPORTING.md      # How results are collected & reported
```

## Test Scenarios

### Login
| Test | Flow | Expected |
|------|------|----------|
| Valid login | `testuser` / `Test123!` | Redirect to dashboard |
| Invalid login | Wrong credentials | Error message |
| Empty credentials | Submit empty form | Validation |
| Locked account | `locked` / `Locked123!` | Account locked message |

### Logout
| Test | Flow | Expected |
|------|------|----------|
| Sign out | Click Sign out from dashboard | Redirect to login |
| Re-login | Logout then login again | Success |

### Registration
| Test | Flow | Expected |
|------|------|----------|
| Valid registration | New username, email, password | Redirect to login |
| Duplicate username | Use existing username | Error message |
| Passwords mismatch | Different password/confirm | Error message |
| Short password | &lt; 6 characters | Error message |

## CI Pipeline

The workflow runs on **pull requests** to `main` or `master`:

1. Checks out code
2. Installs Node.js and dependencies
3. Runs Playwright tests
4. Uploads HTML report and test results as artifacts

See [TEST-REPORTING.md](./TEST-REPORTING.md) for details on how results are reported to the team.

## Useful Commands

```bash
npm test              # Run tests (headless)
npm run test:ui       # Run with Playwright UI
npm run test:headed   # Run with visible browser
npm start             # Start server only (for manual testing)
```

<!-- Small comment: Safe for PR review, just updating docs. -->
We are just updating to test the CI
## Update
## Again
