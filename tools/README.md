# QA & Audit Testing Harness

This directory contains automated testing scripts for **VMS Dhamotharan Thirumana Mandapam**.

## Overview

The scripts test all 13 HTML pages across 8 viewport breakpoints (`360`, `390`, `430`, `768`, `1024`, `1280`, `1440`, `1920`):

1. **`audit.js`** — Checks layout overflow, JS errors, font legibility (>=12px), touch target sizes (>=44px on coarse pointers), stuck `.reveal` elements, and image sources.

## How to Run

Requirements: Node 22+

```bash
node tools/audit.js
```
