---
inclusion: always
---

# Security Rules

## Environment Files
- JANGAN PERNAH commit file `.env.local`, `.env`, atau file environment apapun yang berisi kredensial asli ke repository.
- Hanya `.env.example` (berisi placeholder) yang boleh di-commit.
- Selalu verifikasi bahwa `.gitignore` mengandung entry `.env*` dengan pengecualian `!.env.example`.
- Jika diminta membuat atau mengedit file environment berisi secret, ingatkan user untuk TIDAK meng-commit file tersebut.
