# How to grow `programs.json`

Each row = **one undergraduate (or graduate) program** at one university.

## Required fields

```json
{
  "id": "unique-slug",
  "universityId": "must match id in universities.json",
  "emirate": "dubai | abudhabi | sharjah",
  "track": "law | tech | business",
  "degreeLevel": "undergraduate",
  "college": "College name",
  "programName": "Official degree title",
  "criteriaText": "Human-readable admission rules (from official site)",
  "minOverallPercent": 70,
  "acceptedCurricula": ["moe_general", "moe_advanced", "british_alevels", "american_diploma"],
  "emsatMathMin": null,
  "sourceUrl": "https://...",
  "active": true
}
```

## `acceptedCurricula` (important)

This is why you saw **empty results** while the sidebar still listed BSc:

| Stream in form | JSON value |
|----------------|------------|
| MoE General | `moe_general` |
| MoE Advanced | `moe_advanced` |
| British A-Levels | `british_alevels` |
| American Diploma | `american_diploma` |

- **Engineering / CS** at many UAE unis = Advanced only → use `["moe_advanced", "british_alevels"]`
- **IT / BBA / Law** often include `moe_general`

If a program exists but doesn’t match, it appears under **“Also in this emirate (may need Advanced Stream)”**.

## Adding a new university

1. Add entry to `universities.json` (id, name, shortName, url, emirate).
2. Add one or more rows to `programs.json` with that `universityId`.
3. Copy requirements from the **official admissions page** — do not guess cutoffs for production.

## Scale target

| Phase | Rows | Coverage |
|-------|------|----------|
| Hackathon MVP | 40–80 | Top Dubai/AD/Sharjah × 3 tracks |
| Full UAE | 300+ | CAA-licensed HEIs × major programs |

## Official sources

- [CAA licensed institutions](https://www.caa.ae/)
- Each university’s **Undergraduate Admissions** / **Catalog** PDF
- MOE stream guidance (General vs Advanced)

After editing JSON, commit and push — no code change needed unless you add new tracks.
