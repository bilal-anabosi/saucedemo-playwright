# 🧪 SauceDemo Playwright Testing Framework

This repository contains an end-to-end testing framework built using **Playwright** and **TypeScript** for automated testing of the [SauceDemo website](https://www.saucedemo.com/).

## 📋 Features Tested

- ✅ **Login**
- 🛒 **Add to Cart**
- ➖ **Remove from Cart**
- 💳 **Checkout**
- 🔃 **Sorting Products**
  - A-Z
  - Price (High to Low)

## 🧱 Framework Structure

The framework uses modern Playwright features:
- **Page Object Model (POM)** for clean test architecture
- **Parameterized configuration** via `.env`
- **Playwright Test Hooks** (beforeAll, beforeEach, etc.)
- **Browser cross-testing** (Chromium + Firefox or WebKit)
- **Screenshots on failure or as needed**
- **Test grouping by feature**

## .env
Create a .env file in the root with your credentials:
BASE_URL=https://www.saucedemo.com
STANDARD_USER=standard_user
LOCKED_OUT_USER=locked_out_user
PASSWORD=secret_sauce
TEST_ENV=qa

## 🧪 Test Report

Here is a sample screenshot from the test run:

![Test Report Screenshot](./screenshots/report-example.png)
