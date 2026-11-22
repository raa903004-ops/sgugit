#!/usr/bin/env python3
"""Mirror the deployed static AutoChoice site for GitHub Pages.

The source server is controlled by the hackathon team. This operation obtains
static assets only; it never executes downloaded code in the build runner.
"""
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import quote
import os

BASE = os.environ.get("AUTOCHOICE_SOURCE", "http://51.250.44.9/").rstrip("/") + "/"
DEST = Path("site")
FILES = [
    "index.html", "app.js", "catalog.js", "viewer.js",
    "viewer-engine.bundle.js", "style.css",
    "hero.webp", "stage.webp", "duel-details.webp",
    "models/tesla-model-3.glb",
    *[f"cabin-{i}.webp" for i in range(1, 16)],
    *[f"exterior-{i}.webp" for i in range(1, 16)],
]

def fetch(path):
    url = BASE + quote(path, safe="/")
    req = Request(url, headers={"User-Agent": "AutoChoice-Pages-Deploy/1.0"})
    with urlopen(req, timeout=45) as response:
        if response.status != 200:
            raise RuntimeError(f"HTTP {response.status} for {path}")
        data = response.read()
    if not data or data[:15].lower().startswith(b"<!doctype html") and path != "index.html":
        raise RuntimeError(f"Missing or unexpected asset: {path}")
    return data

def main():
    DEST.mkdir(parents=True, exist_ok=True)
    for path in FILES:
        data = fetch(path)
        out = DEST / path
        out.parent.mkdir(parents=True, exist_ok=True)
        out.write_bytes(data)
        print(f"{path}: {len(data)} bytes")
    page = (DEST / "index.html").read_text(encoding="utf-8")
    if "AutoChoice" not in page:
        raise RuntimeError("The source does not appear to be AutoChoice.")
    (DEST / ".nojekyll").touch()
    print(f"Prepared {len(FILES)} static files for GitHub Pages")

if __name__ == "__main__":
    main()
